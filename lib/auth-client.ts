import { createAuthClient } from "better-auth/react";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
if (!appUrl && typeof window === "undefined") {
  throw new Error("NEXT_PUBLIC_APP_URL environment variable is required");
}

export const authClient = createAuthClient({
  baseURL: appUrl ?? window.location.origin,
});

export const { signIn, signUp, signOut, useSession } = authClient;
