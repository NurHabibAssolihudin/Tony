# Tech Stack — Project Tony

## 1. Ringkasan
Tony berjalan **murni di atas Letta Code** (Apache 2.0) sebagai otak asisten dan interface CLI.
Tidak ada frontend custom, tidak ada Agent SDK aplikasi, dan komponen otomasi (Fase 2) masih
**dievaluasi**.

## 2. Stack Fase 1 — Letta Code (agen stateful + CLI)

### 2.1 Runtime & Install
| Komponen | Teknologi | Alasan |
|----------|-----------|--------|
| Harness / CLI | **`@letta-ai/letta-code`** (npm, Node 22.19+) | Cara resmi menjalankan Letta; CLI interaktif |
| Runtime package | **Bun** (bun.lock, bundling internal) | Package manager/build resmi proyek Letta |
| Native deps | **Python 3 + make + g++** | Diperlukan saat instalasi (compile native) |
| App Server (opsional) | `letta server --backend local --listen ws://127.0.0.1:4500` | Always-on / akses jarak jauh via SSH |
| Model inference | Provider via CLI: OpenAI, Anthropic, Ollama, LM Studio, dsb. | Model-agnostic (`/connect`, `/model`) |
| Storage | **MemFS** (git-based memori agen) di `~/.letta/...` | State & memori lokal, mudah di-backup |

### 2.2 Lisensi
- **Apache 2.0** — permissive: komersial, modifikasi, distribusi, turunan berbayar diizinkan;
  hanya perlu atribusi/NOTICE.

## 3. Interface (Fase 1)
| Interface | Status | Catatan |
|-----------|--------|---------|
| **CLI interaktif** (`letta`) | ✅ Jalur utama | Chat, `/connect`, `/model`, `/new`, `/agent` |
| Channels (Telegram/Slack/Discord/WhatsApp/Signal) | 📋 Opsi first-party | Di luar scope Fase 1; tanpa kode custom |
| Desktop app Letta | 📋 Opsi first-party | Branding Letta; di luar scope |
| chat.letta.com (web/mobile) | ❌ Cloud-only | Tidak bisa dipakai untuk agent self-hosted |
| UI custom / Agent SDK | ❌ Ditunda | Kebutuhan kecil; diputuskan belakangan |

## 4. Stack Fase 2 — Otomasi ("tangan", **belum diputuskan**)
Kandidat yang sedang dievaluasi di `10-eval-activepieces.md`:
| Kandidat | Stack | Lisensi | Catatan |
|----------|-------|---------|---------|
| Activepieces | TypeScript/Fastify/BullMQ, PostgreSQL+Redis, React+Tailwind | **MIT (CE)** + komersial (fitur enterprise) | MCP native; kandidat terdepan |
| n8n | TypeScript, MySQL/Postgres | Fair-code (Sustainable Use) | Bukan fully open-source |
| Dify | Python/Flask, Postgres, Vue | Modified Apache 2.0 (pembatasan multi-tenant/logo) | Lebih ke "otak", bukan "tangan" |
| Make / Zapier | — | Proprietary | Cloud-only |

## 5. Integrasi Jembatan (Fase 2, bila diputuskan)
- Letta mendukung **MCP client/tools**.
- Activepieces menyediakan **MCP server** bawaan — potensi jembatan natural.
- Keputusan akhir belum diambil; tergantung hasil evaluasi.

## 6. Infrastruktur Deployment
| Komponen | Teknologi | Keterangan |
|----------|-----------|-----------|
| App Server (opsional) | systemd atau Docker `letta server` | Selalu hidup di VPS |
| Reverse proxy | — | Tidak dibutuhkan Fase 1 (tanpa web) |
| Node.js | 22.19+ | CLI & harness |
| Backup | cron/rsync `~/.letta` | State & memori |

## 7. Desain Monorepo
```
tony/                              # = D:\Projects\Tony
├── letta-code/                    # source Letta Code (vendor, untuk referensi/dev)
├── docs/                          # dokumentasi (file ini)
└── README.md
```
> Tidak ada workspace pnpm untuk Fase 1 — Tony tidak membangun aplikasi sendiri saat ini.
> `apps/`, `packages/`, `infra/` akan dibuat hanya bila benar-benar diperlukan.

## 8. Tooling Pendukung
| Tool | Peran |
|------|-------|
| Git | Version control |
| Node 22.19+ | Runtime Letta Code CLI |
| Python/make/g++ | Native deps saat instalasi |
| Docker/systemd (opsional) | App Server selalu-hidup |

## 9. Justifikasi Pilihan Kunci
- **Letta Code (Apache 2.0):** lisensi permissive + kemampuan memori/learning yang membedakan
  Tony sebagai "asisten yang beringatan", sekaligus menyediakan CLI siap-pakai → **tanpa perlu
  membangun frontend**.
- **Tanpa UI custom:** kebutuhan interface kecil; Letta punya CLI & interface first-party lain.
- **Otomasi ditunda:** menghindari komitmen sebelum keputusan lisensi/arsitektur matang.
