#!/bin/bash

# ==============================================================================
# CodeLearning Platform - Server Setup Script (Ubuntu)
# ==============================================================================

# Exit on error
set -e

echo "🚀 Starting Server Setup..."

# 1. System Updates
echo "🔄 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install Required Packages
echo "📦 Installing Node.js & PostgreSQL..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql postgresql-contrib git build-essential

# 3. Configure PostgreSQL
echo "🐘 Configuring PostgreSQL..."
# Create database and user if they don't exist
sudo -u postgres psql -c "CREATE DATABASE codelearning;" || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER codeadmin WITH PASSWORD 'ChangeThisSecurePassword';" || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE codelearning TO codeadmin;"
# Important: Grant schema privileges for Postgres 15+
sudo -u postgres psql -d codelearning -c "GRANT ALL ON SCHEMA public TO codeadmin;"

# 4. Global Node Packages
echo "🛠️ Installing PM2 globally..."
sudo npm install -g pm2

# 5. Application Setup
echo "📂 Setting up application directory..."
mkdir -p /var/www/codelearning
cd /var/www/codelearning

# If the directory is empty, the user will need to clone their repo here manually 
# or we can ask them for the git URL. For now, we assume they will copy files.

echo "✅ Basic environment is ready!"
echo "--------------------------------------------------------"
echo "Next steps:"
echo "1. Clone your repository to /var/www/codelearning"
echo "2. Create /var/www/codelearning/backend/.env with production values"
echo "3. Run schema.sql and seed.sql against the local database"
echo "4. Start server with: pm2 start src/index.js --name 'backend'"
echo "--------------------------------------------------------"
