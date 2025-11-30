from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class QuizModel(BaseModel):
    name: str
    author: str
    questions: Optional[List['QuestionModel']] = []


class QuestionModel(BaseModel):
    name: str
    question: str
    answer: str
    quizzes: Optional[List['QuizModel']] = []


class UserAnswerModel(BaseModel):
    quiz_name: str
    correct_answers: int
    percentage: int
    user_name: Optional[str] = None
    date: Optional[str] = None
