export type CommentResponseDto = {
  id: string;

  taskId: string;
  authorId: string;

  content: string;

  editedAt: string | null;
  deletedAt: string | null;

  createdAt: string;
  updatedAt: string;
};
