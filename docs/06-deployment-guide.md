# Panduan Deployment — Project Tony (Fase 1: Letta Code + App Server opsional)

> Target: menjalankan **Letta Code** secara **self-hosted** dengan interface **CLI**.
> Tidak ada frontend/domain/HTTPS pada Fase 1 — Nginx/Certbot hanya relevan bila nanti ada
> interface web/channel (di luar scope saat ini).

## 1. Prasyarat Server (VPS)
- OS Linux (Ubuntu 22.04/24.04 disarankan)
- CPU 1–2 core, RAM 2 GB+ (bertambah bila memakai model lokal)
- **Node.js 22.19+**, **Python 3**, **make**, **g++**
- **Docker + Docker Compose** **dan/atau systemd** (untuk App Server selalu-hidup)
- Akses SSH ke server

```bash
sudo apt update
sudo apt install -y git nodejs npm python3 build-essential
# pastikan node >= 22
node --version
```

## 2. Install & Jalankan Letta Code
```bash
# install CLI (compile native)
sudo npm install -g @letta-ai/letta-code

# jalankan interaktif (SSH) — agen dibuat otomatis
letta

# di dalam CLI:
#   /connect    -> hubungkan LLM provider (OpenAI/Anthropic/Ollama, ...)
#   /model      -> pilih model
#   /new        -> percakapan baru (verifikasi memori lintas sesi)
```

## 3. (Opsional) App Server selalu-hidup — systemd
Bila ingin agen selalu aktif / diakses berulang via SSH, buat service systemd:

```ini
[Unit]
Description=Letta App Server (Tony)
After=network.target
[Service]
ExecStart=/usr/bin/letta server --backend local --listen ws://127.0.0.1:4500
Restart=always
User=tony
[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now letta-tony
```

> ⚠️ Biarkan terikat `127.0.0.1` (internal). App Server **tidak boleh** diekspos publik.

## 4. (Opsional) Containerisasi
Bila memilih Docker untuk App Server (dasar `node:22-slim`), pastikan native deps diinstal
sebelum `npm install -g @letta-ai/letta-code`:

```dockerfile
FROM node:22-slim
RUN apt-get update && apt-get install -y python3 make g++ git && npm i -g @letta-ai/letta-code
CMD ["letta", "server", "--backend", "local", "--listen", "ws://127.0.0.1:4500"]
```
Pakai `restart: always`.

## 5. Backup & Recovery
- **State/memori agen:** backup `~/.letta` (MemFS per agen) — bisa via `git` karena git-backed.
- **Config:** API key / konfigurasi provider.
- Jadwalkan cron backup harian ke lokasi eksternal:
```bash
# contoh cron harian
0 3 * * * rsync -a ~/.letta/ /backup/tony-letta/
```

## 6. Monitoring & Logging (Opsional)
- `sudo journalctl -u letta-tony -f` — log App Server (bila pakai systemd)
- `docker logs -f letta` — log container (bila pakai Docker)
- `htop` / `docker stats` — resource

## 7. Update / Upgrade
```bash
sudo npm install -g @letta-ai/letta-code@latest
sudo systemctl restart letta-tony
```
> Pantau changelog Letta untuk breaking change.

## 8. Checklist Go-Live Fase 1
- [ ] Letta Code CLI terinstal & berjalan
- [ ] LLM provider terkoneksi; chat berfungsi via CLI
- [ ] Memori lintas percakapan terverifikasi
- [ ] (Opsional) App Server aktif (systemd/Docker) & terikat internal
- [ ] Backup state & config terjadwal
- [ ] Tidak ada port service yang diekspos publik (selain SSH)
