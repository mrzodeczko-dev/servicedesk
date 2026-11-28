import { isOpen, type Ticket } from './ticket';

// Dates from the API are ISO 8601 texts with an offset, e.g. "2026-03-29T01:30:00Z".

// Overdue means open and past dueAt. Exactly at dueAt the ticket is not overdue yet.
export function isOverdue(ticket: Ticket, now: Date): boolean {
  if (!isOpen(ticket) || ticket.dueAt === null) {
    return false;
  }

  return now.getTime() > Date.parse(ticket.dueAt);
}
