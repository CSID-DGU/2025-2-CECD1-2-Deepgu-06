# app/schemas/cctv.py
from pydantic import BaseModel


class CctvBase(BaseModel):
    name: str
    location: str
    streaming_url: str


class CctvCreate(CctvBase):
    pass


class CctvOut(CctvBase):
    cctv_id: int
    status: str

    class Config:
        orm_mode = True
