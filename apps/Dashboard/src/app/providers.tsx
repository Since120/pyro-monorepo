// apps/dashboard/src/app/providers.tsx
"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

// Wir nehmen children als Prop,
// um sie in <SessionProvider> zu wrappen.
export function Providers({ children }: { children: React.ReactNode }) {
	return <SessionProvider>{children}</SessionProvider>;
}
