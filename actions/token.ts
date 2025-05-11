"use server";

import { v4 } from "uuid";
import { AccessToken } from "livekit-server-sdk";
import { getSelf } from "@/lib/auth-service";
import { getUserById } from "@/lib/user-service";
import { isBlockedByUser } from "@/lib/block-service";

export const createViewerToken = async (hostIdentity: string) => {
  let self;

  try {
    self = await getSelf();
  } catch {
    const id = v4();
    const username = `guest#${Math.random().toString(36).substring(2, 8)}`;
    self = { id, username };
  }

  const host = await getUserById(hostIdentity);
  if (!host) throw new Error(`Host ${hostIdentity} not found`);

  const isBlocked = await isBlockedByUser(host.id);
  if (isBlocked) throw new Error(`Blocked by ${host.username}`);

  const isHost = self.id === host.id;
  const identity = isHost ? `host-${self.id}` : self.id;

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity,
      name: self.username,
      ttl: "5h",
      metadata: JSON.stringify({
        customIdentity: identity,
        isHost,
        isGuest: !self.id
      }),
    }
  );

  token.addGrant({
    room: host.id,
    roomJoin: true,
    canPublish: isHost,
    canPublishData: true,
    canSubscribe: true,
    ...(isHost && { roomAdmin: true })
  });

  return token.toJwt();
};