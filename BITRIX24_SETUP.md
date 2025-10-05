# Bitrix24 Webhook Configuration Guide

## Overview

This guide explains how to configure Bitrix24 webhook for staging and production
environments.

## Required Environment Variable

Add the following to your `.env` file:

```bash
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/your-webhook-key/
```

⚠️ **Important**: The URL must end with a trailing slash `/`

## Getting Your Webhook URL

1. Log in to your Bitrix24 account
2. Go to **Applications** → **Webhooks**
3. Click **Add Webhook** (or use existing)
4. Select permissions for CRM (leads):
   - `crm` - Read/Write access to CRM
5. Copy the webhook URL

## Environment Setup

### Development

Create `.env` file in project root:

```bash
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/your-dev-webhook/
```

### Staging

Set environment variable in Docker/staging environment:

```bash
# In docker-compose.yml or staging environment
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/your-staging-webhook/
```

### Production

Set environment variable in production server:

```bash
# In production environment variables
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/your-prod-webhook/
```

## Docker Configuration

### For Docker Compose

Edit `docker-compose.yml`:

```yaml
services:
  app:
    environment:
      - BITRIX24_WEBHOOK_URL=${BITRIX24_WEBHOOK_URL}
```

Then create `.env` file alongside `docker-compose.yml`:

```bash
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/your-webhook/
```

### For Docker Run

```bash
docker run -e BITRIX24_WEBHOOK_URL="https://your-domain.bitrix24.ru/rest/1/your-webhook/" your-image
```

## Testing

### 1. Check Configuration

```bash
# Test the API endpoint
curl http://localhost:4321/api/form
```

Should return:

```json
{
  "status": "ok",
  "message": "Form API is working"
}
```

### 2. Test Form Submission

```bash
curl -X POST http://localhost:4321/api/form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+79001234567",
    "formType": "callback"
  }'
```

Should return:

```json
{
  "success": true,
  "leadId": 123,
  "message": "Заявка успешно отправлена! Мы свяжемся с вами в течение 15 минут."
}
```

## Troubleshooting

### Error: "Сервис временно недоступен"

- Check that `BITRIX24_WEBHOOK_URL` is set in environment
- Verify the URL format (must end with `/`)

### Error: "Bitrix24 error: 403"

- Check webhook permissions in Bitrix24
- Ensure webhook has CRM access

### Error: "Bitrix24 error: 404"

- Verify webhook URL is correct
- Check that webhook is still active in Bitrix24

## Security Best Practices

1. **Never commit webhook URLs to git**
   - Use `.env` files (already in `.gitignore`)
   - Use environment variables in CI/CD

2. **Use different webhooks for each environment**
   - Development: Limited permissions, test data
   - Staging: Same as production permissions
   - Production: Full permissions, real data

3. **Rotate webhooks periodically**
   - Change webhook keys every 6-12 months
   - Update immediately if compromised

4. **Monitor webhook usage**
   - Check Bitrix24 logs for suspicious activity
   - Set up alerts for unusual patterns

## Form Types

The API supports different form types with automatic lead categorization:

- `callback` - Заявка на обратный звонок
- `consultation` - Запрос консультации
- `calculator` - Расчет калькулятора
- `bankruptcy` - Заявка на банкротство

## Custom Fields

If you need to map form data to custom Bitrix24 fields, edit:
`src/pages/api/form.ts`

Look for the `UF_CRM_1234567890` field and replace with your custom field ID
from Bitrix24.

## Additional Resources

- [Bitrix24 REST API Documentation](https://dev.1c-bitrix.ru/rest_help/)
- [CRM Lead Methods](https://dev.1c-bitrix.ru/rest_help/crm/leads/index.php)
- [Webhook Setup Guide](https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=99&LESSON_ID=2280)
