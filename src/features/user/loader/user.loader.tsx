import {UserRepository} from "@/data/repositories/user.repository.ts";
import type {LoaderFunctionArgs} from "react-router";
import {WorkLocationRepository} from "@/data/repositories/work-location.repository.ts";

export const userLoader = async () => {
    return await UserRepository.getUsers()
}

export const userDetailLoader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params as unknown as {id: number}
    return await UserRepository.getUserById(id)
}

export const userFormLoader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params
    const [workLocations, user] = await Promise.all([
        await WorkLocationRepository.getAll(),
        id ? await UserRepository.getUserById(Number(id)) : Promise.resolve(null),
    ]);
    return {user, workLocations}
}
