from typing import List
from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse
from starlette.templating import Jinja2Templates
from starlette.testclient import TestClient
from fastapi import Request

from app.database import get_db
from app.main import application
from app.routers.quiz_router import router as quiz_router
from app.routers.question_router import router as question_router
from app.user_async_database import User
from app.users import current_active_user
from app.utils import templates

application.include_router(quiz_router)
application.include_router(question_router)


@pytest.fixture
def mock_templates():
    mock = MagicMock(spec=Jinja2Templates)
    mock.TemplateResponse.return_value = "Mocked Template Response"
    return mock


@pytest.fixture
def mock_db():
    db = MagicMock(spec=Session)
    return db


@pytest.fixture
def mock_user():
    mock_user = MagicMock(spec=User)
    mock_user.email = "testuser@example.com"
    return mock_user


@pytest.fixture(autouse=True)
def override_dependency(mock_db):
    application.dependency_overrides[get_db] = lambda: mock_db


@pytest.fixture
def client(mock_templates):
    application.dependency_overrides[templates] = lambda: mock_templates
    application.dependency_overrides[current_active_user] = lambda: mock_user
    return TestClient(application)


@pytest.mark.parametrize(
    'quiz_data, status_code, result_data',
    [
        ({"name": "Test Book", "author": "Test Author"}, 200, {"name": "Test Book", "author": "Test Author"}),
        ({"name": "Test Book", "authorr": "Test Author"}, 422, {"detail": "Invalid data"}),
    ]
)
def test_add_quiz(client, mock_db, quiz_data: dict, status_code, result_data: dict):

    response = client.post("/quizzes/", json=quiz_data, headers={"Authorization": "Bearer fake_token"})

    assert response.status_code == status_code
    if status_code == 200:
        assert response.json()["name"] == result_data["name"]
        assert response.json()["author"] == result_data["author"]
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
    elif status_code == 422:
        assert "detail" in response.json()


@pytest.mark.parametrize(
    'quiz_data, status_code, result_data',
    [
        ({"quiz_name": "TestQuiz", "current_index": 0}, 200,
         [{"name": "Test Book", "question": "Who is", "answer": "answer"},]),
        ({"quiz_name": "Test Book", "current_index": "tt"},
         422, [{"detail": "Invalid data"},]),
    ]
)
def test_get_next_question(client, mock_db, mocker, quiz_data: dict, status_code, result_data: List[dict]):
    mock_question_repo = mocker.patch('app.routers.question_router.QuizRepository')
    mock_question_repo.return_value.list_questions_by_quiz.return_value = result_data if result_data else []
    url = f"/questions/{quiz_data['quiz_name']}/next?current_index={quiz_data['current_index']}"

    response = client.get(url)

    assert response.status_code == status_code
    if status_code == 200:
        response_json = response.json()
        assert len(response_json) == len(result_data[0])
        assert response_json["name"] == result_data[0]["name"]
        assert response_json["question"] == result_data[0]["question"]
        assert response_json["answer"] == result_data[0]["answer"]

        mock_question_repo.return_value.list_questions_by_quiz.assert_called_once_with(quiz_data["quiz_name"])


