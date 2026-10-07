export class ApiError extends Error {
  // null = no llego a haber respuesta HTTP (backend caido o error de red), que es el caso que
  // `serverFetch` ya modela asi en su `ServerResult`.
  status: number | null;

  constructor(message: string, status: number | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
