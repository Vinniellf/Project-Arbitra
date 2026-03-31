type Step =
  | 'init'
  | 'confirm_issue'
  | 'give_steps'
  | 'check_result'
  | 'escalation'
  | 'closed'

type State = {
  step: Step
  reference?: string
}

const chatStates: Record<string, State> = {}

const getState = (chatId: string): State => {
  if (!chatStates[chatId]) {
    chatStates[chatId] = { step: 'init' }
  }
  return chatStates[chatId]
}

export const resetPepeState = (chatId: string) => {
  delete chatStates[chatId]
}

const generateTicket = () => {
  return `MT-${Date.now().toString().slice(-6)}`
}

// helpers simples
const isYes = (msg: string) =>
  msg.includes('si') || msg.includes('sí')

const isNo = (msg: string) =>
  msg.includes('no') || msg.includes('sigue igual')

export const getPepeResponse = (chatId: string, message: string) => {
  const state = getState(chatId)
  const msg = message.toLowerCase()

  // 🟢 1. INICIO
  if (state.step === 'init') {
    state.step = 'confirm_issue'

    return `👋 Hola, soy Pepe 🤖  

🧠 Desde el monitoreo detecté que tu impresora presenta fallas  

👉 ¿Estás teniendo problemas con esa impresora?`
  }

  // 🟡 2. CONFIRMACIÓN
  if (state.step === 'confirm_issue') {
    if (isYes(msg)) {
      state.step = 'give_steps'

      return `🖨️ Perfecto, vamos a revisarlo  

1. Verifica que la impresora esté encendida  
2. Revisa niveles de tinta o tóner  
3. Confirma conexión  
4. Intenta imprimir una prueba  

👉 Dime cómo te va`
    }

    return `🤔 Solo para confirmar  

👉 ¿El problema es con la impresora que te mencioné?`
  }

  // 🔵 3. PASOS
  if (state.step === 'give_steps') {
    state.step = 'check_result'

    return `👉 ¿Se solucionó el problema después de los pasos?`
  }

  // 🟣 4. VALIDACIÓN
  if (state.step === 'check_result') {
    if (isYes(msg)) {
      state.step = 'closed'

      return `🎉 Excelente  

La impresora ya está funcionando correctamente  

Si necesitas ayuda, aquí estaré 🤖`
    }

    if (isNo(msg)) {
      state.step = 'escalation'
      state.reference = generateTicket()

      return `🧠 Gracias por la información  

🔧 Voy a escalar tu caso a soporte técnico  

🎫 Ticket generado: ${state.reference}  

👨‍🔧 Un técnico se comunicará contigo`
    }

    return `🤔 ¿Se solucionó el problema?`
  }

  // 🔴 5. ESCALAMIENTO
  if (state.step === 'escalation') {
    return `👨‍🔧 Tu caso ya fue escalado  

🎫 Ticket: ${state.reference}  

📞 Pronto se comunicarán contigo  

👉 Si tienes más detalles puedes agregarlos`
  }

  // ⚫ 6. CIERRE
  if (state.step === 'closed') {
    return `😊 Me alegra haber ayudado  

👉 Estoy disponible si necesitas algo más`
  }

  return `⚠️ No entendí, ¿puedes repetir?`
}
