import {AssetTable} from "../../../components/tables/asset.table.tsx";
import type {IDetailAsset} from "../../../types/asset.type.ts";
import {useLoaderData, useNavigation} from "react-router";

export const AssetPage = () => {
    const assets = useLoaderData<IDetailAsset[]>();
    const isLoading = useNavigation().state === "loading";

    return (<AssetTable data={assets} isLoading={isLoading}/>)
}