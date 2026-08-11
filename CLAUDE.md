@AGENTS.md

# UI component rules

- Always use shadcn components for UI. Check `components.json` for the configured style/aliases, and use the shadcn MCP server (`search`/`view`/`add`/`docs`) to find and install the right component before hand-rolling one.
- Use the minimum amount of Tailwind utility classes needed to achieve the design — don't add classes for effects, spacing, or variants that weren't asked for.
- Never design for responsiveness (breakpoint variants like `sm:`, `md:`, `lg:`, etc.) unless explicitly instructed to do so.
