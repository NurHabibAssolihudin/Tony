# Project Plan — Tony

## 1. Ringkasan
Tony berjalan dalam **dua fase**. **Fase 1** (fokus saat ini): self-host **Letta** + bangun
**"Tony UI"** + branding. **Fase 2**: serap **Activepieces** untuk aksi nyata.

## 2. Fase 1 — Letta + "Tony UI" (Detail)

### 2.1 Milestone
| Milestone | Keluaran | Definisi Selesai (DoD) |
|-----------|----------|------------------------|
| **M1: Setup Letta lokal** | App Server Letta jalan di dev | `letta server` aktif; LLM terkoneksi; chat lewat CLI |
| **M2: Skel "Tony UI"** | Frontend Next.js terhubung ke Letta | UI bisa chat dengan agen "Tony" (via Agent SDK) |
| **M3: Branding & memori** | Identitas Tony + memori lintas sesi | Branding tampil; konteks tetap saat sesi baru |
| **M4: Deploy VPS** | Tony live dengan HTTPS | `https://<domain>` aktif; App Server internal; backup |
| **M5: Validasi & docs** | Stabil & terdokumentasi | Test/build hijau; checklist go-live; ADR lengkap |

### 2.2 Task Breakdown (Fase 1)
- **T1.1** Install `@letta-ai/letta-code`; setup python/make/g++
- **T1.2** Koneksi LLM provider; buat agen "Tony"
- **T1.3** Jalankan App Server dev (`letta server ... ws://127.0.0.1:4500`)
- **T2.1** Inisialisasi monorepo pnpm (`apps/ui`)
- **T2.2** Next.js + TS; halaman chat; `lib/letta.ts` (Agent SDK remote)
- **T2.3** Streaming pesan; daftar sesi/percakapan
- **T3.1** Branding "Tony" (nama, logo, favicon, tema, judul)
- **T3.2** Verifikasi memori lintas percakapan
- **T4.1** Siapkan VPS + domain (A record) + Nginx + Certbot
- **T4.2** Deploy App Server (systemd) + "Tony UI" (Docker/systemd)
- **T4.3** Konfigurasi token auth & pastikan `:4500` tidak terpapar
- **T4.4** Backup state/config; monitoring
- **T5.1** Jalankan checklist go-live
- **T5.2** Finalisasi docs & ADR

### 2.3 Estimasi & Prioritas
- Urutan kritis: M1 → M2 → M4. M3 paralel dengan M2.
- Estimasi: M1 (0.5–1 hr), M2 (1–2 hr), M3 (0.5–1 hr), M4 (1–2 hr), M5 (0.5 hr).
- **P0:** chat + memori + deploy live. **P1:** multi-provider, multi-agen. **P2:** polish & monitoring.

## 3. Fase 2 — Serap Activepieces (Ringkas / Planned)
- **F2-M1** Tambah `apps/activepieces` ke monorepo (MIT).
- **F2-M2** Setup DB/Redis Activepieces.
- **F2-M3** Jembatan **MCP**: aktifkan MCP server AP; arahkan Letta MCP client ke sana.
- **F2-M4** Routing Nginx satu domain (`/activepieces/*`, `/mcp`).
- **F2-M5** Uji integrasi: Tony membuat & menjalankan flow; dokumentasi.

## 4. Prinsip Prioritas
1. **Fase 1 stabil dulu** sebelum Fase 2.
2. **Scope Fase 1 ketat** (chat + memori + branding + deploy).
3. **Oops fleksibel** — bentuk "Tony UI" (ADR-008) bisa disesuaikan.

## 5. Risiko pada Jadwal
| Risiko | Tindakan |
|--------|----------|
| Build UI memakan waktu | Scope ketat; iterasi kecil |
| Native deps Letta (VPS) | Install python3/make/g++; uji di staging |
| Integrasi MCP rumit | Pindah Fase 2 setelah Fase 1 stabil |

## 6. Checklist Go-Live Fase 1 (DoD)
- [ ] App Server Letta aktif & LLM terkoneksi
- [ ] Memori lintas percakapan terverifikasi
- [ ] "Tony UI" chat berfungsi + branding "Tony"
- [ ] Deploy VPS + HTTPS (`https://domain`)
- [ ] `:4500` tidak terpapar publik; token aman
- [ ] Backup state & config berjalan
- [ ] `docs/` (01–09) & `README.md` lengkap
- [ ] Git repo `main` di-push ke origin
