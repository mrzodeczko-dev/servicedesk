export const USER_ROLES = ['USER', 'AGENT', 'ADMIN']as const;

export type UserRole = (typeof USER_ROLES)[number];

export function isStaff(role: UserRole): boolean {
  return role === 'AGENT' || role === 'ADMIN';
}
