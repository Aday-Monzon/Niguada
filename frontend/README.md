# Frontend de Niguada

Frontend CRM construido con React, TypeScript, Vite, Tailwind CSS y React Router.

## Estructura

```text
frontend/
|-- src/
|   |-- app/
|   |   |-- providers/
|   |   `-- router/
|   |-- components/
|   |   |-- forms/
|   |   |-- layout/
|   |   `-- ui/
|   |-- features/
|   |   |-- auth/
|   |   |-- clients/
|   |   |-- opportunities/
|   |   `-- tasks/
|   |-- lib/
|   |   |-- api/
|   |   |-- auth/
|   |   |-- constants/
|   |   `-- utils/
|   |-- pages/
|   |-- styles/
|   `-- types/
|-- .env.example
|-- index.html
|-- package.json
|-- tailwind.config.cjs
`-- vite.config.ts
```

## Conexion con backend

1. Copia `frontend/.env.example` a `frontend/.env`
2. Ajusta `VITE_API_URL`
3. Asegura que el backend este corriendo en `http://localhost:4000`
4. Inicia el frontend con `npm run dev`

La API se consume desde `src/lib/api/client.ts` y la sesion se gestiona en `src/app/providers/AuthProvider.tsx`.

## Flujo de autenticacion

- `POST /auth/login` devuelve `accessToken` y `user`
- el token se guarda en `localStorage`
- al recargar, el frontend llama a `GET /auth/me`
- las rutas privadas se protegen con React Router

## Pantallas incluidas

- `login`
- `dashboard`
- `clientes`
- `oportunidades`
- `tareas`

## Credenciales de ejemplo

- `admin@niguada.dev` / `Admin123!`
