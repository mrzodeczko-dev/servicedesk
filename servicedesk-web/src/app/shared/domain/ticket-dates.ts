import { isOpen, type Ticket } from './ticket';
import { tick } from '@angular/core/testing';

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

// Calendar day in Warsaw, e.g. "29.03.2026". Only the equality of two such texts is used.
const WARSAW_DAY_FORMATTER = new Intl.DateTimeFormat('pl-PL', {
  timeZone: 'Europe/Warsaw',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function isDueToday(ticket: Ticket, now: Date): boolean {
  if (ticket.dueAt === null) {
    return false;
  }

  const dueDay = WARSAW_DAY_FORMATTER.format(new Date(ticket.dueAt));
  const currentDay = WARSAW_DAY_FORMATTER.format(now);

  return dueDay === currentDay;
}
