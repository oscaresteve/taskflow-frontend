#!/usr/bin/env bash
# Stop: el turno no se cierra con el proyecto sin compilar.
# Salir con 2 devuelve los errores de tsc al agente para que los arregle antes de terminar.
set -uo pipefail

command -v node >/dev/null 2>&1 || export PATH="$HOME/.local/share/fnm/aliases/default/bin:$PATH"

payload=$(cat)

# Si el turno ya se reanudo por este mismo hook, no volver a bloquear: evita el bucle infinito
# cuando los errores no son arreglables (por ejemplo, errores que ya estaban en la rama).
if [ "$(printf '%s' "$payload" | jq -r '.stop_hook_active // false')" = "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

if ! output=$(node_modules/.bin/tsc -p tsconfig.json --noEmit 2>&1); then
  printf 'typecheck fallo:\n%s\n' "$output" >&2
  exit 2
fi
