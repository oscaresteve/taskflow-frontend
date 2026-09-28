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

## Soft delete: espacios inactivos y proyectos archivados

El borrado es lógico: los espacios se desactivan y los proyectos se archivan. El backend responde
404 a todo lo que cuelga de un espacio inactivo.

**Consecuencia para el frontend:** no se construyen pantallas ni flujos para consultar contenido de
espacios inactivos o proyectos archivados mientras no exista el endpoint de reactivar/desarchivar.
La UI se limita a no ofrecer esos caminos, sin código defensivo para un estado que aún no se puede
alcanzar.

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
