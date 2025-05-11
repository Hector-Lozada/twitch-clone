"use client";

import { UserAvatar } from "../user-avatar";

interface HeaderProps{
    imageUrl: string;
    hostName: string;
    hostIdentity: string;
    viewerIdentity: string;
    isFollowing: boolean;
    name: string;
}

export const Header = ({
    imageUrl,
    hostName,
    hostIdentity,
    viewerIdentity,
    isFollowing,
    name,
}:HeaderProps) => {
    return ( 
        <div className="flex flex-col-1 lg:flex-row gap-y-4 lg:gap-y-0 justify-between px-4">
            <div className="flex items-center gap-x-3">
                <UserAvatar 
                imageUrl={imageUrl}
                username={hostName}
                size="lg"
                isLive={true}
                showBadge
                />
                 <div className="space-y-1">
                    <div className="flex items-center gap-x-2">
                        <h2 className="text-lg font-semibold">
                            {hostName}
                        </h2>
                    </div>
                 </div>
            </div>
        </div>
     );
}
 
