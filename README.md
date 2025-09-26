# 🚚 Trek Link

**Trek Link** adalah aplikasi web berbasis **Next.js** untuk mempermudah proses pemesanan, pengiriman, dan penerimaan barang. Aplikasi ini digunakan oleh:

- **PDC (Pre Delivery Center)** — Client pemesan (~10 kantor)
- **Distributor** — Tangerang Selatan
- **GRB (Group Retail Branch)** — Jakarta Barat

Dengan Trek Link, alur order dari PDC ke Distributor hingga GRB bisa dilacak secara lebih efisien dan transparan.

---

## ⚡️ Tech Stack

- [Next.js 15](https://nextjs.org/) – React Framework
- [React 19](https://react.dev/) – UI library
- [TypeScript](https://www.typescriptlang.org/) – Static typing
- [Supabase](https://supabase.com/) – Auth (Gmail) & Database
- [Tailwind CSS 4](https://tailwindcss.com/) – Styling
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) – State management
- [Lucide Icons](https://lucide.dev/) – Icon set

---

## 🚀 Getting Started

### 1. Clone repo

```bash
git clone https://github.com/pdc-jkind/trek-link.git
cd trek-link
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Setup environment variables

Copy file `.env.example` menjadi `.env.local` lalu isi dengan konfigurasi Supabase dan setting lain:

```bash
cp .env.example .env.local
```

### 4. Generate Supabase types

```bash
npm run types:generate
```

### 5. Run development server

```bash
npm run dev
```

Akses di [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```plaintext
.
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── img
│   │   ├── favicon.ico
│   │   ├── icon.png
│   │   ├── jkind.png
│   │   ├── mobil.webp
│   │   └── truk.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── (frontend)
│   │   │   ├── (auth)
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── callback
│   │   │   │   │   └── route.ts
│   │   │   │   ├── components
│   │   │   │   │   ├── AuthButtons.tsx
│   │   │   │   │   ├── AuthCard.tsx
│   │   │   │   │   ├── AuthLayout.tsx
│   │   │   │   │   ├── AuthMessages.tsx
│   │   │   │   │   ├── AuthUI.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── login
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── unauthorized
│   │   │   │   │   └── page.tsx
│   │   │   │   └── useAuth.ts
│   │   │   ├── (dashboard)
│   │   │   │   ├── components
│   │   │   │   │   ├── actions
│   │   │   │   │   │   ├── ActionButton.tsx
│   │   │   │   │   │   └── SearchFilter.tsx
│   │   │   │   │   ├── data-display
│   │   │   │   │   │   ├── StatsCard.tsx
│   │   │   │   │   │   ├── StatsGrid.tsx
│   │   │   │   │   │   └── Table.tsx
│   │   │   │   │   ├── feedback
│   │   │   │   │   │   ├── ConfirmDialog.tsx
│   │   │   │   │   │   ├── EmptyState.tsx
│   │   │   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   │   │   └── StatusBadge.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── layout
│   │   │   │   │       ├── Card.tsx
│   │   │   │   │       ├── PageHeader.tsx
│   │   │   │   │       ├── Sidebar.tsx
│   │   │   │   │       └── TopBar.tsx
│   │   │   │   ├── dashboard
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── useDashboardInit.ts
│   │   │   │   ├── disparity
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── help
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── items
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── ItemMasterModal.tsx
│   │   │   │   │   │   ├── ItemModal.tsx
│   │   │   │   │   │   ├── ItemsErrorState.tsx
│   │   │   │   │   │   ├── ItemsFilters.tsx
│   │   │   │   │   │   ├── ItemsHeader.tsx
│   │   │   │   │   │   ├── ItemsLoadingState.tsx
│   │   │   │   │   │   ├── ItemsStatistics.tsx
│   │   │   │   │   │   ├── ItemsTable.tsx
│   │   │   │   │   │   ├── ItemsTableActions.tsx
│   │   │   │   │   │   ├── ItemsTableFooter.tsx
│   │   │   │   │   │   ├── ItemVariantModal.tsx
│   │   │   │   │   │   └── ViewModeToggle.tsx
│   │   │   │   │   ├── item.service.ts
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── useItems.ts
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── offices
│   │   │   │   │   ├── components
│   │   │   │   │   │   └── OfficeModal.tsx
│   │   │   │   │   ├── office.service.ts
│   │   │   │   │   ├── office.type.ts
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── useOffice.ts
│   │   │   │   ├── orders
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reception
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── settings
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── useSettings.ts
│   │   │   │   ├── types
│   │   │   │   │   └── menuConfig.ts
│   │   │   │   └── users
│   │   │   │       ├── page.tsx
│   │   │   │       ├── user.service.ts
│   │   │   │       ├── user.types.ts
│   │   │   │       ├── UserAssignmentModal.tsx
│   │   │   │       └── useUser.ts
│   │   │   ├── lib
│   │   │   │   └── client.ts
│   │   │   └── store
│   │   │       ├── theme.store.ts
│   │   │       └── user.store.ts
│   │   ├── error.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── lib
│   │   ├── auth
│   │   │   └── auth.server.ts
│   │   └── supabase
│   │       └── server.ts
│   ├── middleware.ts
│   └── types
│       ├── auth.types.ts
│       ├── database.ts
│       └── user.types.ts
├── tailwind.config.ts
├── README.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## 📌 Available Scripts

- `npm run dev` – Menjalankan server development
- `npm run build` – Build project untuk production
- `npm run start` – Menjalankan server production
- `npm run lint` – Menjalankan ESLint
- `npm run types:generate` – Generate Supabase types ke `src/types/database.ts`

---

## 📖 Features

- 🔐 Login dengan Gmail (Supabase Auth)
- 📦 Modul Order (tracking order dari PDC → Distributor → GRB)
- 🏢 Modul Office & User Management
- 📊 Dashboard dengan statistik
- 🗂 Modul Items dengan filtering, modal, table, dan view toggle
- ⚙️ Settings & Help section

---

## 📦 Deployment

Deploy mudah menggunakan **Vercel**:

1. Push repo ke GitHub/GitLab/Bitbucket
2. Import project ke [Vercel](https://vercel.com/new)
3. Tambahkan environment variables dari `.env.local`
4. Deploy 🎉

---

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
