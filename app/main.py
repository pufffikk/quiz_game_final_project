from typing import List, Union, Literal

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from starlette.templating import Jinja2Templates

from app.database import Base, get_db
from app.models.base_models import QuizModel
from app.repositories.repository import QuizRepository
from fastapi.responses import HTMLResponse
from fastapi import FastAPI, Request

application = FastAPI()

templates = Jinja2Templates(directory="templates")


@application.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("base.html", {"request": request})


@application.post("/quizzes/add")
def create_quiz(quizzes: Union[QuizModel, List[QuizModel]], db: Session = Depends(get_db)):
    quiz_repo = QuizRepository(db)

    if isinstance(quizzes, list):
        return quiz_repo.create_multiple_quizzes(quizzes)
    else:
        return quiz_repo.create_quiz(quizzes.name, quizzes.author)


@application.delete("/quizzes/delete")
def delete_quiz(quiz: QuizModel, db: Session = Depends(get_db)):
    quiz_repo = QuizRepository(db)
    return quiz_repo.delete_quiz(quiz)


@application.get("/quizzes", response_model=list[QuizModel])
def list_quizzes(request: Request, field: Literal['name', 'author'] = 'name',
                 sort_by: str = "name", order: str = "asc", db: Session = Depends(get_db)):
    quiz_repo = QuizRepository(db)
    return templates.TemplateResponse(request, "quizzes.html",
                                      {"quizzes": quiz_repo.list_quizzes(field, order),
                                       "sort_by": sort_by,
                                       "order": order})