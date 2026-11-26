// Una mencion se guarda en el texto del comentario como @[username](userId). Lleva el id porque es
// lo unico inmutable, y lleva el username para que el texto siga leyendose si el usuario ya no
// pertenece al proyecto: al pintarla se resuelve el actual y solo se cae al guardado si no esta.
//
// El editor no ve ese token en ningun momento: escribe y lee "@username", y la conversion pasa al
// cargar el comentario y al enviarlo.
const MENTION_TOKEN = /@\[([^\]\n]{1,100})\]\(([A-Za-z0-9_-]{1,64})\)/g;

// La @ tiene que ir pegada a un inicio de linea o a un espacio, para no confundir un email con una
// mencion. Es la misma regla que abre el selector mientras se escribe.
const PLAIN_MENTION = /(^|\s)@([a-z0-9_]{3,30})/g;

export type MentionSegment =
  | { type: "text"; value: string }
  | { type: "mention"; userId: string; fallbackUsername: string };

export function parseMentions(content: string): MentionSegment[] {
  const segments: MentionSegment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(MENTION_TOKEN)) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }

    segments.push({ type: "mention", fallbackUsername: match[1], userId: match[2] });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", value: content.slice(lastIndex) });
  }

  return segments;
}

// Guardado -> editor.
export function toDisplayText(content: string, usernameById: Map<string, string>): string {
  return content.replace(MENTION_TOKEN, (_match, fallback: string, userId: string) => {
    return `@${usernameById.get(userId) ?? fallback}`;
  });
}

// Editor -> guardado. Un @loquesea que no corresponde a nadie del proyecto se queda como texto
// plano, que es justo lo que es.
export function toStoredText(content: string, idByUsername: Map<string, string>): string {
  return content.replace(PLAIN_MENTION, (match, prefix: string, username: string) => {
    const userId = idByUsername.get(username);

    return userId ? `${prefix}@[${username}](${userId})` : match;
  });
}

// La consulta en curso cuando el cursor esta escribiendo una mencion.
export function getMentionQuery(value: string, caret: number): { query: string; start: number } | null {
  const before = value.slice(0, caret);
  const at = before.lastIndexOf("@");

  if (at === -1) return null;
  if (at > 0 && !/\s/.test(before[at - 1])) return null;

  const query = before.slice(at + 1);

  // Una mencion no lleva espacios: en cuanto aparece uno, ya no se esta escribiendo una.
  if (/\s/.test(query)) return null;

  return { query, start: at };
}
