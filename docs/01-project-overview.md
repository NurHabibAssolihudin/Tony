# Project Overview — Tony

## 1. Visi
**Tony** adalah asisten AI pribadi yang dapat di-deploy sendiri (self-hosted), dibangun di atas
fondasi open-source berlisensi **permissive** sehingga bebas dipakai, dibagikan, dan dijadikan
basis layanan berbayar oleh siapa pun. Tony berdesain **satu project monorepo terpadu**, bukan
sekadar beberapa layanan yang disambungkan.

Tony dirancang untuk menjadi asisten yang:
- **Beringatan & belajar** — menggunakan Letta (agen stateful dengan memori) sehingga ingat
  percakapan dan berkembang seiring waktu.
- **Mampu bertindak** — lewat Activepieces, Tony dapat menjalankan otomasi nyata (email, CRM,
  notifikasi, webhook, dll), bukan hanya menjawab.
- **Berkepribadian "Tony"** — UI dengan identitas yang konsisten dan bebas direbrand.
- **Self-hosted penuh** — data & kontrol milik sendiri di VPS.

## 2. Fondasi: Komponen Open-Source
| Komponen | Peran | Lisensi |
|----------|-------|---------|
| **Letta** (d/h MemGPT) | Otak asisten: agen stateful dengan memori, skills, subagents, MCP | **Apache 2.0** ✅ permissive |
| **Tony UI** (kita bangun) | Wajah asisten: web chat frontend (React/Next.js) di atas Letta Agent SDK | Milik kita |
| **Activepieces** | Tangan asisten: mesin otomasi/aksi, 700+ integrasi, MCP server | **MIT** ✅ permissive |

> **Mengapa bukan LobeHub/LobeChat:** lisensi LobeHub (Community License) membatasi karya turunan
> komersial. Letta (Apache 2.0) + Activepieces (MIT) memberi kebebasan penuh untuk *open-source,
> portofolio, dan turunan berbayar*. Lihat `07-context.md` & `09-adr.md` (ADR-001/002).

## 3. Masalah yang Dipecahkan
1. **Kebergantungan pada lisensi restriktif** → kombinasi Apache 2.0 + MIT menghilangkan hambatan
   distribusi komersial turunan.
2. **Asisten yang "lupa"** → Letta memberi memori jangka panjang & pembelajaran berkelanjutan.
3. **Asisten hanya "pandai bicara"** → Activepieces memungkinkan Tony **bertindak** nyata.
4. **Fragmentasi tooling** → satu monorepo terpadu (Letta + UI + Activepieces).
5. **Personal branding** → "Tony UI" dibangun sendiri sehingga bebas di-branding ulang.

## 4. Peta Jalan 2 Fase
| Fase | Cakupan | Keluaran |
|------|---------|----------|
| **Fase 1 (sekarang)** | Self-host **Letta App Server** + bangun **"Tony UI"** (web chat) di atas Agent SDK + branding "Tony" | Tony beringatan, self-hosted, tampil di browser via domain sendiri |
| **Fase 2 (nanti)** | **Serap Activepieces** ke monorepo, hubungkan via **MCP** | Tony bisa membuat & menjalankan otomasi nyata |

## 5. Arsitektur High-Level (Target Akhir)
```
               ┌────────────────────────────────────────────────┐
  Browser ───► │     "Tony UI" (React/Next.js — kita buat)      │
               │     branding "Tony" penuh (bebas lisensi)       │
               └───────────────────┬────────────────────────────┘
                                   │  Letta Agent SDK (remote, WS :4500)
               ┌───────────────────▼────────────────────────────┐
               │      Letta App Server (self-host, Apache 2.0)  │
               │      • agen stateful, memori, skills, MCP       │
               └───────────────────┬────────────────────────────┘
                                   │  MCP tools
               ┌───────────────────▼────────────────────────────┐
               │     Activepieces (MIT) — mesin otomasi/aksi     │
               │     • flows, 700+ integrasi, MCP server          │
               └────────────────────────────────────────────────┘
```
Fase 1: hanya blok **Tony UI** + **Letta**. Fase 2: tambah **Activepieces** tanpa mengubah fondasi.

## 6. Persona & Use Case Utama
- **Persona:** individu/developer yang ingin asisten AI self-hosted, ber-memori, dan bisa bertindak,
  yang legal untuk dijadikan basis project open-source/berbayar.
- **Use case fase 1:** chat personal, memori percakapan lintas sesi, identitas "Tony".
- **Use case fase 2 (contoh):** "Tony, kirim ringkasan rapat ke email tim", "Tony, tambah lead ke
  CRM", "Tony, buat reminder Slack saat deadline".

## 7. Keberhasilan (Definition of Success)
- **Fase 1:** Letta App Server self-hosted di VPS; "Tony UI" ter-deploy dengan HTTPS; Tony punya
  memori lintas percakapan; branding "Tony" penuh; repo monorepo bersih & terdokumentasi.
- **Fase 2:** Activepieces aktif dalam monorepo yang sama; Tony membuat & menjalankan flow via MCP;
  semua di-deploy dari satu sumber.
