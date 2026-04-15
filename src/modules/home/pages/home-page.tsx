import { PepeWelcome } from '../components/PepeWelcome'
import { PepeInfoCard } from '../components/PepeInfoCard'
import { ChatContainer } from '@/modules/chat/containers/ChatContainer'

export const HomePage = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex-1 flex">
            <PepeWelcome />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 flex-2 flex flex-col">
            <PepeInfoCard />
          </div>
        </div>

        <ChatContainer />
      </div>
    </div>
  )
}
