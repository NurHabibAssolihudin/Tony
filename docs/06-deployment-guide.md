# Deployment Guide — Project Tony (Phase 1: Letta Code + optional App Server)

> Goal: run **Letta Code** **self-hosted** with a **CLI** interface.
> No frontend/domain/HTTPS in Phase 1 — Nginx/Certbot only become relevant when a
> web interface/channel is added later (out of current scope).

## 1. Server Prerequisites (VPS)

- OS Linux (Ubuntu 22.04/24.04 recommended)
- 1–2 CPU cores, 2 GB+ RAM (more if running local models)
- **Node.js 22.19+**, **Python 3**, **make**, **g++**
- **Docker + Docker Compose** **and/or systemd** (for an always-on App Server)
- SSH access to the server

```bash
sudo apt update
sudo apt install -y git nodejs npm python3 build-essential
# make sure node >= 22
node --version
```

## 2. Install & Run Letta Code

```bash
# install CLI (native compile)
sudo npm install -g @letta-ai/letta-code

# run interactively (SSH) — agent created automatically
letta

# inside the CLI:
#   /connect    -> connect an LLM provider (OpenAI/Anthropic/Ollama, ...)
#   /model      -> pick a model
#   /new        -> new conversation (verify cross-session memory)
```

## 3. (Optional) Always-on App Server — systemd

If the agent should stay active / be accessed repeatedly via SSH, create a systemd service:

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

> ⚠️ Keep it bound to `127.0.0.1` (internal). The App Server must **not** be exposed publicly.
> If remote clients are ever needed, add authentication first (`--ws-auth capability-token`)
> or use an overlay network (e.g., Tailscale).

## 4. (Optional) Containerization

For a Docker-based App Server (based on `node:22-slim`), install native deps before
`npm install -g @letta-ai/letta-code`:

```dockerfile
FROM node:22-slim
RUN apt-get update && apt-get install -y python3 make g++ git && npm i -g @letta-ai/letta-code
CMD ["letta", "server", "--backend", "local", "--listen", "ws://127.0.0.1:4500"]
```

Use `restart: always`.

## 5. Backup & Recovery

- **Agent state/memory:** back up `~/.letta` (MemFS per agent) — can also be pushed via
  `/memory-repository` since it is git-backed.
- **Config:** API keys / provider configuration.
- Schedule a daily cron backup to external storage:
```bash
# example daily cron
0 3 * * * rsync -a ~/.letta/ /backup/tony-letta/
```

## 6. Monitoring & Logging (Optional)

- `sudo journalctl -u letta-tony -f` — App Server logs (systemd setup)
- `docker logs -f letta` — container logs (Docker setup)
- `htop` / `docker stats` — resources

## 7. Update / Upgrade

```bash
sudo npm install -g @letta-ai/letta-code@latest
sudo systemctl restart letta-tony
```

> Watch the Letta changelog for breaking changes; re-pin the vendored version and sync
> `docs/app/` when upgrading (see `05-dev-guide.md` § Vendored engine).

## 8. Phase 1 Go-Live Checklist

- [ ] Letta Code CLI installed & running
- [ ] LLM provider connected; chat works via CLI
- [ ] Cross-conversation memory verified
- [ ] (Optional) App Server up (systemd/Docker) & bound internally
- [ ] State & config backups scheduled
- [ ] No service ports exposed publicly (other than SSH)
