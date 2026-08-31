import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import type { ITemplate } from "@/types/template.type.ts";
import { TemplateTable } from "@/components/tables/template.table.tsx";

export const TemplatePage = () => {
    const isLoading = useNavigation().state === "loading";
    const { templates } = useLoaderData() as { templates: ITemplate[] };
    const revalidator = useRevalidator();

    return (
        <div className="space-y-6">
            <TemplateTable
                data={templates || []}
                isLoading={isLoading}
                onRefresh={() => revalidator.revalidate()}
            />
        </div>
    );
};
