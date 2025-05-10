import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";
import { ToggleCard } from "./_components/toggle-card";

const ChatPage = async () => {
    const self = await getSelf();
    const stream = await getStreamByUserId(self.id)

    if(!stream){
        throw new Error("Stream not found");
    }

    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">⚙️ Configuracion del Chat</h1>
            </div>
            <div className="space-y-4">
                <ToggleCard 
                field="isChatEnable"
                label="Habilitar chat"
                value={stream.isChatEnable}/>
                <ToggleCard 
                field="isChatDelayed"
                label="Demorar chat"
                value={stream.isChatDelayed}/>
                <ToggleCard 
                field="isChatFollowersOnly"
                label="Debe seguir al usuario para chatear"
                value={stream.isChatFollowersOnly}/>
            </div>
        </div>
    );
}
 
export default ChatPage;