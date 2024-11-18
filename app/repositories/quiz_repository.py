from typing import List

from fastapi import HTTPException
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from app.models.base_models import QuizModel, QuestionModel
from app.models.db_models import Quiz, Question


class QuizRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_quiz_by_id(self, quiz_id: int):
        return self.session.query(Quiz).filter(Quiz.id == quiz_id).first()

    def get_quiz_by_name(self, quiz_name: str):
        return self.session.query(Quiz).filter(Quiz.name == quiz_name).first()

    def create_quiz(self, name: str, author: str):
        new_quiz = Quiz(name=name, author=author)
        self.session.add(new_quiz)
        self.session.commit()
        self.session.refresh(new_quiz)
        return new_quiz

    def create_multiple_quizzes(self, quizzes: List[QuizModel]):
        new_quizzes = [Quiz(name=quiz.name, author=quiz.author) for quiz in quizzes]
        self.session.add_all(new_quizzes)
        self.session.commit()
        return quizzes

    def list_quizzes(self, field: str, order: str):
        if order == "asc":
            return self.session.query(Quiz).order_by(asc(getattr(Quiz, field))).all()
        elif order == "desc":
            return self.session.query(Quiz).order_by(desc(getattr(Quiz, field))).all()
        return self.session.query(Quiz).all()

    def list_questions_by_quiz(self, quiz_name: str):
        quiz = self.session.query(Quiz).filter(Quiz.name == quiz_name).first()
        if quiz is None:
            raise HTTPException(status_code=404, detail="Quiz with such name was not found")
        return quiz.questions

    def delete_quiz_by_id(self, quiz_id: int):
        quiz = self.session.query(Quiz).filter(Quiz.id == quiz_id).first()
        if quiz:
            self.session.delete(quiz)
            self.session.commit()
        return quiz

    def delete_quiz(self, quiz: str):
        quiz_to_delete = self.session.query(Quiz).filter(Quiz.name == quiz).first()
        if quiz_to_delete:
            self.session.delete(quiz_to_delete)
            self.session.commit()
        return quiz_to_delete

