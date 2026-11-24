import { isAssigned, isOpen, type Ticket } from './ticket';
import type { TicketStatus } from './ticket-status';


function createTicket(status: TicketStatus, assigneeId: number | null): Ticket {
  return {
    id: 1,
    title: 'Printer does not work',
    description: 'The printer on the 2nd floor prints blank pages.',
    status,
    priority: 'MEDIUM',
    assigneeId,
    createdAt: '2026-11-23T09:15:00Z',
    dueAt: null,
    resolvedAt: null,
  };
}

describe('isOpen', () => {
  it('returns true for NEW, IN_PROGRESS and WAITING', () => {
    expect(isOpen(createTicket('NEW', null))).toBe(true);
    expect(isOpen(createTicket('IN_PROGRESS', null))).toBe(true);
    expect(isOpen(createTicket('WAITING', null))).toBe(true);
  });

  it('returns false for RESOLVED and CLOSED', () => {
    expect(isOpen(createTicket('RESOLVED', null))).toBe(false);
    expect(isOpen(createTicket('CLOSED', null))).toBe(false);
  });

  describe('isAssigned', () => {
    it('returns false when assigneeId is null', () => {
      expect(isAssigned(createTicket('NEW', null))).toBe(false);
    })
    it('returns true when assigneeId is set', () => {
      expect(isAssigned(createTicket('NEW', 7))).toBe(true);
    })

    it('returns true when assigneeId is 0', () => {
      expect(isAssigned(createTicket('NEW', 0))).toBe(true);
    });
  })
})
