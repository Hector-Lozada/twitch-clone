import { getStreams } from "@/lib/feed-service"
import { ResultCard } from "./result-card";
import { Skeleton } from "@/components/ui/skeleton";

export const Results = async () => {

    const data = await getStreams();

    return(
        <div>
            <h2 className="text-lg font-semibold mb-4">
                Transmisiones que creemos que te gustarán
            </h2>
            {data.length === 0 && (
                <div className="text-muted-foreground text-sm">
                    No se encuentran los streams .
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {data.map((result) => (
                    <ResultCard 
                    key={result.id}
                    data={result}
                    />
                ))}
            </div>
        </div>
    )
}
export const ResultsSkeleton = () => {
    return (
        <div className="p-4 border rounded shadow-sm">
            <Skeleton className="h-40 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
};
