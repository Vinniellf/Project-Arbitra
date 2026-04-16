import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Eye, Sparkles, ShieldCheck, Zap } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import { useAuthContext } from '../hooks/useAuthContext'
import { AuthErrorMessage } from '../components/AuthErrorMessage'
import { PASSWORD_ERRORS } from '../constants/password-errors'
import {
  PASSWORD_RULES,
  validatePassword,
  isPasswordValid,
} from '../utils/password-validator'
import { getCurrentSessionUser } from '../services/session.service'

import LoadingScreen from '@/shared/components/ui/LoadingScreen'
import { isAdminUser } from '@/modules/auth/utils/role.utils'
import { ROUTES } from '@/shared/constants/routes'

type RuleItemProps = {
  valid: boolean
  label: string
}

const RuleItem = ({ valid, label }: RuleItemProps) => (
  <div className="flex items-center gap-2 text-xs">
    {valid ? (
      <Check size={14} className="text-green-500" />
    ) : (
      <X size={14} className="text-gray-300" />
    )}
    <span className={valid ? 'text-green-600' : 'text-gray-500'}>{label}</span>
  </div>
)

const cleanTextInput = (value: string) => value.replace(/^\s+/, '')
const cleanPasswordInput = (value: string) => value

export default function NewPasswordPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showLoading, setShowLoading] = useState(false)

  const { confirmNewPassword, updateProfile, loading } = useAuth()
  const { refreshUser, setRequiresNewPassword } = useAuthContext()
  const navigate = useNavigate()

  const rules = validatePassword(password)
  const validPassword = isPasswordValid(rules)

  const isValidName = (value: string) => value.trim().length >= 2

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const cleanFirstName = firstName.trim()
    const cleanLastName = lastName.trim()
    const cleanPassword = password
    const cleanConfirmPassword = confirmPassword

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanPassword ||
      !cleanConfirmPassword
    ) {
      setError('Completa todos los campos')
      return
    }

    if (!isValidName(cleanFirstName) || !isValidName(cleanLastName)) {
      setError('El nombre y apellido deben tener al menos 2 caracteres')
      return
    }

    if (!validPassword) {
      setError(PASSWORD_ERRORS.INVALID_PASSWORD)
      return
    }

    if (cleanPassword !== cleanConfirmPassword) {
      setError(PASSWORD_ERRORS.PASSWORD_MISMATCH)
      return
    }

    try {
      await confirmNewPassword(cleanPassword)

      await updateProfile({
        firstName: cleanFirstName,
        lastName: cleanLastName,
      })

      setShowLoading(true)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(PASSWORD_ERRORS.UNEXPECTED_ERROR)
      }
    }
  }

  const handleLoadingFinish = useCallback(async () => {
    await refreshUser()

    const sessionUser = await getCurrentSessionUser()
    const redirectPath = isAdminUser(sessionUser?.groups ?? [])
      ? ROUTES.ADMIN
      : ROUTES.HOME

    setRequiresNewPassword(false)
    navigate(redirectPath, { replace: true })
  }, [navigate, refreshUser, setRequiresNewPassword])

  if (showLoading) {
    return <LoadingScreen variant="welcome" onFinish={handleLoadingFinish} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#eef6fb] via-white to-[#e3edf7] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/30 bg-white/75 p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
      >
        <div className="mb-5">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <ShieldCheck className="h-5 w-5 text-[#5aa9e6]" />
            Completa tu cuenta
            <Sparkles size={16} className="text-[#5aa9e6]" />
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Ingresa tus datos y define una contraseña segura
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Nombre
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(cleanTextInput(e.target.value))}
                onPaste={(e) => {
                  e.preventDefault()
                  const text = e.clipboardData.getData('text')
                  setFirstName(cleanTextInput(text))
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition hover:border-gray-300 focus:ring-2 focus:ring-[#5aa9e6]/40"
                placeholder="Nombre"
                maxLength={50}
                autoComplete="given-name"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Apellido
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(cleanTextInput(e.target.value))}
                onPaste={(e) => {
                  e.preventDefault()
                  const text = e.clipboardData.getData('text')
                  setLastName(cleanTextInput(text))
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition hover:border-gray-300 focus:ring-2 focus:ring-[#5aa9e6]/40"
                placeholder="Apellido"
                maxLength={50}
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(cleanPasswordInput(e.target.value))}
              onPaste={(e) => {
                e.preventDefault()
                const text = e.clipboardData.getData('text')
                setPassword(cleanPasswordInput(text))
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition hover:border-gray-300 focus:ring-2 focus:ring-[#5aa9e6]/40"
              placeholder="Ingresa tu contraseña"
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Confirmar contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(cleanPasswordInput(e.target.value))
              }
              onPaste={(e) => {
                e.preventDefault()
                const text = e.clipboardData.getData('text')
                setConfirmPassword(cleanPasswordInput(text))
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition hover:border-gray-300 focus:ring-2 focus:ring-[#5aa9e6]/40"
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-gray-600">
              <Eye size={14} />
              Mostrar contraseña
            </span>

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={`flex h-5 w-10 items-center rounded-full p-1 transition ${
                showPassword ? 'bg-[#5aa9e6]' : 'bg-gray-300'
              }`}
              aria-label={
                showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
            >
              <div
                className={`h-3.5 w-3.5 rounded-full bg-white shadow transition ${
                  showPassword ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-5 mb-5">
          <p className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-600">
            <Zap size={13} />
            Requisitos de seguridad
          </p>

          <div className="space-y-1.5 rounded-xl border border-white/30 bg-white/60 p-3">
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

        <AuthErrorMessage message={error} />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-linear-to-r from-[#5aa9e6] to-[#4a8fd9] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-[#4a8fd9] hover:to-[#1E6F9F] hover:shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Procesando...
            </span>
          ) : (
            'Guardar y continuar'
          )}
        </button>
      </form>
    </div>
  )
}
