"""Slice 3: successful translate with LLM mocked at HTTP boundary."""

import httpx
from fastapi.testclient import TestClient

from app.config import Settings
from app.llm import build_translator
from app.main import create_app


def test_translate_returns_mocked_llm_response() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path.endswith("/chat/completions")
        return httpx.Response(
            200,
            json={"choices": [{"message": {"content": " Good morning "}}]},
        )

    transport = httpx.MockTransport(handler)
    http_client = httpx.Client(transport=transport)
    settings = Settings(
        llm_api_key="test-key",
        llm_base_url="https://api.example/v1",
        llm_model="test-model",
    )
    translator = build_translator(settings, client=http_client)
    client = TestClient(create_app(settings=settings, translator=translator))

    response = client.post("/translate", json={"text": "Bom dia"})
    assert response.status_code == 200
    assert response.json() == {"translation": "Good morning"}
