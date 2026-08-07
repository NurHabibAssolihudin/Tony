# Tony

> Asisten AI pribadi **self-hosted** — beringatan, belajar, dan mampu bertindak.
> Dibangun sebagai **satu monorepo terpadu** di atas fondasi open-source berlisensi permissive.

## ✨ Ringkasan
Tony adalah asisten AI yang dapat di-deploy sendiri di VPS Anda. Ia dirancang untuk:
- 🧠 **Beringatan** — memakai **Letta** (agen stateful dengan memori) sehingga ingat konteks & belajar seiring waktu.
- 💬 **Berbicara dengan identitas "Tony"** — lewat **"Tony UI"**, frontend web yang kita bangun.
- ⚙️ **(Fase 2) Bertindak** — lewat **Activepieces** untuk otomasi nyata (email, CRM, notifikasi, dsb).

## 🧩 Komponen & Lisensi
| Komponen | Peran | Lisensi |
|----------|-------|---------|
| [Letta](https://github.com/letta-ai/letta) (Apache 2.0) | Otak: agen stateful + memori | ✅ Permissive |
| **Tony UI** | Frontend web (React/Next.js) — milik kita | Milik kita (disarankan MIT) |
| [Activepieces](https://github.com/activepieces/activepieces) (MIT) | Mesin otomasi/aksi (Fase 2) | ✅ Permissive |

> Semua komponen berlisensi permissive → Tony bebas untuk **open-source, portofolio, dan dijadikan
> basis layanan berbayar** oleh siapa pun.

## 📁 Struktur
```
tony/
├── apps/
│   ├── ui/            # "Tony UI" (Next.js + TypeScript)     [Fase 1]
│   └── letta/         # service App Server Letta              [Fase 1]
├── packages/shared/   # tipe & util bersama (opsional)
├── infra/             # docker-compose, nginx, .env.example
├── docs/              # dokumentasi project
└── README.md
```

## 🚀 Coba Lokal (Fase 1)
```bash
# 1) Letta CLI + App Server (butuh Node 22.19+, python/make/g++)
npm install -g @letta-ai/letta-code
letta --backend local connect openai --api-key "<KEY>"
letta server --backend local --listen ws://127.0.0.1:4500

# 2) Tony UI (monorepo)
corepack enable
pnpm install
cd apps/ui && pnpm dev        # http://localhost:3000
```
Detail: lihat [`docs/05-dev-guide.md`](docs/05-dev-guide.md).

## 📚 Dokumentasi
| Dokumen | Isi |
|---------|-----|
| [01-project-overview.md](docs/01-project-overview.md) | Visi, komponen, roadmap, arsitektur |
| [02-spec.md](docs/02-spec.md) | Spesifikasi & kriteria penerimaan |
| [03-tech-stack.md](docs/03-tech-stack.md) | Stack & justifikasi |
| [04-architecture.md](docs/04-architecture.md) | Arsitektur & alur data |
| [05-dev-guide.md](docs/05-dev-guide.md) | Panduan developer |
| [06-deployment-guide.md](docs/06-deployment-guide.md) | Deployment VPS |
| [07-context.md](docs/07-context.md) | Asumsi, risiko, referensi |
| [08-plan.md](docs/08-plan.md) | Milestone & task |
| [09-adr.md](docs/09-adr.md) | Architecture Decision Records |

## 🗺️ Roadmap
- **Fase 1:** Self-host Letta + bangun "Tony UI" + branding + memori. *(sedang dikerjakan)*
- **Fase 2:** Serap Activepieces (MIT) → integrasi MCP → Tony mampu bertindak.

## 📄 Lisensi
Tony menggabungkan komponen **Apache 2.0** (Letta) dan **MIT** (Activepieces). Kode "Tony UI"
milik project ini. Saat mendistribusikan, sertakan atribusi & lisensi komponen terkait.
