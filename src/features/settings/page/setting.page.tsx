import { WorkLocationTable } from "@/components/tables/work-location.table.tsx";
import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import { SlaPolicyTable } from "@/components/tables/sla.table.tsx";
import { AssetCategoryTable } from "@/components/tables/asset-category.table.tsx";
import { VendorTable } from "@/components/tables/vendor.table.tsx";
import { ProjectTable } from "@/components/tables/project.table.tsx";
import { TemplateTable } from "@/components/tables/template.table.tsx";

export const SettingPage = () => {
	const { workLocations, slas, assetCategories, vendors, projects, templates } = useLoaderData();
	const isLoading = useNavigation().state === "loading";
	const revalidator = useRevalidator();

	return (
		<div className="grid grid-cols-1 gap-8">
			<WorkLocationTable data={workLocations} isLoading={isLoading} onRefresh={() => revalidator.revalidate()} />
			<SlaPolicyTable data={slas} isLoading={isLoading} onRefresh={() => revalidator.revalidate()} />
			<AssetCategoryTable data={assetCategories} isLoading={isLoading} onRefresh={() => revalidator.revalidate()} />
			<VendorTable data={vendors} isLoading={isLoading} onRefresh={() => revalidator.revalidate()} />
			<ProjectTable data={projects} vendors={vendors} isLoading={isLoading} onRefresh={() => revalidator.revalidate()} />
			<TemplateTable data={templates} isLoading={isLoading} onRefresh={() => revalidator.revalidate()} />
		</div>
	)
}