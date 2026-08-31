
import { type ITemplate, type ITemplateRepository, type IUploadTemplatePayload } from "@/types/template.type.ts";
import api from "../api/interceptors.ts";


const templateApi: ITemplateRepository = {
	getAll: async (): Promise<ITemplate[]> => {
		const res = await api.get('/templates');
		return res.data;
	},
	getById: async (id: number | string): Promise<ITemplate> => {
		const res = await api.get(`/templates/${id}`);
		return res.data;
	},
	upload: async (payload: IUploadTemplatePayload): Promise<ITemplate> => {
		const formData = new FormData();
		formData.append('type', payload.type);
		if (payload.description) {
			formData.append('description', payload.description);
		}
		formData.append('file', payload.file);

		const res = await api.post('/templates', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return res.data;
	},
	remove: async (id: number | string) => {
		return await api.delete(`/templates/${id}`);
	},
	downloadDocument: async (id: number | string, fileName?: string) => {
		const response = await api.get(`/templates/${id}/download`, {
			responseType: 'blob',
		});
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', fileName || `template-${id}.docx`);
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(url);
	},
	getDocumentBlob: async (id: number | string): Promise<Blob> => {
		const res: any = await api.get(`/templates/${id}/download`, {
			responseType: 'blob',
		});
		const blobData = res.data ? res.data : res;
		console.log(res)
		return blobData instanceof Blob ? blobData : new Blob([blobData]);
	}
}


const createTemplateRepository = () => {
	return templateApi
};

export const TemplateRepository = createTemplateRepository();