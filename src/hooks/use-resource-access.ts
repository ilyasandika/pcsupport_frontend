import { useAuth } from "@/context/AuthContext.tsx";

export interface ICanAccessOptions {
	/**
	 * ID or NIK of the resource owner (e.g. ticket.engineer?.id, ticket.createdBy?.id)
	 */
	resourceOwnerId?: string | number | null;
	/**
	 * List of roles allowed to bypass the ownership check.
	 * Default: ['admin']
	 */
	bypassRoles?: string[];
}

export const useResourceAccess = () => {
	const { user } = useAuth();

	/**
	 * Checks whether the current user has access rights to a resource.
	 * Access is granted if:
	 * 1. The user's role is included in `bypassRoles` (e.g. 'admin')
	 * 2. OR the user's ID matches `resourceOwnerId`
	 */
	const canAccess = (options?: ICanAccessOptions): boolean => {
		if (!user) return false;

		const { resourceOwnerId, bypassRoles = ["admin"] } = options || {};

		// 1. Check Role Bypass (Case Insensitive)
		const userRole = user.role?.toLowerCase();
		if (userRole && bypassRoles.some((role) => role.toLowerCase() === userRole)) {
			return true;
		}

		// 2. Check Ownership Comparison
		// user.sub usually contains the User ID from the Auth token, fallback to user.id or user.nik
		const currentUserId = user.sub ?? (user as Record<string, any>).id ?? (user as Record<string, any>).nik;

		if (
			resourceOwnerId !== undefined &&
			resourceOwnerId !== null &&
			currentUserId !== undefined &&
			currentUserId !== null
		) {
			return String(currentUserId) === String(resourceOwnerId);
		}

		return false;
	};

	return { canAccess };
};
