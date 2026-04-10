const chatSessions: Record<string, string> = {}

const getOrCreateSessionId = (chatId: string): string => {
  if (!chatSessions[chatId]) {
    chatSessions[chatId] = `bedrock-session-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  return chatSessions[chatId]
}

export const resetPepeState = (chatId: string) => {
  delete chatSessions[chatId]
}

export const streamPepeResponse = async (
  chatId: string, 
  message: string, 
  onChunk: (chunk: string) => void, 
  onComplete: () => void            
) => {
  const sessionId = getOrCreateSessionId(chatId);
  const currentPrompt = message.trim();

  if (!currentPrompt) return; 

  try {
    // 1. Obtener tu token de sesión 
    const token = localStorage.getItem('session_token'); 

    // 2. Hacer la petición a tu Lambda 
    const response = await fetch(import.meta.env.VITE_LAMBDA_PEPE_DEV_FRONTED_TO_AGENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ 
        prompt: currentPrompt,
        sessionId: sessionId 
      })
    });

    if (!response.ok) throw new Error('Error comunicando con AgentCore');

    // 3. Prepararse para leer el stream 
    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    // 4. Bucle de lectura en tiempo real
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      
      onChunk(chunk); 
    }
  } catch (error) {
    console.error("Error en Pepe:", error);
    onChunk("\n⚠️ Lo siento, tuve un problema de conexión con el servidor central.");
  } finally {
    onComplete();
  }
}