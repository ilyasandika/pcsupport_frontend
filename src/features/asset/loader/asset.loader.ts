import {AssetRepository} from "@/data/repositories/asset.repository.ts";
import type {LoaderFunctionArgs} from "react-router";
import {AssetCategoryRepository} from "@/data/repositories/asset-category.repository.ts";
import {ProjectRepository} from "@/data/repositories/project.repository.ts";

export const assetLoader = async () => {
    return await AssetRepository.getAssets();
}

export const assetDetailLoader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params as unknown as {id: string}
    return await AssetRepository.getAssetBySn(id)
}


export const assetFormLoader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params as unknown as {id: string}
    const [asset, categories, projects] = await Promise.all([
        id ? AssetRepository.getAssetBySn(id) : Promise.resolve(null),
        AssetCategoryRepository.getAll(),
        ProjectRepository.getAll()
    ]);
    return {asset, categories, projects}
}

