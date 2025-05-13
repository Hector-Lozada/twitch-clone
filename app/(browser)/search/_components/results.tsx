import { getSearch } from "@/lib/search-service";
import { ResultCard } from "./result-card";

interface ResultsProps {
    term?: string;
};

export const Results = async ({
    term,
} : ResultsProps) => {

    const data = await getSearch(term);

    return(
        <div>
            <h2 className="text-lg font-semibold mb-4">
                Resultados encontrados para &quot;{term}&quot;
            </h2>
            {data.length === 0 && (
                <p className="text-muted-foreground text-sm">
                    No hay resultados, por favor intente más tarde
                </p>
            )}
            <div className=" flex flex-col gap-y-4">
                {data.map((result) => (
                    <ResultCard data={result} key={result.id} />
                ))}
            </div>
        </div>
    )
};

export const ResultsSkeleton = () =>{
    return (
        <div>

        </div>
    )
}