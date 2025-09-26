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
├── .env.example
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── img
│       ├── favicon.ico
│       ├── icon.png
│       ├── jkind.png
│       ├── mobil.webp
│       └── truk.svg
└── src
    ├── app
    │   ├── error.tsx
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── not-found.tsx
    │   └── (frontend)
    │       ├── (auth)
    │       │   ├── auth.service.ts
    │       │   ├── layout.tsx
    │       │   ├── useAuth.ts
    │       │   ├── callback
    │       │   │   └── route.ts
    │       │   ├── components
    │       │   │   ├── AuthButtons.tsx
    │       │   │   ├── AuthCard.tsx
    │       │   │   ├── AuthLayout.tsx
    │       │   │   ├── AuthMessages.tsx
    │       │   │   ├── AuthUI.tsx
    │       │   │   └── index.ts
    │       │   ├── login
    │       │   │   └── page.tsx
    │       │   └── unauthorized
    │       │       └── page.tsx
    │       ├── (dashboard)
    │       │   ├── dashboard
    │       │   │   ├── page.tsx
    │       │   │   └── useDashboardInit.ts
    │       │   ├── disparity
    │       │   │   └── page.tsx
    │       │   ├── help
    │       │   │   └── page.tsx
    │       │   ├── items
    │       │   │   ├── item.service.ts
    │       │   │   ├── page.tsx
    │       │   │   ├── useItems.ts
    │       │   │   └── components
    │       │   │       ├── ItemMasterModal.tsx
    │       │   │       ├── ItemModal.tsx
    │       │   │       ├── ItemVariantModal.tsx
    │       │   │       ├── ItemsErrorState.tsx
    │       │   │       ├── ItemsFilters.tsx
    │       │   │       ├── ItemsHeader.tsx
    │       │   │       ├── ItemsLoadingState.tsx
    │       │   │       ├── ItemsStatistics.tsx
    │       │   │       ├── ItemsTable.tsx
    │       │   │       ├── ItemsTableActions.tsx
    │       │   │       ├── ItemsTableFooter.tsx
    │       │   │       └── ViewModeToggle.tsx
    │       │   ├── offices
    │       │   │   ├── office.service.ts
    │       │   │   ├── office.type.ts
    │       │   │   ├── page.tsx
    │       │   │   ├── useOffice.ts
    │       │   │   └── components
    │       │   │       └── OfficeModal.tsx
    │       │   ├── orders
    │       │   │   └── page.tsx
    │       │   ├── reception
    │       │   │   └── page.tsx
    │       │   ├── settings
    │       │   │   └── page.tsx
    │       │   ├── types
    │       │   │   └── menuConfig.ts
    │       │   ├── users
    │       │   │   ├── page.tsx
    │       │   │   ├── user.service.ts
    │       │   │   ├── user.types.ts
    │       │   │   ├── useUser.ts
    │       │   │   └── UserAssignmentModal.tsx
    │       │   ├── components
    │       │   │   ├── Sidebar.tsx
    │       │   │   ├── ThemeProvider.tsx
    │       │   │   ├── TopBar.tsx
    │       │   │   ├── common
    │       │   │   │   └── ConfirmDialog.tsx
    │       │   │   └── ui
    │       │   │       ├── ActionButton.tsx
    │       │   │       ├── Card.tsx
    │       │   │       ├── EmptyState.tsx
    │       │   │       ├── index.ts
    │       │   │       ├── LoadingSpinner.tsx
    │       │   │       ├── PageHeader.tsx
    │       │   │       ├── SearchFilter.tsx
    │       │   │       ├── StatsCard.tsx
    │       │   │       ├── StatsGrid.tsx
    │       │   │       ├── StatusBadge.tsx
    │       │   │       └── Table.tsx
    │       │   ├── layout.tsx
    │       │   └── lib
    │       │       └── client.ts
    │       └── store
    │           └── user.store.ts
    ├── lib
    │   ├── auth
    │   │   └── auth.server.ts
    │   └── supabase
    │       └── server.ts
    ├── middleware.ts
    └── types
        ├── auth.types.ts
        ├── database.ts
        └── user.types.ts
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
