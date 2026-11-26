type GlobalSearchParams = { search?: string; limit?: number };

export const searchKeys = {
  all: ["search"] as const,
  // params por defecto {} para que invalidar sin parametros alcance todas las busquedas
  // (react-query trata {} como comodin al comparar claves parcialmente).
  global: (params: GlobalSearchParams = {}) => [...searchKeys.all, "global", params] as const,
};
