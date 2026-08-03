#!/bin/bash
set -e
DEST="/var/www/ai-readiness"

echo "── Creating destination directories ───────────────────────────────"
sudo mkdir -p "$DEST/shared" "$DEST/base" "$DEST/automotive" \
              "$DEST/bfsi" "$DEST/retail" "$DEST/healthcare" "$DEST/ict"

echo "── Copying shared assets ──────────────────────────────────────────"
sudo cp shared/industry-configs.js "$DEST/shared/"
sudo cp shared/engine.js           "$DEST/shared/"
sudo cp shared/styles.css          "$DEST/shared/"

echo "── Copying industry index pages ───────────────────────────────────"
sudo cp base/index.html        "$DEST/base/"
sudo cp automotive/index.html  "$DEST/automotive/"
sudo cp bfsi/index.html        "$DEST/bfsi/"
sudo cp retail/index.html      "$DEST/retail/"
sudo cp healthcare/index.html  "$DEST/healthcare/"
sudo cp ict/index.html         "$DEST/ict/"

echo "── Setting permissions ────────────────────────────────────────────"
sudo chown -R www-data:www-data "$DEST"
sudo chmod -R 755 "$DEST"

echo "── Installing Nginx config ────────────────────────────────────────"
# NOTE: This config serves the site on its own subdomain
# (aireadiness.netscribes.com). Point DNS for that subdomain at this host
# and issue a matching TLS cert before reloading nginx:
#   sudo certbot --nginx -d aireadiness.netscribes.com
sudo cp nginx-ai-readiness.conf /etc/nginx/sites-available/ai-readiness.conf
[ ! -L /etc/nginx/sites-enabled/ai-readiness.conf ] && \
  sudo ln -s /etc/nginx/sites-available/ai-readiness.conf /etc/nginx/sites-enabled/

sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "✓ Live at:"
echo "  https://aireadiness.netscribes.com/             — All Industries (base)"
echo "  https://aireadiness.netscribes.com/automotive/  — Automotive & Manufacturing"
echo "  https://aireadiness.netscribes.com/bfsi/        — Banking & Insurance"
echo "  https://aireadiness.netscribes.com/retail/      — Retail & Logistics"
echo "  https://aireadiness.netscribes.com/healthcare/  — Life Sciences & Healthcare"
echo "  https://aireadiness.netscribes.com/ict/         — ICT & Media"
