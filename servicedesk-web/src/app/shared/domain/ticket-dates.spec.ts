import { Ticket } from './ticket';

import { isOverdue } from './ticket-dates';

function createTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    id: 1,
    title: 'Printed does not work',
    description: 'The printer on the 2nd floor prints blank pages',
    status: 'NEW',
    priority: 'MEDIUM',
    assigneeId: null,
    createdAt: '2026-11-25T09:15:00Z',
    dueAt: null,
    resolvedAt: null,
    ...overrides,
  };
}

describe('isOverdue', () => {
  const dueAt = '2026-11-25T16:00:00Z';

  it('is overdue when now is after dueAt', () => {
    const ticket = createTicket({ dueAt });

    expect(isOverdue(ticket, new Date('2026-11-25T16:30:00Z'))).toBe(true);
  });

  it('is not overdue before dueAt', () => {
    const ticket = createTicket({ dueAt });

    expect(isOverdue(ticket, new Date('2026-11-25T15:30:00Z'))).toBe(false);
  });

  it('is not overdue without dueAt', () => {
    const ticket = createTicket({ dueAt: null });

    expect(isOverdue(ticket, new Date('2026-11-25T16:30:00Z'))).toBe(false);
  });
});
