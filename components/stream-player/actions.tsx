"use client";

import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Heart, HeartCrack } from "lucide-react";
import { cn } from "@/lib/utils";
import { onFollow, onUnfollow } from "@/actions/follow";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

interface ActionsProps {
  hostIdentity: string;
  isFollowing: boolean;
  isHost: boolean;
};

export const Actions = ({
  hostIdentity,
  isFollowing,
  isHost
}: ActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { userId } = useAuth();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(hostIdentity)
        .then(data => toast.success(`Acabas de seguir a ${data.following.username}`))
        .catch(() => toast.error("Error al seguir"))
    });
  };

  const handleUnFollow = () => {
    startTransition(() => {
      onUnfollow(hostIdentity)
        .then(data => toast.success(`Dejaste de seguir a ${data.following.username}`))
        .catch(() => toast.error("Error al dejar de seguir"))
    });
  };

  const toggleFollow = () => {
    if (!userId) {
      return router.push("/sign-in");
    }
    if (isHost) return;

    if (isFollowing) {
      handleUnFollow();
    } else {
      handleFollow();
    }
  }

  return (
    <Button
      disabled={isPending || isHost}
      onClick={toggleFollow}
      size="sm"
      className="w-full lg:w-auto gap-x-2"
    >
      {isFollowing ? (
        <>
          <HeartCrack className="h-4 w-4" />
          Dejar de Seguir
        </>
      ) : (
        <>
          <Heart className="h-4 w-4" />
          Seguir
        </>
      )}
    </Button>
  );
};

export const ActionsSkeleton = () => {
  return (
    <Skeleton className="h-10 w-full lg:w-24" />
  );
};