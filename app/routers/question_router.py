from typing import List, Union
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from starlette.templating import Jinja2Templates
from fastapi import APIRouter, Request
from app.database import get_db
from app.models.base_models import QuestionModel
from app.repositories.question_repository import QuestionRepository
from fastapi.responses import HTMLResponse

router = APIRouter()
templates = Jinja2Templates(directory="templates")

valid_fields = ['question', 'answer']


@router.get("/create_question", response_class=HTMLResponse)
def create_quiz_html(request: Request):
    return templates.TemplateResponse("create_question.html", {"request": request})


@router.post("/questions/")
def create_quiz(questions: Union[QuestionModel, List[QuestionModel]], db: Session = Depends(get_db)):
    questions_repo = QuestionRepository(db)
    if isinstance(questions, list):
        return questions_repo.create_multiple_questions(questions)
    else:
        return questions_repo.create_question(questions.question, questions.answer)


@router.get("/questions", response_model=List[QuestionModel])
def list_quizzes(request: Request, field: str = 'question', sort_by: str = "question",
                 order: str = "asc", db: Session = Depends(get_db)):
    if field not in valid_fields:
        raise HTTPException(status_code=400, detail=f"Invalid field: {field}")

    questions_repo = QuestionRepository(db)
    questions = questions_repo.list_questions(field, order)
    return templates.TemplateResponse("questions.html",
                                      {"request": request,
                                       "questions": questions,
                                       "sort_by": sort_by,
                                       "order": order})