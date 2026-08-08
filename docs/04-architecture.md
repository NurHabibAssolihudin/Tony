# Arsitektur — Project Tony

## 1. Prinsip Arsitektur
1. **Monorepo terpadu** — seluruh project dalam satu repository (source Letta + docs).
2. **Tanpa tambahan yang tidak perlu** — Fase 1 memakai Letta Code murni (CLI).
3. **Fondasi bebas lisensi** — Letta (Apache 2.0).
4. **Evolusi bertahap** — Fase 1 (Letta CLI), Fase 2 (tambah komponen otomasi **jika** terpilih).
5. **Self-hosted & aman** — App Server tidak diekspos publik langsung.

## 2. Arsitektur Fase 1 (Letta Code murni)
```
        User ──terminal/SSH──►  Letta Code CLI (lokal / VPS)
                                    │  agen stateful
                                    │  memori/state ~/.letta (MemFS, git-backed)
                                    ▼
                               LLM provider (API)

        (opsional: selalu-hidup / akses jarak jauh)
        User ──SSH──►  Letta App Server (letta server, bind internal 127.0.0.1:4500)
```
- **CLI** menjalankan agen in-process; semua state (memori, percakapan, koneksi provider) ada di
  mesin lokal — **tidak perlu akun Letta**.
- **MemFS** melacak seluruh konteks via git → mudah di-backup, dipindah, atau disinkronkan ke repo.
- App Server opsional hanya untuk kebutuhan *always-on* / remote; tetap terikat internal.

## 3. Struktur Monorepo (Fase 1)
```
tony/
├── letta-code/                  # source Letta Code (vendor)
├── docs/                        # dokumentasi project
└── README.md
```

## 4. Alur Data Singkat (Fase 1)
1. User menjalankan `letta` di terminal (lokal / SSH ke VPS).
2. User mengirim pesan → Letta Code menyusun konteks dari **memori** agen, memanggil LLM,
   mengembalikan jawaban (streaming).
3. Pesan & konteks disimpan di memori agen (MemFS) → Tony "mengingat" lintas sesi.

## 5. Peta Integrasi Fase 2 (Otomasi — belum diputuskan)
```
                    Letta Code (CLI / App Server)
                        │  MCP tools (potensial)
                        ▼
              komponen otomasi (kandidat: Activepieces MCP server)
                        │
                   flows / integrasi
```
- Keputusan komponen "tangan" **belum diambil**; lihat `10-eval-activepieces.md`.
- Prinsip jembatan (bila Activepieces): Letta agent memakai **MCP client** → **Activepieces MCP
  server** (`/mcp`).

## 6. Keputusan Arsitektur Penting (ringkas ADR)
| Keputusan | Alasan | Status |
|-----------|--------|--------|
| Letta sebagai otak (bukan LobeHub) | Lisensi Apache 2.0 + memori/learning | ⚖️ ADR-001 |
| **Tanpa UI custom** — pakai Letta CLI | Kebutuhan UI kecil; interface first-party tersedia | ⚖️ ADR-010 (ADR-003 superseded) |
| App Server tidak diekspos publik | Keamanan | ⚖️ ADR-007 |
| Monorepo terpadu | Satu toolchain & deploy | ⚖️ ADR-006 |
| Otomasi = evaluasi dulu | Hindari komitmen sebelum keputusan matang | 📋 ADR-002/005 (evaluasi) |

> Detail ADR lengkap: `09-adr.md`.
