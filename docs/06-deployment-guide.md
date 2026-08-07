# Panduan Deployment — Project Tony (Fase 1: VPS + Nginx)

> Target: deploy **"Tony UI"** + **Letta App Server** di **VPS** dengan **domain sendiri** & **HTTPS**.
> Activepieces ditambahkan di Fase 2.

## 1. Prasyarat Server (VPS)
- OS Linux (Ubuntu 22.04/24.04 disarankan)
- CPU 2+ core, RAM 4 GB+, disk 20 GB+ (SSD)
- **Docker + Docker Compose v2** (untuk UI) **dan/atau systemd** (untuk App Server)
- **Node.js 22.19+**, **Python 3**, **make**, **g++**
- **Domain** (A record → IP VPS)
- Port 80 & 443 terbuka

```bash
sudo apt update
sudo apt install -y nginx docker.io docker-compose-v2 git nodejs npm python3 build-essential
# pastikan node >= 22
node --version
```

## 2. Install & Jalankan Letta App Server
```bash
# install CLI (compile native)
sudo npm install -g @letta-ai/letta-code

# koneksi LLM provider (mis. OpenAI)
letta --backend local connect openai --api-key "$OPENAI_API_KEY"

# buat token auth
echo "TONY_APP_SERVER_TOKEN_$(openssl rand -hex 16)" > /opt/tony/infra/app-server-token

# jalankan App Server (bind 127.0.0.1 agar tidak terpapar publik)
letta server \
  --backend local \
  --listen ws://127.0.0.1:4500 \
  --ws-auth capability-token \
  --ws-token-file /opt/tony/infra/app-server-token
```
**Agar selalu hidup**, buat service systemd:
```ini
[Unit]
Description=Letta App Server (Tony)
After=network.target
[Service]
ExecStart=/usr/bin/letta server --backend local --listen ws://127.0.0.1:4500 --ws-auth capability-token --ws-token-file /opt/tony/infra/app-server-token
Restart=always
User=tony
[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now letta-tony
```

## 3. Deploy "Tony UI" (Next.js)
```bash
cd /opt/tony/apps/ui
pnpm install
pnpm build
# env produksi
export LETTA_APP_SERVER_URL=ws://127.0.0.1:4500
export LETTA_APP_SERVER_TOKEN="$(cat /opt/tony/infra/app-server-token)"
# jalankan via node/pm2/docker (restart otomatis)
```
Bisa di-container-kan (`infra/docker-compose.yml`) dengan `restart: always`.

## 4. Reverse Proxy — Nginx + HTTPS

### 4.1 Instal Nginx & Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 4.2 Konfigurasi Site (`/etc/nginx/sites-available/tony`)
```nginx
server {
    listen 80;
    server_name tony.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;      # Tony UI
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";  # websocket/streaming
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/tony /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 4.3 TLS
```bash
sudo certbot --nginx -d tony.example.com
sudo systemctl enable certbot.timer
```
Selesai → `https://tony.example.com`.

> ⚠️ JANGAN expose :4500 (App Server) ke publik. Nginx hanya mengekspos Tony UI (dan kelak
> routing `/activepieces/*`).

## 5. Backup & Recovery
- **State/memori agen:** backup `~/.letta/` (atau `LETTA_LOCAL_BACKEND_DIR`) — MemFS per agen.
- **Config:** `/opt/tony/infra/*` (token, env).
- **UI build artifact** bisa di-rebuild dari source.
- Jadwalkan cron backup harian ke lokasi eksternal.

## 6. Monitoring & Logging (Opsional)
- `sudo journalctl -u letta-tony -f` — log App Server
- `docker compose logs -f ui` — log UI
- `docker stats` / `htop` — resource

## 7. Update / Upgrade
```bash
cd /opt/tony && git pull
# rebuild UI
cd apps/ui && pnpm install && pnpm build
sudo systemctl restart letta-tony
```
> Pantau changelog Letta untuk breaking change.

## 8. Checklist Go-Live Fase 1
- [ ] App Server Letta aktif (systemd) di VPS
- [ ] LLM provider terkoneksi; chat berfungsi
- [ ] Memori lintas percakapan terverifikasi
- [ ] "Tony UI" di-deploy (Next.js) & restart otomatis
- [ ] Nginx proxy + HTTPS aktif (`https://tony.example.com`)
- [ ] App Server `:4500` TIDAK terpapar publik
- [ ] Backup state & config terjadwal
- [ ] Branding "Tony" muncul di UI
