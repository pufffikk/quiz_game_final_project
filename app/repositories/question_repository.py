from typing import List

from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from app.models.base_models import QuestionModel
from app.models.db_models import Question


class QuestionRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_question_by_id(self, question_id: int):
        return self.session.query(Question).filter(Question.id == question_id).first()

    def get_question_by_name(self, question_name: str):
        return self.session.query(Question).filter(Question.name == question_name).first()

    def create_question(self, name: str, question: str, answer: str):
        new_question = Question(name=name, question=question, answer=answer)
        self.session.add(new_question)
        self.session.commit()
        self.session.refresh(new_question)
        return new_question

    def create_multiple_questions(self, questions: List[QuestionModel]):
        new_questions = [Question(name=question.name, question=question.question, answer=question.answer)
                         for question in questions]
        self.session.add_all(new_questions)
        self.session.commit()
        return new_questions

    def list_questions(self, field: str, order: str):
        if order == "asc":
            return self.session.query(Question).order_by(asc(getattr(Question, field))).all()
        elif order == "desc":
            return self.session.query(Question).order_by(desc(getattr(Question, field))).all()
        return self.session.query(Question).all()

    def delete_question_by_id(self, question_id: int):
        question = self.session.query(Question).filter(Question.id == question_id).first()
        if question:
            self.session.delete(question)
            self.session.commit()
        return question

    def delete_question_by_name(self, question_name: str):
        question = self.session.query(Question).filter(Question.name == question_name).first()
        if question:
            self.session.delete(question)
            self.session.commit()
        return question

    def delete_question(self, question: QuestionModel):
        question_to_delete = (self.session.query(Question)
                              .filter(Question.question == question.question
                                      and Question.answer == question.answer).first())
        if question_to_delete:
            self.session.delete(question_to_delete)
            self.session.commit()
        return question_to_delete
