import { Maximize, Minimize } from "lucide-react";

import { Hint } from "../hint";
import { Button } from "../ui/button";

interface FullscreenControlProps {
    isFullscreen: boolean,
    onToggle: () => void;
};

export const FullscreenControl = ({
    isFullscreen,
    onToggle,
}: FullscreenControlProps) =>{
    const Icon = isFullscreen ? Maximize : Minimize;

    const label = isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"
    return(
        <div className=" flex items-center justify-center gap-4">
            <Hint label={label} asClild>
                <Button
                onClick={onToggle}
                className="text-white p-1.5 hover:bg-gray-600">
                    <Icon className="h-5 w-5"/>
                </Button>
            </Hint>

        </div>
    )
}