import {WorkLocationTable} from "@/components/tables/work-location.table.tsx";
import {useLoaderData, useNavigation} from "react-router";
import {SlaPolicyTable} from "@/components/tables/sla.table.tsx";
import {AssetCategoryTable} from "@/components/tables/asset-category.table.tsx";
import {VendorTable} from "@/components/tables/vendor.table.tsx";
import {ProjectTable} from "@/components/tables/project.table.tsx";
import {TemplateTable} from "@/components/tables/template.table.tsx";

export const SettingPage = () => {
    const {workLocations, slas, assetCategories, vendors, projects, templates} = useLoaderData()
    const isLoading = useNavigation().state === "loading";
    console.log(workLocations, slas, assetCategories)
    return (
	<div className="grid grid-cols-1 gap-8">
	    <WorkLocationTable data={workLocations} isLoading={isLoading}/>
	    <SlaPolicyTable data={slas} isLoading={isLoading}/>
	    <AssetCategoryTable data={assetCategories} isLoading={isLoading}/>
	    <VendorTable data={vendors} isLoading={isLoading}/>
	    <ProjectTable data={projects} isLoading={isLoading}/>
	    <TemplateTable data={templates} isLoading={isLoading}/>
	</div>
    )

}