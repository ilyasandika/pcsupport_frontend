import { WorkLocationRepository } from "@/data/repositories/work-location.repository.ts";

export const locationLoader = async () => {
    const locations = await WorkLocationRepository.getAll();
    return { locations };
};
