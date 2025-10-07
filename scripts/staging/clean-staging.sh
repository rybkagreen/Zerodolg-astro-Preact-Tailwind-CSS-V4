#!/bin/bash

# Script to clean the staging environment
set -e  # Exit on any error

echo "🧹 Cleaning staging environment..."

# Stop and remove containers
echo "🐳 Removing Docker containers..."
docker compose down -v

# Remove any dangling images
echo "🗑️ Removing dangling images..."
docker image prune -f

# Optionally remove staging-specific images
echo "🗑️ Removing staging images..."
docker rmi zerodolg-astro-zerodolg-web:latest zerodolg-astro-zerodolg-ssr-server:latest 2>/dev/null || true

# Clean logs directory
echo "🗑️ Cleaning logs directory..."
rm -rf logs/*
mkdir -p logs

echo "✅ Staging environment cleaned successfully!"