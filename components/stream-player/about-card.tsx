"use client";

import { BioModal } from "./bio-modal";
import { VerifiedMark } from "./verified-mark";

interface AboutCardProps{
    hostName: string;
    hostIdentity: string;
    viewerIdentity: string;
    bio: string ;
    followedByCount: number;
}

export const AboutCard = ({
    hostName,
    hostIdentity,
    viewerIdentity,
    bio,
    followedByCount,
} : AboutCardProps) => {
    const hostAsViewer =  `host-${hostIdentity}`;
    const isHost = viewerIdentity === hostAsViewer;

    const followedByLabel = followedByCount === 1 ? "seguidor" : "seguidores";

    return(
        <div className="px-4">
            <div className="group rounded-xl bg-background p-6 lg:p-10 flex flex-col gap-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2 font-semibold text-lg lg:text-2xl">
                        Sobre {hostName}
                        <VerifiedMark />
                    </div>
                    {isHost && (
                        <BioModal initialValue={bio}/>
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">{followedByCount}</span> {followedByLabel}
                </div>
                <p>
                    {bio || "¡Shhh! Este usuario juega a las escondidas."}
                </p>
            </div>
        </div>
    )
}