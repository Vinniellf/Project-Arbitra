export const PepeInfoCard = () => {
  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">

      {/* Título */}
      <div className="text-center">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#0f172a]">
          ¿Cómo aprovechar mejor a Pepe?
        </h3>
      </div>

      {/* INFOGRAFÍA */}
      <div className="mt-4 relative">

        {/* Línea vertical */}
        <div className="absolute left-4 sm:left-3.5 top-0 bottom-0 w-0.5 bg-[#5aa9e6]/40"></div>

        <div className="space-y-6 sm:space-y-5">

          {/* PASO */}
          {[ 
            {
              num: 1,
              color: "bg-[#5aa9e6]",
              title: "Describe el problema",
              items: [
                "Indica qué ocurre (no imprime, error, papel atascado, etc.)",
                "Menciona cuándo comenzó el problema",
              ],
              example: 'Ejemplo: "Mi impresora no imprime desde ayer"',
            },
            {
              num: 2,
              color: "bg-[#4e24b1]",
              title: "Proporciona detalles clave",
              items: [
                "Pepe ya identifica tu impresora automáticamente",
                "Indica luces o códigos de error",
                "Tipo de conexión (USB, WiFi)",
              ],
              example: 'Ejemplo: "Tiene luz roja parpadeando y está por WiFi"',
            },
            {
              num: 3,
              color: "bg-[#5aa9e6]",
              title: "Sigue las instrucciones",
              items: [
                "Aplica los pasos que te indica Pepe",
                "Responde para continuar el diagnóstico",
                "Pepe puede continuar el diagnóstico o escalar el caso",
              ],
            },
            {
              num: 4,
              color: "bg-[#4e24b1]",
              title: "Confirmación o ayuda especializada",
              items: [
                "Verifica si la impresora funciona correctamente",
                "Si el problema continúa, sigue conversando con Pepe",
                "Se generará automáticamente un ticket de soporte",
                "Tu caso será derivado a un técnico humano",
              ],
              example:
                'Ejemplo: "No funcionó, necesito ayuda" → se genera ticket',
            },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-3 relative">

              {/* Número */}
              <div
                className={`
                  min-w-8 h-8 flex items-center justify-center
                  rounded-full text-white font-bold text-xs sm:text-sm
                  shadow-md ${step.color}
                `}
              >
                {step.num}
              </div>

              {/* Contenido */}
              <div className="flex-1">
                <h4 className="text-sm sm:text-base font-semibold text-[#0f172a]">
                  {step.title}
                </h4>

                <ul className="mt-1 space-y-1">
                  {step.items.map((item, i) => (
                    <li
                      key={i}
                      className="text-xs sm:text-sm text-[#1f3c50]"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>

                {step.example && (
                  <p className="text-[10px] sm:text-xs text-[#64748b] mt-1">
                    {step.example}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nota */}
      <p className="text-[10px] sm:text-[11px] text-center text-[#94a3b8] mt-4">
        Este servicio forma parte del soporte de impresoras brindado por Misión Tecnológica.
      </p>
    </div>
  )
}
