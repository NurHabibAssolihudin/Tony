# Project Overview — Tony

## 1. Visi
**Tony** adalah asisten AI pribadi yang dapat di-deploy sendiri (self-hosted), dibangun di atas
fondasi open-source berlisensi **permissive** sehingga bebas dipakai, dibagikan, dan dijadikan
basis layanan berbayar oleh siapa pun. Tony berdesain **satu project monorepo terpadu** tanpa
komponen tambahan yang tidak diperlukan.

Fase ini Tony berjalan **murni di atas Letta Code** (Apache 2.0) — tanpa frontend custom,
tanpa Agent SDK, tanpa komponen UI tambahan. Interface utama adalah **CLI**.

Tony dirancang untuk menjadi asisten yang:
- **Beringatan & belajar** — memakai Letta Code (agen stateful dengan memori) sehingga ingat
  percakapan dan berkembang seiring waktu.
- **(Fase 2) Mampu bertindak** — integrasi otomasi nyata (email, CRM, notifikasi, webhook, dll)
  sedang dievaluasi; belum diputuskan komponennya.
- **Self-hosted penuh** — data & kontrol milik sendiri.

## 2. Fondasi: Komponen Open-Source
| Komponen | Peran | Lisensi |
|----------|-------|---------|
| **Letta Code** (d/h MemGPT) | Otak asisten + interface CLI: agen stateful dengan memori, skills, subagents, MCP | **Apache 2.0** ✅ permissive |
| *(Interface/UI tambahan)* | Belum diputuskan; kebutuhan kecil → ditunda | — |
| Activepieces (kandidat "tangan") | Mesin otomasi/aksi (Fase 2) | **MIT (CE)** ⏳ dievaluasi |

## 3. Masalah yang Dipecahkan
1. **Kebergantungan pada lisensi restriktif** → Letta (Apache 2.0) menghilangkan hambatan
   distribusi komersial turunan.
2. **Asisten yang "lupa"** → Letta memberi memori jangka panjang & pembelajaran berkelanjutan.
3. **Interface web cloud yang tak bisa di-self-host** → solusi: pakai **CLI** / interface
   first-party Letta, bukan membangun frontend sendiri (lihat ADR-010).
4. **Kompleksitas yang tidak perlu** → tanpa UI custom, scope Fase 1 kecil dan cepat.

## 4. Peta Jalan 2 Fase
| Fase | Cakupan | Keluaran |
|------|---------|----------|
| **Fase 1 (sekarang)** | **Letta Code murni**: self-host, connect LLM provider, buat agen "Tony", verifikasi memori, interface CLI | Tony beringatan & self-hosted, dipakai via terminal |
| **Fase 2 (nanti)** | **Evaluasi & pilih** komponen otomasi ("tangan"); integrasi bila terpilih | Tony bisa membuat & menjalankan otomasi nyata |

## 5. Arsitektur High-Level (Target Akhir)
```
                 ┌───────────────────────────────────┐
   User ──►      │  Letta Code (Apache 2.0)           │
 (terminal/SSH)  │  • CLI interaktif                  │
                 │  • agen stateful, memori (MemFS)   │
                 └───────────────┬───────────────────┘
                                 │  tools / eksekusi
                                 ▼
                           LLM provider (API)
```
Fase 1: hanya blok **Letta Code** (CLI). Fase 2: tambah komponen otomasi **jika** hasil
evaluasi mendukung — tanpa mengubah fondasi.

## 6. Persona & Use Case Utama
- **Persona:** individu/developer yang ingin asisten AI self-hosted, ber-memori, dan kelak bisa
  bertindak, yang legal untuk dijadikan basis project open-source/berbayar.
- **Use case fase 1:** chat personal via terminal, memori percakapan lintas sesi.
- **Use case fase 2 (contoh):** "kirim ringkasan rapat ke email", "tambah lead ke CRM",
  "buat reminder" — komponennya masih dievaluasi.

## 7. Keberhasilan (Definition of Success)
- **Fase 1:** Letta Code berjalan self-hosted; LLM terhubung; agen "Tony" aktif via CLI; memori
  lintas percakapan terverifikasi; repo monorepo bersih & terdokumentasi.
- **Fase 2:** keputusan komponen otomasi terdokumentasi (ADR); integrasi berjalan bila dipilih.
