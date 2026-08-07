# Context Document — Project Tony

Dokumen kontekstual: alasan keputusan (ADR ringkas), asumsi, status lisensi, dan referensi.
Detail keputusan lengkap ada di `09-adr.md`.

## 1. Ringkasan Keputusan
| No | Keputusan | Alasan | Status |
|----|-----------|--------|--------|
| ADR-001 | **Letta**, bukan LobeHub | Lisensi Apache 2.0 (permissive) + memori/learning | ⚖️ Disetujui |
| ADR-002 | Fondasi Letta (Apache 2.0) + Activepieces (MIT) | Mendukung open-source, portofolio, dan turunan berbayar | ⚖️ Disetujui |
| ADR-003 | Bangun **"Tony UI"** custom (React/Next) | Web app Letta tidak self-hostable; kontrol branding | ⚖️ Disetujui |
| ADR-004 | Pemisahan Otak/UI/Tangan | Modular, auditable, dan Disederhanakan | ⚖️ Disetujui |
| ADR-005 | Jembatan Letta↔Activepieces via MCP | Standar terbuka, didukung keduanya | 📋 Fase 2 |
| ADR-006 | Monorepo terpadu | Satu toolchain & deploy | ⚖️ Disetujui |
| ADR-007 | App Server tidak diekspos publik | Keamanan token & tool execution | ⚖️ Disetujui |
| ADR-008 | Bentuk "Tony UI" | Asumsi: web chat custom (opsi masih terbuka) | 🔶 Asumsi |

## 2. Status Lisensi (Analisis)
| Komponen | Lisensi | Implikasi |
|----------|---------|-----------|
| **Letta** | **Apache 2.0** | ✅ Komersial, modifikasi, distribusi, turunan berbayar diizinkan; wajib atribusi/NOTICE |
| **Tony UI** | Milik kita | Disarankan MIT saat publikasi |
| **Activepieces** | **MIT** | ✅ Bebas |

### Mengapa mengganti LobeHub?
LobeHub memakai **Community License** yang membatasi:
- Komersial tanpa modifikasi source → boleh.
- **Mengembangkan & mendistribusikan karya turunan (modifikasi) → wajib lisensi komersial.**
Karena Anda ingin Tony **open-source, portofolio, dan memungkinkan turunan berbayar**, maka
LobeHub tidak sesuai; **Letta (Apache 2.0) + Activepieces (MIT)** memenuhi semuanya.

## 3. Asumsi
- Self-hosting Letta via **App Server** (local backend, MemFS), Node 22.19+, butuh python/make/g++.
- LLM provider final belum diputuskan; asumsi awal OpenAI/Anthropic; bisa diganti.
- **"Tony UI"** awalnya **web chat** (React/Next). Opsi lain (saluran chat/desktop) tercatat di
  ADR-008 dan bisa diputuskan kemudian.
- Server: VPS Ubuntu + Docker/systemd + Nginx.

## 4. Risiko & Mitigasi
| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Letta project berubah cepat | Upgrade/maintenance | Pin versi; pantau changelog; dokumentasikan |
| Build UI memakan waktu | Fase 1 mundur | Scope ketat (chat + branding); iterasi bertahap |
| Token App Server bocor | Akses tidak sah | Simpan di backend; jangan di browser; rotate token |
| Kehilangan memori agen | Tony "lupa" | Backup MemFS terjadwal |
| Integrasi MCP (Fase 2) kompleks | Effort tambahan | Lakukan bertahap setelah Fase 1 stabil |

## 5. Referensi & Sumber
- Letta (repo): https://github.com/letta-ai/letta
- Letta docs: https://docs.letta.com
- Letta self-hosting: https://docs.letta.com/self-hosting/index.md
- Letta Agent SDK: https://docs.letta.com/agent-sdk/index.md
- Letta MCP: https://docs.letta.com/agent-sdk/mcp/index.md
- Letta License (Apache 2.0): https://raw.githubusercontent.com/letta-ai/letta/main/LICENSE
- Activepieces (repo): https://github.com/activepieces/activepieces
- Activepieces MCP: https://www.activepieces.com/docs/mcp/overview
- Model Context Protocol: https://modelcontextprotocol.io

## 6. Catatan Eksplorasi
- Letta membuat **App Server** via CLI `@letta-ai/letta-code`; state di `~/.letta/lc-local-backend`
  (MemFS); `letta server --backend local --listen ws://0.0.0.0:4500`.
- Web app `chat.letta.com` adalah **layanan cloud**, TIDAK bisa di-self-host → perlu frontend sendiri.
- Letta Agent SDK mendukung **MCP server & tools** (jembatan ke Activepieces).
- Prasyarat native: python3, make, g++; Node 22.19+.
