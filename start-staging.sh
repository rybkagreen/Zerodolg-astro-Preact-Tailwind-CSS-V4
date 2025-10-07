#!/bin/sh

# Start PM2 in runtime mode for Docker with proper config file handling
# Using explicit script path from config instead of treating config as script
exec pm2-runtime /app/dist/server/entry.mjs \
  --name "zerodolg-backend" \
  --instances 1 \
  --max-memory-restart 1G \
  --error /app/logs/pm2-error.log \
  --output /app/logs/pm2-out.log \
  --time \
  --merge-logs
