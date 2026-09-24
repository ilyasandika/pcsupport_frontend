import {useQuery} from "@tanstack/react-query";
import {AssetRepository} from "@/data/repositories/asset.repository.ts";

export const useGetAssetDetail = (assetTag: string) => {
    return useQuery({
	queryKey: ['asset', 'detail', assetTag],
	queryFn: async () => await AssetRepository.getAssetByAssetTag(assetTag),
    })
};