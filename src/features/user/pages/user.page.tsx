import {useLoaderData, useNavigation} from "react-router";
import type {IDetailUser} from "../../../types/user.type.ts";
import {UserTable} from "../../../components/tables/user.table.tsx";

export const UserPage = () => {
    const isLoading = useNavigation().state === "loading";
    const users = useLoaderData<IDetailUser[]>()
    return (
	<UserTable data={users} isLoading={isLoading}/>
    )
}