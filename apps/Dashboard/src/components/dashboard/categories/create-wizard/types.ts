// apps/Dashboard/src/components/dashboard/categories/create-wizard/types.ts

export interface CategoryFormData {
	categoryType: string; // z. B. "employees" | "freelancers" etc.
	name: string;
	tags: string[];
	isVisible: boolean;
	trackingActive: boolean;
	sendSetup: boolean;
}
