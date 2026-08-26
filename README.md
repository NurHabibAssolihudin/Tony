# Tony

> Asisten AI pribadi **self-hosted** — beringatan, belajar, dan (kelak) mampu bertindak.
> Dibangun di atas **Letta** (Apache 2.0) tanpa komponen tambahan yang tidak diperlukan.

## ✨ Ringkasan
Tony adalah asisten AI yang berjalan di infrastruktur Anda sendiri. Fase ini **murni memakai
Letta Code** — tanpa frontend custom, tanpa Agent SDK, tanpa komponen tambahan:

- 🧠 **Beringatan & belajar** — memakai **Letta Code** (agen stateful dengan memori) sehingga
  ingat konteks & belajar seiring waktu.
- 💬 **Berbicara via CLI** — chat langsung dari terminal (`letta`), cukup satu perintah.
- ⚙️ **(Fase 2) Bertindak** — integrasi otomasi nyata masih **dievaluasi**
  (lihat [`docs/10-eval-activepieces.md`](docs/10-eval-activepieces.md)).

> Keputusan: **tidak ada tambahan apa pun di Fase 1** (UI custom, frontend web, dsb. ditunda;
> kebutuhan interface akan diputuskan belakangan).

## 🧩 Komponen & Lisensi
| Komponen | Peran | Lisensi |
|----------|-------|---------|
| [Letta Code](https://github.com/letta-ai/letta-code) | Otak + interface: agen stateful dengan memori, dijalankan via CLI | ✅ Apache 2.0 (permissive) |
| [Activepieces](https://github.com/activepieces/activepieces) | Mesin otomasi/aksi (Fase 2) | ⏳ **Masih dievaluasi** (MIT CE) |

> Source Letta Code di-vendor ke `letta-code/` (tanpa `.git`) agar semua kebutuhan project
> tersimpan dalam satu repo. Versi ter-pin: **v0.30.32** (upstream tag, commit `1e78870`).

## 📁 Struktur
```
tony/
├── letta-code/        # source Letta Code (vendor, untuk referensi/dev)
├── docs/              # dokumentasi project
└── README.md
```

## 🚀 Coba Lokal (Fase 1)
```bash
# 1) Install Letta Code CLI (butuh Node 22.19+; python/make/g++ saat compile native)
npm install -g @letta-ai/letta-code

# 2) Jalankan CLI → agen "Tony" dibuat otomatis
letta

# 3) Di dalam CLI:
#    /connect          # hubungkan LLM provider (OpenAI, Anthropic, Ollama, ...)
#    /model            # pilih model
#    /new              # sesi baru — verifikasi memori lintas sesi
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
| [10-eval-activepieces.md](docs/10-eval-activepieces.md) | Evaluasi "tangan" Fase 2 |

## 🗺️ Roadmap
- **Fase 1:** Letta Code murni — self-host, memori, interface CLI. *(sedang dikerjakan)*
- **Fase 2:** Integrasi otomasi/aksi (Activepieces atau alternatif — **menunggu evaluasi**).

## 📄 Lisensi
Letta berlisensi **Apache 2.0** (permissive): bebas dipakai, dimodifikasi, didistribusikan, dan
dijadikan basis turunan berbayar dengan atribusi. Saat mendistribusikan, sertakan lisensi/NOTICE
komponen terkait.
