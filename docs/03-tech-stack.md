# Tech Stack — Project Tony

## 1. Ringkasan
Tony dibangun di atas **Letta** (Apache 2.0) sebagai otak agen, **"Tony UI"** (frontend yang kita
bangun) sebagai wajah, dan akan menyerap **Activepieces** (MIT) sebagai mesin otomasi di Fase 2.

## 2. Stack Fase 1 — Letta (agen stateful)

### 2.1 Runtime & Install
| Komponen | Teknologi | Alasan |
|----------|-----------|--------|
| Harness / CLI | **`@letta-ai/letta-code`** (npm, Node 22.19+) | Cara resmi menjalankan Letta |
| Native deps | **Python 3 + make + g++** | Diperlukan saat instalasi (compile native) |
| App Server | `letta server --backend local --listen ws://0.0.0.0:4500` | Self-host runtime + WebSocket API |
| Model inference | Provider via CLI: OpenAI, Anthropic, Ollama, LM Studio, dsb. | Model-agnostic |
| Storage | **MemFS** (git-based memori agen) di `~/.letta/...` | State & memori lokal, mudah di-backup |

### 2.2 Lisensi
- **Apache 2.0** — permissive: komersial, modifikasi, distribusi, turunan berbayar diizinkan;
  hanya perlu atribusi/NOTICE.

## 3. Stack Fase 1 — "Tony UI" (dibangun)
| Komponen | Teknologi | Alasan |
|----------|-----------|--------|
| Frontend | **React + Next.js (App Router) + TypeScript** | Modern, kuat, SEO/SSR |
| Integration | **`@letta-ai/letta-agent-sdk`** (TypeScript) | Antarmuka resmi ke App Server (remote backend) |
| Styling | Tailwind CSS / CSS Modules | Fleksibel & cepat |
| State | React Query / Zustand | Manajemen state chat & streaming |
| Lisensi | Milik kita (disarankan MIT saat dipublikasikan) | Open-source |

## 4. Stack Fase 2 — Activepieces (mesin otomasi)
| Komponen | Teknologi | Alasan |
|----------|-----------|--------|
| Bahasa | TypeScript | Selaras dengan UI |
| Backend | Fastify (Node) + BullMQ | Ringan, performa |
| Frontend | React + Tailwind | Konsisten |
| Data | PostgreSQL + Redis | Antrian & penyimpanan flow |
| Integrasi | 700+ Pieces + **MCP Server** | Jembatan ke Tony via MCP |
| Lisensi | **MIT** | Permissive |

## 5. Integrasi Jembatan (Letta ↔ Activepieces)
- Letta Agent SDK mendukung **MCP server & tools** (`docs.letta.com/agent-sdk/mcp`).
- Activepieces menyediakan **MCP server** bawaan (`https://<host>/mcp`).
- Merencanakan: Tony (Letta agent) memakai **MCP tools** yang menunjuk ke Activepieces MCP server,
  sehingga Tony bisa membuat/menjalankan flow secara natural language.

## 6. Infrastruktur Deployment
| Komponen | Teknologi | Keterangan |
|----------|-----------|-----------|
| Container | Docker + Docker Compose | Orkestrasi frontend & (kelak) Activepieces |
| Runtime service | systemd atau Docker untuk `letta server` | App Server selalu hidup |
| Reverse proxy | **Nginx** | TLS + routing domain |
| TLS | Certbot / Let's Encrypt | HTTPS |
| Node.js | 22.19+ | Untuk CLI & frontend |

## 7. Desain Monorepo
```
tony/                              # = D:\Projects\Tony
├── apps/
│   ├── ui/                        # "Tony UI" (Next.js)        [Fase 1]
│   ├── letta/                     # script/service untuk App Server [Fase 1]
│   └── activepieces/              # (Fase 2)
├── packages/
│   └── shared/                    # tipe & utilitas bersama (opsional)
├── infra/                         # docker-compose, nginx config, env contoh
├── docs/                          # dokumentasi (file ini)
└── package.json / pnpm-workspace.yaml
```
> Catatan: Letta berjalan sebagai service mandiri (klik/App Server), bukan package pnpm. "Tony UI"
> adalah workspace pnpm; Activepieces ditambahkan sebagai workspace pada Fase 2.

## 8. Tooling Pendukung
| Tool | Peran |
|------|-------|
| Git | Version control |
| pnpm | Package manager monorepo |
| Node 22.19+ | Runtime frontend & Letta CLI |
| Docker Compose | Local & prod |
| Nginx + Certbot | Proxy & TLS |

## 9. Justifikasi Pilihan Kunci
- **Letta (Apache 2.0):** lisensi permissive + kemampuan memori/learning yang membedakan Tony
  sebagai "asisten yang beringatan".
- **Activepieces (MIT):** otomasi AI-first, MCP native, 700+ integrasi.
- **"Tony UI" custom:** karena web app Letta (`chat.letta.com`) tidak dapat di-self-host, bisogno
  frontend sendiri agar branding & kontrol penuh.
- **MCP sebagai jembatan:** standar terbuka yang didukung kedua belah pihak.
