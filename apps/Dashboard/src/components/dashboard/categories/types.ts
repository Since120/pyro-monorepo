// apps/dashboard/src/components/dashboard/categories/types.ts

export interface CategoryItem {
  id: string;
  name: string;
  createdAt?: Date;
  lastUsedAt?: Date | null;
  deletedInDiscord?: boolean;
}
