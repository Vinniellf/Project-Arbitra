import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Eye, Sparkles, ShieldCheck, Zap } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import { useAuthContext } from '../hooks/useAuthContext'
import { PASSWORD_ERRORS } from '../constants/password-errors'
import {
  PASSWORD_RULES,
  validatePassword,
  isPasswordValid,
} from '../utils/password-validator'

import LoadingScreen from '@/shared/components/ui/LoadingScreen'

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
  const [showLoading, setShowLoading] = useState(false)

  const { confirmNewPassword, loading } = useAuth()
  const { refreshUser } = useAuthContext()
  const navigate = useNavigate()

  const rules = validatePassword(password)
  const validPassword = isPasswordValid(rules)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError(PASSWORD_ERRORS.REQUIRED)
      return
    }

    if (!validPassword) {
      setError(PASSWORD_ERRORS.INVALID_PASSWORD)
      return
    }

    if (password !== confirmPassword) {
      setError(PASSWORD_ERRORS.PASSWORD_MISMATCH)
      return
    }

    try {
      await confirmNewPassword(password)
      setShowLoading(true)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(PASSWORD_ERRORS.UNEXPECTED_ERROR)
      }
    }
  }

  if (showLoading) {
    return (
      <LoadingScreen
        variant="welcome"
        onFinish={async () => {
          await refreshUser()
          navigate('/home', { replace: true })
        }}
      />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#eef6fb] via-white to-[#e3edf7] px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md
          bg-white/70 backdrop-blur-xl
          p-8 rounded-3xl
          border border-white/30
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        "
      >
        <div className="mb-7">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="text-[#5aa9e6]" />
            Nueva contraseña
            <Sparkles size={18} className="text-[#5aa9e6]" />
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Define una contraseña segura para tu cuenta
          </p>
        </div>

        <div className="space-y-6 mb-6">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Contraseña
            </label>

            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full px-4 py-3
                border border-gray-200 rounded-xl
                outline-none
                hover:border-gray-300
                focus:ring-2 focus:ring-[#5aa9e6]/40
                transition
              "
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Confirmar contraseña
            </label>

            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="
                w-full px-4 py-3
                border border-gray-200 rounded-xl
                outline-none
                hover:border-gray-300
                focus:ring-2 focus:ring-[#5aa9e6]/40
                transition
              "
              placeholder="Repite tu contraseña"
              required
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Eye size={16} />
              Mostrar contraseña
            </span>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`
                w-12 h-6 flex items-center rounded-full p-1 transition
                ${showPassword ? 'bg-[#5aa9e6]' : 'bg-gray-300'}
              `}
            >
              <div
                className={`
                  bg-white w-4 h-4 rounded-full shadow transform transition
                  ${showPassword ? 'translate-x-6' : ''}
                `}
              />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-2">
            <Zap size={14} />
            Requisitos de seguridad
          </p>

          <div className="space-y-2 bg-white/60 rounded-xl p-3 border border-white/30">
            <RuleItem
              valid={rules.length}
              label={`Mínimo ${PASSWORD_RULES.MIN_LENGTH} caracteres`}
            />
            <RuleItem valid={rules.upper} label="Una mayúscula" />
            <RuleItem valid={rules.lower} label="Una minúscula" />
            <RuleItem valid={rules.number} label="Un número" />
            <RuleItem valid={rules.special} label="Un símbolo" />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 rounded-xl font-semibold text-white
            bg-linear-to-r from-[#5aa9e6] to-[#4a8fd9]
            hover:from-[#4a8fd9] hover:to-[#1E6F9F]
            transition-all duration-200
            shadow-md hover:shadow-lg
            disabled:opacity-50
          "
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Procesando...
            </span>
          ) : (
            'Actualizar contraseña'
          )}
        </button>
      </form>
    </div>
  )
}
