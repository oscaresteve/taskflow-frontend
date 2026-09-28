"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { useProjectMentionDirectory } from "@/hooks/use-project-mention-directory";
import { getMentionQuery } from "@/lib/mentions";
import { cn, getFullName } from "@/lib/utils";

const MAX_SUGGESTIONS = 6;

interface MentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  workspaceSlug: string;
  projectSlug: string;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  placeholder?: string;
  "aria-label"?: string;
  onEscape?: () => void;
}

export function MentionTextarea({
  value,
  onChange,
  onBlur,
  workspaceSlug,
  projectSlug,
  disabled,
  autoFocus,
  maxLength,
  placeholder,
  "aria-label": ariaLabel,
  onEscape,
}: MentionTextareaProps) {
  const t = useTranslations("tasks");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mention, setMention] = useState<{ query: string; start: number } | null>(null);
  const [highlight, setHighlight] = useState(0);

  // El roster del proyecto es una lista acotada, asi que se filtra en cliente en vez de ir al
  // servidor por cada tecla.
  const { members } = useProjectMentionDirectory(workspaceSlug, projectSlug);

  const suggestions = mention
    ? members.filter((member) => member.user.username.startsWith(mention.query.toLowerCase())).slice(0, MAX_SUGGESTIONS)
    : [];

  const isOpen = mention !== null && suggestions.length > 0;

  function syncMention(nextValue: string, caret: number) {
    setMention(getMentionQuery(nextValue, caret));
    setHighlight(0);
  }

  function insert(username: string) {
    if (!mention) return;

    const textarea = textareaRef.current;
    const caret = textarea?.selectionStart ?? value.length;
    const token = `@${username} `;
    const next = value.slice(0, mention.start) + token + value.slice(caret);

    onChange(next);
    setMention(null);

    // Dejar el cursor detras de la mencion para poder seguir escribiendo sin tocar el raton.
    requestAnimationFrame(() => {
      const position = mention.start + token.length;
      textarea?.focus();
      textarea?.setSelectionRange(position, position);
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (isOpen) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlight((current) => (current + 1) % suggestions.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlight((current) => (current - 1 + suggestions.length) % suggestions.length);
        return;
      }

      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        insert(suggestions[highlight].user.username);
        return;
      }

      // La lista se cierra primero: el Escape de fuera cancela la edicion del comentario entero.
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setMention(null);
        return;
      }
    }

    if (event.key === "Escape") {
      event.stopPropagation();
      onEscape?.();
    }
  }

  return (
    <div className="relative flex-1">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          syncMention(event.target.value, event.target.selectionStart);
        }}
        onClick={(event) => syncMention(value, event.currentTarget.selectionStart)}
        onBlur={() => {
          // El blur llega antes que el click de la sugerencia, asi que se cierra con un respiro.
          setTimeout(() => setMention(null), 150);
          onBlur();
        }}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        autoFocus={autoFocus}
        className="w-full"
      />

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t("comments.mentionListLabel")}
          className="absolute z-50 mt-1 w-64 overflow-hidden rounded-md border bg-popover p-1 shadow-md"
        >
          {suggestions.map((member, index) => (
            <li key={member.userId}>
              <button
                type="button"
                role="option"
                aria-selected={index === highlight}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => insert(member.user.username)}
                onMouseEnter={() => setHighlight(index)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm",
                  index === highlight && "bg-accent",
                )}
              >
                <CustomAvatar
                  size="sm"
                  avatarUrl={member.user.avatarUrl}
                  alt={getFullName(member.user.firstName, member.user.lastName)}
                  seed={member.userId}
                  variant="glyphs"
                />
                <span className="font-medium">@{member.user.username}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {getFullName(member.user.firstName, member.user.lastName)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
