import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { renderAsync } from "docx-preview";
import { TemplateRepository } from "@/data/repositories/template.repository.ts";
import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";
import type { ITemplate } from "@/types/template.type.ts";

export const TemplatePreviewPage = () => {
    const { id } = useParams<{ id: string }>();
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [template, setTemplate] = useState<ITemplate | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        let isMounted = true;

        const loadAndRenderDocx = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const [templateData, blob] = await Promise.all([
                    TemplateRepository.getById(id).catch(() => null),
                    TemplateRepository.getDocumentBlob(id),
                ]);

                if (!isMounted) return;

                if (templateData) {
                    setTemplate(templateData);
                }

                if (containerRef.current) {
                    containerRef.current.innerHTML = "";
                    await renderAsync(blob, containerRef.current, undefined, {
                        className: "docx",
                        inWrapper: true,
                        ignoreWidth: false,
                        ignoreHeight: false,
                        debug: false,
                    });
                }
            } catch (err: any) {
                if (isMounted) {
                    console.error("Error rendering docx preview:", err);
                    setError(err?.message || "Failed to load document preview.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadAndRenderDocx();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleDownload = async () => {
        if (!id) return;
        const fileName = template?.filePath.split("/").pop()?.split("\\").pop();
        await TemplateRepository.downloadDocument(id, fileName);
    };

    const navigate = useNavigate()

    return (
        <div className="min-h-screen  flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-3 flex items-center justify-between shadow-xs rounded-lg">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft className="size-4 mr-1.5" /> Close Tab
                    </Button>
                    <div className="h-5 w-px bg-slate-300" />
                    <div className="flex items-center gap-2">
                        <FileText className="size-5 text-ptba-primary" />
                        <h1 className="font-semibold text-slate-800 text-sm md:text-base">
                            {template?.name || `Template Preview`}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="text-xs"
                    >
                        <Download className="size-3.5 mr-1.5" /> Download DOCX
                    </Button>
                </div>
            </header>

            {/* Content Container */}
            <main className="flex-1 p-4 md:p-8 flex justify-center overflow-auto">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center my-auto gap-3 text-slate-500 py-20">
                        <Loader2 className="size-8 animate-spin text-ptba-primary" />
                        <p className="text-sm font-medium">Loading DOCX preview...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center my-auto gap-3 text-red-500 py-20">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div
                    ref={containerRef}
                    className={`bg-white shadow-md rounded-lg max-w-4xl w-full p-4 md:p-8 min-h-[600px] ${isLoading || error ? "hidden" : "block"
                        }`}
                />
            </main>
        </div>
    );
};
