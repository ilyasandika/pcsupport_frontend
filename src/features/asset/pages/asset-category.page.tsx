import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import type { IAssetCategory } from "@/types/asset-category.type.ts";
import { AssetCategoryTable } from "@/components/tables/asset-category.table.tsx";

export const AssetCategoryPage = () => {
    const isLoading = useNavigation().state === "loading";
    const { assetCategories } = useLoaderData() as { assetCategories: IAssetCategory[] };
    const revalidator = useRevalidator();

    return (
        <div className="space-y-6">
            <AssetCategoryTable
                data={assetCategories || []}
                isLoading={isLoading}
                onRefresh={() => revalidator.revalidate()}
            />
        </div>
    );
};
