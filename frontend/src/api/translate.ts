/** Calls Traduz backend only (never the LLM provider directly). */

const defaultBase =
  typeof import.meta.env.VITE_API_BASE_URL === "string"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://127.0.0.1:8000";

export function getApiBaseUrl(): string {
  return defaultBase.replace(/\/$/, "");
}

export type TranslateResult =
  | { ok: true; translation: string }
  | { ok: false; message: string };

export async function translateText(
  text: string,
  fetchImpl: typeof fetch = fetch,
  baseUrl: string = getApiBaseUrl(),
): Promise<TranslateResult> {
  let response: Response;
  try {
    response = await fetchImpl(`${baseUrl}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {
    return { ok: false, message: "Could not reach the translation service." };
  }

  if (!response.ok) {
    let message = "Translation failed.";
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body.detail === "string") {
        message = body.detail;
      }
    } catch {
      /* keep default */
    }
    return { ok: false, message };
  }

  const data = (await response.json()) as { translation?: string };
  if (typeof data.translation !== "string") {
    return { ok: false, message: "Unexpected response from server." };
  }
  return { ok: true, translation: data.translation };
}
