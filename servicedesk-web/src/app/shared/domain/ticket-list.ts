import type { Ticket } from './ticket';
import type { TicketPriority } from './ticket-priority';
import type { TicketStatus } from './ticket-status';

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

// Every status has a group, a status without tickets keeps an empty array.
export function groupByStatus(
  tickets: readonly Ticket[],
): Readonly<Record<TicketStatus, readonly Ticket[]>> {
  const initial: Record<TicketStatus, Ticket[]> = {
    NEW: [],
    IN_PROGRESS: [],
    WAITING: [],
    RESOLVED: [],
    CLOSED: [],
  };
  // push changes only the arrays created above, never the input, so the function stays pure.
  return tickets.reduce((groups, ticket) => {
    groups[ticket.status].push(ticket);
    return groups;
  }, initial);
}

// A field that is left out or set to undefined adds no criterion.
export type TicketFilter = Partial<Pick<Ticket, 'status' | 'priority' | 'assigneeId'>>;

// A ticket stays in the result only when it matches every given criterion.
export function filterTickets(tickets: readonly Ticket[], filter: TicketFilter): readonly Ticket[] {
  // Only undefined means "no criterion": null is a valid filter
  // for unassigned tickets and 0 is a valid user id.
  return tickets.filter(
    (ticket) =>
      (filter.status === undefined || ticket.status === filter.status) &&
      (filter.priority === undefined || ticket.priority === filter.priority) &&
      (filter.assigneeId === undefined || ticket.assigneeId === filter.assigneeId),
  );
}
