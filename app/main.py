
from starlette.templating import Jinja2Templates

from fastapi.responses import HTMLResponse
from fastapi import FastAPI, Request

from app.routers.question_router import router as question_router
from app.routers.quiz_router import router as quiz_router

application = FastAPI()

templates = Jinja2Templates(directory="templates")
application.include_router(quiz_router, prefix="/app", tags=["quizzes"])
application.include_router(question_router, prefix="/app", tags=["questions"])


@application.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("base.html", {"request": request})

