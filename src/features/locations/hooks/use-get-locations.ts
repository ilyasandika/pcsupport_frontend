import {useQuery} from "@tanstack/react-query";
import {WorkLocationRepository} from "@/data/repositories/work-location.repository.ts";

export const useGetLocations = () => {
    return useQuery({
	queryKey: ['work-locations'],
	queryFn: () => WorkLocationRepository.getAll(),
    });
};