import type { IDetailUser, IUserRepository, ICreateUserDTO, IUpdateUserDTO, ISyncUserTagsDTO } from "@/types/user.type.ts";
import api from "../api/interceptors.ts";

const userApi: IUserRepository = {
	getUsers: async (): Promise<IDetailUser[]> => {
		const user = await api.get('users')
		return user.data
	},
	getUserById: async (id: number): Promise<IDetailUser> => {
		const res = await api.get(`users/${id}`)
		return res.data
	},
	getEngineers: async (): Promise<IDetailUser[]> => {
		const res = await api.get('users/engineers')
		return res.data
	},
	getSupervisors: async (): Promise<IDetailUser[]> => {
		const res = await api.get('users/supervisors')
		return res.data
	},
	createUser: async (data: ICreateUserDTO): Promise<void> => {
		const res = await api.post('users', data)
		return res.data
	},
	updateUser: async (id: number, data: IUpdateUserDTO): Promise<void> => {
		const res = await api.patch(`users/${id}`, data)
		return res.data
	},
	toggleUserStatus: async (id: number): Promise<void> => {
		try {
			const res = await api.patch(`users/${id}/status`);
			return res.data;
		} catch (error) {
			try {
				const res = await api.patch(`users/${id}/toggle-status`);
				return res.data;
			} catch {
				const currentUser = await userApi.getUserById(id);
				const res = await api.patch(`users/${id}`, { active: !currentUser.active });
				return res.data;
			}
		}
	},
	activateUser: async (id: number): Promise<void> => {
		const res = await api.patch(`users/${id}/activate`);
		return res.data;
	},
	deactivateUser: async (id: number): Promise<void> => {
		const res = await api.patch(`users/${id}/deactivate`);
		return res.data;
	},
	setActiveStatus: async (id: number, active: boolean): Promise<void> => {
		const res = await api.patch(`users/${id}/status`, { active });
		return res.data;
	},
	deleteUser: async (id: number): Promise<void> => {
		const res = await api.delete(`users/${id}`)
		return res.data
	},
	changePassword: async (id: number, oldPassword: string, newPassword: string) => {
		try {
			const res = await api.patch(`users/password/${id}`, {
				oldPassword,
				newPassword
			})
			return res.data
		} catch (e) {
			throw e
		}
	},
	uploadSignature: async (id: number, file: File): Promise<void> => {
		const formData = new FormData();
		formData.append('file', file);
		const res = await api.post(`users/${id}/signature`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return res.data;
	},
	viewSignature: async (id: number): Promise<void> => {
		try {
			const res = await api.get(`users/${id}/signature`, {
				responseType: 'blob',
			});

			const blob = res instanceof Blob
				? res
				: new Blob([res.data], { type: (res.headers?.['content-type'] as string) || 'image/png' });
			const blobUrl = URL.createObjectURL(blob);
			window.open(blobUrl, '_blank');
		} catch (error) {
			console.error('Error fetching signature:', error);
		}
	},
	deleteSignature: async (id: number): Promise<void> => {
		const res = await api.delete(`users/${id}/signature`);
		return res.data;
	},
	syncUserTags: async (id: number, dto?: ISyncUserTagsDTO): Promise<IDetailUser> => {
		const res = await api.post(`users/${id}/sync-tags`, dto);
		return res.data;
	},
}

const createAssetRepository = () => {
	return userApi;
};

export const UserRepository = createAssetRepository();
