# TaskFlow — Frontend

Cliente web de **TaskFlow**, una aplicación de gestión de proyectos y tareas organizada en workspaces: workspaces → proyectos → tareas, con miembros y roles en los dos niveles.

Es el frontend de la API que vive en el repositorio de al lado, [`taskflow-backend`](https://github.com/oscaresteve/taskflow-backend), que es la fuente de verdad de los datos, la autorización y la validación.

## Demo

**[taskflow.oscaresteve.dev](https://taskflow.oscaresteve.dev)** — `demo@taskflow.dev` / `Password123`, o directamente el botón **"Entrar como demo"** de la pantalla de login.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind v4** + **shadcn/ui** sobre Base UI
- **TanStack React Query** para el estado de servidor
- **React Hook Form** + **Zod** para los formularios
- **@dnd-kit** para el tablero kanban
- **next-intl** para el español y el inglés, **next-themes** para el tema oscuro
- **nuqs** para los filtros, la búsqueda y la paginación en la URL
- **socket.io-client** para el tiempo real
- **recharts** para los gráficos de los resúmenes

Gestor de paquetes: **pnpm** (es el único soportado, no uses `npm` ni `yarn`).

## Puesta en marcha

Este frontend no funciona solo: necesita el backend levantado. Son dos terminales.

En el repositorio del backend, que deja la API en el puerto 4000 con los datos de ejemplo cargados:

```bash
pnpm demo
```

Y aquí:

```bash
pnpm install
pnpm dev
```

En `http://localhost:3000`. Para entrar, el botón **"Entrar como demo"** de la pantalla de login.

### Variables de entorno

Solo hay una, y tiene valor por defecto, así que en local no hace falta ningún `.env`:

| Variable              | Por defecto                  | Qué es                                      |
| --------------------- | ---------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api`  | La URL de la API, con el sufijo `/api`      |

El socket no tiene variable propia: `src/lib/config/env.ts` deriva el origen de esa misma URL, porque la ruta por defecto del socket (`/socket.io`) queda fuera de `/api`.

## Scripts

| Script           | Qué hace                                    |
| ---------------- | ------------------------------------------- |
| `pnpm dev`       | Servidor de desarrollo                      |
| `pnpm build`     | Build de producción                         |
| `pnpm start`     | Sirve el build de producción                |
| `pnpm typecheck` | `tsc --noEmit`                              |
| `pnpm lint`      | eslint                                      |
| `pnpm verify`    | typecheck + lint, lo que hay que pasar      |

## Documentación

- [`CLAUDE.md`](./CLAUDE.md) — la arquitectura en detalle: el flujo de datos por capas, el routing y sus dos capas de protección, i18n, estado en la URL, tiempo real y permisos.
- [`docs/decisiones-producto.md`](./docs/decisiones-producto.md) — decisiones de producto y UX: para qué sirve cada pantalla, qué cuentan los contadores, qué no está hecho a propósito.
- [`../taskflow-backend/docs/decisiones.md`](https://github.com/oscaresteve/taskflow-backend/blob/master/docs/decisiones.md) — por qué este stack, en los dos repositorios.
- [`../taskflow-backend/docs/despliegue.md`](https://github.com/oscaresteve/taskflow-backend/blob/master/docs/despliegue.md) — el despliegue de los dos, incluido lo que hay que configurar en Vercel.
