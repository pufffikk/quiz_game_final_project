from app.models.base_models import UserAnswerModel
from typing import List
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from starlette.templating import Jinja2Templates
from fastapi import APIRouter, Request
from app.database import get_db
from app.repositories.quiz_repository import QuizRepository
from app.repositories.user_answer_repository import UserAnswerRepository
from app.utils import templates

router = APIRouter()


valid_fields = ['user_name', 'quiz_name', 'correct_answers', 'percentage', 'date']


@router.get("/user_answers/", response_model=List[UserAnswerModel])
def list_of_participants(request: Request, field: str = 'percentage', sort_by: str = "percentage",
                         order: str = "asc", db: Session = Depends(get_db)):
    if field not in valid_fields:
        raise HTTPException(status_code=400, detail=f"Invalid field: {field}")

    answer_repo = UserAnswerRepository(db)
    answers = answer_repo.get_all_answers()
    return templates.TemplateResponse("leaderboard.html",
                                      {"request": request,
                                       "answers": answers,
                                       "sort_by": sort_by,
                                       "order": order})
