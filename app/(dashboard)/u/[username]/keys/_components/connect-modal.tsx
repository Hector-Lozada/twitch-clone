"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { IngressInput } from "livekit-server-sdk";
import { ElementRef, useRef, useState, useTransition } from "react";
import { createIngress } from "@/actions/ingress";
import { toast } from "sonner";

const RTMP = String(IngressInput.RTMP_INPUT);
const WHIP = String(IngressInput.WHIP_INPUT);

type IngressType = typeof RTMP | typeof WHIP;

export const ConnectModal = () => {
    const closeRef = useRef<ElementRef<"button">>(null);
    const [isPending, startTransition] = useTransition();
    const [ingressType, setIngressType] = useState<IngressType>(RTMP);

    const onSubmit = () => {
        startTransition(() => {
            createIngress(parseInt(ingressType))
                .then((result) => {
                    if (result.success) {
                        toast.success("Ingress creado exitosamente!");
                        closeRef.current?.click();
                    } else {
                        toast.error(result.error || "No se pudo crear el Ingress");
                    }
                })
                .catch(() => {
                    toast.error("Error al procesar la solicitud");
                });
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button >
                    ⚡ Generar Conexión
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generar Conexión</DialogTitle>
                </DialogHeader>
                <Select
                    disabled={isPending}
                    value={ingressType}
                    onValueChange={(value) => setIngressType(value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione tipo de conexión" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={RTMP}>RTMP</SelectItem>
                        <SelectItem value={WHIP}>WHIP</SelectItem>
                    </SelectContent>
                </Select>
                <Alert >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>¡Advertencia!</AlertTitle>
                    <AlertDescription>
                        Esta acción reiniciará todas las transmisiones activas usando la conexión actual.
                    </AlertDescription>
                </Alert>
                <div className="flex justify-between">
                    <DialogClose ref={closeRef} asChild>
                        <Button variant="ghost">
                            ❌ Cancelar
                        </Button>
                    </DialogClose>
                    <Button
                        disabled={isPending}
                        onClick={onSubmit}
                    >
                        {isPending ? "Procesando..." : "⚡ Generar"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};