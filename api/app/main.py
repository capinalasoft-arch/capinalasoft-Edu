from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .db import engine
from .models import GibbonInfo, Health, Staff, Student
from .queries import get_gibbon_version, list_staff, list_students, ping_db
from .security import require_api_key
from .settings import settings

app = FastAPI(title="Gibbon REST API (MVP)", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=Health)
def health() -> Health:
    db_ok = ping_db(engine)
    version = get_gibbon_version(engine) if db_ok else None
    return Health(ok=True, db=db_ok, gibbonVersion=version)


@app.get(
    "/gibbon/info",
    response_model=GibbonInfo,
    dependencies=[Depends(require_api_key)],
)
def gibbon_info() -> GibbonInfo:
    if not ping_db(engine):
        raise HTTPException(status_code=503, detail="Banco indisponível")
    return GibbonInfo(version=get_gibbon_version(engine))


@app.get("/students", response_model=list[Student], dependencies=[Depends(require_api_key)])
def students(limit: int = 50, offset: int = 0) -> list[Student]:
    try:
        rows = list_students(engine, limit=limit, offset=offset)
        return [Student(**r) for r in rows]
    except Exception as e:
        raise HTTPException(
            status_code=501,
            detail=(
                "Falha ao consultar alunos no schema do Gibbon. "
                "Provavelmente sua instalação tem nomes/colunas diferentes. "
                f"Erro: {type(e).__name__}: {e}"
            ),
        )


@app.get("/staff", response_model=list[Staff], dependencies=[Depends(require_api_key)])
def staff(limit: int = 50, offset: int = 0) -> list[Staff]:
    try:
        rows = list_staff(engine, limit=limit, offset=offset)
        return [Staff(**r) for r in rows]
    except Exception as e:
        raise HTTPException(
            status_code=501,
            detail=(
                "Falha ao consultar staff no schema do Gibbon. "
                f"Erro: {type(e).__name__}: {e}"
            ),
        )


@app.get("/classes", dependencies=[Depends(require_api_key)])
def classes() -> dict:
    # Placeholder: a estrutura de turmas/disciplinas varia conforme versão/configuração do Gibbon.
    return {
        "message": "TODO: implementar /classes com base nas tabelas gibbonCourse/gibbonCourseClass.",
    }
