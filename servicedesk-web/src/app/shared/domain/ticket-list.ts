import type { Ticket } from './ticket';
import type { TicketPriority } from './ticket-priority';

// Operations on ticket lists. All functions are pure: they never change the input array.

export type SortDirection = 'asc' | 'desc';

export interface TicketSort {
  readonly field: 'id' | 'priority';
  readonly direction: SortDirection;
}

// satisfies checks that every priority has a rank and keeps the literal values.
const PRIORITY_RANK = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3,
} as const satisfies Record<TicketPriority, number>;

// The returned comparator remembers the field and the direction (closure).
function compareBy(sort: TicketSort): (a: Ticket, b: Ticket) => number {
  // -1 reverses the order, so one comparator serves both directions.
  const sign = sort.direction === 'asc' ? 1 : -1;
  if (sort.field === 'priority') {
    return (a, b) => sign * (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
  }
  return (a, b) => sign * (a.id - b.id);
}

// toSorted returns a new array, sort would change the caller's array.
export function sortTickets(tickets: readonly Ticket[], sort: TicketSort): readonly Ticket[] {
  return tickets.toSorted(compareBy(sort));
}
