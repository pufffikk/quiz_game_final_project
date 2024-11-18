from pydantic import BaseModel


class QuizModel(BaseModel):
    name: str
    author: str


class QuestionModel(BaseModel):
    name: str
    question: str
    answer: str
