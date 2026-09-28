"use client";

import { useProjectMentionDirectory } from "@/hooks/use-project-mention-directory";
import { parseMentions } from "@/lib/mentions";

interface CommentContentProps {
  content: string;
  workspaceSlug: string;
  projectSlug: string;
}

export function CommentContent({ content, workspaceSlug, projectSlug }: CommentContentProps) {
  const { usernameById } = useProjectMentionDirectory(workspaceSlug, projectSlug);

  const segments = parseMentions(content);

  // Sin menciones no hace falta recorrer nada: es el caso normal.
  if (segments.every((segment) => segment.type === "text")) {
    return <p className="mt-1 text-sm whitespace-pre-wrap">{content}</p>;
  }

  return (
    <p className="mt-1 text-sm whitespace-pre-wrap">
      {segments.map((segment, index) =>
        segment.type === "text" ? (
          <span key={index}>{segment.value}</span>
        ) : (
          <span key={index} className="font-medium text-primary">
            @{usernameById.get(segment.userId) ?? segment.fallbackUsername}
          </span>
        ),
      )}
    </p>
  );
}
