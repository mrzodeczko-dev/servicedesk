import type { TicketPriority } from './ticket-priority';
import type { TicketStatus } from './ticket-status';

// Ticket as returned by the API (TicketDto record in Spring Boot).
export interface Ticket {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly status: TicketStatus;
  readonly priority: TicketPriority;
  readonly assigneeId: number | null;
  readonly createdAt: string; // Instant from the API as ISO 8601 text
  readonly dueAt: string | null;
  readonly resolvedAt: string | null;
}

export function isOpen(ticket: Ticket): boolean {
  return ticket.status === 'NEW' || ticket.status === 'IN_PROGRESS' || ticket.status === 'WAITING';
}

export function isAssigned(ticket: Ticket): boolean {
  return ticket.assigneeId !== null;
}
