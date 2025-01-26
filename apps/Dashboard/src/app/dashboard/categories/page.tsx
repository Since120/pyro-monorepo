import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoriesView } from "@/components/dashboard/categories/categories-view";
import type { CategoryItem } from "@/components/dashboard/categories/types";

export const metadata: Metadata = {
  title: "Categories | Dashboard",
};

// Lade Kategorien aus der DB
async function loadAllCategories(): Promise<CategoryItem[]> {
  // 1) Prisma: Alle Category-Einträge
  const dbCats = await prisma.category.findMany({
    // Optional könntest du hier "select" setzen, wenn du nur bestimmte Spalten brauchst
    // select: { id: true, name: true, deletedInDiscord: true, ... }
  });

  // 2) Auf dein "CategoryItem" mappen
  const catItems = dbCats.map((cat) => {
    return {
      id: cat.id,
      name: cat.name,

      // Falls du "lastUsage" in der DB hast => lastUsedAt
      lastUsedAt: cat.lastUsage ?? null,

      // Falls du "createdAt" in der DB hast => createdAt
      createdAt: cat.createdAt ?? undefined,

      // WICHTIG:deletedInDiscord => highlight
      deletedInDiscord: cat.deletedInDiscord ?? false,
    } as CategoryItem;
  });

  return catItems;
}

// Deine (Server) Page-Component
export default async function Page() {
  const categories = await loadAllCategories();

  // Hier kriegt <CategoriesView> das Feld "deletedInDiscord"
  // und kann es in sidebar-list.tsx rot hervorheben.
  return (
    <CategoriesView categories={categories} />
  );
}
