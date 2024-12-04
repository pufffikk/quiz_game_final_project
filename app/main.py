from contextlib import asynccontextmanager
from fastapi.responses import HTMLResponse
from fastapi import FastAPI, Request, Depends, HTTPException
from starlette.responses import JSONResponse

from app.routers.question_router import router as question_router
from app.routers.quiz_router import router as quiz_router
from app.routers.user_answer_router import router as user_answer_router
from app.schemas.schemas import UserRead, UserCreate, UserUpdate
from app.user_async_database import create_db_and_tables, User
from app.users import auth_backend, fastapi_users, current_active_user, cookie_auth_backend
from app.utils import templates


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
    title="Amazing quiz app",
    description=description,
    summary="Amazing quiz app for working with quizzes.",
    version="0.0.1",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "Amazing quiz app",
        "email": "rbabadzhanov94@gmail.com",
    },
    license_info={
        "name": "Apache 2.0",
        "identifier": "MIT",
    },
    lifespan=lifespan,
    openapi_tags=tags_metadata,
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
    if exc.status_code == 401:  # Unauthorized
        return templates.TemplateResponse(
            "login.html",
            {"request": request, "message": "You must be logged in to access this page"}
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@application.get("/authenticated-route", tags=["authenticated-route"])
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.email}!"}


@application.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("base.html", {"request": request})


@application.get("/register", response_class=HTMLResponse)
async def register_form(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})


@application.get("/login", response_class=HTMLResponse)
async def login_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


# This endpoint run the game
@application.get("/game", response_class=HTMLResponse, tags=["game"])
def game(quiz_name: str, request: Request, user: User = Depends(current_active_user)):
    return templates.TemplateResponse("game.html", {"request": request, "quiz_name": quiz_name})
