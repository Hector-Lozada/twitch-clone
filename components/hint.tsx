import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface HintProps {
    label: string;
    children: React.ReactNode;
    asClild?: boolean;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
};

export const Hint = ({ label, children, asClild, side, align }: HintProps) => {
    return(
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild={asClild}>

                    {children}
                </TooltipTrigger>
                <TooltipContent className="text-black bg-white" side={side} align={align}>
                    <p className="font-semibold">
                        {label}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

