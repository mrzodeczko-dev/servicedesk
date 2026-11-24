export const TICKET_PRIORITIES = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
]as const

export type TicketPriority = (typeof TICKET_PRIORITIES)[number]
