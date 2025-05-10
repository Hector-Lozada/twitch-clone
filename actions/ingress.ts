"use server";

import {
    IngressAudioEncodingPreset,
    IngressInput,
    IngressClient,
    IngressVideoEncodingPreset,
    RoomServiceClient,
    TrackSource,
    type CreateIngressOptions
} from "livekit-server-sdk";
import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

const roomService = new RoomServiceClient(
    process.env.LIVEKIT_API_URL!,
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
);

const ingressClient = new IngressClient(
    process.env.LIVEKIT_API_URL!,
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
);

export const resetIngresses = async (hostIdentity: string) => {
    try {
        const [ingresses, rooms] = await Promise.all([
            ingressClient.listIngress({ roomName: hostIdentity }),
            roomService.listRooms([hostIdentity])
        ]);

        await Promise.all([
            ...rooms.map(room => roomService.deleteRoom(room.name)),
            ...ingresses.map(ingress => 
                ingress.ingressId ? ingressClient.deleteIngress(ingress.ingressId) : Promise.resolve()
            )
        ]);
    } catch (error) {
        console.error("Error resetting ingresses:", error);
        throw error;
    }
};

export const createIngress = async (ingressType: IngressInput) => {
    try {
        const self = await getSelf();
        await resetIngresses(self.id);

        const options: CreateIngressOptions = {
            name: self.username,
            roomName: self.id,
            participantName: self.username,
            participantIdentity: self.id,
        };

        if (ingressType === IngressInput.WHIP_INPUT) {
            options.bypassTranscoding = true;
        } else {
            options.video = {
                source: TrackSource.CAMERA,
                preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
            };
            options.audio = {
                source: TrackSource.MICROPHONE,
                preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS
            };
        }

        const ingress = await ingressClient.createIngress(ingressType, options);

        if (!ingress?.url || !ingress.streamKey) {
            throw new Error("Missing ingress URL or stream key");
        }

        await db.stream.update({
            where: { userId: self.id },
            data: {
                ingressId: ingress.ingressId,
                serverUrl: ingress.url,
                streamKey: ingress.streamKey,
            },
        });

        revalidatePath(`/u/${self.username}/keys`);
        
        // Devuelve solo datos planos
        return {
            success: true,
            data: {
                url: ingress.url,
                streamKey: ingress.streamKey,
                ingressId: ingress.ingressId
            }
        };
    } catch (error) {
        console.error("Error creating ingress:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
};