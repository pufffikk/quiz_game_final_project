from unittest.mock import MagicMock

import pytest
from sqlalchemy.orm import Session
from starlette.testclient import TestClient

from app.database import get_db
from app.main import application
from app.routers.quiz_router import router

application.include_router(router)

@pytest.fixture
def mock_db():
    db = MagicMock(spec=Session)
    return db


@pytest.fixture(autouse=True)
def override_dependency(mock_db):
    application.dependency_overrides[get_db] = lambda: mock_db


client = TestClient(application)


@pytest.mark.parametrize(
    'quiz_data, status_code, result_data',
    [
        ({"name": "Test Book", "author": "Test Author"}, 200, {"name": "Test Book", "author": "Test Author"}),
        ({"name": "Test Book", "authorr": "Test Author"}, 422, {"name": "Test Book", "author": "Test Author"}),
    ]
)
def test_add_single_quiz(mock_db, quiz_data: dict[str, str], status_code, result_data: dict[str, str]):

    response = client.post("/quizzes/", json=quiz_data)

    assert response.status_code == status_code
    if status_code == 200:
        assert response.json()["name"] == result_data["name"]
        assert response.json()["author"] == result_data["author"]
        mock_db.add.assert_called_once()