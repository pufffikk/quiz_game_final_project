from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime
from sqlalchemy.orm import relationship

from app.database import Base


quiz_question = Table(
    'quiz_question', Base.metadata,
    Column('quiz_id', Integer, ForeignKey('questions.id'), primary_key=True),
    Column('question_id', Integer, ForeignKey('quizzes.id'), primary_key=True)
)


class Quiz(Base):
    __tablename__ = 'quizzes'

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    author = Column(String, nullable=False)

    questions = relationship("Question", secondary=quiz_question, back_populates="quizzes")


class Question(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)

    quizzes = relationship("Quiz", secondary=quiz_question, back_populates="questions")


class UserAnswer(Base):
    __tablename__ = 'user_answers'

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_name = Column(String, nullable=False, index=True)
    quiz_name = Column(String, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    percentage = Column(Integer, nullable=False)
    date = Column(DateTime(timezone=True))