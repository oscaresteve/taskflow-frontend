import { parseAsInteger, parseAsStringLiteral, useQueryStates } from "nuqs";

// La pestana activa de una vista es estado compartible, asi que vive en la URL y no en useState:
// un enlace a "los miembros eliminados" o a "los proyectos archivados" tiene que abrir ahi.
//
// Cambiar de pestana vuelve a la primera pagina porque `page` es el mismo para todas (lo declara el
// hook de tabla del listado, y nuqs mantiene las dos lecturas sincronizadas a traves de la URL).
//
// `availableTabs` son las que este usuario puede usar, que no siempre son todas: la pestana de lo
// eliminado solo se ofrece a quien puede devolverlo. El parser sigue aceptando el juego completo,
// pero una pestana que no esta disponible no se queda seleccionada: un enlace compartido por quien
// si la tiene abriria la vista en blanco.
export function useTabParam<TTab extends string>(
  tabs: readonly TTab[],
  defaultTab: TTab,
  availableTabs: readonly TTab[] = tabs,
) {
  const [{ tab }, setQuery] = useQueryStates({
    tab: parseAsStringLiteral(tabs).withDefault(defaultTab),
    page: parseAsInteger.withDefault(1),
  });

  function onTabChange(value: TTab) {
    setQuery({ tab: value, page: 1 });
  }

  // El cast es solo para TypeScript: nuqs tipa su valor con un condicional sobre TTab, pero el
  // parser ya ha validado que sea uno de `tabs`.
  const selected = tab as TTab;

  return { tab: availableTabs.includes(selected) ? selected : defaultTab, onTabChange };
}
