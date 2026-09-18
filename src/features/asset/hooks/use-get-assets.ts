import {useQuery} from "@tanstack/react-query";
import {AssetRepository} from "@/data/repositories/asset.repository.ts";
import {AssetStatus, type IAssetFilter} from "@/types/asset.type.ts";

export const useGetAssets = (filter?: IAssetFilter) => {
    return useQuery({
	queryKey: ['assets', filter],
	queryFn: () => AssetRepository.getAssets(filter),
    })
};

export const useGetBackupAssets = (filter?: IAssetFilter) => {
    return useGetAssets({
	...filter,
	status: [AssetStatus.Backup]
    })
}