from typing import List, Union
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from starlette.templating import Jinja2Templates
from fastapi import APIRouter, Request
from app.database import get_db
from app.models.base_models import QuizModel
from app.repositories.quiz_repository import QuizRepository
from fastapi.responses import HTMLResponse

router = APIRouter()
templates = Jinja2Templates(directory="templates")

valid_fields = ['name', 'author']


@router.get("/create_quiz", response_class=HTMLResponse)
def create_quiz_html(request: Request):
    return templates.TemplateResponse("create_quiz.html", {"request": request})


@router.get("/delete_quiz", response_class=HTMLResponse)
def delete_quiz_html(request: Request):
    return templates.TemplateResponse("delete_quiz.html", {"request": request})


@router.post("/quizzes/")
def create_quiz(quizzes: Union[QuizModel, List[QuizModel]], db: Session = Depends(get_db)):
    quiz_repo = QuizRepository(db)
    if isinstance(quizzes, list):
        return quiz_repo.create_multiple_quizzes(quizzes)
    else:
        return quiz_repo.create_quiz(quizzes.name, quizzes.author)


@router.delete("/quizzes/delete/{quiz_name}")
def delete_quiz(quiz_name: str, db: Session = Depends(get_db)):
    quiz_repo = QuizRepository(db)
    return quiz_repo.delete_quiz(quiz_name)


@router.get("/quizzes", response_model=List[QuizModel])
def list_quizzes(request: Request, field: str = 'name', sort_by: str = "name", order: str = "asc", db: Session = Depends(get_db)):
    if field not in valid_fields:
        raise HTTPException(status_code=400, detail=f"Invalid field: {field}")

    quiz_repo = QuizRepository(db)
    quizzes = quiz_repo.list_quizzes(field, order)
    return templates.TemplateResponse("quizzes.html",
                                      {"request": request,
                                       "quizzes": quizzes,
                                       "sort_by": sort_by,
                                       "order": order})