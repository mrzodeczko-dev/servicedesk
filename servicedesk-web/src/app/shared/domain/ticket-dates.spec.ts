import type { Ticket } from './ticket';
import { formatTicketDate, isDueToday, isOverdue } from './ticket-dates';

// Same factory as in ticket-list.spec.ts, a shared one pays off with the third test file.
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

  it.each([
    { name: 'exactly at dueAt', dueAt, now: '2026-11-25T16:00:00Z', expected: false },
    { name: '1 ms after dueAt', dueAt, now: '2026-11-25T16:00:00.001Z', expected: true },
    {
      name: 'at the same instant written with +02:00',
      dueAt: '2026-07-15T18:00:00+02:00',
      now: '2026-07-15T16:00:00Z',
      expected: false,
    },
    {
      name: 'after dueAt written with +02:00',
      dueAt: '2026-07-15T18:00:00+02:00',
      now: '2026-07-15T16:30:00Z',
      expected: true,
    },
    {
      name: '0.5 s before dueAt with a fraction',
      dueAt: '2026-11-25T16:00:00.500Z',
      now: '2026-11-25T16:00:00Z',
      expected: false,
    },
    {
      name: 'at dueAt with microseconds from Instant',
      dueAt: '2026-11-25T16:00:00.500000Z',
      now: '2026-11-25T16:00:00.500Z',
      expected: false,
    },
  ])('returns $expected $name', ({ dueAt, now, expected }) => {
    const ticket = createTicket({ dueAt });

    expect(isOverdue(ticket, new Date(now))).toBe(expected);
  });

  it.each(['RESOLVED', 'CLOSED'] as const)('is not overdue when %s after dueAt', (status) => {
    const ticket = createTicket({ status, dueAt });

    expect(isOverdue(ticket, new Date('2026-11-25T16:30:00Z'))).toBe(false);
  });

  it('is overdue when WAITING after dueAt', () => {
    const ticket = createTicket({ status: 'WAITING', dueAt });

    expect(isOverdue(ticket, new Date('2026-11-25T16:30:00Z'))).toBe(true);
  });
});

describe('formatTicketDate', () => {
  it('shows a winter date in Warsaw time (UTC+1)', () => {
    expect(formatTicketDate('2026-01-15T09:15:00Z')).toBe('15.01.2026, 10:15');
  });

  it('shows a summer date in Warsaw time (UTC+2)', () => {
    expect(formatTicketDate('2026-07-15T09:15:00Z')).toBe('15.07.2026, 11:15');
  });

  // Warsaw changes the clock at 01:00 UTC: on 29.03.2026 from 02:00 to 03:00,
  // on 25.10.2026 from 03:00 back to 02:00, so two instants show the same text.
  it.each([
    { name: 'before the change', iso: '2026-03-29T00:59:00Z', text: '29.03.2026, 01:59' },
    { name: 'after the change', iso: '2026-03-29T01:00:00Z', text: '29.03.2026, 03:00' },
    { name: 'before the change', iso: '2026-10-25T00:30:00Z', text: '25.10.2026, 02:30' },
    { name: 'after the change', iso: '2026-10-25T01:30:00Z', text: '25.10.2026, 02:30' },
  ])('shows $text $name', ({ iso, text }) => {
    expect(formatTicketDate(iso)).toBe(text);
  });
});

describe('isDueToday', () => {
  const now = new Date('2026-03-29T21:30:00Z');

  const testCases = [
    {
      dueAt: '2026-03-28T23:30:00Z',
      expected: true,
    },
    {
      dueAt: '2026-03-29T21:59:59Z',
      expected: true,
    },
    {
      dueAt: '2026-03-29T22:00:00Z',
      expected: false,
    },
  ];

  it('returns false for tickets without due date', () => {
    expect(isDueToday(createTicket({ dueAt: null }), now)).toBe(false);
  });

  it.each(testCases)('returns $expected for dueAt=$dueAt', ({ dueAt, expected }) => {
    expect(isDueToday(createTicket({ dueAt }), now)).toBe(expected);
  });
});
