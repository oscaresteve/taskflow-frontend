@AGENTS.md

# TaskFlow frontend

Next.js 16 (App Router) + React 19 client for the TaskFlow REST API. The API lives in a separate
repo, `../taskflow-backend` (Express 5 + Prisma + Postgres) — it is the source of truth for data,
authorization and validation. Domain: workspaces → projects → tasks, with members and roles at both
the workspace and the project level.

## Commands

This project uses **pnpm** exclusively (`packageManager` in `package.json`; the backend enforces the
same rule via `devEngines`) — never suggest `npm`/`npx`/`yarn`, including for one-off package runs
(`pnpm dlx`).

- `pnpm dev` — Next dev server. Needs the backend running (`pnpm db:up && pnpm dev` in
  `../taskflow-backend`); `NEXT_PUBLIC_API_URL` defaults to `http://localhost:4000/api`.
- `pnpm typecheck` — `tsc --noEmit`, incremental (~2s). The main correctness signal.
- `pnpm lint` — eslint (flat config, `eslint-config-next`). Two pre-existing findings, both
  expected: the `react-hooks/set-state-in-effect` **error** in `src/hooks/use-mobile.ts` (vendored
  shadcn code) and an unused-`variant` **warning** in `src/components/common/empty-inline.tsx`.
  Don't chase either, and don't rewrite them as part of unrelated work.
- `pnpm verify` — typecheck + lint. Run it before reporting work as done, and report findings other
  than those two.
- `pnpm build` — production build. Slower; only when something build-specific is suspected.
- There is no test suite yet. Pure logic (`lib/permissions`, `lib/schemas`, `lib/query-keys`,
  `lib/colors.ts` and the helpers in `lib/utils.ts`) is the part worth covering first when one is
  added.

### How work gets verified here

Two hooks in `.claude/settings.json` close the loop automatically: eslint on every edited
`.ts`/`.tsx` file (PostToolUse) and a full typecheck when the turn ends (Stop). Both return failures
to the agent, not to the user — so never finish a turn with the project not compiling, and never ask
the user to check whether something compiles.

Visual and behavioural checking is the user's job, in their own browser. Do not drive a browser,
and do not start `pnpm dev` to "see" a change. When a change needs human verification, say what to
click and what to expect.

## Architecture

### Data flow — one direction, never skip a layer

1. `lib/config/env.ts` — zod-validated `NEXT_PUBLIC_*` env.
2. `lib/http/client.ts` — `request<T>()` for the **browser**: `credentials: "include"`, a single
   in-flight refresh on 401 (outside the auth routes) with one retry, hard redirect to sign-in when
   the refresh dies, errors normalized to `ApiError`.
   `lib/http/server-client.ts` — `serverRequest<T>()` for **RSC** (returns `T | null`) and
   `serverFetch()` for `proxy.ts` (needs the raw status). Cookies are forwarded manually.
   `lib/http/query-string.ts` — `buildQueryString()`; never hand-build a query string.
3. `lib/api/<domain>.api.ts` — one exported function per endpoint, client side, on `request`.
   `lib/api/<domain>.server.ts` — the RSC/proxy counterpart, on `serverRequest`.
4. `lib/dtos/<domain>.dto.ts` — response shapes, mirroring the backend's `dtos/`.
   `lib/schemas/<domain>.schema.ts` — zod schemas for form/request bodies; request DTO types are
   `z.infer<...>` of these, shared with react-hook-form via `@hookform/resolvers`.
5. `lib/query-keys/<domain>.keys.ts` — key factories (`all`, `lists`, `detail`, `infiniteList`,
   `me`). List params default to `{}` so a parameterless invalidation still matches every page and
   search (react-query treats `{}` as a partial-match wildcard).
6. `lib/queries/<domain>.queries.ts` — `queryOptions` / `infiniteQueryOptions` builders, each
   pairing a key factory with an api function, `enabled: !!slug` where a slug is required.
7. `hooks/use-*.ts` — one mutation per hook, plus the table/filter hooks. **Invalidate the narrowest
   keys the mutation actually affects** (`detail`, `lists`, `board`, `infiniteList`), and
   `setQueryData` the detail key when the response already carries the updated entity — that is what
   the task, project and workspace hooks do. `*Keys.all` is the blunt fallback, fine when a change
   fans out unpredictably (it is still what the realtime bridge uses).
8. Components consume the query builders and hooks — **never** `fetch` or `*.api.ts` directly. The
   one exception is the auth actions (`signIn`, `signUp`, `signOut`), called straight from the auth
   forms and the logout buttons because they have no hook: they navigate hard instead of touching the
   query cache.

### Avatar uploads — the one `fetch` outside `lib/http`

Workspace avatars do not travel through the API. `hooks/use-upload-workspace-avatar.ts` compresses
the file in the browser (`lib/compress-image.ts`), asks the backend for a signed PutObject URL, PUTs
the file **straight to the bucket** (MinIO in dev, R2 in prod) with a bare `fetch`, then calls the
confirm endpoint so the backend checks the object exists and stores the key. The direct PUT is the
only sanctioned `fetch` outside `lib/http/` — it is not an API call, so `request()` would only get
in the way with its base URL, credentials and JSON headers.

### Routing

`src/app/(private)` (authenticated) and `src/app/(public)` (auth screens); `(global)` groups the
scope-less pages (`my-space`, `preferences`, `workspaces`), and `(private)/onboarding` is where a
user with no workspace lands. The nested scope is
`/workspaces/[workspaceSlug]/projects/[projectSlug]`, whose own `page.tsx` is the project
overview, plus the `list`, `kanban`, `members` and `settings` segments.

- Page-specific components live in that route's `_components/`; anything reused moves to
  `src/components/<domain>/`.
- **Two gating layers, not one.** `src/proxy.ts` is the Next 16 proxy (the file that replaced
  `middleware.ts`): it calls `/auth/me`, gates private routes, and distinguishes a dead session (401)
  from a backend that is restarting (5xx) so a hiccup never logs the user out. It is also the *only*
  place that can renew the session — it calls `/auth/refresh`, forwards the raw `Set-Cookie` and
  rewrites `request.cookies` so this same render already sees the new token, because an RSC cannot
  write cookies. Then `requireWorkspaces()` guards `(global)/layout.tsx` and
  `[workspaceSlug]/layout.tsx`, redirecting to `/onboarding`. See
  `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.
- The task detail modal is global and URL-driven: `task-detail/task-detail-modal.tsx` is mounted
  once in the **root** layout and opened by the search param that `hooks/use-task-modal-href.ts`
  builds, so any task card from any route can link to it.

### i18n (next-intl)

Messages are namespaced JSON files under `src/messages/{en,es}/`, all imported and registered in
`src/i18n/request.ts`. The locale lives on the user model, not in a cookie, so it is resolved per
request from the authenticated user.

**Every new string goes into both `en` and `es` under the same key.** A new namespace file also has
to be imported and added to `messagesByLocale` in `request.ts` for both locales.

### URL state (nuqs)

Filters, search, sorting and pagination live in the URL, via `useQueryStates` in the
`hooks/use-*-table.ts` / `use-*-filters.ts` hooks (plus `use-searchable-grid.ts`, the card-grid
counterpart of the table hooks), so a view can be shared as a link. Don't put shareable view state
in `useState`.

### Tiempo real

`components/realtime/realtime-bridge.tsx` es el único consumidor del socket. Se monta una sola vez
en `app/(private)/layout.tsx`, por debajo de `QueryProvider`, y **no es un provider**: no expone
contexto, solo escucha y devuelve `null`.

- **Lo que llega se invalida, nunca se escribe en la caché.** Por eso los mensajes pueden ser pobres:
  la verdad sigue viniendo del endpoint. El mapeo mensaje → claves es un `switch` explícito sobre
  `event.action` en ese mismo fichero.
- **Cada mensaje trae `actorId` y se ignoran los propios ecos**, o pisarían las actualizaciones
  optimistas del arrastre. El usuario se lee de la caché (`authKeys.me()`) dentro del handler, para
  no tener que reregistrar los listeners.
- El socket se une a la sala del proyecto de la ruta, y **vuelve a unirse en cada `connect`**: tras
  reconectar el servidor tiene un socket nuevo sin salas.
- Al reconectar con el token caducado se llama a `refreshSession()` de `lib/http/client.ts`, que
  comparte el single-flight con las peticiones HTTP — dos refrescos en paralelo rotarían el token dos
  veces y cerrarían la sesión.

**Aristas asumidas:** durante un arrastre la caché del tablero *es* el estado del arrastre, así que
una invalidación que llegue por socket puede pisar la previsualización (solo choca si dos personas
arrastran a la vez, y se corrige al soltar). Y el feed de espacio no se actualiza en vivo: sus
eventos no cuelgan de un proyecto, así que no tienen sala.

### Permissions

`src/lib/permissions/` decides only what the UI shows or enables; the backend re-validates every
request. Never invent a rule that is stricter than what the corresponding endpoint already allows.

The rules it mirrors come from two places in the backend, so check both when syncing:

- `shared/auth/permissions.ts` — the role rules (a manager is OWNER or ADMIN; an ADMIN can neither
  manage an OWNER nor assign the OWNER role). Administering a project is the one rule that spans
  both levels: `requireWorkspaceOrProjectManager` lets a manager of the *workspace* edit, archive
  and staff a project without being in it, and then the project's own hierarchy does not apply —
  which is why `canManageProject` and everything under it take both roles, and why the workspace
  one short-circuits. Task- and comment-level rules did **not** move: they stay project-role only.
- the module services — the rules the services raise themselves, e.g. "you cannot change your own
  role" / "you cannot remove yourself" in `workspace-members.service.ts`, which is what
  `canUpdateWorkspaceMemberRole` and `canRemoveWorkspaceMember` reflect.

One rule deliberately lives outside this directory: comment authorship, inline in
`components/tasks/comments/comment-list.tsx`. Editing is author-only while deleting also allows a
project manager — asymmetric on purpose, because that is exactly what `comments.service.ts` enforces.

### Colors and enums

Project/workspace colors come from `lib/colors.ts` (curated for white-on-color contrast). The enum
palettes are `lib/enum-colors.ts` + `src/app/palette.css`, in three families: **severity** (what task
priority renders through — there is no separate priority palette), **status** and **role**. Each
exports the same `EnumColors` shape, so a new variant means a new palette entry plus its Tailwind
token — never a hardcoded hex in a component.

# UI component rules

- Always use shadcn components for UI. Check `components.json` for the configured style/aliases, and use the shadcn MCP server (`search`/`view`/`add`/`docs`) to find and install the right component before hand-rolling one.
- Use the minimum amount of Tailwind utility classes needed to achieve the design — don't add classes for effects, spacing, or variants that weren't asked for.
- Never design for responsiveness (breakpoint variants like `sm:`, `md:`, `lg:`, etc.) unless explicitly instructed to do so.
- Never modify anything in `src/components/ui/` — those are vendored shadcn primitives. The
  `Edit(src/components/ui/**)` deny rule in `.claude/settings.json` blocks edits but not a whole-file
  `Write`, so treat the directory as read-only regardless of what the permission prompt allows.
  Adjust behaviour at the call site with `className` or a wrapper component instead.

## Conventions

- Comments explain **why**, not what, and match the language of the surrounding file (this codebase
  mixes Spanish and English comments; don't translate existing ones).
- Conventional commits (`feat(scope): ...`). Never commit unless asked to in that same turn.
- When the frontend needs data no endpoint exposes, propose the endpoint in `../taskflow-backend`
  (`/add-dir ../taskflow-backend` to work across both) instead of threading context through props.
- Prefer explicit, named code over clever abstraction for small fixed sets of variants.

## Decisions

- `docs/decisiones-producto.md` — product/UX decisions: what each screen is for, what counters
  count, what is deliberately not built yet. Read it before designing a screen or a counter.
- `../taskflow-backend/docs/decisiones.md` — stack rationale for **both** repos (framework, React
  Query, nuqs, next-intl, shadcn...). New stack decisions go there, not here.
