from datetime import datetime
from typing import List, Union
from fastapi import Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from starlette.templating import Jinja2Templates
from fastapi import APIRouter, Request
from app.database import get_db
from app.user_async_database import User
from app.users import current_active_user
from app.utils import templates
from app.models.base_models import QuestionModel, UserAnswerModel
from app.models.db_models import UserAnswer
from app.repositories.question_repository import QuestionRepository
from fastapi.responses import HTMLResponse

from app.repositories.quiz_repository import QuizRepository
from app.repositories.user_answer_repository import UserAnswerRepository

router = APIRouter()

valid_fields = ['name', 'question', 'answer']


@router.get("/create_question", response_class=HTMLResponse)
def create_quiz_html(request: Request):
    return templates.TemplateResponse("create_question.html", {"request": request})


@router.get("/connect_quiz_and_question", response_class=HTMLResponse)
def connect_quiz_and_question(request: Request):
    return templates.TemplateResponse("connect_quiz_question.html", {"request": request})


@router.post("/questions/")
def create_quiz(questions: Union[QuestionModel, List[QuestionModel]], db: Session = Depends(get_db)):
    questions_repo = QuestionRepository(db)
    if isinstance(questions, list):
        return questions_repo.create_multiple_questions(questions)
    else:
        return questions_repo.create_question(questions.name, questions.question, questions.answer)


@router.get("/questions", response_model=List[QuestionModel])
def list_quizzes(request: Request, field: str = 'name', sort_by: str = "name",
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


@router.get("/questions/{quiz_name}", response_model=List[QuestionModel])
def list_questions_by_quiz(request: Request, quiz_name: str,
                           sort_by: str = "name", order: str = "asc", db: Session = Depends(get_db)):
    quiz_repo = QuizRepository(db)
    questions = quiz_repo.list_questions_by_quiz(quiz_name)
    return templates.TemplateResponse("questions.html",
                                      {"request": request,
                                       "questions": questions,
                                       "sort_by": sort_by,
                                       "order": order})


@router.get("/questions/{quiz_name}/next", response_model=QuestionModel)
def get_next_question(quiz_name: str, current_index: int, db: Session = Depends(get_db)):
    quiz_repo = QuizRepository(db)
    questions = quiz_repo.list_questions_by_quiz(quiz_name)
    if current_index < len(questions):
        return questions[current_index]
    else:
        raise HTTPException(status_code=404, detail="No more questions available")


@router.post("/questions/{quiz_name}/save_results")
def save_results(
    user_data: UserAnswerModel,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    try:
        repo = UserAnswerRepository(db)
        repo.create_answer(user_name=user.email,
                           quiz_name=user_data.quiz_name,
                           correct_answers=user_data.correct_answers,
                           percentage=user_data.percentage,
                           date=datetime.now())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving results: {e}")


@router.put("/questions/{quiz_name}/{question_name}")
def connect_question_with_quiz(quiz_name: str, question_name: str, db: Session = Depends(get_db)):
    quiz_repo = QuizRepository(db)
    question_repo = QuestionRepository(db)
    db_quiz = quiz_repo.get_quiz_by_name(quiz_name)
    if db_quiz is None:
        raise HTTPException(status_code=404, detail=f"Quiz with name: {quiz_name} was not found")
    db_question = question_repo.get_question_by_name(question_name)
    if db_question is None:
        raise HTTPException(status_code=404, detail=f"Question with name: {question_name} was not found")
    db_quiz.questions.append(db_question)
    db.commit()
    db.refresh(db_quiz)
    return jsonable_encoder(db_quiz)