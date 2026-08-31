import { TemplateRepository } from "@/data/repositories/template.repository.ts";

export const templateLoader = async () => {
    const templates = await TemplateRepository.getAll();
    return { templates };
};
