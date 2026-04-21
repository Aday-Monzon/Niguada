# Niguada

Mini ERP/CRM full stack pensado como proyecto de portfolio profesional.

## Objetivo de esta fase

Definir una base técnica sólida antes de desarrollar pantallas, endpoints o lógica de negocio completa.

## Stack

- Frontend: React + TypeScript + Vite + React Router + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Base de datos: PostgreSQL + Prisma

## Estructura propuesta

```text
/
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- app/
|   |   |   |-- providers/
|   |   |   |-- router/
|   |   |   `-- store/
|   |   |-- assets/
|   |   |-- components/
|   |   |   |-- ui/
|   |   |   |-- forms/
|   |   |   |-- layout/
|   |   |   `-- feedback/
|   |   |-- features/
|   |   |   |-- auth/
|   |   |   |-- dashboard/
|   |   |   |-- clients/
|   |   |   |-- opportunities/
|   |   |   |-- tasks/
|   |   |   `-- notes/
|   |   |-- hooks/
|   |   |-- lib/
|   |   |   |-- api/
|   |   |   |-- utils/
|   |   |   `-- constants/
|   |   |-- pages/
|   |   |-- styles/
|   |   |-- types/
|   |   |-- App.tsx
|   |   `-- main.tsx
|   |-- package.json
|   |-- tsconfig.json
|   `-- vite.config.ts
|-- backend/
|   |-- prisma/
|   |   `-- schema.prisma
|   |-- src/
|   |   |-- config/
|   |   |-- common/
|   |   |   |-- middleware/
|   |   |   |-- errors/
|   |   |   `-- utils/
|   |   |-- modules/
|   |   |   |-- auth/
|   |   |   |-- users/
|   |   |   |-- clients/
|   |   |   |-- opportunities/
|   |   |   |-- tasks/
|   |   |   `-- notes/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- app.ts
|   |   `-- server.ts
|   |-- package.json
|   `-- tsconfig.json
|-- docs/
|   `-- architecture.md
`-- .env.example
```

## Resumen de arquitectura

- El frontend consume una API REST del backend mediante `fetch` o una capa `api client` centralizada.
- La autenticacion se resuelve con `access token` de corta vida y `refresh token` seguro en cookie httpOnly.
- React Router separa rutas publicas y privadas.
- Cada dominio vive en un modulo consistente en frontend y backend: `clients`, `opportunities`, `tasks`, `notes`.
- Prisma centraliza el acceso a PostgreSQL y mantiene el modelo de datos alineado con negocio.

## Flujo de autenticacion

1. El usuario inicia sesion con email y password.
2. El backend valida credenciales y devuelve el `access token`.
3. El `refresh token` se almacena en cookie segura.
4. El frontend guarda el estado de sesion en un store ligero y adjunta el `access token` a cada request.
5. Si el token expira, el frontend intenta renovarlo con `/auth/refresh`.
6. Si falla la renovacion, la sesion se cierra y el usuario vuelve a login.

## Modulos funcionales

- `auth`: login, refresh, logout, perfil actual.
- `users`: administracion interna de usuarios y roles.
- `clients`: ficha del cliente, contacto, estado, responsable.
- `opportunities`: pipeline comercial, valor estimado, probabilidad, cierre esperado.
- `tasks`: seguimiento operativo y comercial, vencimientos, asignacion, prioridad.
- `notes`: notas cronologicas asociadas a clientes u oportunidades.

## Estado en frontend

- Estado remoto: gestionado por una capa de consultas centralizada por feature.
- Estado de sesion: store global pequeno para usuario autenticado, tokens y permisos.
- Estado de UI: local por componente o por pagina, evitando globalizar formularios y filtros si no hace falta.

## Escalabilidad

- La estructura por modulos reduce acoplamiento y facilita crecer a facturacion, proyectos o inventario.
- Prisma permite evolucionar el schema con migraciones controladas.
- El backend puede separar servicios por dominio antes de necesitar microservicios.
- El frontend puede incorporar cache de servidor y layouts por area sin rehacer la base.

Consulta el detalle en [docs/architecture.md](docs/architecture.md) y el modelo de datos en [backend/prisma/schema.prisma](backend/prisma/schema.prisma).
