// apps/Dashboard/src/services/http.ts

/**
 * request(path, options?)
 *  - Baut die baseUrl + path zusammen
 *  - führt fetch() aus
 *  - checkt den .ok-Status
 *  - parst JSON
 *  - wirft bei Fehlern eine Error-Exception (die du abfangen kannst)
 */
export async function request(path: string, options: RequestInit = {}): Promise<any> {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL; // z.B. "http://localhost:3004" oder Prod-URL
	const url = `${baseUrl}/${path}`;

	const response = await fetch(url, {
		// Standard-Method = GET
		method: options.method ?? "GET",
		...options,
	});

	// Fehlermeldung extrahieren
	if (!response.ok) {
		// Versuchen, JSON zu parsen (kann schiefgehen)
		let errorBody: any = null;
		try {
			errorBody = await response.json();
		} catch (err) {
			/* ignore parse error */
		}

		const msg = errorBody?.message || errorBody?.error || response.statusText || "API Error";

		// Wir werfen einen richtigen Error in JS
		throw new Error(msg);
	}

	// Erfolg => JSON zurückgeben
	return response.json();
}
