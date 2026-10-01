"""Server-side configuration (LLM credentials never exposed to the browser)."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    llm_api_key: str = ""
    llm_base_url: str = "https://api.openai.com/v1"
    llm_model: str = "gpt-4o-mini"
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]


def get_settings() -> Settings:
    return Settings()
