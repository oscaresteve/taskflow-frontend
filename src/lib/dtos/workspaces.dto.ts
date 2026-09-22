export type WorkspaceResponseDto = {
  id: string;

  name: string;
  slug: string;

  description: string | null;
  avatarUrl: string | null;

  isActive: boolean;
  isFavorite: boolean;

  createdAt: string;
  updatedAt: string;
};

export type WorkspaceAvatarUploadUrlResponseDto = {
  uploadUrl: string;
  key: string;
};
