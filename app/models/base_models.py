from datetime import datetime

from pydantic import BaseModel


class QuizModel(BaseModel):
    name: str
    author: str


class QuestionModel(BaseModel):
    name: str
    question: str
    answer: str


class UserAnswerModel(BaseModel):
    quiz_name: str
    correct_answers: int
    percentage: int
