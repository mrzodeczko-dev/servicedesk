export const TICKET_STATUSES = [
  'NEW',
  'IN_PROGRESS',
  'WAITING',
  'RESOLVED',
  'CLOSED']as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];
