"use client";

import { useState, useTransition, useRef, ElementRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateStream } from "@/actions/stream";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { Trash, Edit, Loader2, X, Check, ImageIcon } from "lucide-react";

interface InfoModalProps {
  initialName: string;
  initialThumbnailUrl: string | null;
}

export const InfoModal = ({
  initialName,
  initialThumbnailUrl,
}: InfoModalProps) => {
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);
  
  const [isPending, startTransition] = useTransition();
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);
  const [name, setName] = useState(initialName);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingThumbnail, setIsDeletingThumbnail] = useState(false);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (name.trim() === "") {
      toast.error("El nombre del stream no puede estar vacío");
      return;
    }

    if (name === initialName && thumbnailUrl === initialThumbnailUrl) {
      closeRef.current?.click();
      return;
    }

    startTransition(async () => {
      try {
        await updateStream({ name, thumbnailUrl });
        toast.success("¡Stream actualizado correctamente!");
        closeRef.current?.click();
        router.refresh();
      } catch (error) {
        toast.error("No se pudo actualizar el stream");
        console.error("Update stream error:", error);
      }
    });
  }, [name, thumbnailUrl, initialName, initialThumbnailUrl, router]);

  const handleUploadComplete = useCallback((res: { url: string }[]) => {
    if (!res?.[0]?.url) {
      toast.error("No se recibió URL de la miniatura");
      return;
    }
    setThumbnailUrl(res[0].url);
    setIsUploading(false);
    toast.success("¡Miniatura subida correctamente!");
    router.refresh();
    closeRef.current?.click();
  }, [router]);

  const handleUploadError = useCallback((error: Error) => {
    setIsUploading(false);
    toast.error("Error al subir la miniatura");
    console.error("Upload error:", error);
  }, []);

  const handleUploadStart = useCallback(() => {
    setIsUploading(true);
  }, []);

  const removeThumbnail = useCallback(() => {
    setIsDeletingThumbnail(true);
    startTransition(async () => {
      try {
        await updateStream({ thumbnailUrl: null });
        setThumbnailUrl(null);
        toast.success("Imagen eliminada correctamente");
        router.refresh();
        closeRef.current?.click();
      } catch (error) {
        toast.error("Error al eliminar la imagen");
        console.error("Delete thumbnail error:", error);
      } finally {
        setIsDeletingThumbnail(false);
      }
    });
  }, [router]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="ml-auto flex items-center gap-1">
          <Edit className="w-4 h-4" />
          Editar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Edit className="w-5 h-5" />
            Editar información del stream
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="stream-name" className="flex items-center gap-1">
              Nombre del Stream
            </Label>
            <Input
              id="stream-name"
              placeholder="Nombre del Stream"
              onChange={handleNameChange}
              value={name}
              disabled={isPending}
              minLength={3}
              maxLength={50}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              Miniatura
            </Label>
            
            {thumbnailUrl ? (
              <div className="relative group">
                <div className="relative aspect-video rounded-xl overflow-hidden border">
                  <Image
                    src={thumbnailUrl}
                    alt="Miniatura del stream"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={false}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                  onClick={removeThumbnail}
                  disabled={isPending || isDeletingThumbnail}
                >
                  <Trash className="w-4 h-4" />
                  {isDeletingThumbnail ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                </Button>
              </div>
            ) : (
              <div className="relative rounded-xl border-2 border-dashed border-muted">
                <UploadDropzone
                  endpoint="thumbnailUploader"
                  appearance={{
                    label: { color: "#FFFFFF" },
                    allowedContent: { color: "#FFFFFF" },
                    uploadIcon: isUploading ? { display: "none" } : undefined,
                  }}
                  onClientUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  onUploadBegin={handleUploadStart}
                  config={{
                    mode: "auto",
                  }}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Subiendo miniatura...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-between gap-4 pt-4">
            <DialogClose ref={closeRef} asChild>
              <Button 
                type="button" 
                variant="ghost" 
                disabled={isPending || isUploading || isDeletingThumbnail}
                className="flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending || isUploading || isDeletingThumbnail || 
                       (name === initialName && thumbnailUrl === initialThumbnailUrl)}
              className="min-w-[100px] flex items-center gap-1"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Guardar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};