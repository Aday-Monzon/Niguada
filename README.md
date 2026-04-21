# Niguada CRM

Mini ERP/CRM full stack construido como proyecto de portfolio profesional. La idea es enseñar criterio de arquitectura, experiencia construyendo producto y capacidad para conectar una API modular con una interfaz moderna y usable.

## Demo del proyecto

Niguada incluye:

- autenticacion con JWT
- dashboard de ventas y operacion
- gestion de clientes
- pipeline de oportunidades
- seguimiento de tareas
- Prisma + PostgreSQL en backend
- React + TypeScript + Vite + Tailwind en frontend

## Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Zod

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT

## Capturas

Sustituye estas imagenes por screenshots reales cuando publiques el repositorio.

![Login placeholder](docs/screenshots/login-placeholder.svg)
![Dashboard placeholder](docs/screenshots/dashboard-placeholder.svg)
![CRM placeholder](docs/screenshots/crm-placeholder.svg)

## Estructura

```text
/
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |-- components/
|   |   |-- features/
|   |   |-- lib/
|   |   |-- pages/
|   |   |-- styles/
|   |   `-- types/
|   |-- .env.example
|   `-- package.json
|-- backend/
|   |-- prisma/
|   |   |-- migrations/
|   |   |-- schema.prisma
|   |   `-- seed.ts
|   |-- src/
|   |   |-- common/
|   |   |-- config/
|   |   |-- lib/
|   |   |-- modules/
|   |   `-- routes/
|   |-- .env.example
|   `-- package.json
`-- docs/
    |-- architecture.md
    `-- screenshots/
```

## Funcionalidades actuales

- login y persistencia de sesion
- rutas protegidas en frontend
- middleware de autenticacion y roles en backend
- CRUD REST de clientes
- CRUD REST de oportunidades
- CRUD REST de tareas
- CRUD REST de notas en backend
- filtros, busqueda y paginacion simple en frontend
- seed de datos para demo local

## Como ejecutar el proyecto

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

El backend queda disponible en `http://localhost:4000`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173`.

## Variables de entorno

### Backend

Archivo: `backend/.env`

```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/niguada"
JWT_SECRET="change-me-super-secret"
JWT_EXPIRES_IN="1d"
CORS_ORIGIN="http://localhost:5173"
```

### Frontend

Archivo: `frontend/.env`

```env
VITE_API_URL=http://localhost:4000/api/v1
```

## Credenciales de demo

- Admin: `admin@niguada.dev` / `Admin123!`
- Employee: `sara@niguada.dev` / `Employee123!`
- Employee: `diego@niguada.dev` / `Employee123!`

## Decisiones tecnicas

### Arquitectura modular

El backend esta separado por dominios (`auth`, `clients`, `opportunities`, `tasks`, `notes`) para que la aplicacion pueda crecer sin mezclar reglas de negocio, transporte HTTP y persistencia.

### API centralizada en frontend

Toda la comunicacion con el backend pasa por un cliente HTTP comun. Esto simplifica el manejo de errores, el envio del token y posibles cambios futuros como refresh tokens o interceptores mas avanzados.

### Formularios con validacion tipada

Se usa `react-hook-form` con `zod` para mantener formularios declarativos y coherentes con la validacion del backend.

### Prisma como capa de datos

Prisma permite mantener un schema legible, seed reproducible y una base preparada para evolucionar a nuevas entidades como invoices, projects o products.

### UI pensada como producto

El frontend no intenta parecer una demo tutorial. Se ha priorizado una interfaz tipo SaaS, con jerarquia visual clara, metricas, modales reutilizables y tablas con estados vacios, errores y carga.

## Deploy recomendado

### Frontend en Vercel

1. Importa el repositorio en Vercel.
2. Selecciona `frontend` como root directory.
3. Configura la variable `VITE_API_URL`.
4. Usa el comando de build:

```bash
npm run build
```

5. Usa como output directory:

```bash
dist
```

### Backend en Railway o Render

1. Crea un nuevo servicio desde el mismo repositorio.
2. Selecciona `backend` como root directory.
3. Configura variables de entorno del backend.
4. Usa:

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
npm run build
npm run start
```

### Base de datos

Opciones recomendadas:

- Railway PostgreSQL
- Render PostgreSQL
- Neon
- Supabase PostgreSQL

La conexion final se pasa por `DATABASE_URL`.

## Posibles mejoras futuras

### Producto

- modulo de notas en frontend
- timeline por cliente y oportunidad
- dashboard con metricas historicas reales
- activity feed y auditoria
- perfiles de usuario y preferencias

### Escalabilidad

- query cache con TanStack Query
- refresh tokens reales con cookie `httpOnly`
- DTOs compartidos entre frontend y backend
- paginacion y filtros mas robustos
- soft delete y trazabilidad

### Calidad

- tests unitarios de servicios backend
- tests de componentes y flujos criticos en frontend
- tests E2E con Playwright
- linting y formatting automatizados
- pipeline CI para build y checks

## Proyecto listo para portfolio

Niguada esta pensado para enseñar en entrevistas:

- capacidad de disenar arquitectura full stack
- criterio de modelado de datos
- experiencia construyendo dashboards y CRUDs reales
- cuidado por DX, UX y documentacion

## Documentacion adicional

- Arquitectura inicial: [docs/architecture.md](docs/architecture.md)
- Backend: [backend/README.md](backend/README.md)
- Frontend: [frontend/README.md](frontend/README.md)
