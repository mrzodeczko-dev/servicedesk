import { isStaff, USER_ROLES } from './user-role';

describe('isStaff', () => {
  it('returns true for AGENT and ADMIN', () => {
    expect(isStaff('AGENT')).toBe(true);
    expect(isStaff('ADMIN')).toBe(true);
  });
  it('returns false for USER', () => {
    expect(isStaff('USER')).toBe(false);
  });
});

describe('USER_ROLES', () => {
  it('list users', () => {
    expect(USER_ROLES).toEqual(['USER', 'AGENT', 'ADMIN']);
  });
});
