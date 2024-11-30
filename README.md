
# FastAPI Quiz Application

This application uses FastAPI to create an API for working with quizzes. It allows users to create quizzes, get questions, and check answers.

## Description

This project utilizes FastAPI, SQLAlchemy, and other modern libraries to build a full RESTful API for quiz management.

### Features:
- User registration and login.
- Create quizzes.
- Play these quizzes.
- Retrieve questions for a quiz.
- Authentication via JWT and Cookies.

## Project Structure

```
├── app/
│   ├── main.py                   # Main file with the FastAPI application
│   ├── database.py               # Database connection setup
│   ├── user_async_database.py    # Database connection for FastAPI Users
│   ├── models/                   # Data models
│   │   ├── base_models.py        # Base models for all database tables
│   │   └── db_models.py         # Specific database models for the app
│   ├── users.py                  # File configuration for FastAPI Users
│   ├── routers/                  # Folder for API routers
│   │   ├── quiz_router.py        # Routes for handling quizzes
│   │   ├── question_router.py    # Routes for handling questions
│   │   └── user_answer_router.py # Routes for handling answers from users
│   ├── repositories/             # Repositories for interacting with the database
│   │   ├── quiz_repository.py    # Logic for managing quizzes in the DB
│   │   ├── question_repository.py # Logic for managing questions in the DB
│   │   ├── user_repository.py    # Logic for managing users in the DB
│   │   └── user_answer_repository.py # Logic for managing answers of users in the DB
│   ├── schemas/                  # Pydantic schemas for request/response models
│   ├── utils.py                  # Utility functions for the app
├── tests/                        # Folder for tests
│   └── test_quiz.py              # Tests for quiz-related endpoints
├── templates/                    # HTML templates for the frontend
├── requirements.txt              # Project dependencies
└── README.md                     # Project README

```

## Installation

Follow these steps to install dependencies and run the project:

1. Clone the repository:
2. Create a virtual environment:
3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
4. Install [Docker](https://www.docker.com/)
5. Run docker-container for Database

```bash
   docker-compose up
   ```
## Running the Application

To start the server, run:

```bash
uvicorn app.main:application --reload
```

Your application will be available at: `http://127.0.0.1:8000`

## Testing

To run tests, use pytest:

```bash
pytest
```

Tests will automatically look for files starting with `test_` inside the `tests/` folder and run them.

## API Documentation

FastAPI generates automatic documentation for the API using Swagger UI, accessible at:

```
http://127.0.0.1:8000/docs
```

There is also ReDoc documentation available:

```
http://127.0.0.1:8000/redoc
```

## Dependencies

- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [Uvicorn](https://www.uvicorn.org/)
- [pytest](https://pytest.org/)
- [Docker](https://www.docker.com/)

