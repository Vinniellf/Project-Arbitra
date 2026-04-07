import { Outlet } from 'react-router-dom'
import { Header } from '@/shared/components/layout/Header'

export const MainLayout = () => {
  return (
    <div
      className="
        min-h-screen flex flex-col
        bg-linear-to-br
        from-[#aae0e9]
        via-[#6db8f5]
        to-[#b7abec]
      "
    >
      <Header />

      <main className="flex-1 flex justify-center p-4">
        <div className="w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
