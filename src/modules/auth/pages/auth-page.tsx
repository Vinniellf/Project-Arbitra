import { useState, useEffect } from 'react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from '@/shared/components/ui/LoadingScreen'
import icon from '@/assets/icon.webp'
import { fetchAuthSession } from 'aws-amplify/auth'

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showLoading, setShowLoading] = useState(false)

  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // AUTOCOMPLETAR EMAIL DESDE URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const emailParam = params.get('email')

    if (emailParam) {
      setEmail(emailParam)
    }
  }, [location])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const result = await login(email, password)

      // USUARIO INVITADO (Cognito)
      if (result.requiresNewPassword) {
        navigate('/new-password')
        return
      }

      // Esperar sesión
      let sessionReady = false
      let attempts = 0

      while (!sessionReady && attempts < 5) {
        const session = await fetchAuthSession()

        if (session.tokens) {
          sessionReady = true
        } else {
          await new Promise(res => setTimeout(res, 200))
          attempts++
        }
      }

      if (!sessionReady) {
        throw new Error('No se pudo establecer la sesión')
      }

      setShowLoading(true)

    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Error inesperado')
      }
    }
  }

  if (showLoading) {
    return (
      <LoadingScreen
        onFinish={() => {
          navigate('/home')
        }}
      />
    )
  }

  return (
    <div className="min-h-screen flex bg-linear-to-br from-[#eef6fb] to-[#e3edf7]">

      {/* Lado izquierdo */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden bg-linear-to-br from-[#0F3D5E] via-[#1E6F9F] to-[#5aa9e6] text-white items-center justify-center px-10">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-20 -right-20 blur-2xl"></div>
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -bottom-20 -left-20 blur-2xl"></div>

        <div className="z-10 text-center flex flex-col items-center space-y-6">
          <img
            src={icon}
            alt="Pepe AI"
            className="w-64 h-64 object-contain drop-shadow-xl"
          />

          <h2 className="text-4xl font-bold tracking-tight">
            Bienvenido a PEPE
          </h2>

          <p className="text-lg opacity-90 max-w-md">
            Plataforma de gestión inteligente para soluciones tecnológicas
          </p>
        </div>
      </div>

      {/* Lado derecho */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/40">

            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              Iniciar sesión
            </h2>

            <p className="text-gray-500 mb-4 text-sm">
              Accede a tu cuenta
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Correo electrónico
                </label>

                <div className="relative group">
                  <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#5aa9e6]" size={18} />

                  <input
                    type="email"
                    placeholder="correo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#5aa9e6]/40"
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
                  <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#5aa9e6]" size={18} />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña temporal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#5aa9e6]/40"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-[#5aa9e6]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* BOTÓN */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-[#5aa9e6] to-[#4a8fd9] disabled:opacity-50"
              >
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
