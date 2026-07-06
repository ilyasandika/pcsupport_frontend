import {UserRepository} from "../../../data/repositories/user.repository.ts";
import type {LoaderFunctionArgs} from "react-router";

export const userLoader = async () => {
    return await UserRepository.getUsers()
}

export const userDetailLoader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params as unknown as {id: number}
    return await UserRepository.getUserById(id)
}
