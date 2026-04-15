const FAILURE_PATTERNS = [
  /no\s+funcion[oó]/i,
  /no\s+me\s+funcion[oó]/i,
  /no\s+sirvi[oó]/i,
  /no\s+me\s+sirvi[oó]/i,
  /sigue\s+igual/i,
  /todav[ií]a\s+no/i,
  /a[uú]n\s+no/i,
  /no\s+se\s+solucion[oó]/i,
  /no\s+qued[oó]/i,
  /no\s+result[oó]/i,
  /contin[uú]a\s+el\s+error/i,
  /persiste\s+el\s+error/i,
  /sigue\s+fallando/i,
]

export const isFailureFeedback = (text: string): boolean => {
  const normalized = text.trim()

  if (!normalized) return false

  return FAILURE_PATTERNS.some((pattern) => pattern.test(normalized))
}
