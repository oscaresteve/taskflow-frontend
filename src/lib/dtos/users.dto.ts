// Candidate shown by the member picker. Deliberately narrower than `UserResponseDto`: `GET /users`
// reaches people you don't share a workspace with yet, so it only returns what the picker paints.
export type UserSummaryResponseDto = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  email: string;
};

// Card for someone you already share a workspace with: the above plus the account state and the
// two dates `UserPopup` shows.
export type UserProfileResponseDto = UserSummaryResponseDto & {
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};
