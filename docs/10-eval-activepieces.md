# Evaluasi Komponen "Tangan" (Otomasi) — Fase 2

> Dokumen kerja untuk memutuskan komponen otomasi/aksi Tony pada Fase 2.
> **Keputusan belum diambil.** Setelah evaluasi, hasilnya dicatat sebagai ADR di `09-adr.md`.

## 1. Tujuan
Fase 1 Tony = **Letta Code murni** (otak + CLI). Fase 2 ingin Tony **bertindak**: email, CRM,
notifikasi, webhook, dsb. Dokumen ini membandingkan kandidat mesin otomasi sebelum komitmen.

## 2. Kriteria Evaluasi
| Kriteria | Bobot | Catatan |
|----------|-------|---------|
| **Lisensi permissive** | Tinggi | Wajib mendukung open-source/portofolio/turunan berbayar |
| **Self-hosted** | Tinggi | Data & kontrol milik sendiri di VPS |
| **Jembatan ke Letta (MCP)** | Tinggi | Letta memakai MCP client/tools |
| Integrasi yang dibutuhkan | Sedang | Email, CRM, notif, webhook (cukup umum) |
| Effort operasional (ops) | Sedang | DB, Redis, update, backup |
| Ekstensibilitas (custom piece) | Rendah–Sedang | Bila perlu integrasi khusus |

## 3. Kandidat & Perbandingan

### 3.1 Activepieces
- **Lisensi:** Community Edition **MIT** + fitur enterprise (RBAC/SSO/audit) **komersial**.
- **Self-host:** ✅ Ya (Docker; ringan, ~1 CPU / 512MB–2GB RAM). Cloud berbayar juga ada.
- **MCP:** ✅ **Native** — pieces otomatis jadi MCP server; ~280–400 MCP server; dukungan AI agents.
- **Integrasi:** 700+ pieces (TypeScript); email/CRM/notif/webhook tersedia.
- **Stack:** TypeScript, Fastify + BullMQ, PostgreSQL + Redis, React + Tailwind.
- **Catatan:** AI-first; **per-flow pricing** di cloud (self-host gratis, unlimited runs).
- **Verdict:** kandidat terdepan — paling permissive & MCP-native.

### 3.2 n8n
- **Lisensi:** **Fair-code (Sustainable Use)** — bukan fully open-source; ada batasan distribusi komersial turunan.
- **Self-host:** ✅ Ya (Community Edition gratis).
- **MCP:** ✅ Mendukung MCP (fitur ditambahkan belakangan; tidak senative Activepieces).
- **Integrasi:** 500+ nodes; ekosistem & template terbesar di kategori self-host.
- **Stack:** TypeScript, MySQL/Postgres, Vue.
- **Catatan:** UI/UX lebih dewasa; komunitas terbesar.
- **Verdict:** kandidat kuat secara fungsional, **kelemahan utama pada lisensi**.

### 3.3 Dify
- **Lisensi:** **Modified Apache 2.0** — melarang multi-tenant SaaS tanpa lisensi komersial + logo tidak boleh dihapus (mirip pembatasan LobeHub yang ditolak).
- **Self-host:** ✅ Ya (Community Edition, fitur setara Cloud).
- **MCP:** ✅ Mendukung MCP.
- **Posisi:** Platform **LLM app builder** (RAG, agent, prompt IDE) — bersaing dengan **Letta sebagai "otak"**, bukan "tangan".
- **Verdict:** ❌ **Bukan cocok sebagai "tangan"**; jika dipakai justru tumpang tindih dengan peran Letta + melanggar semangat lisensi permissive.

### 3.4 Make / Zapier
- **Lisensi:** **Proprietary**.
- **Self-host:** ❌ Cloud-only.
- **Catatan:** Integrasi sangat luas, tetapi tidak sesuai prinsip self-host & lisensi bebas.
- **Verdict:** ❌ Ditolak.

## 4. Tabel Ringkas
| Kandidat | Lisensi | Self-host | MCP-native | Posisi | Status |
|----------|---------|-----------|------------|--------|--------|
| **Activepieces** | MIT (CE) + komersial EE | ✅ | ✅ (terbaik) | Tangan | ⭐ Rekomendasi |
| n8n | Fair-code | ✅ | ⚠️ | Tangan | Cadangan |
| Dify | Modified Apache 2.0 | ✅ | ✅ | Otak (tumpang tindih) | ❌ |
| Make/Zapier | Proprietary | ❌ | — | — | ❌ |

## 5. Rekomendasi Awal
**Activepieces** sebagai pilihan utama "tangan" karena:
1. Lisensi paling permissive (MIT CE) — selaras dengan tujuan project.
2. **MCP native** — jembatan paling alami ke Letta (Letta MCP client → AP MCP server).
3. Self-host ringan di VPS yang sama.
4. Stack TypeScript selaras dengan ekosistem.
n8n sebagai cadangan bila fitur/ekosistem lebih dibutuhkan (dengan catatan lisensi fair-code).

## 6. Pertanyaan Terbuka (untuk keputusan final)
- [ ] Integrasi nyata apa saja yang *pasti* dibutuhkan Tony? (email? CRM mana? notif mana?)
- [ ] Apakah butuh **MCP** sebagai jembatan, atau cukup **webhook**?
- [ ] Volume/trafik otomasi: cukup self-host kecil?
- [ ] Apakah bersedia menerima lisensi fair-code (n8n) bila ekosistem lebih penting daripada MIT murni?
- [ ] Kapan deadline keputusan? (disarankan: setelah Fase 1 stabil)

## 7. Keputusan (diisi setelah evaluasi)
- **Tanggal keputusan:** _(TBD)_
- **Komponen terpilih:** _(TBD)_
- **Alasan:** _(TBD)_
- **Jembatan:** _(TBD — MCP / webhook)_
- **Dicatat sebagai:** ADR-002 / ADR-005 pembaruan di `docs/09-adr.md`.
