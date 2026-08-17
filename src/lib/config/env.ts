import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().min(1).default("http://localhost:4000/api"),
});

// Next.js solo puede inyectar variables NEXT_PUBLIC_* en el bundle del navegador
// si aparecen como `process.env.NEXT_PUBLIC_X` escrito literalmente, por eso se
// pasa como propiedad explicita en vez de validar `process.env` completo.
const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsedEnv.success) {
  throw new Error(`Invalid environment variables: ${JSON.stringify(parsedEnv.error.format())}`);
}

export const env = parsedEnv.data;
