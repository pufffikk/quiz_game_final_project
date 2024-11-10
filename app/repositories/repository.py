from typing import List

from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from app.models.base_models import QuizModel, QuestionModel
from app.models.db_models import Quiz, Question


class QuizRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_quiz_by_id(self, quiz_id: int):
        return self.session.query(Quiz).filter(Quiz.id == quiz_id).first()

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

    def delete_quiz_by_id(self, quiz_id: int):
        quiz = self.session.query(Quiz).filter(Quiz.id == quiz_id).first()
        if quiz:
            self.session.delete(quiz)
            self.session.commit()
        return quiz

    def delete_quiz(self, quiz: QuizModel):
        quiz_to_delete = self.session.query(Quiz).filter(Quiz.name == quiz.name and Quiz.name == quiz.name).first()
        if quiz_to_delete:
            self.session.delete(quiz_to_delete)
            self.session.commit()
        return quiz_to_delete


class QuestionRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_question_by_id(self, question_id: int):
        return self.session.query(Question).filter(Question.id == question_id).first()

    def create_question(self, question: str, answer: str):
        new_question = Question(question=question, answer=answer)
        self.session.add(new_question)
        self.session.commit()
        self.session.refresh(new_question)
        return new_question

    def create_multiple_questions(self, questions: List[QuestionModel]):
        new_questions = [Quiz(question=question.question, answer=question.answer) for question in questions]
        self.session.add_all(new_questions)
        self.session.commit()
        return new_questions

    def list_questions(self, field: str, order: str):
        if order == "asc":
            return self.session.query(Question).order_by(asc(getattr(Quiz, field))).all()
        elif order == "desc":
            return self.session.query(Question).order_by(desc(getattr(Quiz, field))).all()
        return self.session.query(Question).all()

    def delete_question_by_id(self, question_id: int):
        question = self.session.query(Question).filter(Question.id == question_id).first()
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
