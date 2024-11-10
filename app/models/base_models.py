from pydantic import BaseModel


class QuizModel(BaseModel):
    name: str
    author: str


class QuestionModel(BaseModel):
    question: str
    answer: str
