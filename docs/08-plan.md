# Project Plan — Tony

## 1. Ringkasan
Tony berjalan dalam **dua fase**. **Fase 1** (fokus saat ini): **Letta Code murni** — self-host,
LLM, agen "Tony", verifikasi memori — **tanpa komponen tambahan** (no UI custom, no SDK).
**Fase 2**: **evaluasi & pilih** komponen otomasi ("tangan") sebelum integrasi.

## 2. Fase 1 — Letta Code Murni (Detail)

### 2.1 Milestone
| Milestone | Keluaran | Definisi Selesai (DoD) |
|-----------|----------|------------------------|
| **M1: Setup Letta lokal** | Letta Code CLI jalan | `letta` meluncurkan CLI; LLM terhubung (`/connect`) |
| **M2: Agen "Tony" + memori** | Agen aktif & ingat lintas sesi | Chat via CLI; konteks tetap saat sesi baru (`/new`) |
| **M3: (Opsional) Deploy** | App Server selalu-hidup + backup | `letta server` via systemd/Docker; backup `~/.letta` terjadwal |
| **M4: Validasi & docs** | Stabil & terdokumentasi | Checklist go-live; docs & ADR lengkap |

### 2.2 Task Breakdown (Fase 1)
- **T1.1** Install `@letta-ai/letta-code`; setup python/make/g++
- **T1.2** Hubungkan LLM provider (`/connect`); pilih model (`/model`)
- **T2.1** Buat agen "Tony" (`letta --new-agent` / otomatis)
- **T2.2** Chat via CLI; verifikasi memori lintas percakapan (`/new`)
- **T3.1** (Opsional) Siapkan App Server (systemd/Docker) di VPS
- **T3.2** (Opsional) Jadwalkan backup `~/.letta`
- **T4.1** Jalankan checklist go-live
- **T4.2** Finalisasi docs & ADR (termasuk keputusan interface)

### 2.3 Estimasi & Prioritas
- Urutan kritis: M1 → M2 → M4. M3 paralel/opsional.
- Estimasi: M1 (0.5–1 hr), M2 (0.5 hr), M3 (1 hr), M4 (0.5 hr).
- **P0:** chat + memori. **P1:** App Server + backup. **P2:** interface tambahan (channel) — ditunda.

## 3. Fase 2 — Otomasi ("tangan"): Evaluasi Dulu
- **F2-M0 (SEBELUM integrasi):** evaluasi & pilih komponen otomasi — lihat
  `10-eval-activepieces.md`. Keluaran: rekomendasi + ADR keputusan.
- **F2-M1** Integrasi komponen terpilih ke arsitektur (bila kandidat: Activepieces via MCP).
- **F2-M2** Uji integrasi: Tony membuat & menjalankan flow; dokumentasi.
> Prinsip: **jangan mulai integrasi sebelum keputusan komponen final.**

## 4. Prinsip Prioritas
1. **Fase 1 stabil dulu** sebelum Fase 2.
2. **Scope Fase 1 ketat** — Letta murni, tanpa tambahan.
3. **Evaluasi sebelum komitmen** — keputusan otomasi & interface didasarkan bukti/ADR.

## 5. Risiko pada Jadwal
| Risiko | Tindakan |
|--------|----------|
| Native deps Letta (install) | Install python3/make/g++; uji di staging |
| Letta berubah cepat | Pin versi; pantau changelog |
| Kebuntuan evaluasi otomasi | Tetapkan kriteria & deadline keputusan di `10-eval-activepieces.md` |

## 6. Checklist Go-Live Fase 1 (DoD)
- [ ] Letta Code CLI terinstal & LLM terkoneksi
- [ ] Memori lintas percakapan terverifikasi
- [ ] Chat via CLI berfungsi
- [ ] (Opsional) App Server aktif; `:4500` tidak terpapar publik; token/secret aman
- [ ] Backup state & config berjalan
- [ ] `docs/` (01–10) & `README.md` lengkap
- [ ] Git repo `main` di-push ke origin
