import { fetchAuthSession } from 'aws-amplify/auth'

export async function waitForSession(
  maxAttempts = 5,
  delayMs = 200
): Promise<void> {
  let attempts = 0

  while (attempts < maxAttempts) {
    const session = await fetchAuthSession()

    if (session.tokens) {
      return
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs))
    attempts++
  }

  throw new Error('No se pudo establecer la sesión')
}
