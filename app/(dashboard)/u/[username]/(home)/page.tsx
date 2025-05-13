import { currentUser } from "@clerk/nextjs/server";

import { getUserByUsername } from "@/lib/user-service";
import { StreamPlayer } from "@/components/stream-player";
import { notFound } from "next/navigation";
import { isFollowingUser } from "@/lib/follow-service";
import { isBlockedByUser } from "@/lib/block-service";


interface CreatorPageProps {
    params: {username: string;};
};

const CreatorPAge = async ({
    params,
}:CreatorPageProps) => {
    const externalUser = await currentUser();
    const user = await getUserByUsername(params.username);

    if(!user || user.externalUserId !== externalUser?.id || !user.stream){
        throw new Error("Unauthorized");
    }
    if(!user || !user.stream){
        notFound();
    }

    const isFollowing = await isFollowingUser(user.id);
    const isBlocked = await isBlockedByUser(user.id);

    if(isBlocked){
        notFound();
    }

    return(
        <StreamPlayer 
        user={user}
        stream={user.stream}
        isFollowing={isFollowing}
        />
    );
};
export default CreatorPAge;