#!/bin/bash

# Script to test the staging environment
set -e  # Exit on any error

# Default values
VERBOSE=false
SKIP_PERFORMANCE=false
BASE_URL="http://localhost:3000"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --skip-performance)
            SKIP_PERFORMANCE=true
            shift
            ;;
        --base-url)
            BASE_URL="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--verbose] [--skip-performance] [--base-url URL]"
            exit 1
            ;;
    esac
done

print_section() {
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' '━'
    echo "  $1"
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' '━'
}

print_test_result() {
    if [ "$2" = true ]; then
        echo "✅ $3"
    else
        echo "❌ $3"
        if [ "$VERBOSE" = true ]; then
            echo "   $4"
        fi
        TEST_FAILED=true
    fi
}

# Check if staging server is available
wait_for_server() {
    local max_attempts=30
    local attempt=1
    local server_ready=false
    
    echo "⏳ Waiting for staging server to be ready..."
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$BASE_URL/health" > /dev/null 2>&1 || curl -f -s "$BASE_URL" > /dev/null 2>&1; then
            server_ready=true
            break
        fi
        sleep 2
        ((attempt++))
    done
    
    if [ "$server_ready" = false ]; then
        echo "❌ Staging server is not available. Please run: npm run staging:up"
        exit 1
    fi
}

echo "🧪 Running staging tests..."

TEST_FAILED=false

# Wait for server to be ready
wait_for_server

# Test 1: SSR Rendering
print_section "1. Проверка SSR рендеринга"
HTML_CONTENT=$(curl -s "$BASE_URL" | head -c 10000)
HTML_SIZE=$(echo "$HTML_CONTENT" | wc -c)

# Check for title tag
TITLE_EXISTS=$(echo "$HTML_CONTENT" | grep -i "<title" | wc -l)
print_test_result "TITLE_CHECK" "$([ $TITLE_EXISTS -gt 0 ] && echo true || echo false)" "HTML содержит <title>" "Title tag not found in HTML"

# Check for meta description
META_DESC_EXISTS=$(echo "$HTML_CONTENT" | grep -i "meta.*description" | wc -l)
print_test_result "META_DESC_CHECK" "$([ $META_DESC_EXISTS -gt 0 ] && echo true || echo false)" "HTML содержит meta description" "Meta description tag not found in HTML"

# Check HTML size (indicates SSR)
HTML_SIZE_VALID="$([ $HTML_SIZE -gt 1000 ] && echo true || echo false)"
print_test_result "HTML_SIZE_CHECK" "$HTML_SIZE_VALID" "HTML размер указывает на SSR" "HTML size is too small ($HTML_SIZE bytes), SSR might not be working"
echo "   Размер: $(echo "$HTML_SIZE/1024" | bc -l 2>/dev/null || echo "$HTML_SIZE") KB"

# Check TTFB (Time to First Byte)
START_TIME=$(date +%s.%N)
curl -s "$BASE_URL" > /dev/null
END_TIME=$(date +%s.%N)
TTFB=$(echo "$END_TIME - $START_TIME" | bc -l)
TTFB_MS=$(echo "$TTFB * 1000" | bc -l)
TTFB_ACCEPTABLE="$([ $(echo "$TTFB < 1" | bc -l) -eq 1 ] && echo true || echo false)"
print_test_result "TTFB_CHECK" "$TTFB_ACCEPTABLE" "TTFB приемлемый (< 1000ms)" "TTFB too high: ${TTFB_MS}ms"
echo "   TTFB: ${TTFB_MS}ms"

# Test 2: Static Resources
print_section "2. Проверка статических ресурсов"
CSS_FILES=$(echo "$HTML_CONTENT" | grep -o 'href="[^"]*\.css"' | sed 's/href="//' | sed 's/"$//' | head -5)
JS_FILES=$(echo "$HTML_CONTENT" | grep -o 'src="[^"]*\.js"' | sed 's/src="//' | sed 's/"$//' | head -5)

CSS_AVAILABLE=true
for css_file in $CSS_FILES; do
    if [[ $css_file == http* ]]; then
        continue  # Skip external CSS files
    fi
    abs_css_path="$BASE_URL$css_file"
    if ! curl -f -s --head "$abs_css_path" > /dev/null 2>&1; then
        CSS_AVAILABLE=false
        break
    fi
done
print_test_result "CSS_CHECK" "$CSS_AVAILABLE" "CSS файлы загружаются" "Some CSS files are not accessible"

JS_AVAILABLE=true
for js_file in $JS_FILES; do
    if [[ $js_file == http* ]]; then
        continue  # Skip external JS files
    fi
    abs_js_path="$BASE_URL$js_file"
    if ! curl -f -s --head "$abs_js_path" > /dev/null 2>&1; then
        JS_AVAILABLE=false
        break
    fi
done
print_test_result "JS_CHECK" "$JS_AVAILABLE" "JavaScript бандлы доступны" "Some JS files are not accessible"

# Test 3: API Endpoints
print_section "3. Проверка API endpoints"
API_GET_OK=$(curl -f -s --head "$BASE_URL/api/form" -w "%{http_code}" -o /dev/null)
API_GET_ACCESSIBLE="$([ $API_GET_OK = 200 ] && echo true || echo false)"
print_test_result "API_GET_CHECK" "$API_GET_ACCESSIBLE" "GET /api/form доступен" "GET /api/form returned $API_GET_OK"

# Test POST endpoint availability (without sending actual data to avoid side effects)
POST_AVAILABLE=true
if ! curl -f -s -X POST "$BASE_URL/api/form" -H "Content-Type: application/json" -d '{}' --head -w "%{http_code}" -o /dev/null | grep -q "405\|200\|400"; then
    POST_AVAILABLE=false
fi
print_test_result "API_POST_CHECK" "$POST_AVAILABLE" "POST /api/form принимает данные" "POST /api/form is not accessible"

# Test 4: Routing
print_section "4. Проверка маршрутизации"
# Get all links from the main page
ALL_LINKS=$(echo "$HTML_CONTENT" | grep -o 'href="[^"]*"' | sed 's/href="//' | sed 's/"$//' | grep -v '^http' | grep -v '^#' | sort -u | head -10)

BROKEN_LINKS=0
for link in $ALL_LINKS; do
    if [[ "$link" == "/" ]]; then
        continue  # Skip homepage
    fi
    full_url="$BASE_URL$link"
    if ! curl -f -s --head "$full_url" > /dev/null 2>&1; then
        ((BROKEN_LINKS++))
    fi
done

ROUTING_OK="$([ $BROKEN_LINKS -eq 0 ] && echo true || echo false)"
print_test_result "ROUTING_CHECK" "$ROUTING_OK" "Нет битых ссылок" "Found $BROKEN_LINKS broken links"

# Check 404 page
NOT_FOUND_OK=$(curl -f -s --head "$BASE_URL/nonexistent-page" -w "%{http_code}" -o /dev/null)
print_test_result "404_CHECK" "$([ $NOT_FOUND_OK = 404 ] && echo true || echo false)" "404 страница настроена" "404 page not configured properly (returned $NOT_FOUND_OK)"

# Test 5: SEO
print_section "5. Проверка SEO"
# Already checked title and meta description in SSR test
SITEMAP_OK=$(curl -f -s --head "$BASE_URL/sitemap.xml" -w "%{http_code}" -o /dev/null)
print_test_result "SITEMAP_CHECK" "$([ $SITEMAP_OK = 200 ] && echo true || echo false)" "Sitemap доступен" "Sitemap not found"

ROBOTS_OK=$(curl -f -s --head "$BASE_URL/robots.txt" -w "%{http_code}" -o /dev/null)
print_test_result "ROBOTS_CHECK" "$([ $ROBOTS_OK = 200 ] && echo true || echo false)" "Robots.txt настроен" "Robots.txt not found"

# Check for Open Graph tags
OG_TAGS=$(echo "$HTML_CONTENT" | grep -i "property.*og:" | wc -l)
OG_CHECK="$([ $OG_TAGS -gt 0 ] && echo true || echo false)"
print_test_result "OG_CHECK" "$OG_CHECK" "Open Graph теги" "Open Graph tags not found"

# Test 6: Security (Basic checks)
print_section "6. Проверка безопасности"
SECURITY_HEADERS=$(curl -s -D - "$BASE_URL" -o /dev/null | grep -i -E "x-frame-options|content-security-policy|x-content-type-options|x-xss-protection" | wc -l)
SECURITY_CHECK="$([ $SECURITY_HEADERS -gt 0 ] && echo true || echo false)"
print_test_result "SECURITY_HEADERS_CHECK" "$SECURITY_CHECK" "Security headers установлены" "No security headers detected"

# Test 7: Performance (unless skipped)
if [ "$SKIP_PERFORMANCE" = false ]; then
    print_section "7. Проверка производительности"
    PAGE_LOAD_TIME=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL")
    LOAD_TIME_ACCEPTABLE="$([ $(echo "$PAGE_LOAD_TIME < 2" | bc -l 2>/dev/null || echo 0) -eq 1 ] && echo true || echo false)"
    print_test_result "LOAD_TIME_CHECK" "$LOAD_TIME_ACCEPTABLE" "Время загрузки < 2s" "Page load time too high: ${PAGE_LOAD_TIME}s"
    echo "   Время загрузки: ${PAGE_LOAD_TIME}s"
    
    PAGE_SIZE_KB=$(echo "$HTML_SIZE/1024" | bc -l 2>/dev/null || echo "$HTML_SIZE")
    SIZE_ACCEPTABLE="$([ $(echo "$PAGE_SIZE_KB < 1000" | bc -l 2>/dev/null || echo 1) -eq 1 ] && echo true || echo false)"
    print_test_result "SIZE_CHECK" "$SIZE_ACCEPTABLE" "Размер страницы оптимизирован" "Page size too large: ${PAGE_SIZE_KB}KB"
fi

# Test 8: Logs
print_section "8. Проверка логов"
# Check for critical errors in application logs
docker compose logs --tail=50 2>/dev/null | grep -i error | grep -v "deprecated" > /tmp/staging_errors.txt
ERROR_COUNT=$(wc -l < /tmp/staging_errors.txt)
LOGS_OK="$([ $ERROR_COUNT -eq 0 ] && echo true || echo false)"
print_test_result "LOGS_CHECK" "$LOGS_OK" "Нет критических ошибок в логах" "Found $ERROR_COUNT critical errors in logs"
if [ "$VERBOSE" = true ] && [ $ERROR_COUNT -gt 0 ]; then
    echo "   Errors found:"
    cat /tmp/staging_errors.txt
fi

# Final result
if [ "$TEST_FAILED" = false ]; then
    echo ""
    echo "🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ! Staging готов к использованию."
    exit 0
elif [ "$TEST_FAILED" = true ]; then
    echo ""
    echo "❌ КРИТИЧЕСКИЕ ПРОБЛЕМЫ ОБНАРУЖЕНЫ! Необходимо исправление."
    exit 1
fi