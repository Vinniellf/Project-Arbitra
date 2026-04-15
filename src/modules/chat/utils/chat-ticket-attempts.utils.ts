const ticketAttemptsByChat: Record<string, number> = {}

export const registerFailureAttempt = (chatId: string): number => {
  const current = ticketAttemptsByChat[chatId] ?? 0
  const next = current + 1

  ticketAttemptsByChat[chatId] = next

  return next
}

export const getFailureAttempts = (chatId: string): number => {
  return ticketAttemptsByChat[chatId] ?? 0
}

export const resetFailureAttempts = (chatId: string) => {
  delete ticketAttemptsByChat[chatId]
}
