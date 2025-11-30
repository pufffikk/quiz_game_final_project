from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from app.routers.question_router import router as question_router
from app.routers.quiz_router import router as quiz_router
from app.routers.user_answer_router import router as user_answer_router
from app.schemas.schemas import UserRead, UserCreate, UserUpdate
from app.user_async_database import create_db_and_tables, User
from app.users import auth_backend, fastapi_users, current_active_user, cookie_auth_backend


@asynccontextmanager
async def lifespan(application: FastAPI):
    await create_db_and_tables()
    yield

description = """
Amazing quiz app API helps you to create quizzes, questions and play these quizzes. 🚀
"""
tags_metadata = [
    {
        "name": "game",
        "description": "Start point for playing a quiz",
    },
    {
        "name": "authenticated-route",
        "description": "Just for test, that authentication is working",
    },
]
application = FastAPI(
    title="Quiz Game Platform",
    description=description,
    summary="Full-stack quiz platform with FastAPI backend and React frontend.",
    version="0.0.1",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "Quiz Game Platform",
        "email": "rbabadzhanov94@gmail.com",
    },
    license_info={
        "name": "Apache 2.0",
        "identifier": "MIT",
    },
    lifespan=lifespan,
    openapi_tags=tags_metadata,
)

# Add CORS middleware to allow requests from frontend
application.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

application.include_router(quiz_router, prefix="/app", tags=["quizzes"])
application.include_router(question_router, prefix="/app", tags=["questions"])
application.include_router(user_answer_router, prefix="/app", tags=["user_answers"])

application.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)
application.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
application.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)
application.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)
application.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

application.include_router(
    fastapi_users.get_auth_router(cookie_auth_backend),
    prefix="/auth/cookie",
    tags=["auth"],
)


@application.exception_handler(HTTPException)
async def auth_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@application.get("/authenticated-route", tags=["authenticated-route"])
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.email}!"}
