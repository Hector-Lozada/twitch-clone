"use client";

import { useState, useTransition, useRef, ElementRef } from "react";
import { useRouter } from "next/navigation";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";
import { Edit, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface BioModalProps {
  initialValue: string;
  isHost?: boolean;
}

export const BioModal = ({ initialValue, isHost = false }: BioModalProps) => {
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(initialValue);



  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value === initialValue) {
      closeRef.current?.click();
      return;
    }

    startTransition(() => {
      updateUser({ bio: value })
        .then(() => {
          toast.success("¡Biografía actualizada!");
          closeRef.current?.click();
          router.refresh();
        })
        .catch(() => {
          toast.error("Error al actualizar la biografía");
        });
    });
  };

  return (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Editar biografía
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <Textarea
                placeholder="Cuéntale al mundo sobre ti..."
                onChange={(e) => setValue(e.target.value)}
                value={value}
                disabled={isPending}
                className="resize-none min-h-[120px]"
                maxLength={150}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {value.length}/150 caracteres
                </span>
                <div className="flex gap-2">
                  <DialogClose asChild ref={closeRef}>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      disabled={isPending}
                      className="flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    disabled={isPending || value === initialValue}
                    type="submit"
                    className="flex items-center gap-1"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
  );
};