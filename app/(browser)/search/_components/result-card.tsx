import { VerifiedMark } from "@/components/stream-player/verified-mark";
import { Thumbnail } from "@/components/thumbnail";
import { Stream, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { es } from 'date-fns/locale'; // Importa el locale español

// ...
import Link from "next/link";

interface ResultCardProps {
  data: Stream & { user: User };
}

export const ResultCard = ({ data }: ResultCardProps) => {
  return (
    <Link href={`/${data.user.username}`} className="group">
      <div className="w-full flex gap-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
        <div className="relative h-[9rem] w-[16rem] rounded-md overflow-hidden">
          <Thumbnail
            src={data.thumbnailUrl}
            fallback={data.user.imageUrl}
            isLive={data.isLive}
            username={data.user.username}
          />
          {data.isLive && (
            <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-md">
              EN VIVO
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-x-2">
              <p className="font-bold text-lg group-hover:text-primary transition-colors">
                {data.user.username}
              </p>
              <VerifiedMark />
            </div>
            
            <p className="text-sm font-medium line-clamp-2">
              {data.name}
            </p>
            <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                <span>
                    Actualizado {formatDistanceToNow(new Date(data.updatedAt), { 
                    addSuffix: true,
                    locale: es // Añade el locale español
                    })}
                </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};