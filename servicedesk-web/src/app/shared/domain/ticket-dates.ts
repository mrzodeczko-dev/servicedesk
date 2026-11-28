import { isOpen, type Ticket } from './ticket';

// Dates from the API are ISO 8601 texts with an offset, e.g. "2026-03-29T01:30:00Z".

// Overdue means open and past dueAt. Exactly at dueAt the ticket is not overdue yet.
export function isOverdue(ticket: Ticket, now: Date): boolean {
  if (!isOpen(ticket) || ticket.dueAt === null) {
    return false;
  }

  return now.getTime() > Date.parse(ticket.dueAt);
}

// One formatter for the module, MDN recommends reusing it for many dates.
const TICKET_DATE_FORMAT = new Intl.DateTimeFormat('pl-PL', {
  timeZone: 'Europe/Warsaw',
  dateStyle: 'short',
  timeStyle: 'short',
});

// The service desk works in Warsaw time, so the text does not depend on the computer's time zone.
export function formatTicketDate(isoText: string): string {
  return TICKET_DATE_FORMAT.format(new Date(isoText));
}
