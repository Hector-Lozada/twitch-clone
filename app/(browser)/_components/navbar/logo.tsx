import Image from "next/image";
import { Poppins } from "next/font/google";
import Link from "next/link";

import { cn } from "@/lib/utils";


const font = Poppins({
    subsets: ["latin"],
    weight: ["200", "300" ,"400", "600", "700", "800", "900"],
});

export const Logo = () => {
    return (
        <Link href="/">
            <div className=" flex  items-center gap-x-4 hover:opacity-75 transition">
                <div className="bg-white rounded-full p-1 mr-12 shrink-0 lg:mr-0 lg:shrink">
                    <Image
                    src="/unnamed.svg"
                    alt="Logo"
                    height="32"
                    width="32"/>
                </div>
            </div>
        </Link>

    );
};