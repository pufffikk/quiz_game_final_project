from fastapi import Depends
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase

from app.database import get_db
from app.schemas.schemas import UserCreate
from app.user_async_database import User


def get_user_db(db_session=Depends(get_db)):
    yield SQLAlchemyUserDatabase(db_session, User)


def create_user(user_create: UserCreate, db=Depends(get_db)):
    user_db = get_user_db(db)
    user = user_db.create(user_create)
    return user