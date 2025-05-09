"use client";

import { Button } from "@/components/ui/button";
import { onFollow, onUnfollow } from "@/actions/follow";
import { useTransition } from "react";
import { toast } from "sonner";

interface ActionsProps {
    isFollowing: boolean;
    userId: string;
};

export const Actions = ({
    isFollowing,
    userId,
}: ActionsProps) => {
    const [isPending, startTransition] = useTransition();

    const handleFollow = () => {
        startTransition(() => {
            onFollow(userId)
                .then((data) => toast.success(`Empezaste a seguir a ${data.following.username}`))
                .catch((error) => toast.error(error.message || "Failed to follow user"));
        });
    };
    const handleUnfollow = () => {
        startTransition(() => {
            onUnfollow(userId)
                .then((data) => toast.success(`Dejaste de seguir a ${data.following.username}`))
                .catch((error) => toast.error(error.message || "Failed to unfollow user"));
        });
    };

    const onClick = () => {
        if(isFollowing){
            handleUnfollow();
        }
        else{
            handleFollow();
        }
    }
    return (
        <Button 
            disabled={ isPending} 
            onClick={onClick} 
            variant="secondary"
        >
            {isFollowing ? "Dejar de seguir": "Seguir" }
        </Button>
    );
};