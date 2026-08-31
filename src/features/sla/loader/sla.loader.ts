import { SlaPolicyRepository } from "@/data/repositories/sla-policy.repository.ts";

export const slaLoader = async () => {
    const slas = await SlaPolicyRepository.getAll();
    return { slas };
};
