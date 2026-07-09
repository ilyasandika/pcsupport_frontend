import {AssetRepository} from "@/data/repositories/asset.repository.ts";
import type {LoaderFunctionArgs} from "react-router";

export const assetLoader = async () => {
    return await AssetRepository.getAssets();
}

export const assetDetailLoader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params as unknown as {id: string}
    return await AssetRepository.getAssetBySn(id)
}

