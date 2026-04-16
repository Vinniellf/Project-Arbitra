import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'

export const ProfilePage = () => {
  const { user } = useAuthContext()

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            {user?.name || 'Usuario'}
          </h2>
        </div>

        {/* Info */}
        <div className="mt-6 space-y-3 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-800">Correo:</span>
            <p>{user?.email || 'correo@ejemplo.com'}</p>
          </div>
          
        </div>
      </div>
    </div>
  )
}
