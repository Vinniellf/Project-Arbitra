import { useEffect, useMemo, useState } from 'react'
import {
  Pencil,
  Save,
  Mail,
  User,
  Shield,
  Sparkles,
  X,
} from 'lucide-react'
import { authService } from '@/modules/auth/services/auth.service'
import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'

export const ProfilePage = () => {
  const { user, refreshUser } = useAuthContext()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.name) return

    const parts = user.name.trim().split(' ')
    const inferredFirstName = parts[0] || ''
    const inferredLastName = parts.slice(1).join(' ') || ''

    setFirstName(inferredFirstName)
    setLastName(inferredLastName)
  }, [user])

  const initials = useMemo(() => {
    const first =
      firstName?.charAt(0).toUpperCase() ||
      user?.name?.charAt(0).toUpperCase() ||
      'U'
    const last = lastName?.charAt(0).toUpperCase() || ''
    return `${first}${last}`
  }, [firstName, lastName, user?.name])

  const fullNamePreview =
    `${firstName} ${lastName}`.trim() || user?.name || 'Usuario'

  const handleEdit = () => {
    setMessage('')
    setError('')
    setIsEditing(true)
  }

  const handleCancel = () => {
    if (user?.name) {
      const parts = user.name.trim().split(' ')
      const inferredFirstName = parts[0] || ''
      const inferredLastName = parts.slice(1).join(' ') || ''

      setFirstName(inferredFirstName)
      setLastName(inferredLastName)
    }

    setMessage('')
    setError('')
    setIsEditing(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      await authService.updateProfile({
        firstName,
        lastName,
      })

      await refreshUser?.()
      setMessage('Tus datos se actualizaron correctamente.')
      setIsEditing(false)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo actualizar tu perfil.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:px-6 md:py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xl font-bold text-sky-700">
                {initials}
              </div>

              <div>
                <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                  <Sparkles size={11} />
                  Mi perfil
                </div>

                <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                  {fullNamePreview}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Administra tu información personal.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                >
                  <Pencil size={15} />
                  Editar perfil
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    <X size={15} />
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
                  >
                    <Save size={15} />
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 bg-white px-4 py-4 md:px-6 md:py-5 xl:grid-cols-[1.7fr_0.95fr]">
          <section className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Información principal
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Edita los datos esenciales de tu cuenta.
                </p>
              </div>

              <div className="hidden rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[10px] font-semibold text-sky-700 md:block">
                {isEditing ? 'Editando' : 'Solo lectura'}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User size={14} className="text-sky-600" />
                  Nombre
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing || loading}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  placeholder="Ingresa tu nombre"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User size={14} className="text-sky-600" />
                  Apellido
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing || loading}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  placeholder="Ingresa tu apellido"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Mail size={14} className="text-sky-600" />
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500 outline-none"
                  placeholder="correo@ejemplo.com"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Este dato no se puede modificar desde aquí.
                </p>
              </div>
            </div>

            {message && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </section>

          <aside className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Resumen</h2>
            <p className="mt-1 text-sm text-slate-500">
              Vista rápida de tu información actual.
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                  Nombre completo
                </p>
                <p className="mt-2 text-base font-semibold text-slate-800">
                  {fullNamePreview}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                  Correo
                </p>
                <p className="mt-2 break-all text-sm text-slate-700">
                  {user?.email || 'correo@ejemplo.com'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                  <Shield size={13} />
                  Roles
                </p>

                <div className="flex flex-wrap gap-2">
                  {user?.groups?.length ? (
                    user.groups.map((group) => (
                      <span
                        key={group}
                        className="rounded-full border border-sky-200 bg-sky-100 px-2.5 py-1 text-[11px] font-medium text-sky-700"
                      >
                        {group}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">
                      Sin roles visibles
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-sky-200 bg-sky-50 p-3 text-sm text-slate-600">
                {!isEditing
                  ? 'Activa el modo edición para actualizar tu nombre y apellido.'
                  : 'Revisa los cambios antes de guardar.'}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </form>
  )
}
