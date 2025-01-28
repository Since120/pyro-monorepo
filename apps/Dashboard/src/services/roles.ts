// apps/Dashboard/src/services/roles.ts
import { request } from "./http";

/** Liest die Rollen via GET /roles */
export function getRoles() {
	return request("roles");
}
