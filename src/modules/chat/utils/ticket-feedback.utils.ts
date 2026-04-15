const FAILURE_PATTERNS = [
  /no\s+funciona/i,
  /no\s+funciono/i,
  /no\s+funcionó/i,
  /no\s+me\s+funciona/i,
  /no\s+me\s+funciono/i,
  /no\s+me\s+funcionó/i,
  /no\s+sirve/i,
  /no\s+sirvio/i,
  /no\s+sirvió/i,
  /no\s+me\s+sirve/i,
  /no\s+me\s+sirvio/i,
  /no\s+me\s+sirvió/i,
  /sigue\s+igual/i,
  /sigue\s+sin\s+funcionar/i,
  /sigue\s+fallando/i,
  /todavia\s+no/i,
  /todavía\s+no/i,
  /aun\s+no/i,
  /aún\s+no/i,
  /no\s+se\s+soluciono/i,
  /no\s+se\s+solucionó/i,
  /no\s+se\s+arreglo/i,
  /no\s+se\s+arregló/i,
  /persiste\s+el\s+error/i,
  /continua\s+el\s+error/i,
  /continúa\s+el\s+error/i,
]

export const isFailureFeedback = (text: string): boolean => {
  const normalized = text.trim().toLowerCase()

  if (!normalized) return false

  return FAILURE_PATTERNS.some((pattern) => pattern.test(normalized))
}
