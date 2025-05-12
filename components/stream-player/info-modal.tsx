"use client";

import { useState, useTransition, useRef, ElementRef } from "react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";


import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateStream } from "@/actions/stream";
import { toast } from "sonner";

import { UploadDropzone } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";

interface InfoModalProps{
    initialName: string;
    initialThumbnailUrl: string | null;
};

export const InfoModal = ({
    initialName,
    initialThumbnailUrl,
} : InfoModalProps) => {
    const router = useRouter();

    const closeRef = useRef<ElementRef<"button">>(null);
    const [isPending, startTransition] = useTransition();
    const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);
    const [name, setName] = useState(initialName);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(() => {
            updateStream({name: name})
            .then(() => {toast.success("Se ha cambiado el nombre del stream correctamente!");
                closeRef?.current?.click();
            })
            .catch(() => toast.error("No se pudo cambiar el nombre del Stream"))
        })
    }

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className="ml-auto">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Editar informacion del stream
                    </DialogTitle>
                </DialogHeader>
                <form 
                onSubmit={onSubmit}
                className="space-y-14">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input 
                        placeholder="Nombre del Stream"
                        onChange={onChange}
                        value={name}
                        disabled={false}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Thumbnail
                        </Label>
                        <div className="rounded-xl border outline-dashed outline-muted">
                            <UploadDropzone
                            endpoint="thumbnailUploader"
                            appearance={{
                                label:{
                                    color : "#FFFFFF"
                                },
                                allowedContent: {
                                    color: "#FFFFFF"
                                }
                            }}
                            onClientUploadComplete={(res) => {
                                setThumbnailUrl(res?.[0]?.url);
                                router.refresh();
                            }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <DialogClose ref={closeRef} asChild>
                            <Button type="button" variant="ghost">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                        type="submit"
                        disabled={isPending}
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}