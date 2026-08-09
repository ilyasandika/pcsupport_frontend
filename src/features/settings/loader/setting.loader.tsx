import {WorkLocationRepository} from "@/data/repositories/work-location.repository.ts";
import {SlaPolicyRepository} from "@/data/repositories/sla-policy.repository.ts";
import {AssetCategoryRepository} from "@/data/repositories/asset-category.repository.ts";
import {VendorRepository} from "@/data/repositories/vendor.repository.ts";
import {ProjectRepository} from "@/data/repositories/project.repository.ts";
import {TemplateRepository} from "@/data/repositories/template.repository.ts";

export const settingLoader = async () => {
    const [workLocations, slas, assetCategories, vendors, projects, templates] = await Promise.all([
	await WorkLocationRepository.getAll(),
	await SlaPolicyRepository.getAll(),
	await AssetCategoryRepository.getAll(),
	await VendorRepository.getAll(),
	await ProjectRepository.getAll(),
	await TemplateRepository.getAll(),
    ])
    return {workLocations, slas, assetCategories, vendors, projects, templates}
}