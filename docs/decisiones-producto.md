# TaskFlow — Decisiones de producto y UX (frontend)

Las decisiones de **stack** (framework, React Query, nuqs, next-intl, shadcn, recharts...) viven en
`../taskflow-backend/docs/decisiones.md`, que cubre los dos repos. Aquí solo están las decisiones de
producto: qué hace cada pantalla, qué cuenta cada contador y qué está deliberadamente sin construir.

## Papel de cada pantalla

Cada superficie tiene un trabajo y no invade el de las demás:

- **Sidebar**: navegar. No gestiona ni muestra métricas.
- **`/workspaces` y `/workspaces/[slug]/projects`**: gestionar — listar, buscar, ordenar, paginar,
  crear, archivar.
- **Overview de espacio** (`/workspaces/[slug]`): aterrizar. Da contexto y accesos rápidos, **sin
  gráficas**.
- **Proyecto**: es donde viven las gráficas, porque es el único ámbito con suficientes datos
  homogéneos para que una gráfica signifique algo.

## Settings es un elemento hermano en la navegación de su ámbito

Los ajustes de un espacio o de un proyecto se abren desde la propia superficie de navegación de ese
ámbito (el sidebar del espacio, las pestañas del proyecto), nunca desde el desplegable que cambia de
ámbito.

**Por qué:** el desplegable sirve para *cambiar* de espacio/proyecto; meter ahí una acción que
*entra* en el actual mezcla dos intenciones distintas en el mismo control.

## Contadores: solo trabajo alcanzable

Un contador cuenta únicamente lo que el usuario puede abrir: proyectos activos de los que es
miembro, y las tareas dentro de ellos. Y tiene que cuadrar con lo que la pantalla enseña justo
debajo — si la lista muestra 7 tareas, el contador no puede decir 9.

**Por qué:** un número mayor que lo visible se lee como un bug, no como información extra.

## Actividad: un feed por ámbito, y cada uno corta un nivel más abajo

Antes de que existiera el registro de eventos, los dos overviews tenían una tarjeta **"Actividad
reciente"** que era una lista de tareas ordenada por `updatedAt`. Servía de sustituto: decía que una
fila se había tocado, pero no qué había cambiado ni quién. El feed de actividad dice las dos cosas y
sigue enlazando a la tarea, así que la sustituye en ambos overviews; `recentTasks` desapareció del
endpoint de overview por quedarse sin uso.

Lo que **no** sustituye es "Mi trabajo en este espacio": esa es mi cola de tareas abiertas, no un
historial, y responde a otra pregunta.

Cada feed enseña su ámbito y el de justo debajo:

- **Overview de espacio**: el espacio y sus proyectos. No baja al detalle de cada tarea — un solo
  proyecto movido ahogaría a los demás, y esta pantalla está para aterrizar.
- **Overview de proyecto**: el proyecto, sus miembros, sus tareas y sus comentarios. Aquí sí vive el
  detalle.
- **Detalle de tarea**: solo esa tarea, bajo sus campos.

La regla del corte y su implementación están en `../taskflow-backend/docs/eventos-de-dominio.md`.

## Soft delete: cada baja tiene su vuelta, y vive en el listado

El borrado sigue siendo lógico —los espacios se desactivan, los proyectos y las tareas se archivan,
los comentarios y las membresías se marcan—, pero ya no es un camino de ida: cada acción tiene su
inversa en la API (`/reactivate`, `/unarchive`, `/restore`, `/activate`). Las reglas de la
reversibilidad están en `../taskflow-backend/docs/decisiones.md`.

**Lo muerto se lista, pero sigue sin ser navegable.** De un espacio inactivo o un proyecto archivado
todo responde 404 salvo su propia ruta de reversión. Por eso:

- El reverso vive en el **menú de fila del listado de gestión** (`/workspaces`,
  `/workspaces/[slug]/projects`), no en los ajustes: los ajustes de un recurso muerto tampoco se
  pueden abrir.
- Esos listados **separan los estados en pestañas**, una activa a la vez (activos / inactivos,
  activos / archivados, y activas / archivadas en la lista de tareas), con su contador, igual que
  los dos listados de miembros. Así cada vista es homogénea y no hace falta una columna de estado
  para distinguir filas.
- En la vista de lo muerto la fila se queda en los campos que ya trae el listado: sin enlace, sin
  favorito y sin la columna de responsables, porque cada uno de esos tres caminos daría 404.
- `WorkspaceResponseDto` trae `myRole` justamente para esto: sobre un espacio desactivado
  `/members/me` ya responde 404, así que el permiso para ofrecer "reactivar" tiene que venir en el
  propio listado.

**Volver no es una restauración completa.** La baja de un miembro borra su rol, así que el diálogo de
vuelta pide con cuál regresa. Y readmitir en el espacio **no** devuelve las pertenencias a proyectos:
cada proyecto decide por su cuenta a quién deja entrar.

**Lo que no se lista no se restaura desde una lista.** Un comentario borrado desaparece del hilo, así
que su vuelta es un **"deshacer" en el aviso** que sale justo después de borrarlo, no una lápida en
la conversación.

## La pestaña activa es estado de la URL, no de React

Toda segmentación por pestañas de una vista —el estado de los miembros, el ciclo de vida de espacios,
proyectos y tareas— vive en la URL (`?tab=`, vía `hooks/use-tab-param.ts`), nunca en `useState`.
Cambiar de pestaña vuelve a la primera página, porque `page` es el mismo para todas.

**Por qué:** un enlace a "los miembros eliminados" o a "los proyectos archivados" tiene que abrir
justo ahí, y recargar no puede devolverte a la primera pestaña. Es la misma regla que ya seguían los
filtros, la búsqueda y la paginación.

## Favoritos globales: solo espacios

En "Mi espacio" los favoritos globales son espacios de trabajo. Los favoritos de proyectos y tareas
existen dentro de su propio ámbito.

**Por qué:** no hay endpoint global de "mis tareas" que cruce espacios, así que cualquier agregado
global de tareas (por ejemplo un heatmap de actividad personal) queda pospuesto hasta que exista.
Pedir ese endpoint al backend es la vía, no reconstruirlo en el cliente pidiendo espacio por espacio.

## La autorización de la UI es un espejo, no una fuente

`src/lib/permissions/` replica las reglas de `shared/auth/permissions.ts` del backend y solo decide
qué se muestra o se habilita. Nunca es más estricta que el endpoint correspondiente: si un listado ya
expone unos datos, una pantalla nueva sobre esos mismos datos no inventa un filtro extra.

**Por qué:** dos fuentes de verdad divergen; la del servidor es la que manda y revalida cada
petición, y una UI más estricta que la API esconde cosas que el usuario sí puede ver.
