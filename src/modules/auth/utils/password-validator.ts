export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
} as const

export type PasswordRules = {
  length: boolean
  upper: boolean
  lower: boolean
  number: boolean
  special: boolean
}

export const validatePassword = (password: string): PasswordRules => ({
  length: password.length >= PASSWORD_RULES.MIN_LENGTH,
  upper: /[A-Z]/.test(password),
  lower: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
})

export const isPasswordValid = (rules: PasswordRules) =>
  Object.values(rules).every((rule) => rule === true)
