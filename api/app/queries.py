from sqlalchemy import text
from sqlalchemy.engine import Engine


def ping_db(engine: Engine) -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


_columns_cache: dict[str, set[str]] = {}


def _current_db_name(engine: Engine) -> str | None:
    try:
        with engine.connect() as conn:
            return conn.execute(text("SELECT DATABASE()")).scalar_one_or_none()
    except Exception:
        return None


def table_columns(engine: Engine, table_name: str) -> set[str]:
    """Retorna as colunas da tabela no schema atual (cacheado)."""
    cache_key = f"{id(engine)}:{table_name}"
    if cache_key in _columns_cache:
        return _columns_cache[cache_key]

    db_name = _current_db_name(engine)
    if not db_name:
        _columns_cache[cache_key] = set()
        return _columns_cache[cache_key]

    sql = text(
        """
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = :db
          AND TABLE_NAME = :table
        """
    )
    try:
        with engine.connect() as conn:
            rows = conn.execute(sql, {"db": db_name, "table": table_name}).all()
        cols = {r[0] for r in rows}
    except Exception:
        cols = set()

    _columns_cache[cache_key] = cols
    return cols


def has_table(engine: Engine, table_name: str) -> bool:
    return len(table_columns(engine, table_name)) > 0


def _safe_person_email_expr(person_cols: set[str]) -> str:
    # Em algumas instalações pode existir emailAddress em vez de email.
    if "email" in person_cols:
        return "p.email AS email"
    if "emailAddress" in person_cols:
        return "p.emailAddress AS email"
    return "NULL AS email"


def get_gibbon_version(engine: Engine) -> str | None:
    """Tenta obter a versão do Gibbon a partir de gibbonSetting (compatível com variações)."""
    if not has_table(engine, "gibbonSetting"):
        return None

    setting_cols = table_columns(engine, "gibbonSetting")
    # Padrão mais comum: name/value (às vezes settingName/settingValue ou similar).
    name_col = "name" if "name" in setting_cols else ("settingName" if "settingName" in setting_cols else None)
    value_col = "value" if "value" in setting_cols else ("settingValue" if "settingValue" in setting_cols else None)

    if not name_col or not value_col:
        return None

    # Tentativas comuns de chaves de versão.
    candidates = [
        "systemVersion",
        "version",
        "gibbonVersion",
    ]

    sql = text(
        f"""
        SELECT {value_col}
        FROM gibbonSetting
        WHERE {name_col} IN :names
        LIMIT 1
        """
    )
    try:
        with engine.connect() as conn:
            # MySQL requer tupla para IN parametrizado via SQLAlchemy text
            val = conn.execute(sql, {"names": tuple(candidates)}).scalar_one_or_none()
        return str(val) if val is not None else None
    except Exception:
        return None


def list_students(engine: Engine, limit: int = 50, offset: int = 0) -> list[dict]:
    """MVP: tenta listar alunos via tabelas padrão do Gibbon.

    Observação: a instalação do Gibbon pode ter customizações; se alguma tabela/coluna não existir,
    o endpoint retornará 501 com mensagem orientando ajustar o SQL.
    """
    person_cols = table_columns(engine, "gibbonPerson")
    if not person_cols:
        raise RuntimeError("Tabela gibbonPerson não encontrada.")

    enrolment_exists = has_table(engine, "gibbonStudentEnrolment")
    form_group_exists = has_table(engine, "gibbonFormGroup")
    year_group_exists = has_table(engine, "gibbonYearGroup")

    select_email = _safe_person_email_expr(person_cols)

    joins: list[str] = []
    select_extras: list[str] = []

    if enrolment_exists:
        joins.append("LEFT JOIN gibbonStudentEnrolment se ON se.gibbonPersonID = p.gibbonPersonID")
        enrol_cols = table_columns(engine, "gibbonStudentEnrolment")

        if form_group_exists and "gibbonFormGroupID" in enrol_cols:
            joins.append(
                "LEFT JOIN gibbonFormGroup fg ON fg.gibbonFormGroupID = se.gibbonFormGroupID"
            )
            fg_cols = table_columns(engine, "gibbonFormGroup")
            if "name" in fg_cols:
                select_extras.append("fg.name AS formGroup")
            else:
                select_extras.append("NULL AS formGroup")
        else:
            select_extras.append("NULL AS formGroup")

        if year_group_exists and "gibbonYearGroupID" in enrol_cols:
            joins.append(
                "LEFT JOIN gibbonYearGroup yg ON yg.gibbonYearGroupID = se.gibbonYearGroupID"
            )
            yg_cols = table_columns(engine, "gibbonYearGroup")
            if "name" in yg_cols:
                select_extras.append("yg.name AS yearGroup")
            else:
                select_extras.append("NULL AS yearGroup")
        else:
            select_extras.append("NULL AS yearGroup")
    else:
        # Sem enrolment não dá pra inferir year/form group de forma confiável.
        select_extras.extend(["NULL AS formGroup", "NULL AS yearGroup"])

    # Campos base (assumidos no Gibbon v31)
    sql = text(
        f"""
        SELECT
            p.gibbonPersonID,
            p.surname,
            p.preferredName,
            p.officialName,
            {select_email},
            {", ".join(select_extras)}
        FROM gibbonPerson p
        {" ".join(joins)}
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
    person_cols = table_columns(engine, "gibbonPerson")
    if not person_cols:
        raise RuntimeError("Tabela gibbonPerson não encontrada.")
    if not has_table(engine, "gibbonStaff"):
        raise RuntimeError("Tabela gibbonStaff não encontrada.")

    select_email = _safe_person_email_expr(person_cols)
    sql = text(
        f"""
        SELECT
            p.gibbonPersonID,
            p.surname,
            p.preferredName,
            p.officialName,
            {select_email}
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
