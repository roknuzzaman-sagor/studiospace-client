import axios from "axios";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
