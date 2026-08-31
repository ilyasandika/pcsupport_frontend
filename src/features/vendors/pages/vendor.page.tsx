import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import type { IVendor } from "@/types/vendor.type.ts";
import { VendorTable } from "@/components/tables/vendor.table.tsx";

export const VendorPage = () => {
    const isLoading = useNavigation().state === "loading";
    const { vendors } = useLoaderData() as { vendors: IVendor[] };
    const revalidator = useRevalidator();

    return (
        <div className="space-y-6">
            <VendorTable
                data={vendors || []}
                isLoading={isLoading}
                onRefresh={() => revalidator.revalidate()}
            />
        </div>
    );
};
