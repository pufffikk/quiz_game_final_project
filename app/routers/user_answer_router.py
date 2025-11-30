from app.models.base_models import UserAnswerModel
from typing import List
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import APIRouter
from app.database import get_db
from app.repositories.user_answer_repository import UserAnswerRepository

router = APIRouter()


valid_fields = ['user_name', 'quiz_name', 'correct_answers', 'percentage', 'date']


@router.get("/user_answers/", response_model=List[UserAnswerModel])
def list_of_participants(field: str = 'percentage', sort_by: str = "percentage",
                         order: str = "asc", db: Session = Depends(get_db)):
    if field not in valid_fields:
        raise HTTPException(status_code=400, detail=f"Invalid field: {field}")

    answer_repo = UserAnswerRepository(db)
    db_answers = answer_repo.get_all_answers()
    # Convert SQLAlchemy models to Pydantic models
    answers = [
        UserAnswerModel(
            quiz_name=a.quiz_name,
            correct_answers=a.correct_answers,
            percentage=a.percentage,
            user_name=a.user_name,
            date=a.date.isoformat() if a.date else None
        ) for a in db_answers
    ]
    return answers
