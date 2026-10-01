"""Slice 2: POST /translate validation (no LLM call)."""

from fastapi.testclient import TestClient

from app.main import create_app


def test_translate_rejects_empty_text() -> None:
    client = TestClient(create_app())
    response = client.post("/translate", json={"text": ""})
    assert response.status_code == 422


def test_translate_rejects_text_over_5000_chars() -> None:
    client = TestClient(create_app())
    response = client.post("/translate", json={"text": "a" * 5001})
    assert response.status_code == 422
