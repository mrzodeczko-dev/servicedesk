import type { Ticket } from './ticket';
import { filterTickets, groupByStatus, sortTickets } from './ticket-list';

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

  it.each([
    { direction: 'asc', expected: [2, 3, 1] },
    { direction: 'desc', expected: [1, 3, 2] },
  ] as const)('sorts by createdAt for $direction', ({ direction, expected }) => {
    const created = [
      createTicket({ id: 1, createdAt: '2026-11-25T09:15:00.500Z' }),
      createTicket({ id: 2, createdAt: '2026-11-25T10:00:00+01:00' }),
      createTicket({ id: 3, createdAt: '2026-11-25T09:15:00Z' }),
    ];

    const sorted = sortTickets(created, { field: 'createdAt', direction });

    expect(sorted.map((ticket) => ticket.id)).toEqual(expected);
  });

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

  // readonly is checked only by the compiler, a frozen array also fails at run time when changed.
  it('does not change a frozen input and returns a new array', () => {
    const input = Object.freeze([createTicket({ id: 2 }), createTicket({ id: 1 })]);
    const copy = structuredClone(input);

    const sorted = sortTickets(input, { field: 'id', direction: 'asc' });

    expect(input).toEqual(copy);
    expect(sorted).not.toBe(input);
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

  it('does not change a frozen input', () => {
    const input = Object.freeze([
      createTicket({ id: 1, status: 'NEW' }),
      createTicket({ id: 2, status: 'CLOSED' }),
    ]);
    const copy = structuredClone(input);

    groupByStatus(input);

    expect(input).toEqual(copy);
  });
});

describe('filterTickets', () => {
  const ticket1 = createTicket({ id: 1, status: 'NEW', priority: 'HIGH', assigneeId: null });
  const ticket2 = createTicket({ id: 2, status: 'NEW', priority: 'LOW', assigneeId: 0 });
  const ticket3 = createTicket({ id: 3, status: 'WAITING', priority: 'HIGH', assigneeId: 7 });
  const tickets = [ticket1, ticket2, ticket3];

  it('returns every ticket in a new array for an empty filter', () => {
    const filtered = filterTickets(tickets, {});

    expect(filtered).toEqual(tickets);
    expect(filtered).not.toBe(tickets);
  });

  it('ignores criteria set to undefined', () => {
    const filtered = filterTickets(tickets, { status: undefined, assigneeId: undefined });

    expect(filtered).toEqual(tickets);
  });

  it('keeps only unassigned tickets for assigneeId null', () => {
    const filtered = filterTickets(tickets, { assigneeId: null });

    expect(filtered).toEqual([ticket1]);
  });

  it('keeps tickets of user 0 for assigneeId 0', () => {
    const filtered = filterTickets(tickets, { assigneeId: 0 });

    expect(filtered).toEqual([ticket2]);
  });

  it('requires every given criterion to match', () => {
    const filtered = filterTickets(tickets, { status: 'NEW', priority: 'HIGH' });

    expect(filtered).toEqual([ticket1]);
  });

  it('does not change a frozen input', () => {
    const input = Object.freeze([...tickets]);
    const copy = structuredClone(input);

    filterTickets(input, { priority: 'HIGH' });

    expect(input).toEqual(copy);
  });
});
