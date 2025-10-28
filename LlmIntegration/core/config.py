from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    MODEL_NAME: str = "gpt-4o-mini"
    GEMINI_API_KEY: str | None = None

    TIMEOUT_S: int = 60
    MAX_TOKENS: int = 2048

    ALLOWLIST_HOSTS: list[str] = []
    SHARED_SECRET: str = "dev-shared-secret"
    LOG_LEVEL: str = "INFO"

    OTEL_EXPORTER_OTLP_ENDPOINT: str | None = None
    OTEL_SERVICE_NAME: str = "llm-quiz-service"

    def __init__(self, **data):
        super().__init__(**data)
        if isinstance(self.ALLOWLIST_HOSTS, str):
            self.ALLOWLIST_HOSTS = [
                x.strip() for x in self.ALLOWLIST_HOSTS.split(",") if x.strip()
            ]

settings = Settings()
