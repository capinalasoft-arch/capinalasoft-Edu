from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    gibbon_db_host: str = "127.0.0.1"
    gibbon_db_port: int = 3306
    gibbon_db_name: str = "gibbon"
    gibbon_db_user: str = "gibbon"
    gibbon_db_password: str = ""

    api_key: str = "dev-api-key"
    cors_origins: str = "http://localhost,http://10.0.2.2"

    @property
    def sqlalchemy_url(self) -> str:
        # MySQL (PyMySQL)
        return (
            f"mysql+pymysql://{self.gibbon_db_user}:{self.gibbon_db_password}"
            f"@{self.gibbon_db_host}:{self.gibbon_db_port}/{self.gibbon_db_name}"
        )

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
