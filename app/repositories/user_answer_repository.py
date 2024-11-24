from datetime import datetime

from sqlalchemy.orm import Session

from app.models.base_models import QuestionModel
from app.models.db_models import Question, UserAnswer


class UserAnswerRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_answer(self, user_name: str, quiz_name: str, correct_answers: int, percentage:int, date: datetime):
        new_answer = UserAnswer(user_name=user_name, quiz_name=quiz_name,
                                correct_answers=correct_answers, percentage=percentage, date=date)
        self.session.add(new_answer)
        self.session.commit()
        self.session.refresh(new_answer)
        return new_answer

    def get_answers_by_username(self, username: str):
        return self.session.query(UserAnswer).filter(UserAnswer.user_name == username).all()

    def get_all_answers(self):
        return self.session.query(UserAnswer).all()
