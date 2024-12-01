from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient
from starlette.templating import Jinja2Templates

from app.main import application
from app.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.routers.quiz_router import router as quiz_router

from app.models.db_models import Base, Quiz
from app.user_async_database import User
from app.users import current_active_user
from app.utils import templates


SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
application.include_router(quiz_router)


@pytest.fixture
def mock_templates():
    mock = MagicMock(spec=Jinja2Templates)
    mock.TemplateResponse.return_value = "Mocked Template Response"
    return mock


@pytest.fixture(scope="module")
def test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def mock_user():
    mock_user = MagicMock(spec=User)
    mock_user.email = "testuser@example.com"
    return mock_user


@pytest.fixture(scope="module")
def client(test_db):
    application.dependency_overrides[get_db] = lambda: test_db
    application.dependency_overrides[templates] = lambda: mock_templates
    application.dependency_overrides[current_active_user] = lambda: mock_user
    return TestClient(application)


def test_create_quiz(client):
    response = client.post(
        "/quizzes/",
        json={"name": "Test Quiz", "author": "Test Author"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Quiz"
    assert data["author"] == "Test Author"

    db = TestingSessionLocal()
    quiz = db.query(Quiz).filter_by(name="Test Quiz").first()
    assert quiz is not None
    assert quiz.author == "Test Author"
