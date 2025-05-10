import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const receiver = new WebhookReceiver(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
);

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const headerPayload = await headers(); // Añadido await aquí
        const authorization = headerPayload.get("Authorization");

        if (!authorization) {
            return NextResponse.json(
                { error: "No authorization header" },
                { status: 400 }
            );
        }

        const event = await receiver.receive(body, authorization);
        const ingressId = event.ingressInfo?.ingressId;

        if (!ingressId) {
            return NextResponse.json(
                { error: "No ingress ID found" },
                { status: 400 }
            );
        }

        if (event.event === "ingress_started") {
            await db.stream.update({
                where: { ingressId },
                data: { isLive: true }
            });
        } else if (event.event === "ingress_ended") {
            await db.stream.update({
                where: { ingressId },
                data: { isLive: false }
            });
        }

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}