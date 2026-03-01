#!/usr/bin/env bash
set -e
APP_DIR="/var/www/codelearning"
cd "$APP_DIR"

echo "📝 Creating backend .env for production..."
cat > backend/.env << 'EOF'
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://postgres:Admin123!@db:5432/codelearning
JWT_SECRET=georgian_code_learning_platform_secret_key_2026_antigravity
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://mycodelearning.com
FRONTEND_URL=https://mycodelearning.com
RATE_LIMIT_WINDOW_MS=600000
RATE_LIMIT_MAX=100000
EOF

echo "🐋 Starting containers..."
docker compose down --remove-orphans || true
docker compose up -d --build

echo "⏳ Waiting for database to be ready..."
sleep 15

echo "🏗️  Creating database schema..."
docker exec -i codelearning-db psql -U postgres -d codelearning < schema.sql

echo "🌱 Seeding database..."
docker exec -i codelearning-db psql -U postgres -d codelearning < seed.sql

echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/default << 'NGINX'
server {
    listen 80;
    server_name api.mycodelearning.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX

rm -f /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "🚀 SUCCESS! Setup complete."
