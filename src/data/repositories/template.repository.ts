import {delay} from "../../helper/helper.tsx";
import type {ITemplate, ITemplateRepository, IUploadTemplatePayload} from "@/types/template.type.ts";
import api from "../api/interceptors.ts";


const templateLocal: ITemplateRepository = {
    getAll: async (): Promise<ITemplate[]> => {
	await delay();
	console.log('masukLocal')
	return [] as ITemplate[];
    },
    getById: async (id: number | string): Promise<ITemplate> => {
	await delay();
	console.log('masukLocal', id)
	return {} as ITemplate;
    },
    upload: async (payload: IUploadTemplatePayload): Promise<ITemplate> => {
	await delay();
	console.log('masukLocal', payload)
	return {} as ITemplate;
    },
    remove: async (id: number | string) => {
	await delay();
	console.log('masukLocal', id)
    }
}


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
    }
}


const createTemplateRepository = () => {

    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? templateApi : templateLocal;
};

export const TemplateRepository = createTemplateRepository();