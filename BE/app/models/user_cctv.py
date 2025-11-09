# app/models/user_cctv.py
from sqlalchemy import BigInteger, Column, ForeignKey

from app.db.base import Base


class UserCctv(Base):
    __tablename__ = "user_cctv"

    user_id = Column(BigInteger, ForeignKey("user.user_id"), primary_key=True)
    cctv_id = Column(BigInteger, ForeignKey("cctv.cctv_id"), primary_key=True)
