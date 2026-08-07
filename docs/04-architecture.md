# Arsitektur — Project Tony

## 1. Prinsip Arsitektur
1. **Monorepo terpadu** — seluruh project dalam satu repository (UI + service + kelak Activepieces).
2. **Pemisahan peran:** Otak (Letta) / Wajah (Tony UI) / Tangan (Activepieces).
3. **Fondasi bebas lisensi** — Letta (Apache 2.0) + Activepieces (MIT).
4. **Evolusi bertahap** — Fase 1 (Letta + UI), Fase 2 (tambah Activepieces tanpa rombak).
5. **Self-hosted & aman** — App Server tidak diekspos publik langsung.

## 2. Arsitektur Fase 1 (Letta + Tony UI)
```
        Browser ──HTTPS──► Nginx (:443)
                              │
              ┌───────────────┴───────────────┐
              ▼  /                            ▼  (internal only)
        "Tony UI" (Next.js :3000)      Letta App Server (WS :4500)
              │  keep token                  │  memori/state
              └────── Letta Agent SDK ───────┤  ~/.letta/... (MemFS)
                                             ▼
                                        LLM provider (API)
```
- **Tony UI** memegang token; memanggil App Server via Agent SDK (remote backend).
- **App Server** menyimpan state/memori agen (MemFS) dan mengeksekusi tool -> LLM.
- Nginx hanya mengekspos **Tony UI** ke publik; App Server terikat internal (`127.0.0.1`).

## 3. Struktur Monorepo (Fase 1)
```
tony/
├── apps/
│   ├── ui/                  # "Tony UI" (Next.js + TS)
│   │   ├── app/             # halaman & routing
│   │   ├── components/      # komponen chat & branding
│   │   └── lib/letta.ts     # wrapper Agent SDK
│   └── letta/               # service App Server (script/entry, systemd/docker)
├── infra/
│   ├── docker-compose.yml   # orchestration
│   ├── nginx/tony.conf      # reverse proxy + TLS
│   └── .env.example         # template env
├── packages/
│   └── shared/              # tipe & util bersama (opsional)
├── docs/
├── README.md
└── pnpm-workspace.yaml
```

## 4. Alur Data Singkat (Fase 1)
1. User membuka `https://<domain>` → Nginx → **Tony UI**.
2. User mengirim pesan → Tony UI memanggil **Letta Agent SDK** (remote) → **App Server**.
3. App Server menyusun konteks dari **memori** agen, memanggil LLM, mengembalikan jawaban (streaming).
4. Pesan & konteks disimpan di memori agen (MemFS) → Tony "mengingat" lintas sesi.

## 5. Peta Integrasi Fase 2 (Activepieces via MCP)
```
                    "Tony UI"
                        │  Agent SDK
                        ▼
                  Letta App Server ◄── MCP tools ──► Activepieces MCP server
                                                          │
                                                     flows / integrasi
```
- Letta agent memuat **MCP client** yang menunjuk ke **Activepieces MCP server** (`/mcp`).
- Tony memakai tool MCP untuk membuat/menjalankan flow, mengelola tabel, mengetes otomasi.
- Activepieces ditambahkan sebagai workspace di monorepo (`apps/activepieces`).
- Routing Nginx: `https://<domain>/` → Tony UI; `https://<domain>/activepieces/*` → Activepieces.

## 6. Keputusan Arsitektur Penting (ringkas ADR)
| Keputusan | Alasan | Status |
|-----------|--------|--------|
| Letta sebagai otak (bukan LobeHub) | Lisensi Apache 2.0 + memori/learning | ⚖️ ADR-001/002 |
| Bangun "Tony UI" custom | Web app Letta tidak self-hostable; butuh branding | ⚖️ ADR-003 |
| Jembatan via MCP ke Activepieces | Standar terbuka, didukung keduanya | 📋 ADR-005 |
| App Server tidak diekspos publik | Keamanan (harus via backend/UI) | ⚖️ ADR-007 |
| Monorepo terpadu | Satu toolchain & deploy | ⚖️ ADR-006 |

> Detail ADR lengkap: `09-adr.md`.
