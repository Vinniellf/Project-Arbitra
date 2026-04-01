import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const RuleItem = ({ valid, label }: { valid: boolean; label: string }) => (
  <div className="flex items-center gap-2 text-sm">
    {valid ? (
      <Check size={16} className="text-green-500" />
    ) : (
      <X size={16} className="text-gray-300" />
    )}
    <span className={valid ? 'text-green-600' : 'text-gray-500'}>{label}</span>
  </div>
)

export default function NewPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const { confirmNewPassword, loading } = useAuth()
  const navigate = useNavigate()

  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }

  const isValidPassword = Object.values(rules).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isValidPassword) {
      setError('La contraseña no cumple con los requisitos')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      await confirmNewPassword(password)
      navigate('/login')
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message)
      else setError('Error inesperado')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
      >
        {/* HEADER */}
        <div className="mb-7">
          <h2 className="text-2xl font-semibold text-gray-800">
            Crear nueva contraseña
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Define una contraseña segura para tu cuenta
          </p>
        </div>

        {/* INPUTS */}
        <div className="space-y-5 mb-6">
          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Nueva contraseña
            </label>

            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                         focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 
                         outline-none transition"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Confirmar contraseña
            </label>

            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                         focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 
                         outline-none transition"
            />
          </div>

          {/* TOGGLE */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Mostrar contraseña</span>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition 
                ${showPassword ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition 
                  ${showPassword ? 'translate-x-5' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* CHECKLIST */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-600 mb-2">
            Requisitos de seguridad
          </p>

          <div className="space-y-2">
            <RuleItem valid={rules.length} label="Mínimo 8 caracteres" />
            <RuleItem valid={rules.upper} label="Una letra mayúscula" />
            <RuleItem valid={rules.lower} label="Una letra minúscula" />
            <RuleItem valid={rules.number} label="Un número" />
            <RuleItem valid={rules.special} label="Un carácter especial" />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium text-white 
                     bg-linear-to-r from-blue-500 to-purple-600 
                     hover:from-blue-600 hover:to-purple-700 
                     transition shadow-md"
        >
          {loading ? 'Procesando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  )
}
