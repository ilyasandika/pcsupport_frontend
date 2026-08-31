import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import type { IDetailWorkLocation } from "@/types/work-location.type.ts";
import { WorkLocationTable } from "@/components/tables/work-location.table.tsx";

export const LocationPage = () => {
    const isLoading = useNavigation().state === "loading";
    const { locations } = useLoaderData() as { locations: IDetailWorkLocation[] };
    const revalidator = useRevalidator();

    return (
        <div className="space-y-6">
            <WorkLocationTable
                data={locations || []}
                isLoading={isLoading}
                onRefresh={() => revalidator.revalidate()}
            />
        </div>
    );
};
