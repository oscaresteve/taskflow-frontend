import { parseAsInteger, parseAsStringLiteral, useQueryStates } from "nuqs";

// La pestana activa de una vista es estado compartible, asi que vive en la URL y no en useState:
// un enlace a "los miembros eliminados" o a "los proyectos archivados" tiene que abrir ahi.
//
// Cambiar de pestana vuelve a la primera pagina porque `page` es el mismo para todas (lo declara el
// hook de tabla del listado, y nuqs mantiene las dos lecturas sincronizadas a traves de la URL).
export function useTabParam<TTab extends string>(tabs: readonly TTab[], defaultTab: TTab) {
  const [{ tab }, setQuery] = useQueryStates({
    tab: parseAsStringLiteral(tabs).withDefault(defaultTab),
    page: parseAsInteger.withDefault(1),
  });

  function onTabChange(value: TTab) {
    setQuery({ tab: value, page: 1 });
  }

  return { tab, onTabChange };
}
