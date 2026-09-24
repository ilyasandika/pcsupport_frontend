import {useQuery} from "@tanstack/react-query";
import {UserRepository} from "@/data/repositories/user.repository.ts";

export const useGetSupervisors = () => {
    return useQuery({
	queryKey: ['supervisors'],
	queryFn: () => UserRepository.getSupervisors(),
    })
};