from pydantic import BaseModel


class Student(BaseModel):
    gibbonPersonID: int
    surname: str | None = None
    preferredName: str | None = None
    officialName: str | None = None
    email: str | None = None
    formGroup: str | None = None
    yearGroup: str | None = None


class Staff(BaseModel):
    gibbonPersonID: int
    surname: str | None = None
    preferredName: str | None = None
    officialName: str | None = None
    email: str | None = None


class Health(BaseModel):
    ok: bool
    db: bool
    gibbonVersion: str | None = None


class GibbonInfo(BaseModel):
    version: str | None = None
