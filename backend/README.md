# Backend de Niguada

API REST para el mini ERP/CRM construida con Node.js, Express, TypeScript, Prisma y PostgreSQL.

## Estructura

```text
backend/
|-- prisma/
|   |-- migrations/
|   |   `-- 20260421195500_init/
|   |       `-- migration.sql
|   |-- schema.prisma
|   `-- seed.ts
|-- src/
|   |-- common/
|   |   |-- errors/
|   |   |-- middlewares/
|   |   |-- schemas/
|   |   `-- utils/
|   |-- config/
|   |-- lib/
|   |-- modules/
|   |   |-- auth/
|   |   |-- clients/
|   |   |-- opportunities/
|   |   |-- tasks/
|   |   `-- notes/
|   |-- routes/
|   |-- types/
|   |-- app.ts
|   `-- server.ts
|-- .env.example
|-- package.json
`-- tsconfig.json
```

## Modulos y endpoints

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/clients`
- `POST /api/v1/clients`
- `GET /api/v1/clients/:id`
- `PATCH /api/v1/clients/:id`
- `DELETE /api/v1/clients/:id` `admin`
- `GET /api/v1/opportunities`
- `POST /api/v1/opportunities`
- `GET /api/v1/opportunities/:id`
- `PATCH /api/v1/opportunities/:id`
- `DELETE /api/v1/opportunities/:id` `admin`
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id` `admin`
- `GET /api/v1/notes`
- `POST /api/v1/notes`
- `GET /api/v1/notes/:id`
- `PATCH /api/v1/notes/:id`
- `DELETE /api/v1/notes/:id` `admin`

## Autenticacion

- Login con JWT Bearer token
- Middleware `authenticate` para proteger rutas
- Middleware `authorize` para restringir acciones por rol
- Roles soportados:
  - `ADMIN`
  - `EMPLOYEE`

## Ejemplo rapido

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@niguada.dev",
  "password": "Admin123!"
}
```

### Crear cliente

```http
POST /api/v1/clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "Acme Logistics",
  "contactName": "Laura Diaz",
  "contactEmail": "laura@acme.com",
  "status": "ACTIVE",
  "ownerId": "<employee-id>"
}
```

## Levantar el backend

1. Copia `backend/.env.example` a `backend/.env`
2. Ajusta `DATABASE_URL` y `JWT_SECRET`
3. Instala dependencias con `npm install`
4. Genera Prisma Client con `npm run prisma:generate`
5. Aplica migraciones con `npm run prisma:migrate`
6. Carga datos demo con `npm run prisma:seed`
7. Inicia en desarrollo con `npm run dev`

## Credenciales seed

- Admin: `admin@niguada.dev` / `Admin123!`
- Employee: `sara@niguada.dev` / `Employee123!`
- Employee: `diego@niguada.dev` / `Employee123!`
