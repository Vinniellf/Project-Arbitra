import type { TicketPriority } from '../types/chat.types'

type TicketSummaryInput = {
  subject: string
  description: string
  priority: TicketPriority
}

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

export const buildTicketSummaryMessage = ({
  subject,
  description,
  priority,
}: TicketSummaryInput): string => {
  return [
    '## Solicitud de ticket',
    '',
    `**Asunto:** ${subject}`,
    `**Prioridad:** ${PRIORITY_LABELS[priority]}`,
    '',
    '**Descripción:**',
    description,
  ].join('\n')
}

export const buildTicketSuccessMessage = (ticketCode: string): string => {
  return [
    'Tu ticket fue generado correctamente.',
    '',
    'Un especialista revisará tu caso pronto.',
    '',
    `**Código de ticket:** ${ticketCode}`,
  ].join('\n')
}
