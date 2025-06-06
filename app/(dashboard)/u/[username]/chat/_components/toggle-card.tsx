"use client";

import { toast } from "sonner";
import { startTransition, useTransition } from "react";

import { updateStream } from "@/actions/stream";

import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

type FieldTypes = "isChatEnable" | "isChatDelayed" | "isChatFollowersOnly"

interface ToggleCardProps {
    label: string;
    value: boolean;
    field: FieldTypes;
}

export const ToggleCard = ({
    label,
    value = false,
    field,
}: ToggleCardProps) => {
    const [isPending, startTransition] = useTransition();
    const onChange = () => {
        startTransition (() =>{
            updateStream({[field]: !value})
            .then(() => toast.success("Configuracion del chat actualizada!"))
            .catch(() => toast.error("Error al actualizar"))
        });
    }
    return(
        <div className="rounded-xl bg-muted p-6">
            <div className="flex items-center justify-between">
                <p className="font-semibold shrink-0">
                    {label}
                </p>
                <div className="space-y-2">
                    <Switch
                    onCheckedChange={onChange}
                    disabled={isPending}
                    checked={value}>
                        {value ?  "On" : "Off"}
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export const ToggleCardSkeleton = () =>{
    return(
        <Skeleton className="rounded-xl p-10 w-full"/>
    )
}