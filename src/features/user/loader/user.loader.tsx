import {UserRepository} from "../../../data/repositories/user.repository.ts";

export const userLoader = async () => {
    return await UserRepository.getUsers()
}