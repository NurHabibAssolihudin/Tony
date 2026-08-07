# Spesifikasi Project Tony

## 1. Tujuan Dokumen
Menetapkan lingkup, kebutuhan fungsional/non-fungsional, dan kriteria penerimaan Tony. Fokus saat
ini adalah **Fase 1**: self-host **Letta** + membangun **"Tony UI"** + branding.

## 2. Komponen & Lisensi
| Komponen | Peran | Lisensi | Status |
|----------|-------|---------|--------|
| Letta (App Server + harness) | Otak asisten (agen stateful, memori) | Apache 2.0 | Dipakai (self-host) |
| "Tony UI" (frontend kita) | Web chat UI, branding Tony | Milik kita (MIT bila dipublikasikan) | Dibangun |
| Activepieces | Mesin otomasi/aksi | MIT | Fase 2 |

## 3. Lingkup Fase 1
- ✅ Install & self-host **Letta App Server** (via CLI `@letta-ai/letta-code`) di VPS.
- ✅ Bangun **"Tony UI"**: web chat frontend (React + Next.js + TypeScript) terhubung ke App Server
  melalui **Letta Agent SDK** (remote backend).
- ✅ Branding **"Tony"** penuh pada UI (nama, logo, tema, judul).
- ✅ Pilih LLM provider (OpenAI, Anthropic, dsb.) agar Tony bisa menjawab.
- ✅ Verifikasi **memori** lintas percakapan.
- ✅ Deploy di VPS: App Server (:4500) + frontend + Nginx + domain + HTTPS.
- ❌ **TIDAK** membangun integrasi otomasi nyata di Fase 1.
- ❌ **TIDAK** menyentuh Activepieces (akan di Fase 2).

## 4. Requirements Fungsional (Fase 1)
| ID | Requirement | Kriteria Penerimaan |
|----|-------------|---------------------|
| FR-01 | App Server Letta berjalan self-hosted | `letta server` aktif di VPS; API/WS dapat diakses |
| FR-02 | "Tony UI" menampilkan identitas "Tony" | Branding Tony di header, judul, logo, tema |
| FR-03 | User dapat chat dengan Tony | Frontend mengirim ke SDK; balasan streaming tampil |
| FR-04 | Tony **ingat** lintas percakapan | Memulai sesi baru tetap menyimpan konteks/memori Tony |
| FR-05 | Memilih/mengganti LLM provider | Provider terkonfigurasi; chat berfungsi |
| FR-06 | Akses via HTTPS + domain sendiri | `https://<domain>` mengarah ke "Tony UI" |
| FR-07 | (Opsional) Beberapa agen/komputer diatur | App Server dapat melayani beberapa agen |

## 5. Requirements Non-Fungsional (Fase 1)
| ID | Kategori | Requirement |
|----|----------|-------------|
| NFR-01 | Availability | App Server & frontend `restart: always` / systemd; uptime tinggi |
| NFR-02 | Security | Auth WS (capability-token); jangan expose App Server publik langsung; secret di `.env` |
| NFR-03 | Performa | Respon chat lancar; memori disimpan efisien (MemFS) |
| NFR-04 | Maintainability | Monorepo terstruktur; dokumentasi lengkap |
| NFR-05 | Portability | Semua layanan via Docker Compose / systemd; mudah pindah server |
| NFR-06 | Backups | Cadangkan state/memori agen (`~/.letta/...` / MemFS) & config |
| NFR-07 | Licensing | Letta (Apache 2.0) + Activepieces (MIT) dipakai sesuai syarat (atribusi) |

## 6. Arsitektur Deployment (Fase 1)
```
        User ──HTTPS──► Nginx ──► "Tony UI" (Next.js, :3000)
                                     │  Letta Agent SDK (remote)
        (internal, token)            ▼
                               Letta App Server (ws://127.0.0.1:4500)
```
- "Tony UI" dan App Server berjalan di VPS yang sama; frontend memegang token, App Server tidak
  diekspos langsung ke publik (per saran keamanan Letta).

## 7. Lingkup Fase 2 (Ringkas)
- Serap `activepieces` ke monorepo (MIT).
- Hubungkan Letta → Activepieces via **MCP** (Letta Agent SDK mendukung MCP server → Activepieces
  MCP server).
- Satu domain, routing Nginx (`/activepieces/*`).
- Detail di `08-plan.md` & `04-architecture.md`.

## 8. Di Luar Lingkup Saat Ini
- Modifikasi mendalam internal Letta harness (utamanya konfigurasi/UI, bukan fork inti).
- Mobile native app baru, integrasi pihak ketiga non-default, fitur komersial yang mahal.
