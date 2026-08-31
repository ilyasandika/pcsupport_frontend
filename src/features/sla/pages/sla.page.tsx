import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import type { ISlaPolicy } from "@/types/sla.type.ts";
import { SlaPolicyTable } from "@/components/tables/sla.table.tsx";

export const SlaPage = () => {
    const isLoading = useNavigation().state === "loading";
    const { slas } = useLoaderData() as { slas: ISlaPolicy[] };
    const revalidator = useRevalidator();

    return (
        <div className="space-y-6">
            <SlaPolicyTable
                data={slas || []}
                isLoading={isLoading}
                onRefresh={() => revalidator.revalidate()}
            />
        </div>
    );
};
