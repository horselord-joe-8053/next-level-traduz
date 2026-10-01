"""OpenAI-compatible chat completions client (HTTP boundary for tests)."""

from typing import Protocol

import httpx

from app.config import Settings


class Translator(Protocol):
    def translate(self, text: str) -> str: ...


class OpenAICompatibleTranslator:
    """Calls POST {base_url}/chat/completions with a PT-BR → EN system prompt."""

    def __init__(self, settings: Settings, client: httpx.Client | None = None) -> None:
        self._settings = settings
        self._client = client or httpx.Client(timeout=60.0)

    def translate(self, text: str) -> str:
        if not self._settings.llm_api_key:
            raise RuntimeError("LLM_API_KEY is not configured")

        base = self._settings.llm_base_url.rstrip("/")
        url = f"{base}/chat/completions"
        payload = {
            "model": self._settings.llm_model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You translate Brazilian Portuguese to English. "
                        "Reply with only the English translation, no explanation."
                    ),
                },
                {"role": "user", "content": text},
            ],
        }
        headers = {
            "Authorization": f"Bearer {self._settings.llm_api_key}",
            "Content-Type": "application/json",
        }
        response = self._client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()


def build_translator(
    settings: Settings,
    client: httpx.Client | None = None,
) -> OpenAICompatibleTranslator:
    return OpenAICompatibleTranslator(settings, client=client)
