# Context Document — Project Tony

Dokumen kontekstual: alasan keputusan (ADR ringkas), asumsi, status lisensi, dan referensi.
Detail keputusan lengkap ada di `09-adr.md`.

## 1. Ringkasan Keputusan
| No | Keputusan | Alasan | Status |
|----|-----------|--------|--------|
| ADR-001 | **Letta**, bukan LobeHub | Lisensi Apache 2.0 (permissive) + memori/learning | ⚖️ Disetujui |
| ADR-002 | Fondasi Letta (Apache 2.0) + otomasi (kandidat Activepieces MIT) | Mendukung open-source, portofolio, turunan berbayar | 📋 **Dievaluasi ulang** |
| ADR-003 | ~~Bangun "Tony UI" custom~~ | UI tidak dibutuhkan → pakai CLI | ❌ Superseded (ADR-010) |
| ADR-004 | Pemisahan peran: Otak (Letta) / (kelak) Tangan (otomasi) | Modular, auditable | ⚖️ Disetujui (revisi: tanpa "Wajah") |
| ADR-005 | Jembatan Letta ↔ otomasi via MCP | Standar terbuka, didukung keduanya | 📋 Fase 2 — dievaluasi |
| ADR-006 | Monorepo terpadu | Satu toolchain & deploy | ⚖️ Disetujui |
| ADR-007 | App Server tidak diekspos publik | Keamanan | ⚖️ Disetujui |
| ADR-008 | ~~Bentuk "Tony UI"~~ | Interface = CLI first-party | ❌ Superseded (ADR-010) |
| ADR-009 | Penyimpanan memori via MemFS + backup | Memori Tony adalah aset inti | ⚖️ Disetujui |
| ADR-010 | **Interface Fase 1 = Letta CLI murni; tanpa komponen tambahan** | Kebutuhan UI kecil; CLI siap-pakai | ⚖️ Disetujui |

## 2. Status Lisensi (Analisis)
| Komponen | Lisensi | Implikasi |
|----------|---------|-----------|
| **Letta Code** | **Apache 2.0** | ✅ Komersial, modifikasi, distribusi, turunan berbayar diizinkan; wajib atribusi/NOTICE |
| **Activepieces** | **Dual-license**: Community Edition **MIT** + fitur enterprise (RBAC/SSO/audit) **komersial** | ✅ CE bebas; perhatikan fitur berbayar bila dipakai |
| n8n (kandidat) | Fair-code / Sustainable Use | ⚠️ Bukan fully open-source |
| Dify (kandidat) | Modified Apache 2.0 (larang multi-tenant SaaS + logo) | ⚠️ Mirip pembatasan LobeHub |

### Interface Letta (hasil riset, 2026)
| Interface | Self-host-friendly? | Catatan |
|-----------|--------------------|---------|
| **CLI** (`letta`) | ✅ | Jalur utama Fase 1 |
| **Channels** (Telegram/Slack/Discord/WhatsApp/Signal) | ✅ | First-party, `letta server --channels <x>` |
| **Desktop app** (Win/macOS/Linux) | ✅ | Branding Letta |
| **chat.letta.com** (web/mobile) | ❌ | Cloud-only; **tidak bisa** untuk agent self-hosted |

> Kesimpulan: anggapan "perlu bangun UI sendiri karena web app Letta cloud-only" **keliru** —
> Letta punya CLI & interface first-party lain yang berjalan di atas backend lokal/self-host.

## 3. Asumsi
- Self-hosting Letta via **CLI** (`@letta-ai/letta-code`), Node 22.19+, butuh python/make/g++.
- LLM provider final belum diputuskan; asumsi awal OpenAI/Anthropic; bisa diganti (`/connect`).
- Interface Fase 1 = **CLI**; interface lain (channel/desktop) ditunda (ADR-010).
- Komponen otomasi (Fase 2) **belum dipilih**; evaluasi di `10-eval-activepieces.md`.
- Server: VPS Ubuntu + systemd/Docker (opsional, untuk App Server selalu-hidup).

## 4. Risiko & Mitigasi
| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Letta project berubah cepat | Upgrade/maintenance | Pin versi; pantau changelog; dokumentasikan |
| Native deps Letta (install) | Gagal compile | Install python3/make/g++; coba WSL/Docker |
| API key bocor | Penyalahgunaan | Simpan aman (keyring/.env); jangan di-commit |
| Kehilangan memori agen | Tony "lupa" | Backup MemFS terjadwal (`~/.letta`) |
| Komitmen otomasi terlalu dini | Salah pilih arsitektur | Evaluasi dulu; keputusan via ADR |

## 5. Referensi & Sumber
- Letta Code (repo): https://github.com/letta-ai/letta-code
- Letta docs: https://docs.letta.com
- Letta self-hosting: https://docs.letta.com/self-hosting
- Letta CLI: https://docs.letta.com/platform/cli
- Letta Channels: https://docs.letta.com/configuration/channels
- Letta License (Apache 2.0): https://raw.githubusercontent.com/letta-ai/letta-code/main/LICENSE
- Activepieces (repo): https://github.com/activepieces/activepieces
- Activepieces MCP: https://www.activepieces.com/docs/mcp/overview
- Model Context Protocol: https://modelcontextprotocol.io

## 6. Catatan Eksplorasi
- `@letta-ai/letta-code` v0.30.x: CLI interaktif (`letta`), subcommands (`agents`, `memory`,
  `messages`, `channels`, `cron`, `skills`, `server`, `environments`), state `~/.letta` (MemFS).
- App Server: `letta server --backend local --listen ws://127.0.0.1:4500`.
- Channels: `letta server --backend local --channels <telegram|slack|discord|whatsapp|signal>`.
- Slash commands: `/connect`, `/model`, `/new`, `/resume`, `/agent`, `/search`, `/skills`.
- Prasyarat native: python3, make, g++; Node 22.19+.
