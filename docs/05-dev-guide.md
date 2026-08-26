# Panduan Developer (Dev Guide) — Project Tony

> Fokus Fase 1: menjalankan **Letta Code murni** — install, hubungkan LLM, buat agen "Tony",
> dan verifikasi memori — **tanpa membangun UI/frontend tambahan**.

## 1. Prasyarat Lokal
- **Git**
- **Node.js 22.19+** (`node --version`)
- **Python 3 + make + g++** (untuk native deps Letta saat install)
- **Docker/systemd** (opsional, untuk App Server selalu-hidup)

## 2. Setup Lokal

### 2.1 Install Letta Code CLI
```powershell
# install CLI (compile native -> butuh python/make/g++)
npm install -g @letta-ai/letta-code
```

### 2.2 Jalankan CLI & buat agen "Tony"
```powershell
# buka direktori kerja, lalu:
letta
```
- Pertama kali dijalankan, agen lokal dibuat otomatis; state tersimpan lokal, **tanpa login**.
- Bisa juga membuat agen baru dengan preset tertentu:
```powershell
letta --new-agent --personality tutorial   # agen demo
```
- Slash commands utama di dalam CLI:
  - `/connect` — hubungkan LLM provider (OpenAI/ChatGPT, Anthropic, Ollama, LM Studio, Z.ai, dll)
  - `/model` — pilih model
  - `/new` — mulai percakapan baru · `/resume` — lanjut percakapan
  - `/agent` — pindah/ganti agen · `/search` — cari pesan/agen · `/help` — bantuan
  - `/skills` — lihat skills · `/palace`, `/doctor`, `/sleeptime` — audit/manajemen memori
- **Headless / non-interaktif:**
```powershell
letta -p --agent <agent-id> "pesan"          # kirim pesan satu kali
letta --agent <agent-id>                     # lanjut agent tertentu
```

### 2.3 Verifikasi memori lintas percakapan
```powershell
# 1) Ceritakan sesuatu ke Tony, lalu catat jawabannya
# 2) Keluar (Ctrl+D), jalankan letta lagi, lalu /new untuk percakapan baru
# 3) Tanyakan: "Apa yang kuceritakan tadi?" -> harus diingat Tony
```
Opsional, cek state memori via subcommand:
```powershell
letta memory status --agent <agent-id>
letta memory diff --agent <agent-id>
```

### 2.4 App Server (opsional — selalu-hidup / remote)
```powershell
letta server --backend local --listen ws://127.0.0.1:4500
```
- Proses mencetak base URL saat start.
- State/memori tersimpan di `~/.letta` (MemFS, git-backed).
- > **Windows:** pastikan `python`, `make` (via mingw/choco), dan `g++` tersedia; atau gunakan
  > WSL/Docker untuk kemudahan.

## 3. Struktur Repo
```
tony/
├── letta-code/        # source Letta Code (vendor, untuk referensi/riset) — ter-pin v0.30.32
├── docs/              # dokumentasi project
└── README.md
```
Vendor dilakukan sebagai plain copy (tanpa `.git`) dari **tag rilis upstream**, saat ini
**v0.30.32** (commit `1e78870`). Untuk memperbarui vendor:
```powershell
Remove-Item -Recurse -Force letta-code
git clone --depth 1 --branch vX.Y.Z https://github.com/letta-ai/letta-code letta-code
Remove-Item -Recurse -Force letta-code\.git
# lalu update catatan versi ter-pin di README.md & dokumen ini
```

## 4. Interface Lain (di luar scope Fase 1)
Letta Code punya interface **first-party** tanpa kode custom — dicatat di sini untuk referensi:
- **Channels:** `letta server --backend local --channels telegram` (juga slack, discord,
  whatsapp, signal) → chat dari aplikasi pesan yang sudah dipakai.
- **Desktop app** (Windows/macOS/Linux) — branding Letta.
- **chat.letta.com** — **cloud-only**, tidak bisa dipakai untuk agent self-hosted.
Keputusan memakai interface tambahan ditunda (ADR-010).

## 5. Konvensi Kode & Workflow
- **Commit:** conventional commits (`feat:`, `fix:`, `docs:`).
- **Dokumentasi:** setiap keputusan baru → tambah ADR (`docs/09-adr.md`).

## 6. Validasi (Fase 1)
- [ ] `letta` berjalan & LLM terhubung (`/connect`)
- [ ] Chat interaktif berfungsi
- [ ] Memori lintas sesi terverifikasi (poin 2.3)
- [ ] (Opsional) App Server `letta server` hidup
- [ ] (Opsional) Backup `~/.letta` terjadwal

## 7. Troubleshooting Umum
| Masalah | Solusi |
|---------|--------|
| `letta` tidak dikenali | `npm install -g @letta-ai/letta-code`; cek PATH |
| Gagal compile native | Install python3/make/g++; coba WSL/Docker |
| Model tidak merespons | `/connect` ulang; cek API key; `/model` ganti model |
| Memori hilang setelah restart | Pastikan `~/.letta` tidak terhapus; backup rutin |
| Port bentrok | Ubah port di flag `--listen` |

## 8. Catatan Keamanan
- Jangan expose App Server ke publik langsung.
- API key disimpan aman (keyring / `.env` lokal, jangan di-commit).

## 9. Catatan Lisensi
- Letta: **Apache 2.0** — sertakan atribusi/NOTICE bila mendistribusikan.
- Komponen otomasi (Fase 2): belum diputuskan (lihat `10-eval-activepieces.md`).
