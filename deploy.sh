#!/bin/bash

# ==============================================================================
# CodeLearning Platform - Docker Deployment Update Script
# ==============================================================================

set -e

APP_DIR="/var/www/codelearning"

echo "🔄 Updating application from GitHub..."
cd $APP_DIR
git fetch origin main
git pull origin main

echo "♻️ Rebuilding and restarting containers..."
docker compose pull
docker compose up -d --build

echo "✨ Deployment successful!"
