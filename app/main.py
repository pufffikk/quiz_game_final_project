
from contextlib import asynccontextmanager
from fastapi.responses import HTMLResponse
from fastapi import FastAPI, Request, Depends, Response
from fastapi.responses import RedirectResponse

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


application = FastAPI(lifespan=lifespan)

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


@application.get("/authenticated-route")
async def authenticated_route(user: User = Depends(current_active_user)):
    if not user:
        return RedirectResponse(url="/login")
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


@application.get("/game", response_class=HTMLResponse)
def create_quiz_html(quiz_name: str, request: Request):
    return templates.TemplateResponse("game.html", {"request": request, "quiz_name": quiz_name})
