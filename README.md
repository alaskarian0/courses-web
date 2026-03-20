# Courses Web

A modern Arabic RTL course management system built with **Next.js 15**, **React 19**, and **TypeScript**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (Turbopack) |
| Language | TypeScript 5 |
| UI Components | Shadcn/ui + Radix UI |
| Styling | Tailwind CSS 4 |
| State Management | Zustand 5 |
| HTTP Client | Axios |
| Charts | Recharts |
| Form Validation | Zod 4 |
| Icons | Lucide React |
| Export | ExcelJS, XLSX |

## Features

- **Authentication** - Login, register, password change, temporary password handling
- **Dashboard** - Interactive analytics with bar and pie charts
- **Data Management** - Full CRUD operations with search, filtering, and pagination
- **Reports** - Generate, print, and export reports to Excel
- **Settings** - App configuration
- **Role-based Access** - Permission-based navigation and actions
- **RTL Support** - Fully Arabic interface with right-to-left layout
- **Theming** - Light/dark mode with customizable color themes
- **Responsive** - Desktop and mobile friendly

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login)
│   └── (home)/             # Protected pages (dashboard, data, reports, settings)
├── components/
│   ├── ui/                 # Shadcn/ui components
│   ├── common/             # Shared components (table, modals, export)
│   ├── features/           # Feature-specific components (data, posts)
│   └── layouts/            # Sidebar, breadcrumbs, navigation
├── store/                  # Zustand stores (auth, posts, theme)
├── hooks/                  # Custom hooks (useAuth, useApi, usePermissions)
├── context/                # React context providers (theme, sidebar)
├── lib/                    # Utilities (axios client, token manager, date utils)
├── types/                  # TypeScript type definitions
└── styles/                 # Global CSS
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/alaskarian0/courses-web.git
cd courses-web
npm install
```

### Environment Variables

Copy the example env file and configure it:

```bash
cp .env.example .env.local
```

```env
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3003/api/
NEXT_PUBLIC_API_FILE_URL=http://localhost:3003/
```

### Development

```bash
npm run dev
```

The app runs at **http://localhost:4000** with Turbopack enabled for fast HMR.

### Production Build

```bash
npm run build
npm start
```

## Deployment

### PM2 (Production)

The project includes a PM2 ecosystem config for production deployment:

```bash
npm run build
pm2 start ecosystem.config.js
```

This will:
- Run the app on port **4000**
- Set production environment variables
- Output logs to `./logs/`

### Manual Deployment

```bash
# Build the project
npm run build

# Start with custom port
PORT=4000 npm start
```

## API Integration

The frontend connects to a REST API backend. Configure the API URL via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for API requests | `http://localhost:3001` |
| `NEXT_PUBLIC_API_FILE_URL` | Base URL for file/media access | - |

### API Features

- Bearer token authentication
- Automatic token refresh on 401 responses
- Request retry with exponential backoff
- 30-second request timeout
- CORS with credentials

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 4000, Turbopack) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Contributors

- [alaskarian0](https://github.com/alaskarian0)
- [sajjad-basim9](https://github.com/sajjad-basim9)

## License

MIT
