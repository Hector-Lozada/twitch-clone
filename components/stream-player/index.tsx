"use client";

import { useViewerToken } from "@/hooks/user-viewer-token";
import { Stream, User } from "@prisma/client";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { LiveKitRoom } from "@livekit/components-react";
import { Video, VideoSkeleton } from "./video";
import { cn } from "@/lib/utils";
import { Chat, ChatSkeleton } from "./chat";
import { ChatToggle } from "./chat-toggle";
import { Header, HeaderSkeleton } from "./header";
import { InfoCard } from "./info-card";
import { AboutCard } from "./about-card";

type CustomStream = {
    id: string;
    isChatEnable: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
    isLive: boolean;
    thumbnailUrl: string | null;
    name: string;
};

type CustomUser = {
    id: string;
    username: string;
    bio: string | null;
    stream: CustomStream | null;
    imageUrl: string;
    _count: {followedBy: number}
};

interface StreamPlayerProps {
    user: CustomUser;
    stream: CustomStream;
    isFollowing: boolean;
}

export const StreamPlayer = ({
    user,
    stream,
    isFollowing,
}: StreamPlayerProps) => {
    const {
        token,
        name,
        identity
    } = useViewerToken(user.id);

    const { collapsed } = useChatSidebar((state) => state);

    if (!token || !name || !identity) {
        return <StreamPlayerSkeleton />;
    }

    return (
        <div className="bg-[#080808]">
            {collapsed && (
                <div className="hidden lg:block fixed top-[100px] right-2 z-50">
                    <ChatToggle />
                </div>
            )}
            <LiveKitRoom
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKUT_WS_URL}
                className={cn(
                    "grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full", 
                    collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
                )}
            >
                <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
                    {/* Contenedor de video con tamaño reducido */}
                    <div className="relative pt-[56.25%]"> {/* Mantiene relación de aspecto 16:9 */}
                        <div className="absolute inset-0">
                            <Video
                                hostName={user.username}
                                hostIdentity={user.id}
                            />
                        </div>
                    </div>
                    
                    <Header 
                        hostName={user.username}
                        hostIdentity={user.id}
                        viewerIdentity={identity}
                        imageUrl={user.imageUrl}
                        isFollowing={isFollowing}
                        name={stream.name}
                    />
                    <InfoCard 
                        hostIdentity={user.id}
                        viewerIdentity={identity}
                        name={stream.name}
                        thumbnailUrl={stream.thumbnailUrl}
                    />
                    <AboutCard
                    hostName={user.username}
                    hostIdentity={user.id}
                    viewerIdentity={identity}
                    bio={user.bio || ""}
                    followedByCount = {user._count.followedBy}
                    />
                </div>
                <div className={cn("col-span-1", collapsed && "hidden")}>
                    <Chat
                        viewerName={name}
                        hostName={user.username}
                        hostIdentity={user.id}
                        isFollowing={isFollowing} 
                        isChatEnable={stream.isChatEnable}
                        isChatDelayed={stream.isChatDelayed}
                        isChatFollowersOnly={stream.isChatFollowersOnly}
                    />
                </div>
            </LiveKitRoom>
        </div>
    );
};

export const StreamPlayerSkeleton = () => {
    return (
        <div className="bg-background">
            <div className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full">
                <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
                    <div className="relative pt-[56.25%]">
                        <div className="absolute inset-0">
                            <VideoSkeleton  />
                        </div>
                    </div>
                    <HeaderSkeleton />
                </div>
                <div className="col-span-1 bg-background">
                    <ChatSkeleton />
                </div>
            </div>
        </div>
    );
};