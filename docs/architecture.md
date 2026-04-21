# Arquitectura de Niguada

## 1. Vision general

Niguada se plantea como una aplicacion full stack modular, con separacion clara entre interfaz, logica de negocio y persistencia. La meta es que funcione como mini ERP/CRM de portfolio: suficientemente realista para demostrar criterio tecnico, pero sin complejidad innecesaria.

## 2. Comunicacion frontend-backend

### Patron

- El frontend consume una API REST versionada, por ejemplo `/api/v1`.
- Todas las llamadas pasan por `frontend/src/lib/api`, donde viven:
  - cliente HTTP base
  - manejo de cabeceras
  - normalizacion de errores
  - renovacion de sesion

### Flujo de request

1. Una pagina o feature dispara una accion.
2. La feature llama a su cliente de API.
3. El backend valida autenticacion y permisos.
4. El controlador delega en servicio de dominio.
5. El servicio usa Prisma para leer o escribir en PostgreSQL.
6. La respuesta vuelve al frontend en formato JSON consistente.

### Formato de respuesta sugerido

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

## 3. Autenticacion y autorizacion

### Estrategia

- `access token` JWT de vida corta para autenticar requests.
- `refresh token` persistente y revocable en cookie `httpOnly`.
- Roles base:
  - `admin`
  - `employee`

### Flujo

1. `POST /auth/login`
2. El backend valida `email` + `passwordHash`.
3. Devuelve:
   - `accessToken` en body
   - `refreshToken` en cookie segura
4. El frontend hidrata el estado de sesion.
5. Si una request devuelve `401` por expiracion, intenta `POST /auth/refresh`.
6. Si la renovacion falla, se ejecuta logout.

### Autorizacion

- Middleware de autenticacion para rutas privadas.
- Middleware de roles para operaciones administrativas.
- En frontend, las rutas privadas usan guardas por sesion y rol, pero la seguridad real vive en backend.

## 4. Modulos de negocio

### `auth`

- login
- refresh
- logout
- current user

### `users`

- gestion de usuarios internos
- roles
- activacion y desactivacion

### `clients`

- datos legales y comerciales
- informacion de contacto
- propietario interno
- relacion con oportunidades, tareas y notas

### `opportunities`

- pipeline comercial
- valor estimado
- probabilidad de cierre
- fecha esperada
- cliente asociado
- responsable interno

### `tasks`

- tareas relacionadas con clientes u oportunidades
- prioridad
- estado
- vencimiento
- asignacion a usuario

### `notes`

- notas cronologicas
- autor
- asociacion opcional a cliente u oportunidad

## 5. Estructura de frontend

### Criterio

Frontend organizado por `features`, evitando una estructura solo por tipo de archivo. Esto mejora mantenibilidad cuando crezcan las pantallas.

### Capas

- `app/`: bootstrap, router, providers globales
- `components/`: piezas reutilizables transversales
- `features/`: logica y vistas por dominio
- `lib/`: cliente API, utilidades, constantes
- `pages/`: composicion de pantalla a nivel de ruta
- `types/`: tipos compartidos del frontend

### Estado

Recomendacion:

- estado remoto con TanStack Query cuando entremos en implementacion
- estado global minimo para autenticacion y preferencias
- estado local para formularios, modales y filtros efimeros

Esto evita sobrecargar una store global y escala mejor en CRUDs y dashboards.

## 6. Estructura de backend

### Criterio

Backend modular por dominio, con responsabilidades separadas:

- `routes`: definicion de endpoints
- `controller`: adaptacion HTTP
- `service`: logica de negocio
- `repository` opcional si mas adelante Prisma necesita encapsulacion extra
- `dto` y `validators`: contratos de entrada y salida

### Flujo interno

`route -> middleware -> controller -> service -> prisma`

### Ventajas

- testeo mas facil
- menos acoplamiento entre transporte y negocio
- cada modulo puede crecer de forma aislada

## 7. Escalabilidad

### A corto plazo

- anadir modulos como `projects`, `invoices` o `products`
- incorporar auditoria y soft delete selectivo
- agregar filtros, paginacion y ordenacion consistentes

### A medio plazo

- extraer eventos de dominio simples
- cachear lecturas frecuentes
- dividir backend en bounded contexts si la app crece mucho

### A nivel portfolio

Esta arquitectura demuestra:

- criterio de separacion por capas
- modelado relacional realista
- autenticacion moderna
- capacidad de evolucionar sin rehacer la base
