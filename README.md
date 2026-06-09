# 🚀 Niguada CRM - The Ultimate Full-Stack Production-Ready Boilerplate

A modern, ultra-clean, and high-performance Mini ERP/CRM Starter Kit built from scratch to save developers and startups over 40+ hours of setup, architecture design, and configuration.

## 🌐 Live Demo & Production Showcase

Test the fully functional production build right now:

🔗 Live Demo App: [PEGA_AQUÍ_TU_ENLACE_DE_VERCEL_CON_HTTPS]

🔑 Demo Credentials:

Email: `admin@niguada.dev`

Password: `[PEGA_AQUÍ_LA_CONTRASEÑA_DEL_SEED_ADMIN]`

The database automatically populates with realistic mock data via a production database seed script on every deployment.

## 🛠️ The Tech Stack (Industry Standards)

This boilerplate is structured following enterprise-level architectural patterns:

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn UI, Lucide Icons.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, JWT Authentication.
- **Database & Infra:** PostgreSQL, Docker, Docker Compose.
- **Validation:** Zod (Strict end-to-end type safety for API requests and forms).

## ✨ Core Features Included

- **Modular Architecture:** Clean backend folder structure separating routes, controllers, and services. Easy to extend.
- **Robust Authentication:** Secure JWT-based auth flow with protected route wrappers on both client and server.
- **Modern UI/UX:** Dark/Light theme ready, premium layout, custom modern sidebar, and fully styled DataTable components.
- **Interactive Sales Pipeline:** Drag-and-drop style Kanban layout for managing business opportunities and leads.
- **Automated Seeding:** Instantly fill your local or production database with realistic data for immediate testing.

## 💻 1-Minute Local Setup

### Backend Configuration

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Frontend Configuration

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Alternatively, launch the entire ecosystem seamlessly using our production-ready Docker configuration:

```bash
docker-compose up --build
```

## 💼 Commercial License & Full Access

Want to use this clean architecture to build client projects or launch your own profitable SaaS?

🔗 Get the Commercial Production License on Lemon Squeezy: [AQUÍ_IRÁ_EL_LINK_DE_TU_TIENDA]

Built with ❤️ by [Tu Nombre o GitHub User]
