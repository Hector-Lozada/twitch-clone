"use client";

import { ReceivedChatMessage } from "@livekit/components-react";
import { stringToColor } from "@/lib/utils";
import { format } from "date-fns";

interface ChatMessageProps {
    data: ReceivedChatMessage;
}

export const ChatMessage = ({ data }: ChatMessageProps) => {
    const color = stringToColor(data.from?.name || "");
    
    return (
        <div className="flex gap-2 p-2 rounded-md hover:bg-white/5">
            <p className="text-sm ">
                {format(data.timestamp, "HH:mm")} {/* Formato corregido: "HH:mm" */}
            </p>
            <div className="flex flex-wrap items-baseline gap-1 grow">
                <p className="text-sm font-semibold whitespace-nowrap">
                    <span className="truncate" style={{ color: color }}>
                        {data.from?.name}
                    </span>
                </p>
                <p className="text-sm break-all">
                    {data.message}
                </p>
            </div>
        </div>
    );
};