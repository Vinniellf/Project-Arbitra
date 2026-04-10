import { useState, useEffect } from 'react'
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchAuthSession } from 'aws-amplify/auth'

import { useAuth } from '../hooks/useAuth'
import { useAuthContext } from '../hooks/useAuthContext'
import { getAuthErrorMessage } from '../utils/auth-error-handler'
import { AuthErrorMessage } from '../components/AuthErrorMessage'

import { isAdminUser } from '../utils/role.utils'
import { getCurrentSessionUser } from '../services/session.service'

import LoadingScreen from '@/shared/components/ui/LoadingScreen'
import icon from '@/assets/icon.webp'

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showLoading, setShowLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, loading } = useAuth()
  const { refreshUser } = useAuthContext()

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const emailParam = params.get('email')

    if (emailParam) {
      setEmail(emailParam)
    }
  }, [location])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    try {
      const result = await login(cleanEmail, cleanPassword)

      if (result.requiresNewPassword) {
        navigate('/new-password')
        return
      }

      let sessionReady = false
      let attempts = 0

      while (!sessionReady && attempts < 5) {
        const session = await fetchAuthSession()

        if (session.tokens) {
          sessionReady = true
        } else {
          await new Promise((res) => setTimeout(res, 200))
          attempts++
        }
      }

      if (!sessionReady) {
        throw new Error('No se pudo establecer la sesión')
      }

      setShowLoading(true)
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error))
    }
  }

  if (showLoading) {
    return (
      <LoadingScreen
        variant="login"
        onFinish={async () => {
          await refreshUser()

          const sessionUser = await getCurrentSessionUser()
          const redirectPath = isAdminUser(sessionUser?.groups ?? [])
            ? '/admin'
            : '/home'

          navigate(redirectPath, { replace: true })
        }}
      />
    )
  }

  return (
    <div className="min-h-screen flex bg-linear-to-br from-[#eef6fb] via-white to-[#e3edf7]">
      {/* LADO IZQUIERDO */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden bg-linear-to-br from-[#0F3D5E] via-[#1E6F9F] to-[#5aa9e6] text-white items-center justify-center px-10">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-20 -right-20 blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -bottom-20 -left-20 blur-3xl animate-pulse"></div>

        <div className="z-10 text-center flex flex-col items-center space-y-6">
          <div className="relative">
            <img
              src={icon}
              alt="Pepe AI"
              className="w-64 h-64 object-contain drop-shadow-2xl"
            />

            <Sparkles className="absolute -top-4 -right-4 text-white/80 animate-bounce" />
          </div>

          <h2 className="text-4xl font-bold tracking-tight">
            Bienvenido a PEPE
          </h2>

          <p className="text-lg opacity-90 max-w-md leading-relaxed">
            Plataforma de gestión inteligente para soluciones tecnológicas
          </p>
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div
            className="
              bg-white/70 backdrop-blur-xl
              p-8 rounded-3xl
              border border-white/30
              shadow-[0_10px_40px_rgba(0,0,0,0.08)]
              transition-all duration-300
            "
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              Iniciar sesión
              <Sparkles size={20} className="text-[#5aa9e6]" />
            </h2>

            <p className="text-gray-500 mb-6 text-sm">Accede a tu cuenta</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Correo electrónico
                </label>

                <div className="relative group">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#5aa9e6] transition"
                    size={18}
                  />

                  <input
                    type="email"
                    placeholder="correo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`
                      w-full pl-10 pr-4 py-3
                      border rounded-xl
                      outline-none
                      hover:border-gray-300
                      focus:ring-2 focus:ring-[#5aa9e6]/40
                      transition
                      ${error ? 'border-red-300' : 'border-gray-200'}
                    `}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Contraseña
                </label>

                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#5aa9e6] transition"
                    size={18}
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña temporal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`
                      w-full pl-10 pr-10 py-3
                      border rounded-xl
                      outline-none
                      hover:border-gray-300
                      focus:ring-2 focus:ring-[#5aa9e6]/40
                      transition
                      ${error ? 'border-red-300' : 'border-gray-200'}
                    `}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-[#5aa9e6] transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <AuthErrorMessage message={error} className="mt-2" />

              {/* BOTÓN */}
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
                    Ingresando...
                  </span>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
