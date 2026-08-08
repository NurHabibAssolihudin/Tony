# Spesifikasi Project Tony

## 1. Tujuan Dokumen
Menetapkan lingkup, kebutuhan fungsional/non-fungsional, dan kriteria penerimaan Tony. Fokus saat
ini adalah **Fase 1**: **Letta Code murni** (self-host + interface CLI) **tanpa komponen tambahan**.

## 2. Komponen & Lisensi
| Komponen | Peran | Lisensi | Status |
|----------|-------|---------|--------|
| Letta Code (CLI + harness) | Otak asisten (agen stateful, memori) + interface CLI | Apache 2.0 | Dipakai |
| Interface/UI tambahan | Ditunda — kebutuhan kecil, keputusan belakangan | — | Ditunda |
| Activepieces (kandidat "tangan") | Mesin otomasi/aksi | MIT (CE) | Fase 2 — dievaluasi |

## 3. Lingkup Fase 1
- ✅ Install **Letta Code CLI** (`@letta-ai/letta-code`) di mesin lokal / VPS.
- ✅ Hubungkan **LLM provider** (OpenAI, Anthropic, Ollama, dsb.) via `/connect`.
- ✅ Buat agen **"Tony"** dan chat via **CLI**.
- ✅ Verifikasi **memori** lintas percakapan.
- ✅ (Opsional) Jalankan **App Server** (`letta server`) agar selalu aktif / diakses jarak jauh.
- ✅ (Opsional) Cadangkan state/memori agen (`~/.letta/...` / MemFS).
- ❌ **TIDAK** membangun frontend / "Tony UI" / web chat custom di Fase 1.
- ❌ **TIDAK** memakai Agent SDK untuk aplikasi custom di Fase 1.
- ❌ **TIDAK** menyentuh komponen otomasi (masih dievaluasi; akan diputuskan sebelum Fase 2).

## 4. Requirements Fungsional (Fase 1)
| ID | Requirement | Kriteria Penerimaan |
|----|-------------|---------------------|
| FR-01 | Letta Code CLI terinstal & berjalan | `letta` meluncurkan antarmuka interaktif |
| FR-02 | LLM provider terhubung | `/connect` berhasil; agen dapat menjawab |
| FR-03 | Agen "Tony" aktif via CLI | Chat interaktif berfungsi (input → jawaban streaming) |
| FR-04 | Tony **ingat** lintas percakapan | Mulai sesi baru tetap menyimpan konteks/memori |
| FR-05 | (Opsional) App Server self-hosted | `letta server` berjalan; state di MemFS |
| FR-06 | (Opsional) Back-up memori | `~/.letta` dapat dicadangkan/dipulihkan |

## 5. Requirements Non-Fungsional (Fase 1)
| ID | Kategori | Requirement |
|----|----------|-------------|
| NFR-01 | Availability | App Server (bila dipakai) `restart: always` / systemd |
| NFR-02 | Security | API key disimpan aman (`.env`/keyring); jangan di-commit; jangan expose App Server publik langsung |
| NFR-03 | Performa | Respon chat lancar; memori disimpan efisien (MemFS) |
| NFR-04 | Maintainability | Monorepo terstruktur; dokumentasi lengkap |
| NFR-05 | Portability | Letta mudah di-install ulang / dipindah (Node 22.19+ + native deps) |
| NFR-06 | Backups | Cadangkan state/memori agen (`~/.letta` / MemFS) & config |
| NFR-07 | Licensing | Letta (Apache 2.0) dipakai sesuai syarat (atribusi) |

## 6. Arsitektur Deployment (Fase 1)
```
        User ──terminal/SSH──►  Letta Code CLI (lokal / VPS)
                                   │  MemFS state ~/.letta
                                   ▼
                              LLM provider (API)
        (opsional, selalu-hidup)
        User ──SSH──►  Letta App Server (letta server, :4500 internal)
```
- Interface utama adalah **CLI**; tidak ada web yang diekspos publik di Fase 1.
- Nginx/HTTPS/domain hanya relevan bila nanti ada interface web/channel — di luar scope saat ini.

## 7. Lingkup Fase 2 (Ringkas / Belum Diputuskan)
- **Evaluasi** komponen otomasi ("tangan"): Activepieces vs n8n vs Dify vs lain — lihat
  `10-eval-activepieces.md`.
- Keputusan dicatat sebagai ADR sebelum integrasi dimulai.
- Detail perencanaan di `08-plan.md`.

## 8. Di Luar Lingkup Saat Ini
- Pembangunan frontend/web UI custom.
- Modifikasi mendalam internal Letta harness.
- Integrasi otomasi nyata (menunggu keputusan evaluasi).
