# Panduan Developer (Dev Guide) — Project Tony

> Fokus Fase 1: menjalankan **Letta** lokal dan mengembangkan **"Tony UI"** di atas Agent SDK.

## 1. Prasyarat Lokal
- **Git**
- **Node.js 22.19+** (`node --version`)
- **pnpm** (`corepack enable`)
- **Python 3 + make + g++** (untuk native deps Letta)
- **Docker Desktop + Docker Compose** (opsional untuk prod)

## 2. Setup Lokal Per-Komponen

### 2.1 Install Letta CLI + App Server
```powershell
# install CLI (compile native -> butuh python/make/g++)
npm install -g @letta-ai/letta-code

# koneksi LLM provider (contoh: OpenAI)
letta --backend local connect openai --api-key "<KEY>"

# jalankan App Server lokal (dev)
letta server --backend local --listen ws://127.0.0.1:4500
```
- Verifikasi: proses menampilkan base URL & channel URLs.
- State/memori tersimpan di `~/.letta/lc-local-backend` (MemFS).

> **Windows:** pastikan `python`, `make` (via mingw/choco), dan `g++` tersedia; atau gunakan
> WSL/Docker untuk kemudahan.

### 2.2 Siapkan "Tony UI" (Next.js)
```bash
# pada monorepo
pnpm install
cd apps/ui
pnpm dev        # http://localhost:3000
```

### 2.3 Koneksi UI → App Server (via Agent SDK)
```ts
// apps/ui/lib/letta.ts
import { LettaAgentClient } from '@letta-ai/letta-agent-sdk';

export const letta = new LettaAgentClient({
  backend: 'remote',
  url: process.env.LETTA_APP_SERVER_URL,      // ws://127.0.0.1:4500 (dev)
  authToken: process.env.LETTA_APP_SERVER_TOKEN,
});
// buat agen "Tony", resume session, stream pesan
```

## 3. Struktur UI "Tony"
```
apps/ui/
├── app/               # routing Next.js (App Router)
│   ├── layout.tsx     # branding Tony (header, judul)
│   └── page.tsx       # chat utama
├── components/
│   ├── Chat/          # kanvas chat, message list, input
│   └── Branding/      # logo, tema, warna "Tony"
└── lib/letta.ts       # wrapper Agent SDK
```

## 4. Branding "Tony" (kita kontrol penuh)
Karena UI milik kita: ganti nama, logo, favicon, warna, judul halaman bebas — **tanpa kendala
lisensi**. Letakkan aset di `apps/ui/public/` dan atur di `layout.tsx`/`manifest.ts`.

## 5. Konvensi Kode & Workflow
- **Package manager:** pnpm (monorepo).
- **Frontend:** React 19 + Next.js + TypeScript; ikuti konvensi App Router.
- **Format/lint:** ESLint + Prettier (config di root).
- **Commit:** conventional commits (`feat:`, `fix:`, `docs:`).
- **Test:** Vitest/Jest untuk unit; Playwright (opsional) untuk e2e UI.

## 6. Menjalankan Test & Validasi
```bash
pnpm test        # unit test UI
pnpm lint        # lint
pnpm build       # production build UI
# uji manual: chat dengan Tony, cek memori lintas sesi
```

## 7. Troubleshooting Umum
| Masalah | Solusi |
|---------|--------|
| `letta` tidak dikenali | `npm install -g @letta-ai/letta-code`; cek PATH |
| Gagal compile native | Install python3/make/g++; coba WSL/Docker |
| UI tak bisa hubungi App Server | Pastikan URL & token benar; App Server hidup |
| Memori hilang setelah restart | Backup `~/.letta/...`; pastikan volume/service persisten di prod |
| Port bentrok | Ubah port di env/script |

## 8. Catatan Keamanan
- Jangan ekspos App Server ke publik langsung.
- Token App Server berada di **backend/UI**, bukan di kode browser.
- Secret disimpan di `.env` (jangan di-commit).

## 9. Catatan Lisensi
- Letta: **Apache 2.0** — sertakan atribusi/NOTICE bila mendistribusikan.
- "Tony UI": milik kita; disarankan **MIT** bila dipublikasikan.
- Activepieces (Fase 2): **MIT**.
