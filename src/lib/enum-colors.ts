export interface EnumColors {
  text: string;
  bg: string;
  bgSoft: string;
  bgSoftHover: string;
  border: string;
  menuHighlight: string;
}

export const neutralColors: EnumColors = {
  text: "text-foreground!",
  bg: "bg-foreground!",
  bgSoft: "bg-foreground/10!",
  bgSoftHover: "hover:bg-foreground/15!",
  border: "border-border!",
  menuHighlight:
    "focus:bg-accent! focus:text-accent-foreground! focus:**:text-accent-foreground! text-accent-foreground!",
};

export const severityGoodColors: EnumColors = {
  text: "text-severity-good-foreground!",
  bg: "bg-severity-good!",
  bgSoft: "bg-severity-good/15!",
  bgSoftHover: "hover:bg-severity-good/25!",
  border: "border-severity-good/30!",
  menuHighlight:
    "focus:bg-severity-good/15! focus:text-severity-good-foreground! focus:**:text-severity-good-foreground! text-severity-good-foreground!",
};

export const severityWarningColors: EnumColors = {
  text: "text-severity-warning-foreground!",
  bg: "bg-severity-warning!",
  bgSoft: "bg-severity-warning/15!",
  bgSoftHover: "hover:bg-severity-warning/25!",
  border: "border-severity-warning/30!",
  menuHighlight:
    "focus:bg-severity-warning/15! focus:text-severity-warning-foreground! focus:**:text-severity-warning-foreground! text-severity-warning-foreground!",
};

export const severitySeriousColors: EnumColors = {
  text: "text-severity-serious-foreground!",
  bg: "bg-severity-serious!",
  bgSoft: "bg-severity-serious/15!",
  bgSoftHover: "hover:bg-severity-serious/25!",
  border: "border-severity-serious/30!",
  menuHighlight:
    "focus:bg-severity-serious/15! focus:text-severity-serious-foreground! focus:**:text-severity-serious-foreground! text-severity-serious-foreground!",
};

export const severityCriticalColors: EnumColors = {
  text: "text-severity-critical-foreground!",
  bg: "bg-severity-critical!",
  bgSoft: "bg-severity-critical/15!",
  bgSoftHover: "hover:bg-severity-critical/25!",
  border: "border-severity-critical/30!",
  menuHighlight:
    "focus:bg-severity-critical/15! focus:text-severity-critical-foreground! focus:**:text-severity-critical-foreground! text-severity-critical-foreground!",
};

export const statusTodoColors: EnumColors = {
  text: "text-status-todo-foreground!",
  bg: "bg-status-todo!",
  bgSoft: "bg-status-todo/15!",
  bgSoftHover: "hover:bg-status-todo/25!",
  border: "border-status-todo/30!",
  menuHighlight:
    "focus:bg-status-todo/15! focus:text-status-todo-foreground! focus:**:text-status-todo-foreground! text-status-todo-foreground!",
};

export const statusInProgressColors: EnumColors = {
  text: "text-status-in-progress-foreground!",
  bg: "bg-status-in-progress!",
  bgSoft: "bg-status-in-progress/15!",
  bgSoftHover: "hover:bg-status-in-progress/25!",
  border: "border-status-in-progress/30!",
  menuHighlight:
    "focus:bg-status-in-progress/15! focus:text-status-in-progress-foreground! focus:**:text-status-in-progress-foreground! text-status-in-progress-foreground!",
};

export const statusInReviewColors: EnumColors = {
  text: "text-status-in-review-foreground!",
  bg: "bg-status-in-review!",
  bgSoft: "bg-status-in-review/15!",
  bgSoftHover: "hover:bg-status-in-review/25!",
  border: "border-status-in-review/30!",
  menuHighlight:
    "focus:bg-status-in-review/15! focus:text-status-in-review-foreground! focus:**:text-status-in-review-foreground! text-status-in-review-foreground!",
};

export const statusDoneColors: EnumColors = {
  text: "text-status-done-foreground!",
  bg: "bg-status-done!",
  bgSoft: "bg-status-done/15!",
  bgSoftHover: "hover:bg-status-done/25!",
  border: "border-status-done/30!",
  menuHighlight:
    "focus:bg-status-done/15! focus:text-status-done-foreground! focus:**:text-status-done-foreground! text-status-done-foreground!",
};

export const roleOwnerColors: EnumColors = {
  text: "text-role-owner-foreground!",
  bg: "bg-role-owner!",
  bgSoft: "bg-role-owner/15!",
  bgSoftHover: "hover:bg-role-owner/25!",
  border: "border-role-owner/30!",
  menuHighlight:
    "focus:bg-role-owner/15! focus:text-role-owner-foreground! focus:**:text-role-owner-foreground! text-role-owner-foreground!",
};

export const roleAdminColors: EnumColors = {
  text: "text-role-admin-foreground!",
  bg: "bg-role-admin!",
  bgSoft: "bg-role-admin/15!",
  bgSoftHover: "hover:bg-role-admin/25!",
  border: "border-role-admin/30!",
  menuHighlight:
    "focus:bg-role-admin/15! focus:text-role-admin-foreground! focus:**:text-role-admin-foreground! text-role-admin-foreground!",
};

export const roleMemberColors: EnumColors = {
  text: "text-role-member-foreground!",
  bg: "bg-role-member!",
  bgSoft: "bg-role-member/15!",
  bgSoftHover: "hover:bg-role-member/25!",
  border: "border-role-member/30!",
  menuHighlight:
    "focus:bg-role-member/15! focus:text-role-member-foreground! focus:**:text-role-member-foreground! text-role-member-foreground!",
};
