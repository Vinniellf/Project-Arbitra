type ConversationStep =
  | 'init'
  | 'confirming'
  | 'diagnosis'
  | 'awaiting_response'
  | 'derivation'

type ConversationState = {
  step: ConversationStep
  attempts: number
  reference?: string
}

const state: ConversationState = {
  step: 'init',
  attempts: 0,
}

// 🧠 SIMULACIÓN DE MONITOREO
const monitoredDevice = {
  name: 'LaserJet Pro M404',
  issue: 'no imprime', // 'atasco' | 'no imprime' | 'error'
}

// 🔄 RESET
export const resetPepeState = () => {
  state.step = 'init'
  state.attempts = 0
  state.reference = undefined
}

// 🔎 GENERAR TICKET PROFESIONAL
const generateReference = (): string => {
  const date = new Date()
  const y = date.getFullYear().toString().slice(-2)
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')

  const random = Math.floor(1000 + Math.random() * 9000)

  return `MT-${y}${m}${d}-${random}`
}

// 🔍 HELPERS
const isNegative = (msg: string) =>
  msg.includes('no funciona') ||
  msg.includes('sigue igual') ||
  msg.includes('no se solucionó') ||
  msg.includes('continúa igual')

const isPositive = (msg: string) =>
  msg.includes('sí') ||
  msg.includes('si') ||
  msg.includes('ya funciona') ||
  msg.includes('listo') ||
  msg.includes('solucionado')

// 🧠 DETECCIÓN DE PROBLEMA
const detectIssue = (msg: string) => {
  if (msg.includes('no imprime')) return 'no imprime'
  if (msg.includes('atasco') || msg.includes('papel')) return 'atasco'
  if (msg.includes('error') || msg.includes('falla')) return 'error'
  return null
}

// 🧠 FUNCIÓN PRINCIPAL
export const getPepeResponse = (message: string): string => {
  const msg = message.toLowerCase()
  const detectedIssue = detectIssue(msg)

  // 🟢 INIT
  if (state.step === 'init') {
    state.step = 'diagnosis'

    if (detectedIssue) {
      state.step = 'confirming'

      if (detectedIssue === 'no imprime') {
        return `🧠 Entiendo lo que ocurre  

Detecté que tu impresora ${monitoredDevice.name} presenta problemas de impresión  

📡 Según el monitoreo, el equipo no está respondiendo correctamente  

👉 Antes de continuar, confirmemos:  
¿No imprime ningún documento o imprime con errores?`
      }

      if (detectedIssue === 'atasco') {
        return `📄 Detecté un posible atasco en tu impresora ${monitoredDevice.name}  

📡 El sistema indica una obstrucción en el flujo de papel  

👉 ¿La impresora muestra papel atascado o un error en pantalla?`
      }

      return `⚠️ Detecté un comportamiento inusual en tu impresora ${monitoredDevice.name}  

👉 ¿Podrías indicarme qué mensaje aparece o qué comportamiento observas?`
    }

    return `👋 Hola, soy Pepe 🤖  

Soporte de equipos de Misión Tecnológica  

🧠 Tengo acceso a tus equipos asignados  

🖨️ Detecté actividad irregular en tu impresora ${monitoredDevice.name}  

👉 ¿Qué problema estás experimentando?`
  }

  // 🟡 CONFIRMING
  if (state.step === 'confirming') {
    if (msg.includes('no imprime')) {
      state.step = 'awaiting_response'

      return `🖨️ Perfecto, gracias por confirmar  

Vamos a validar el estado de tu impresora ${monitoredDevice.name}:  

1. Verifica que esté encendida  
2. Revisa si aparece como "offline"  
3. Confirma papel y tóner  
4. Intenta imprimir una página de prueba  

👉 Dime cómo te va`
    }

    if (msg.includes('error') || msg.includes('falla')) {
      state.step = 'awaiting_response'

      return `⚠️ Entiendo  

Vamos a revisar el error en ${monitoredDevice.name}:  

1. Reinicia la impresora  
2. Verifica conexiones  
3. Observa si aparece algún código  

👉 Cuéntame qué ocurre`
    }

    return `🤔 Solo para confirmar  

¿El problema es que no imprime, hay un atasco o aparece algún error?`
  }

  // 🔵 DIAGNÓSTICO
  if (state.step === 'diagnosis') {
    state.attempts++

    if (detectedIssue === 'no imprime' || monitoredDevice.issue === 'no imprime') {
      state.step = 'awaiting_response'

      return `🖨️ Vamos a revisar tu impresora ${monitoredDevice.name}  

1. Verifica encendido  
2. Revisa conexión  
3. Confirma papel y tóner  

👉 Dime si se solucionó`
    }

    if (detectedIssue === 'atasco' || monitoredDevice.issue === 'atasco') {
      state.step = 'awaiting_response'

      return `📄 Vamos a resolver el atasco en ${monitoredDevice.name}  

1. Apaga la impresora  
2. Retira el papel  
3. Enciende nuevamente  

👉 Dime si se solucionó`
    }

    if (state.attempts === 1) {
      return `🤔 ¿El problema es impresión, atasco o error?`
    }

    if (state.attempts >= 2) {
      state.step = 'derivation'
      state.reference = generateReference()

      return `🧠 Gracias por la información  

No se logró resolver el incidente en este nivel  

🔧 Procederé a escalar tu caso a soporte especializado  

📌 Ticket generado exitosamente  
🎫 Ticket de atención: ${state.reference}  

👨‍🔧 Un técnico se pondrá en contacto contigo  

👉 Puedes continuar la conversación si deseas más ayuda`
    }
  }

  // 🟣 RESPUESTA A SOLUCIÓN
  if (state.step === 'awaiting_response') {
    if (isNegative(msg)) {
      state.step = 'derivation'
      state.reference = generateReference()

      return `🧠 Gracias por intentarlo  

He identificado que la impresora ${monitoredDevice.name} requiere revisión especializada  

🔧 Estoy escalando tu caso al equipo técnico  

📌 Tu solicitud ha sido registrada correctamente  
🎫 Ticket de atención: ${state.reference}  

👨‍🔧 Un especialista se comunicará contigo en breve  

👉 Puedes seguir consultando aquí si lo necesitas`
    }

    if (isPositive(msg)) {
      state.step = 'init'
      state.attempts = 0
      state.reference = undefined

      return `🎉 Excelente  

La impresora ${monitoredDevice.name} ya está funcionando correctamente  

Si necesitas ayuda, aquí estaré 🤖`
    }

    return `🤔 ¿Se solucionó el problema?`
  }

  // 🔴 DERIVACIÓN
  if (state.step === 'derivation') {
    return `👨‍🔧 Tu caso ya está siendo gestionado por el equipo técnico  

🎫 Ticket de atención: ${state.reference}  

📞 En breve recibirás atención especializada  

👉 Si tienes más detalles, puedes agregarlos aquí`
  }

  return `⚠️ Ocurrió un error`
}
