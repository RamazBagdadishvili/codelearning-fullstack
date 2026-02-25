#!/bin/bash

# ==============================================================================
# CodeLearning Platform - Deployment Update Script
# ==============================================================================

set -e

APP_DIR="/var/www/codelearning"

echo "🔄 Updating application from GitHub..."
cd $APP_DIR
git pull origin main

echo "📦 Installing backend dependencies..."
cd $APP_DIR/backend
npm install --production

echo "🐘 Running database migrations (optional but recommended)..."
# You can add command to run SQL files here if needed
# psql -U codeadmin -d codelearning -f ../schema.sql

echo "♻️ Restarting backend process with PM2..."
pm2 restart backend || pm2 start src/index.js --name "backend"

echo "✨ Deployment successful!"
