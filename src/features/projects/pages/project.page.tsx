import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import type { IProject } from "@/types/project.type.ts";
import type { IVendor } from "@/types/vendor.type.ts";
import { ProjectTable } from "@/components/tables/project.table.tsx";

export const ProjectPage = () => {
    const isLoading = useNavigation().state === "loading";
    const { projects, vendors } = useLoaderData() as { projects: IProject[]; vendors: IVendor[] };
    const revalidator = useRevalidator();

    return (
        <div className="space-y-6">
            <ProjectTable
                data={projects || []}
                vendors={vendors || []}
                isLoading={isLoading}
                onRefresh={() => revalidator.revalidate()}
            />
        </div>
    );
};
