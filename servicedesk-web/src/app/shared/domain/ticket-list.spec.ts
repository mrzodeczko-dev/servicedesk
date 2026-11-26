import type { Ticket } from './ticket';
import { groupByStatus, sortTickets } from './ticket-list';

// Default values describe a typical ticket, each test overrides only the fields it checks.
function createTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    id: 1,
    title: 'Printer does not work',
    description: 'The printer on the 2nd floor prints blank pages.',
    status: 'NEW',
    priority: 'MEDIUM',
    assigneeId: null,
    createdAt: '2026-11-25T09:15:00Z',
    dueAt: null,
    resolvedAt: null,
    ...overrides,
  };
}

describe('sortTickets', () => {
  const tickets = [
    createTicket({ id: 1, priority: 'LOW' }),
    createTicket({ id: 2, priority: 'CRITICAL' }),
    createTicket({ id: 3, priority: 'MEDIUM' }),
    createTicket({ id: 4, priority: 'HIGH' }),
  ];

  it('sorts by priority from CRITICAL to LOW for desc', () => {
    const sorted = sortTickets(tickets, { field: 'priority', direction: 'desc' });

    expect(sorted.map((ticket) => ticket.priority)).toEqual(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
  });

  it('sorts by priority from LOW to CRITICAL for asc', () => {
    const sorted = sortTickets(tickets, { field: 'priority', direction: 'asc' });

    expect(sorted.map((ticket) => ticket.priority)).toEqual(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
  });

  it('keeps the input order of tickets with equal priority', () => {
    const samePriority = [
      createTicket({ id: 5, priority: 'HIGH' }),
      createTicket({ id: 6, priority: 'LOW' }),
      createTicket({ id: 7, priority: 'HIGH' }),
    ];

    const sorted = sortTickets(samePriority, { field: 'priority', direction: 'desc' });

    expect(sorted.map((ticket) => ticket.id)).toEqual([5, 7, 6]);
  });

  it('sorts by id in ascending order', () => {
    const shuffled = [createTicket({ id: 3 }), createTicket({ id: 1 }), createTicket({ id: 2 })];

    const sorted = sortTickets(shuffled, { field: 'id', direction: 'asc' });

    expect(sorted.map((ticket) => ticket.id)).toEqual([1, 2, 3]);
  });
});

describe('groupByStatus', () => {
  it('puts tickets into the groups of their statuses in input order', () => {
    const tickets = [
      createTicket({ id: 1, status: 'NEW' }),
      createTicket({ id: 2, status: 'WAITING' }),
      createTicket({ id: 3, status: 'NEW' }),
    ];

    const groups = groupByStatus(tickets);

    expect(groups.NEW.map((ticket) => ticket.id)).toEqual([1, 3]);
    expect(groups.WAITING.map((ticket) => ticket.id)).toEqual([2]);
  });

  it('returns empty arrays for statuses without tickets', () => {
    const groups = groupByStatus([createTicket({ status: 'NEW' })]);

    expect(groups.IN_PROGRESS).toEqual([]);
    expect(groups.WAITING).toEqual([]);
    expect(groups.RESOLVED).toEqual([]);
    expect(groups.CLOSED).toEqual([]);
  });
});
