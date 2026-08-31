import { AssetCategoryRepository } from "@/data/repositories/asset-category.repository.ts";

export const assetCategoryPageLoader = async () => {
    const assetCategories = await AssetCategoryRepository.getAll();
    return { assetCategories };
};
