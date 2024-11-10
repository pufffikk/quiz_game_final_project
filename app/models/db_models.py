from sqlalchemy import Column, Integer, String, ForeignKey, Table
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
    name = Column(String, nullable=False)
    author = Column(String, nullable=False)

    questions = relationship("Question", secondary=quiz_question, back_populates="quizes")


class Question(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)

    quizes = relationship("Quiz", secondary=quiz_question, back_populates="questions")