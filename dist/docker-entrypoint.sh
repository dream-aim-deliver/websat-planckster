#!/bin/bash
log() {
    echo -e "\e[32m$(date -u) [websat-planckster] - $@\e[0m"
}

log "Generating ecosystem.config.js"
j2 dist/ecosystem.config.js.j2 > /opt/dadai/app/ecosystem.config.cjs
echo "=================== /opt/dadai/app/ecosystem.config.j2 ==================="
cat /opt/dadai/app/ecosystem.config.j2


log "Building Apache configuration files."
j2 dist/httpd.conf.j2 | sed '/^\s*$/d' > /etc/httpd/conf/httpd.conf
echo "=================== /etc/httpd/conf/httpd.conf ========================"
cat /etc/httpd/conf/httpd.conf
echo ""

log "Building Websat Planckster Apache configuration files."
j2 dist/dad.conf.j2 | sed '/^\s*$/d' > /etc/httpd/conf.d/dad.conf
echo "=================== /etc/httpd/conf/conf.d/dad.conf ========================"
cat /etc/httpd/conf.d/dad.conf
echo ""

log "Removing default Apache SSL configuration files."
rm -f /etc/httpd/conf.d/ssl.conf

log "Building NextJS application"
cd /opt/dadai/app
npm run build

log "Starting pm2"
npx pm2 start ecosystem.config.cjs

log "Starting Apache"
httpd

log "Starting pm2 logs"
npx pm2 logs 
