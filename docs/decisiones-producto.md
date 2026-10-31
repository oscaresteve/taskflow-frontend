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
- Esos listados **separan los estados en pestañas**, una activa a la vez, con su contador, igual que
  los dos listados de miembros. Así cada vista es homogénea y no hace falta una columna de estado
  para distinguir filas.
- **La primera pestaña se llama como lo que lista, no "activos"**: *Espacios* / Inactivos,
  *Proyectos* / Archivados, *Tareas* / Archivadas, *Miembros* / Pendientes / Eliminados. Lo primero
  que se viene a ver es la cosa; "activos" no añade nada, y el nombre del estado solo hace falta en
  la pestaña que se sale de lo normal.
- En la vista de lo muerto la fila se queda en los campos que ya trae el listado: sin enlace, sin
  favorito y sin la columna de responsables, porque cada uno de esos tres caminos daría 404.
- `WorkspaceResponseDto` trae `myRole` justamente para esto: sobre un espacio desactivado
  `/members/me` ya responde 404, así que el permiso para ofrecer "reactivar" tiene que venir en el
  propio listado.

**Lo muerto solo se le enseña a quien puede devolverlo.** Una pestaña de bajas sin permiso para
deshacerlas es un callejón: enseña filas que no llevan a ninguna parte y una acción apagada.

- Cuando el permiso depende solo del rol, **la pestaña no se pinta**: pendientes y eliminados del
  espacio son para quien manda en el espacio, los inactivos del proyecto para quien manda en el
  proyecto (o en su espacio), y las tareas archivadas solo para el mando del proyecto, porque el del
  espacio no alcanza a las tareas. Tampoco se piden sus contadores.
- Cuando depende de cada fila —el rol de espacio y el de proyecto varían por fila en `/workspaces` y
  en `/workspaces/[slug]/projects`— **se filtra en el servidor** con `?myRole=`, y la pestaña
  aparece solo si queda algo dentro. Filtrar en el cliente descuadraría el contador y la paginación.
- Esa comprobación se hace **sin la búsqueda de la tabla**: si dependiera de ella, escribir en el
  buscador haría desaparecer la pestaña abierta.
- Y si la URL pide una pestaña que este usuario no tiene (un enlace de quien sí la tiene), se cae a
  la primera en vez de dejar la vista en blanco (`hooks/use-tab-param.ts`).

**Cada pestaña ofrece solo sus propias salidas, y a la vista.** En eliminados, readmitir; en activos,
dar de baja; en pendientes, las dos que tiene una invitación: aceptarla o **cancelarla**. Cancelar no
es dar de baja: borra la fila, así que el invitado vuelve a ser invitable y en eliminados no aparece
quien nunca entró (el porqué, en `../taskflow-backend/docs/decisiones.md`).

Y cuando la fila tiene una sola acción, **se pinta en la fila** (`components/common/row-action-button.tsx`),
no detrás del `⋯`: un menú de un solo elemento obliga a abrirlo para descubrir que no había nada que
elegir. Por eso la tabla de miembros ya no tiene desplegable en ninguna pestaña, y "Desarchivar" /
"Reactivar" son botones. El `⋯` se queda donde sí hay varias cosas: la fila de un proyecto o espacio
activo (abrir, miembros, ajustes, favorito, archivar) y la de una tarea activa.

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
