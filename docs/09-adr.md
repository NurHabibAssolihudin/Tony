# Architecture Decision Records (ADR) — Project Tony

> Format: [Status] — Judul. Status: `Accepted` (disetujui) / `Proposed` / `Superseded`.
> Tanggal ditetapkan sesuai iterasi perencanaan project Tony.

---

## ADR-001 — Mengganti LobeHub(d/LobeChat) dengan Letta sebagai fondasi asisten

- **Status:** Accepted
- **Tanggal:** 2026-08
- **Konteks:** Awalnya Tony direncanakan di atas LobeHub (d/h LobeChat) karena UI asisten AI yang
  matang. Namun tujuan project adalah **open-source + portofolio + memungkinkan turunan berbayar**,
  dan LobeHub memakai **LobeHub Community License** yang membatasi karya turunan bermodifikasi.
- **Keputusan:** Gunakan **Letta** (d/h MemGPT) sebagai komponen "otak" asisten.
  - Letta berlisensi **Apache 2.0** (permissive).
  - Letta menyediakan agen **stateful dengan memori** — selaras dengan visi "Tony yang beringatan".
- **Konsekuensi (pro):**
  - Bebas dipakai, dimodifikasi, didistribusikan, dan dijadikan basis turunan berbayar (dgn atribusi).
  - Kemampuan memori/learning membedakan Tony dari asisten chat biasa.
- **Konsekuensi (kontra):**
  - Tidak ada UI chat siap-pakai (seperti LobeChat) → perlu membangun "Tony UI" (lihat ADR-003).
  - Stack Letta (Node/Python) berbeda dari stack LobeHub (Next.js inti); arsitektur dirombak.
- **Alternatif yang dinilai:** LobeHub (Community License — ditolak), Open WebUI (lisensi + syarat
  mempertahankan branding — ditolak), LibreChat (MIT — baik, tapi tanpa memori native sebagus Letta).

## ADR-002 — Kombinasi fondasi permissive: Letta (Apache 2.0) + Activepieces (MIT)

- **Status:** Accepted
- **Konteks:** Tujuan project menuntut seluruh komponen bebas dari lisensi restriktif.
- **Keputusan:** Bangun Tony di atas **Letta (Apache 2.0)** untuk otak agen dan **Activepieces
  (MIT)** untuk mesin otomasi/aksi.
- **Konsekuensi:**
  - Pro: Seluruh stack komersial-friendly, open-source, dan mendukung turunan berbayar.
  - Kontra: Wajib mematuhi syarat atribusi Apache 2.0 dan menyertakan lisensi komponen.

## ADR-003 — Membangun "Tony UI" web custom (React + Next.js) di atas Letta Agent SDK

- **Status:** Accepted
- **Konteks:** Web app Letta (`chat.letta.com`) adalah layanan cloud dan **tidak dapat
  di-self-host**. Tanpa frontend, Tony tidak punya antarmuka web yang dapat di-branding.
- **Keputusan:** Bangun frontend web sendiri, **"Tony UI"** (React + Next.js + TypeScript),
  terhubung ke Letta App Server melalui **Letta Agent SDK** (remote backend).
- **Konsekuensi:**
  - Pro: Kontrol penuh atas branding "Tony", UI, dan data.
  - Kontra: Effort pengembangan frontend; menjadi tanggung jawab tim Tony.

## ADR-004 — Pemisahan peran: Otak (Letta) / Wajah (Tony UI) / Tangan (Activepieces)

- **Status:** Accepted
- **Konteks:** Menghindari monolit dan memudahkan evolusi.
- **Keputusan:** Arsitektur modular tiga lapis dengan jembatan jelas:
  - Otak: Letta (memori, agen, eksekusi).
  - Wajah: Tony UI (interaksi pengguna).
  - Tangan: Activepieces (aksi/otomasi) — Fase 2.
- **Konsekuensi:** Boundary jelas → mudah diuji, di-maintain, dan diganti per-komponen.

## ADR-005 — Jembatan integrasi Letta ↔ Activepieces via MCP (Model Context Protocol)

- **Status:** Proposed (untuk Fase 2)
- **Konteks:** Ingin Tony mampu bertindak (bukan sekadar chat).
- **Keputusan:** Hubungkan Letta agent (yang mendukung **MCP client**) ke **Activepieces MCP
  server** (`/mcp`). Tony memakai tool MCP untuk membuat/menjalankan flow, mengelola tabel, dsb.
  Webhook sebagai jalur sekunder untuk skenario event-driven.
- **Konsekuensi:** Standar terbuka yang didukung kedua pihak; perlu konfigurasi MCP + auth.

## ADR-006 — Monorepo terpadu (pnpm)

- **Status:** Accepted
- **Konteks:** Seluruh komponen (UI, service, kelak Activepieces) satu project.
- **Keputusan:** Repository monorepo dengan pnpm workspaces; `apps/ui`, `apps/letta`,
  `apps/activepieces`, `packages/shared`.
- **Konsekuensi:** Satu toolchain, satu source of truth, deploy terpadu; butuh disiplin boundary.

## ADR-007 — App Server Letta tidak diekspos ke publik

- **Status:** Accepted
- **Konteks:** App Server punya akses filesystem & shell; token jangan jatuh ke browser.
- **Keputusan:** App Server hanya berjalan di `127.0.0.1:4500` (internal); "Tony UI"/backend memegang
  token dan berbicara atas nama user; Nginx hanya mengekspos UI.
- **Konsekuensi:** Lebih aman; arsitektur klien-server yang benar.

## ADR-008 — Bentuk "Tony UI"

- **Status:** Proposed (asumsi untuk iterasi ini)
- **Konteks:** Keputusan final bentuk UI masih terbuka.
- **Asumsi/opsi:**
  - **(a) Web chat custom (React/Next)** — disarankan; branding penuh, multi-user, via Agent SDK.
  - (b) Desktop app Letta — cepat mulai, branding terbatas.
  - (c) Saluran chat (Slack/Telegram/Discord) — fokus integrasi, tanpa frontend sendiri.
- **Keputusan awal:** **Opsi (a)** sebagai arah utama; (b)/(c) sebagai pelengkap/integrasi.
- **Konsekuensi:** Menentukan scope frontend Fase 1. Perlu konfirmasi final dari pemilik project.

## ADR-009 — Penyimpanan state & memori agen via MemFS Letta + backup

- **Status:** Accepted
- **Konteks:** Memori Tony adalah aset inti yang harus persisten & aman.
- **Keputusan:** Gunakan mekanisme MemFS default Letta (`~/.letta/...`); jadwalkan backup; set
  `LETTA_LOCAL_BACKEND_DIR` agar terisolasi & mudah dipindahkan.
- **Konsekuensi:** Persistensi terjamin; perlu strategi backup & pemulihan.

---

## Lampiran: Alur Keputusan
1. Evaluasi lisensi (LobeHub ✗ → Letta/Open WebUI/LibreChat).
2. Pilih Letta (Apache 2.0) + Activepieces (MIT) karena memenuhi seluruh tujuan.
3. Rancang arsitektur 3-lapis + UI custom + MCP bridge.
4. Documentasikan, inisialisasi git, lalu deploy Fase 1.
