export interface RegisterPayloadInput {
  name: string;
  email: string;
  password: string;
  photoURL: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getApiBaseUrl(configuredUrl?: string): string {
  const rawUrl = configuredUrl?.trim() || "http://localhost:5000";
  const normalizedUrl = rawUrl.replace(/\/+$/, "");

  return /\/api$/i.test(normalizedUrl)
    ? normalizedUrl
    : `${normalizedUrl}/api`;
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
