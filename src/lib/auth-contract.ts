export interface RegisterPayloadInput {
  name: string;
  email: string;
  password: string;
  photoURL: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getApiOrigin(configuredUrl?: string): string {
  const rawUrl = configuredUrl?.trim() || "http://localhost:5000";
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_API_URL must be an absolute backend URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_API_URL must use HTTP or HTTPS.");
  }

  return url.origin;
}

export function getApiBaseUrl(
  configuredUrl: string | undefined,
  isBrowser: boolean,
): string {
  if (isBrowser) return "/api";
  return `${getApiOrigin(configuredUrl)}/api`;
}

export function createRegisterPayload(input: RegisterPayloadInput) {
  return {
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    password: input.password,
    photoURL: input.photoURL.trim(),
  };
}

export function createLoginPayload(email: string, password: string) {
  return { email: normalizeEmail(email), password };
}

export function createGooglePayload(credential: string) {
  return { credential };
}

export function isUnauthorizedStatus(status: number | undefined): boolean {
  return status === 401;
}
