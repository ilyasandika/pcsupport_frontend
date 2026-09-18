import {useQuery} from "@tanstack/react-query";
import {AssetCategoryRepository} from "@/data/repositories/asset-category.repository.ts";

export const useGetAssetCategories = () => {
    return useQuery({
	queryKey: ['asset-categories'],
	queryFn: () => AssetCategoryRepository.getAll(),
    });
};