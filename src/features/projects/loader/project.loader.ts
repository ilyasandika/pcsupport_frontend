import { ProjectRepository } from "@/data/repositories/project.repository.ts";
import { VendorRepository } from "@/data/repositories/vendor.repository.ts";

export const projectLoader = async () => {
    const [projects, vendors] = await Promise.all([
        ProjectRepository.getAll(),
        VendorRepository.getAll(),
    ]);
    return { projects, vendors };
};
