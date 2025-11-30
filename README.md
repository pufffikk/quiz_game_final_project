
# Quiz Game Platform

A full-stack quiz application built with FastAPI backend and React + TypeScript frontend. This platform allows users to create quizzes, manage questions, play interactive quizzes, and compete on the leaderboard.

## Description

This is a full-stack quiz platform that combines a FastAPI backend with a React + TypeScript frontend. The backend utilizes FastAPI, SQLAlchemy, and other modern libraries to build a RESTful API for quiz management, while the frontend provides an interactive user interface built with React, TypeScript, and React Router.

### Features:
- **User Authentication**: Registration and login with cookie-based authentication
- **Quiz Management**: Create, view, and delete quizzes
- **Question Management**: Create, view, and delete questions
- **Quiz-Question Linking**: Connect questions to quizzes
- **Interactive Gameplay**: Play quizzes with real-time answer checking
- **Leaderboard**: Track user performance and scores
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Modern UI with smooth animations

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
├── frontend/                     # React + TypeScript frontend application
│   ├── src/                      # Frontend source code
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── services/            # API service functions
│   │   └── contexts/            # React contexts (theme, etc.)
│   └── package.json             # Frontend dependencies
├── templates/                    # Legacy HTML templates (deprecated)
├── requirements.txt             # Backend Python dependencies
└── README.md                    # Project README

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

### Backend (FastAPI)

To start the backend server, run:

```bash
uvicorn app.main:application --reload
```

The backend API will be available at: `http://127.0.0.1:8000`

### Frontend (React)

Navigate to the frontend directory and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:3000`

The Vite dev server is configured to proxy API requests to the backend automatically.

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

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework for building APIs
- [SQLAlchemy](https://www.sqlalchemy.org/) - SQL toolkit and ORM
- [Uvicorn](https://www.uvicorn.org/) - ASGI server
- [FastAPI Users](https://fastapi-users.github.io/fastapi-users/) - User authentication
- [pytest](https://pytest.org/) - Testing framework
- [Docker](https://www.docker.com/) - Containerization

### Frontend
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [React Router](https://reactrouter.com/) - Client-side routing
- [Vite](https://vitejs.dev/) - Build tool and dev server

