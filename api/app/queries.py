from sqlalchemy import text
from sqlalchemy.engine import Engine


def ping_db(engine: Engine) -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


def list_students(engine: Engine, limit: int = 50, offset: int = 0) -> list[dict]:
    """MVP: tenta listar alunos via tabelas padrão do Gibbon.

    Observação: a instalação do Gibbon pode ter customizações; se alguma tabela/coluna não existir,
    o endpoint retornará 501 com mensagem orientando ajustar o SQL.
    """
    sql = text(
        """
        SELECT
            p.gibbonPersonID,
            p.surname,
            p.preferredName,
            p.officialName,
            p.email,
            fg.name AS formGroup,
            yg.name AS yearGroup
        FROM gibbonPerson p
        LEFT JOIN gibbonStudentEnrolment se ON se.gibbonPersonID = p.gibbonPersonID
        LEFT JOIN gibbonFormGroup fg ON fg.gibbonFormGroupID = se.gibbonFormGroupID
        LEFT JOIN gibbonYearGroup yg ON yg.gibbonYearGroupID = se.gibbonYearGroupID
        WHERE p.status = 'Full'
          AND p.gibbonPersonID IS NOT NULL
        ORDER BY p.surname, p.preferredName
        LIMIT :limit OFFSET :offset
        """
    )
    with engine.connect() as conn:
        rows = conn.execute(sql, {"limit": limit, "offset": offset}).mappings().all()
    return [dict(r) for r in rows]


def list_staff(engine: Engine, limit: int = 50, offset: int = 0) -> list[dict]:
    sql = text(
        """
        SELECT
            p.gibbonPersonID,
            p.surname,
            p.preferredName,
            p.officialName,
            p.email
        FROM gibbonPerson p
        INNER JOIN gibbonStaff s ON s.gibbonPersonID = p.gibbonPersonID
        WHERE p.status = 'Full'
        ORDER BY p.surname, p.preferredName
        LIMIT :limit OFFSET :offset
        """
    )
    with engine.connect() as conn:
        rows = conn.execute(sql, {"limit": limit, "offset": offset}).mappings().all()
    return [dict(r) for r in rows]
