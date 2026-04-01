import { PepeWelcome } from "../components/PepeWelcome";
import { PepeInfoCard } from "../components/PepeInfoCard";
import { ChatContainer } from "@/modules/chat/containers/ChatContainer";

export const HomePage = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl space-y-6">
        {/* BLOQUE SUPERIOR */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* IZQUIERDA */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex-1 flex">
            <PepeWelcome />
          </div>
          {/* DERECHA */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex-2 flex flex-col">
            <PepeInfoCard />
          </div>
        </div>
        {/* CHAT */}
        <ChatContainer />
      </div>
    </div>
  );
};
