import type { Message } from '../types/chat.types'

export const getMockMessages = (): Message[] => {
  return [
    {
      id: '1',
      role: 'bot',
      content: 'Hola 👋 soy Pepe, ¿en qué puedo ayudarte?',
    },
    {
      id: '2',
      role: 'user',
      content: 'Mi impresora no imprime',
    },
    {
      id: '3',
      role: 'bot',
      content: 'Entiendo. ¿Te muestra algún error o luz encendida?',
    },
  ]
}
