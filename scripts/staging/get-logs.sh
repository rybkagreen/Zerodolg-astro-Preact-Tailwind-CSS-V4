#!/bin/bash

# Script to get staging environment logs
set -e  # Exit on any error

echo "📋 Getting staging environment logs..."

# Show logs from Docker containers
docker compose logs