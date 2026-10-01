"""Traduz HTTP API."""

from functools import lru_cache

import httpx
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.config import Settings, get_settings
from app.llm import Translator, build_translator

MAX_INPUT_CHARS = 5000


class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=MAX_INPUT_CHARS)


class TranslateResponse(BaseModel):
    translation: str


@lru_cache
def _cached_settings() -> Settings:
    return get_settings()


def get_translator(settings: Settings = Depends(_cached_settings)) -> Translator:
    return build_translator(settings)


def create_app(
    *,
    settings: Settings | None = None,
    translator: Translator | None = None,
) -> FastAPI:
    app = FastAPI(title="Traduz API")
    cfg = settings or get_settings()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=cfg.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    if translator is not None:
        app.dependency_overrides[get_translator] = lambda: translator

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.post("/translate", response_model=TranslateResponse)
    def translate(
        body: TranslateRequest,
        translator: Translator = Depends(get_translator),
    ) -> TranslateResponse:
        try:
            translation = translator.translate(body.text)
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail="Translation provider error") from exc

        return TranslateResponse(translation=translation)

    return app


app = create_app()
