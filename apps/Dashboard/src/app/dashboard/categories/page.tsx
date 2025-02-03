// apps/dashboard/src/app/dashboard/categories/page.tsx

import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { CategoriesView } from "@/components/dashboard/categories/categories-view";
import type { CategoryItem } from "@/components/dashboard/categories/types";

export const metadata: Metadata = {
	title: "Categories | Dashboard",
};

// Hilfsfunktion: KEIN default export
async function loadAllCategories(): Promise<CategoryItem[]> {
	// Hier der "select" => so weiß TS, dass 'deletedInDiscord' existiert
	const dbCats = await prisma.category.findMany({
		select: {
			id: true,
			name: true,
			deletedInDiscord: true,
			// ... sonstige Felder
		},
	});

	// Mapping => CategoryItem
	return dbCats.map((cat) => ({
		id: cat.id,
		name: cat.name,
		deletedInDiscord: cat.deletedInDiscord ?? false,
		// z. B. ...
		// createdAt: cat.createdAt,
		// lastUsedAt: cat.lastUsage ?? null,
	}));
}

// "default export" => Next.js Page
export default async function Page() {
	const categories = await loadAllCategories();
	return <CategoriesView categories={categories} />;
}
