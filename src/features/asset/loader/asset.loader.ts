import {AssetRepository} from "../../../data/repositories/asset.repository.ts";

export const assetLoader = async () => {
    return await AssetRepository.getAssets();
}