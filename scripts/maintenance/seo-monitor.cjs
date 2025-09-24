const fs = require('fs');
const path = require('path');

// Function to count heading tags in HTML files
function countHeadings(htmlContent) {
  const headings = {
    h1: (htmlContent.match(/<h1[^>]*>/gi) || []).length,
    h2: (htmlContent.match(/<h2[^>]*>/gi) || []).length,
    h3: (htmlContent.match(/<h3[^>]*>/gi) || []).length,
    h4: (htmlContent.match(/<h4[^>]*>/gi) || []).length,
    h5: (htmlContent.match(/<h5[^>]*>/gi) || []).length,
    h6: (htmlContent.match(/<h6[^>]*>/gi) || []).length,
  };

  return headings;
}

// Function to check for meta tags
function checkMetaTags(htmlContent) {
  const hasTitle = /<title[^>]*>/.test(htmlContent);
  const hasDescription = /<meta[^>]*name=["']description["'][^>]*content=["'][^"']*["']/.test(
    htmlContent
  );
  const hasKeywords = /<meta[^>]*name=["']keywords["'][^>]*content=["'][^"']*["']/.test(
    htmlContent
  );
  const hasCanonical = /<link[^>]*rel=["']canonical["'][^>]*href=["'][^"']*["']/.test(htmlContent);

  return {
    hasTitle,
    hasDescription,
    hasKeywords,
    hasCanonical,
  };
}

// Function to check for structured data
function checkStructuredData(htmlContent) {
  const hasStructuredData = /<script[^>]*type=["']application\/ld\+json["'][^>]*>/.test(
    htmlContent
  );

  return {
    hasStructuredData,
  };
}

// Function to check for analytics scripts
function checkAnalytics(htmlContent) {
  const hasYandexMetrika = /ym\([^)]*\)|yandex_metrika|yandex-verification/i.test(htmlContent);
  const hasGoogleAnalytics = /gtag\([^)]*\)|google-analytics|ga\([^)]*\)/i.test(htmlContent);
  const hasBitrix24 = /bitrix24|b24|bitrix/i.test(htmlContent);

  return {
    hasYandexMetrika,
    hasGoogleAnalytics,
    hasBitrix24,
  };
}

// Function to analyze a single HTML file
function analyzeHTMLFile(filePath) {
  try {
    const htmlContent = fs.readFileSync(filePath, 'utf8');

    const headings = countHeadings(htmlContent);
    const metaTags = checkMetaTags(htmlContent);
    const structuredData = checkStructuredData(htmlContent);
    const analytics = checkAnalytics(htmlContent);

    return {
      filePath,
      headings,
      metaTags,
      structuredData,
      analytics,
    };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return null;
  }
}

// Function to analyze all HTML files in the dist directory
function analyzeSite() {
  const distDir = path.join(__dirname, '..', 'dist');
  const results = [];

  function walkDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.html')) {
        const analysis = analyzeHTMLFile(filePath);
        if (analysis) {
          results.push(analysis);
        }
      }
    });
  }

  walkDir(distDir);

  return results;
}

// Function to generate a report
function generateReport(results) {
  console.log('=== SEO Analysis Report ===\n');

  // Overall statistics
  const totalFiles = results.length;
  let filesWithH1 = 0;
  let filesWithDescription = 0;
  let filesWithCanonical = 0;
  let filesWithStructuredData = 0;
  let filesWithYandexMetrika = 0;
  let filesWithGoogleAnalytics = 0;
  let filesWithBitrix24 = 0;

  results.forEach((result) => {
    if (result.headings.h1 > 0) filesWithH1++;
    if (result.metaTags.hasDescription) filesWithDescription++;
    if (result.metaTags.hasCanonical) filesWithCanonical++;
    if (result.structuredData.hasStructuredData) filesWithStructuredData++;
    if (result.analytics.hasYandexMetrika) filesWithYandexMetrika++;
    if (result.analytics.hasGoogleAnalytics) filesWithGoogleAnalytics++;
    if (result.analytics.hasBitrix24) filesWithBitrix24++;
  });

  console.log('Overall Statistics:');
  console.log(`- Total HTML files analyzed: ${totalFiles}`);
  console.log(
    `- Files with H1 tags: ${filesWithH1}/${totalFiles} (${Math.round((filesWithH1 / totalFiles) * 100)}%)`
  );
  console.log(
    `- Files with meta description: ${filesWithDescription}/${totalFiles} (${Math.round((filesWithDescription / totalFiles) * 100)}%)`
  );
  console.log(
    `- Files with canonical tags: ${filesWithCanonical}/${totalFiles} (${Math.round((filesWithCanonical / totalFiles) * 100)}%)`
  );
  console.log(
    `- Files with structured data: ${filesWithStructuredData}/${totalFiles} (${Math.round((filesWithStructuredData / totalFiles) * 100)}%)`
  );
  console.log(
    `- Files with Yandex.Metrika: ${filesWithYandexMetrika}/${totalFiles} (${Math.round((filesWithYandexMetrika / totalFiles) * 100)}%)`
  );
  console.log(
    `- Files with Google Analytics: ${filesWithGoogleAnalytics}/${totalFiles} (${Math.round((filesWithGoogleAnalytics / totalFiles) * 100)}%)`
  );
  console.log(
    `- Files with Bitrix24 integration: ${filesWithBitrix24}/${totalFiles} (${Math.round((filesWithBitrix24 / totalFiles) * 100)}%)\n`
  );

  // Detailed analysis
  console.log('Detailed Analysis:');
  results.forEach((result) => {
    console.log(`\nFile: ${result.filePath.replace(path.join(__dirname, '..', 'dist'), '')}`);
    console.log(
      `  Headings: H1(${result.headings.h1}) H2(${result.headings.h2}) H3(${result.headings.h3}) H4(${result.headings.h4}) H5(${result.headings.h5}) H6(${result.headings.h6})`
    );
    console.log(
      `  Meta tags: Title(${result.metaTags.hasTitle ? '✓' : '✗'}) Description(${result.metaTags.hasDescription ? '✓' : '✗'}) Keywords(${result.metaTags.hasKeywords ? '✓' : '✗'}) Canonical(${result.metaTags.hasCanonical ? '✓' : '✗'})`
    );
    console.log(`  Structured data: ${result.structuredData.hasStructuredData ? '✓' : '✗'}`);
    console.log(
      `  Analytics: Yandex.Metrika(${result.analytics.hasYandexMetrika ? '✓' : '✗'}) Google Analytics(${result.analytics.hasGoogleAnalytics ? '✓' : '✗'}) Bitrix24(${result.analytics.hasBitrix24 ? '✓' : '✗'})`
    );
  });
}

// Function to check for common SEO issues
function checkSEOIssues(results) {
  console.log('\n=== SEO Issues Report ===\n');

  let issuesFound = false;

  results.forEach((result) => {
    const filePath = result.filePath.replace(path.join(__dirname, '..', 'dist'), '');

    // Check for multiple H1 tags
    if (result.headings.h1 > 1) {
      console.log(`⚠️  Multiple H1 tags found in ${filePath}: ${result.headings.h1} H1 tags`);
      issuesFound = true;
    }

    // Check for missing H1 tags
    if (result.headings.h1 === 0) {
      console.log(`⚠️  Missing H1 tag in ${filePath}`);
      issuesFound = true;
    }

    // Check for missing meta description
    if (!result.metaTags.hasDescription) {
      console.log(`⚠️  Missing meta description in ${filePath}`);
      issuesFound = true;
    }

    // Check for missing canonical tag
    if (!result.metaTags.hasCanonical) {
      console.log(`⚠️  Missing canonical tag in ${filePath}`);
      issuesFound = true;
    }

    // Check for missing structured data
    if (!result.structuredData.hasStructuredData) {
      console.log(`⚠️  Missing structured data in ${filePath}`);
      issuesFound = true;
    }
  });

  if (!issuesFound) {
    console.log('✅ No major SEO issues found!');
  }
}

// Main function
function main() {
  console.log('Starting SEO analysis...\n');

  const results = analyzeSite();
  generateReport(results);
  checkSEOIssues(results);

  console.log('\n=== Analysis Complete ===');
}

// Run the analysis
main();
