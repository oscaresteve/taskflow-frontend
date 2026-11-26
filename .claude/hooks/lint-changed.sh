#!/usr/bin/env bash
# PostToolUse (Edit|Write): pasa eslint por el archivo que se acaba de tocar.
# Salir con 2 devuelve el error al agente (no al usuario) para que lo corrija en la misma vuelta.
set -uo pipefail

# fnm no siempre deja node en el PATH de un hook.
command -v node >/dev/null 2>&1 || export PATH="$HOME/.local/share/fnm/aliases/default/bin:$PATH"

file=$(jq -r '.tool_response.filePath // .tool_input.file_path // empty')

case "$file" in
  *.ts | *.tsx) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

if ! output=$(node_modules/.bin/eslint "$file" 2>&1); then
  printf 'eslint fallo en %s:\n%s\n' "$file" "$output" >&2
  exit 2
fi
