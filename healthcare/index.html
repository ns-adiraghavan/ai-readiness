#!/bin/bash
set -e
DEST="/var/www/ai-readiness"

echo "── Creating destination directories ───────────────────────────────"
sudo mkdir -p "$DEST/shared" "$DEST/base" "$DEST/automotive" \
              "$DEST/bfsi" "$DEST/retail" "$DEST/healthcare" "$DEST/ict"

echo "── Copying shared assets ──────────────────────────────────────────"
sudo cp shared/industry-configs.js "$DEST/shared/"
sudo cp shared/engine.js           "$DEST/shared/"

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
# NOTE: If you already have a server block for netscribes.com, copy only
# the location{} blocks into your existing config rather than installing
# this as a second server{} block.
sudo cp nginx-ai-readiness.conf /etc/nginx/sites-available/ai-readiness.conf
[ ! -L /etc/nginx/sites-enabled/ai-readiness.conf ] && \
  sudo ln -s /etc/nginx/sites-available/ai-readiness.conf /etc/nginx/sites-enabled/

sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "✓ Live at:"
echo "  /ai-readiness/              — All Industries (base)"
echo "  /ai-readiness/automotive/   — Automotive & Manufacturing"
echo "  /ai-readiness/bfsi/         — Banking & Insurance"
echo "  /ai-readiness/retail/       — Retail & Logistics"
echo "  /ai-readiness/healthcare/   — Life Sciences & Healthcare"
echo "  /ai-readiness/ict/          — ICT & Media"
