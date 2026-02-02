# Multi-User Todo Web Application (Phase II)

This project implements a multi-user todo web application with a Next.js frontend, FastAPI backend, and Neon PostgreSQL database. Development is guided by Spec-Driven Development principles and uses AI agents for code generation.

## Project Structure

- `backend/`: FastAPI application for API endpoints and database interaction.
- `frontend/`: Next.js application for the user interface.
- `specs/`: Feature specifications, implementation plans, and task breakdowns.
- `.specify/`: Spec-Kit Plus configurations and templates.
- `history/`: Prompt History Records (PHRs).

## Setup & Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm (or yarn/pnpm)
- Git

### Backend Setup

1.  Navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a Python virtual environment:
    ```bash
    py -m venv .venv
    # On Windows:
    .\.venv\Scripts\activate
    # On macOS/Linux:
    source .venv/bin/activate
    ```
3.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in the `backend/` directory with your database URL and JWT secret:
    ```
    DATABASE_URL="postgresql://user:password@host:port/database"
    BETTER_AUTH_SECRET="your_very_secret_key_here"
    ```
    *Replace with your Neon PostgreSQL connection string and a strong secret key.*
5.  Run database migrations (initially this creates tables):
    ```bash
    # Ensure you are in the virtual environment
    uvicorn src.main:app --reload
    # This will trigger the `on_startup` event in main.py to create tables
    ```
6.  Start the FastAPI development server:
    ```bash
    uvicorn src.main:app --reload
    ```
    The backend API will be available at `http://127.0.0.1:8000/api`.

### Frontend Setup

1.  Navigate to the `frontend/` directory:
    ```bash
    cd frontend
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the `frontend/` directory with your backend API base URL:
    ```
    NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"
    ```
4.  Start the Next.js development server:
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:3000`.

## Deployment

### Backend (e.g., Railway, Render)

1.  **Containerization**: The `backend/Dockerfile` is configured for container deployment.
2.  **Environment Variables**: Ensure `DATABASE_URL` and `BETTER_AUTH_SECRET` are set in your deployment environment.
3.  **Start Command**: The `Dockerfile` specifies `uvicorn src.main:app --host 0.0.0.0 --port 8000`. Ensure your platform runs this command or equivalent.

### Frontend (Vercel)

1.  **Automatic Detection**: Vercel will automatically detect the Next.js project in the `frontend/` directory.
2.  **Build Settings**: Ensure the root directory for the Vercel project is set to `frontend/`.
3.  **Environment Variables**: Set `NEXT_PUBLIC_API_BASE_URL` in your Vercel project settings to the public URL of your deployed backend API.
4.  **Deployment**: Push your changes to GitHub, and Vercel will build and deploy automatically.

## AI Development Workflow

This project is developed using the Gemini CLI and adheres to a Spec-Driven Development (SDD) workflow:

1.  **Specification (`/sp.specify`)**: Define feature requirements, user stories, and acceptance criteria.
2.  **Planning (`/sp.plan`)**: Create technical plans, data models, and API contracts.
3.  **Task Breakdown (`/sp.tasks`)**: Generate an actionable list of implementation tasks.
4.  **Implementation (`/sp.implement`)**: Execute tasks by generating and modifying code.
5.  **Testing**: Automated tests are generated and executed throughout the development process.

## Contact

[Your Name/Team Name]
[Contact Information]
