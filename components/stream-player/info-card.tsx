"use client";

import { Pencil } from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { InfoModal } from "./info-modal";

interface InfoCardProps {
    name: string;
    thumbnailUrl: string | null;
    hostIdentity: string;
    viewerIdentity: string;
};

export const InfoCard = ({
    name,
    thumbnailUrl,
    hostIdentity,
    viewerIdentity,
}: InfoCardProps) => {
    const isHost = viewerIdentity === `host-${hostIdentity}`;
    
    // Si no es el host, no mostrar nada
    if (!isHost) {
        return null;
    }

    return (
        <div className="px-4">
            <div className="rounded-xl bg-background">
                <div className="flex items-center gap-x-2.5 p-4">
                    <div className="rounded-md bg-black p-2 h-auto text-white">
                        <Pencil className="h-5 w-5"/>
                    </div>
                    <div>
                        <h2 className="text-sm lg:text-lg font-semibold capitalize">
                            Editar la información del stream
                        </h2>
                        <p className="text-muted-foreground text-xs lg:text-sm">
                            Maximiza tus visualizaciones
                        </p>
                    </div>
                    <InfoModal 
                        initialName={name}
                        initialThumbnailUrl={thumbnailUrl}
                    />
                </div>
                <Separator />
                <div className="p-4 lg:p-6 space-y-4">
                    <div>
                        <h3 className="text-sm text-muted-foreground mb-2">
                            Nombre:
                        </h3>
                        <p className="text-sm font-semibold">
                            {name}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm text-muted-foreground mb-2">
                            Miniatura:
                        </h3>
                        {thumbnailUrl && (
                            <div className="relative aspect-video rounded-md overflow-hidden w-[200px] border border-white/10">
                                <Image
                                    fill
                                    src={thumbnailUrl}
                                    alt={name}
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}