"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
    startTransition(async () => {
      try {
        const result = await createIngress(parseInt(ingressType));
        
        if (result?.success) {
          toast.success("Ingress creado exitosamente!", {
            description: `Tipo: ${ingressType === RTMP ? "RTMP" : "WHIP"}`,
          });
          closeRef.current?.click();
        } else {
          toast.error(result?.error || "No se pudo crear el Ingress");
        }
      } catch (error) {
        console.error("Ingress creation error:", error);
        toast.error("Error inesperado al crear el Ingress");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button  size="sm">
          ⚡ Generar Conexión
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Generar Conexión</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Select
            disabled={isPending}
            value={ingressType}
            onValueChange={(value: IngressType) => setIngressType(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tipo de conexión" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RTMP}>RTMP (Compatible con más software)</SelectItem>
              <SelectItem value={WHIP}>WHIP (Menor latencia)</SelectItem>
            </SelectContent>
          </Select>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>¡Advertencia!</AlertTitle>
            <AlertDescription className="text-xs">
              Esta acción reiniciará todas las transmisiones activas usando la conexión actual.
              Los espectadores necesitarán recargar la página.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3 pt-2">
            <DialogClose ref={closeRef} asChild>
              <Button variant="ghost" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              disabled={isPending}
              onClick={onSubmit}
              className="min-w-[120px]"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">⚡</span> Procesando...
                </span>
              ) : (
                "⚡ Generar"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};