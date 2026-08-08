# Architecture Decision Records (ADR) — Project Tony

> Format: [Status] — Judul. Status: `Accepted` (disetujui) / `Proposed` (diusulkan) /
> `Superseded` (digantikan) / `Under review` (sedang dievaluasi).
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
  - Tidak ada web chat siap-pakai yang self-hostable (lihat ADR-010 → solusi: CLI).
- **Alternatif yang dinilai:** LobeHub (Community License — ditolak), Open WebUI (lisensi + syarat
  mempertahankan branding — ditolak), LibreChat (MIT — baik, tapi tanpa memori native sebagus Letta).

## ADR-002 — Fondasi permissive: Letta (Apache 2.0) + komponen otomasi (sedang dievaluasi)

- **Status:** Under review
- **Konteks:** Awalnya direncanakan **Activepieces (MIT)** sebagai mesin otomasi/aksi. Setelah
  riset, lisensi Activepieces adalah **dual-license** (CE MIT + fitur enterprise komersial), dan
  ada beberapa kandidat lain (n8n, Dify, dsb.).
- **Keputusan:** Fondasi "otak" tetap **Letta (Apache 2.0)**. Pilihan komponen "tangan" (Fase 2)
  **belum final** — dibandingkan di `10-eval-activepieces.md`.
- **Konsekuensi:**
  - Pro: Keputusan berbasis evaluasi; stack komersial-friendly.
  - Kontra: Wajib mematuhi syarat atribusi Apache 2.0 dan lisensi komponen terpilih.

## ADR-003 — Membangun "Tony UI" web custom (React + Next.js) — **SUPERSEDED**

- **Status:** Superseded (digantikan ADR-010)
- **Konteks:** Rencana awal membuat frontend web sendiri untuk branding.
- **Keputusan:** ~~Bangun "Tony UI" (React + Next.js) di atas Letta Agent SDK~~ **dibatalkan**.
- **Alasan superseded:** Interface Fase 1 = **Letta CLI murni**; kebutuhan UI kecil; Letta punya
  interface first-party lain (channels/desktop) yang bisa dipakai tanpa kode custom.
- **Konsekuensi:** Tidak ada effort pengembangan frontend di Fase 1; branding khusus ditunda.

## ADR-004 — Pemisahan peran: Otak (Letta) / (kelak) Tangan (otomasi)

- **Status:** Accepted (revisi — tanpa layer "Wajah")
- **Konteks:** Menghindari monolit dan memudahkan evolusi.
- **Keputusan:** Arsitektur modular dengan jembatan jelas:
  - Otak: Letta (memori, agen, eksekusi) + interface CLI.
  - Tangan: komponen otomasi/aksi — Fase 2 (belum dipilih).
  - ~~Wajah/UI custom~~ dihapus (ADR-010).
- **Konsekuensi:** Boundary jelas → mudah diuji, di-maintain, dan diganti per-komponen.

## ADR-005 — Jembatan integrasi Letta ↔ otomasi via MCP (Model Context Protocol)

- **Status:** Proposed (Fase 2 — menunggu keputusan komponen)
- **Konteks:** Ingin Tony mampu bertindak (bukan sekadar chat).
- **Keputusan (potensial):** Hubungkan Letta agent (yang mendukung **MCP client/tools**) ke
  komponen otomasi. Bila terpilih Activepieces: gunakan **Activepieces MCP server** (`/mcp`).
- **Konsekuensi:** Standar terbuka yang didukung pihak terkait; perlu konfigurasi MCP + auth.

## ADR-006 — Monorepo terpadu (git)

- **Status:** Accepted
- **Konteks:** Seluruh komponen (source Letta + kelak otomasi) satu project.
- **Keputusan:** Repository monorepo; `letta-code/` (vendor source), `docs/`, `README.md`.
  Workspace pnpm dibuat **hanya bila** ada aplikasi sendiri (saat ini tidak).
- **Konsekuensi:** Satu source of truth, deploy terpadu; disiplin boundary.

## ADR-007 — App Server Letta tidak diekspos ke publik

- **Status:** Accepted
- **Konteks:** App Server punya akses filesystem & shell; credential jangan jatuh ke publik.
- **Keputusan:** App Server (bila dipakai) hanya berjalan di `127.0.0.1:4500` (internal);
  diakses via SSH/CLI, bukan langsung dari internet.
- **Konsekuensi:** Lebih aman; arsitektur klien-server yang benar.

## ADR-008 — Bentuk "Tony UI" — **SUPERSEDED**

- **Status:** Superseded (digantikan ADR-010)
- **Konteks:** Opsi bentuk interface/UI sebelumnya (web custom / desktop / saluran chat).
- **Keputusan:** ~~Opsi (a) web chat custom~~ **dibatalkan**; interface = CLI (ADR-010).
  Opsi channels/desktop tetap tersedia sebagai pelengkap bila dibutuhkan nanti.

## ADR-009 — Penyimpanan state & memori agen via MemFS Letta + backup

- **Status:** Accepted
- **Konteks:** Memori Tony adalah aset inti yang harus persisten & aman.
- **Keputusan:** Gunakan mekanisme MemFS default Letta (`~/.letta`); jadwalkan backup.
- **Konsekuensi:** Persistensi terjamin; perlu strategi backup & pemulihan.

## ADR-010 — Interface Fase 1 = Letta CLI murni; tanpa komponen tambahan

- **Status:** Accepted
- **Tanggal:** 2026-08
- **Konteks:** Kebutuhan interface/UI sangat kecil; project menolak kompleksitas tambahan
  (UI custom, Agent SDK, frontend web) sebelum benar-benar diperlukan.
- **Keputusan:**
  - Fase 1 memakai **Letta Code murni**, interface utama = **CLI** (`letta`).
  - **Tidak ada** komponen tambahan: no UI custom, no Agent SDK, no frontend.
  - Interface first-party lain (channels/desktop) tercatat sebagai opsi, **di luar scope**.
- **Konsekuensi:**
  - Pro: Scope kecil, cepat live, tanpa effort frontend.
  - Kontra: Tanpa antarmuka web sendiri; branding khusus ditunda.
- **Referensi:** riset interface Letta di `07-context.md` (CLI/channels/desktop/web-chat-cloud).

---

## Lampiran: Alur Keputusan
1. Evaluasi lisensi (LobeHub ✗ → Letta/Open WebUI/LibreChat).
2. Pilih Letta (Apache 2.0) sebagai otak.
3. Putuskan interface Fase 1 = CLI murni, tanpa komponen tambahan (ADR-010).
4. Evaluasi komponen otomasi Fase 2 (`10-eval-activepieces.md`) sebelum integrasi.
5. Documentasikan, inisialisasi git, lalu eksekusi Fase 1.
