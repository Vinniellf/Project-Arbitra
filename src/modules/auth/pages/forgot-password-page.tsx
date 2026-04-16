import { useMemo, useRef, useState } from 'react'
import {
  Eye,
  Check,
  X,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { AuthErrorMessage } from '../components/AuthErrorMessage'
import {
  getAuthErrorMessage,
  isInvalidLambdaResponseError,
} from '../utils/auth-error-handler'
import {
  PASSWORD_RULES,
  validatePassword,
  isPasswordValid,
} from '../utils/password-validator'
import { ROUTES } from '@/shared/constants/routes'

type Step = 'request' | 'confirm'

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

const cleanEmailInput = (value: string) => value.trim()
const cleanCodeInput = (value: string) => value.replace(/\s/g, '')
const cleanPasswordInput = (value: string) => value

export default function ForgotPasswordPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const initialEmail =
    new URLSearchParams(location.search).get('email')?.trim() ?? ''

  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  const { forgotPassword, confirmReset, loading } = useAuth()

  const requestInFlightRef = useRef(false)
  const resendInFlightRef = useRef(false)
  const confirmInFlightRef = useRef(false)

  const rules = useMemo(() => validatePassword(newPassword), [newPassword])
  const validPassword = isPasswordValid(rules)

  const handleRequestCode = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (loading || requestInFlightRef.current) return
    requestInFlightRef.current = true

    setError('')
    setInfoMessage('')

    const cleanEmail = email.trim()

    if (!cleanEmail) {
      setError('Ingresa tu correo electrónico')
      requestInFlightRef.current = false
      return
    }

    try {
      await forgotPassword(cleanEmail)
      setInfoMessage(
        'Te enviamos un código de verificación a tu correo electrónico'
      )
      setStep('confirm')
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error))
    } finally {
      requestInFlightRef.current = false
    }
  }

  const handleConfirmReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (loading || confirmInFlightRef.current) return
    confirmInFlightRef.current = true

    setError('')
    setInfoMessage('')

    const cleanEmail = email.trim()
    const cleanCode = code.trim()

    if (!cleanEmail || !cleanCode || !newPassword || !confirmPassword) {
      setError('Completa todos los campos')
      confirmInFlightRef.current = false
      return
    }

    if (!validPassword) {
      setError('La contraseña no cumple con los requisitos')
      confirmInFlightRef.current = false
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      confirmInFlightRef.current = false
      return
    }

    try {
      await confirmReset(cleanEmail, cleanCode, newPassword)

      navigate(`${ROUTES.LOGIN}?email=${encodeURIComponent(cleanEmail)}`, {
        replace: true,
        state: {
          successMessage:
            'Tu contraseña fue actualizada correctamente. Ahora inicia sesión.',
        },
      })
    } catch (error: unknown) {
      if (isInvalidLambdaResponseError(error)) {
        navigate(`${ROUTES.LOGIN}?email=${encodeURIComponent(cleanEmail)}`, {
          replace: true,
          state: {
            successMessage:
              'La contraseña fue actualizada. Ahora inicia sesión.',
          },
        })
        return
      }

      setError(getAuthErrorMessage(error))
    } finally {
      confirmInFlightRef.current = false
    }
  }

  const handleResendCode = async () => {
    if (loading || resendInFlightRef.current) return
    resendInFlightRef.current = true

    setError('')
    setInfoMessage('')

    const cleanEmail = email.trim()

    if (!cleanEmail) {
      setError('Ingresa tu correo electrónico')
      setStep('request')
      resendInFlightRef.current = false
      return
    }

    try {
      await forgotPassword(cleanEmail)
      setInfoMessage('Te enviamos un nuevo código de verificación')
      setStep('confirm')
      setCode('')
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error))
    } finally {
      resendInFlightRef.current = false
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#eef6fb] via-white to-[#e3edf7] px-4">
      <form
        onSubmit={step === 'request' ? handleRequestCode : handleConfirmReset}
        className="w-full max-w-sm rounded-2xl border border-white/30 bg-white/75 p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
      >
        <div className="mb-5">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <ShieldCheck className="h-5 w-5 text-[#5aa9e6]" />
            Recuperar contraseña
            <Sparkles size={16} className="text-[#5aa9e6]" />
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            {step === 'request'
              ? 'Ingresa tu correo para recibir un código de recuperación'
              : 'Ingresa el código y define tu nueva contraseña'}
          </p>
        </div>

        <AuthErrorMessage message={infoMessage} variant="info" />
        <AuthErrorMessage message={error} />

        {step === 'request' ? (
          <fieldset disabled={loading} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Correo electrónico
              </label>

              <div className="relative group">
                <Mail
                  className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#5aa9e6] transition"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(cleanEmailInput(e.target.value))}
                  onPaste={(e) => {
                    e.preventDefault()
                    const text = e.clipboardData.getData('text')
                    setEmail(cleanEmailInput(text))
                  }}
                  className="w-full rounded-lg border border-gray-200 px-10 py-2.5 text-sm outline-none transition hover:border-gray-300 focus:ring-2 focus:ring-[#5aa9e6]/40 disabled:opacity-60"
                  placeholder="correo@empresa.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-linear-to-r from-[#5aa9e6] to-[#4a8fd9] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-[#4a8fd9] hover:to-[#1E6F9F] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enviando código...
                </span>
              ) : (
                'Enviar código'
              )}
            </button>

            <div className="text-center">
              <Link
                to={`${ROUTES.LOGIN}${
                  email ? `?email=${encodeURIComponent(email)}` : ''
                }`}
                className="text-sm font-medium text-[#1E6F9F] transition hover:text-[#0F3D5E]"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </fieldset>
        ) : (
          <fieldset disabled={loading} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Correo electrónico
              </label>

              <div className="relative group">
                <Mail
                  className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#5aa9e6] transition"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(cleanEmailInput(e.target.value))}
                  onPaste={(e) => {
                    e.preventDefault()
                    const text = e.clipboardData.getData('text')
                    setEmail(cleanEmailInput(text))
                  }}
                  className="w-full rounded-lg border border-gray-200 px-10 py-2.5 text-sm outline-none transition hover:border-gray-300 focus:ring-2 focus:ring-[#5aa9e6]/40 disabled:opacity-60"
                  placeholder="correo@empresa.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Código de verificación
              </label>

              <div className="relative group">
                <ShieldCheck
                  className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#5aa9e6] transition"
                  size={18}
                />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(cleanCodeInput(e.target.value))}
                  onPaste={(e) => {
                    e.preventDefault()
                    const text = e.clipboardData.getData('text')
                    setCode(cleanCodeInput(text))
                  }}
                  className="w-full rounded-lg border border-gray-200 px-10 py-2.5 text-sm outline-none transition hover:border-gray-300 focus:ring-2 focus:ring-[#5aa9e6]/40 disabled:opacity-60"
                  placeholder="Ingresa el código"
                  autoComplete="one-time-code"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Nueva contraseña
              </label>

              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(cleanPasswordInput(e.target.value))
                }
                onPaste={(e) => {
                  e.preventDefault()
                  const text = e.clipboardData.getData('text')
                  setNewPassword(cleanPasswordInput(text))
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition hover:border-gray-300 focus:ring-2 focus:ring-[#5aa9e6]/40 disabled:opacity-60"
                placeholder="Ingresa tu nueva contraseña"
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
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition hover:border-gray-300 focus:ring-2 focus:ring-[#5aa9e6]/40 disabled:opacity-60"
                placeholder="Repite tu nueva contraseña"
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

            <div className="rounded-xl border border-white/30 bg-white/60 p-3">
              <p className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-600">
                <Zap size={13} />
                Requisitos de seguridad
              </p>

              <div className="space-y-1.5">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-linear-to-r from-[#5aa9e6] to-[#4a8fd9] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-[#4a8fd9] hover:to-[#1E6F9F] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Actualizando...
                </span>
              ) : (
                'Restablecer contraseña'
              )}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="font-medium text-[#1E6F9F] transition hover:text-[#0F3D5E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reenviar código
              </button>

              <Link
                to={`${ROUTES.LOGIN}${
                  email ? `?email=${encodeURIComponent(email)}` : ''
                }`}
                className="font-medium text-[#1E6F9F] transition hover:text-[#0F3D5E]"
              >
                Volver
              </Link>
            </div>
          </fieldset>
        )}
      </form>
    </div>
  )
}
