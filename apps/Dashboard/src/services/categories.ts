// apps/Dashboard/src/services/categories.ts
import { request } from "./http"; // <-- aus deinem http.ts

/** Restore-Funktion für eine Kategorie (PATCH /categories/restore/:id) */
export function restoreCategory(categoryId: string) {
	return request(`categories/restore/${categoryId}`, {
		method: "PATCH",
	});
}

/** Update einer Kategorie via PATCH /categories/:id */
export function updateCategory(categoryId: string, payload: any) {
	return request(`categories/${categoryId}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
}

/** Löscht eine Kategorie via DELETE /categories/:id */
export function deleteCategory(categoryId: string) {
	return request(`categories/${categoryId}`, {
		method: "DELETE",
	});
}

/** Erstellt eine Kategorie via POST /categories */
export function createCategory(payload: any) {
	return request("categories", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
}

export function getCategories() {
	return request("categories"); // GET /categories
}


export async function deleteCategoryHard(id: string) {
	  return request(`categories/${id}/hard`, {
	    method: "DELETE",
	  });
	}