# Tasks: PHASE II SPECIFICATION - FULL-STACK TODO WEB APPLICATION

**Feature Branch**: `1-multiuser-todo-app`
**Created**: 2026-01-25
**Status**: Generated
**Input**:
  - `specs/1-multiuser-todo-app/plan.md`
  - `specs/1-multiuser-todo-app/spec.md`
  - `specs/1-multiuser-todo-app/data-model.md`
  - `specs/1-multiuser-todo-app/contracts/openapi.yaml`
  - `specs/1-multiuser-todo-app/research.md`

## Implementation Strategy

This project will follow an iterative and incremental implementation strategy, prioritizing user stories as defined in the specification. Each user story will be implemented as a self-contained, testable increment. Parallelization opportunities between frontend and backend tasks within each story will be leveraged where dependencies allow. The focus will be on delivering a Minimal Viable Product (MVP) that covers User Story 1 first, followed by subsequent stories and then cross-cutting concerns.

## Dependency Graph (User Story Completion Order)

1.  User Story 1: New User Signup and First Task Creation (P1)
    *   **Depends on:** Phase 1 (Setup), Phase 2 (Foundational)
2.  User Story 2: Returning User Task Management (P1)
    *   **Depends on:** User Story 1
3.  User Story 3: Multi-User Data Isolation (P1)
    *   **Depends on:** User Story 1 and User Story 2

## Parallel Execution Examples (per User Story)

### User Story 1: New User Signup and First Task Creation

*   **Backend Parallel:** Implement User model and authentication API routes concurrently with Task model and task creation API.
*   **Frontend Parallel:** Develop signup/login forms concurrently with the dashboard and create task form.

### User Story 2: Returning User Task Management

*   **Backend Parallel:** Implement API routes for viewing, updating, deleting, and marking tasks complete/incomplete.
*   **Frontend Parallel:** Develop UI components for displaying task list, edit forms, delete confirmation, and completion toggles.

### User Story 3: Multi-User Data Isolation

*   **Backend Parallel:** Develop JWT middleware logic for user_id extraction and authorization checks.
*   **Frontend Parallel:** Implement client-side logic to ensure correct user context is passed with requests.

## Phase 1: Setup

These tasks prepare the development environment and initial project structure.

- [X] T001 Initialize the backend project with FastAPI in `backend/`
- [X] T002 Configure a virtual environment and install initial Python dependencies (`fastapi`, `uvicorn`, `sqlmodel`, `psycopg2-binary`, `python-jose[cryptography]`, `passlib[bcrypt]`, `python-multipart`, `pydantic-settings`, `dotenv`) in `backend/`
- [X] T003 Initialize the frontend project with Next.js (App Router, TypeScript, Tailwind CSS) in `frontend/`
- [X] T004 Configure initial Next.js settings and `tailwind.config.ts` in `frontend/`
- [X] T005 Create `backend/src/main.py` with basic FastAPI app instance
- [X] T006 Create `frontend/app/layout.tsx` with basic Tailwind CSS styling

## Phase 2: Foundational

These tasks establish core services and utilities required across multiple user stories.

- [X] T007 [P] Implement database connection and session management in `backend/src/db.py`
- [X] T008 [P] Configure environment variables for backend (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.) using `pydantic-settings` in `backend/src/config.py`
- [X] T009 [P] Setup basic logging configuration for the backend in `backend/src/logger.py`
- [X] T010 [P] Setup backend test environment with Pytest in `backend/tests/`
- [X] T011 [P] Setup frontend test environment with Jest/React Testing Library in `frontend/tests/`

## Phase 3: User Story 1 - New User Signup and First Task Creation [US1]

**Goal**: Enable new users to sign up, log in automatically, and create their first task.
**Independent Test Criteria**: A new user can successfully create an account, log in, and create a task that appears in their dashboard.

### Backend - User Authentication & Task Creation (US1)

- [X] T012 [P] [US1] Create `User` model using SQLModel in `backend/src/models/user.py`
- [X] T013 [P] [US1] Create `Task` model using SQLModel with `user_id` foreign key in `backend/src/models/task.py`
- [X] T014 [P] [US1] Implement user authentication service (`signup`, `login`) using Better Auth principles in `backend/src/services/auth_service.py`
- [X] T015 [P] [US1] Implement FastAPI routes for user signup (`POST /api/signup`) in `backend/src/api/auth.py`
- [X] T016 [P] [US1] Implement FastAPI routes for user login (`POST /api/login`) in `backend/src/api/auth.py`
- [X] T017 [P] [US1] Implement dependency for JWT token verification and user extraction in `backend/src/auth/jwt.py`
- [X] T018 [P] [US1] Implement task creation service in `backend/src/services/task_service.py`
- [X] T019 [P] [US1] Implement FastAPI route for task creation (`POST /api/{user_id}/tasks`) in `backend/src/api/tasks.py`
- [X] T020 [P] [US1] Add integration tests for user signup and login in `backend/tests/test_auth.py`
- [X] T021 [P] [US1] Add integration tests for task creation in `backend/tests/test_tasks.py`

### Frontend - User Authentication & Task Creation UI (US1)

- [X] T022 [P] [US1] Create `AuthContext` to manage JWT token in React state in `frontend/src/lib/auth_context.tsx`
- [X] T023 [P] [US1] Create API client for authentication and tasks in `frontend/src/lib/api.ts`
- [X] T024 [P] [US1] Create signup form component in `frontend/src/components/SignupForm.tsx`
- [X] T025 [P] [US1] Create login form component in `frontend/src/components/LoginForm.tsx`
- [X] T026 [P] [US1] Create authentication pages (`/signup`, `/login`) in `frontend/app/(auth)/`
- [X] T027 [P] [US1] Implement routing for authenticated users to dashboard and unauthenticated to auth pages in `frontend/app/middleware.ts`
- [X] T028 [P] [US1] Create dashboard page component in `frontend/app/(main)/dashboard/page.tsx`
- [X] T029 [P] [US1] Create "Add Task" form component in `frontend/src/components/AddTaskForm.tsx`
- [X] T030 [P] [US1] Integrate Add Task form into dashboard page in `frontend/app/(main)/dashboard/page.tsx`
- [X] T031 [P] [US1] Add integration tests for signup/login flow in `frontend/tests/auth.test.tsx`
- [X] T032 [P] [US1] Add integration tests for task creation flow in `frontend/tests/tasks.test.tsx`

## Phase 4: User Story 2 - Returning User Task Management [US2]

**Goal**: Allow authenticated users to view, update, delete, and mark tasks complete/incomplete.
**Independent Test Criteria**: An authenticated user can perform all CRUD operations on their own tasks and see immediate updates.

### Backend - Task Management API (US2)

- [X] T033 [P] [US2] Implement task retrieval service (`get_all_tasks`, `get_task_by_id`) in `backend/src/services/task_service.py`
- [X] T034 [P] [US2] Implement task update service in `backend/src/services/task_service.py`
- [X] T035 [P] [US2] Implement task deletion service in `backend/src/services/task_service.py`
- [X] T036 [P] [US2] Implement task completion toggle service in `backend/src/services/task_service.py`
- [X] T037 [P] [US2] Implement FastAPI routes for task retrieval (`GET /api/{user_id}/tasks`, `GET /api/{user_id}/tasks/{id}`) in `backend/src/api/tasks.py`
- [X] T038 [P] [US2] Implement FastAPI route for task update (`PUT /api/{user_id}/tasks/{id}`) in `backend/src/api/tasks.py`
- [X] T039 [P] [US2] Implement FastAPI route for task deletion (`DELETE /api/{user_id}/tasks/{id}`) in `backend/src/api/tasks.py`
- [X] T040 [P] [US2] Implement FastAPI route for task completion toggle (`PATCH /api/{user_id}/tasks/{id}/complete`) in `backend/src/api/tasks.py`
- [X] T041 [P] [US2] Add integration tests for task retrieval, update, delete, and completion in `backend/tests/test_tasks.py`

### Frontend - Task Management UI (US2)

- [X] T042 [P] [US2] Create task list display component in `frontend/src/components/TaskList.tsx`
- [X] T043 [P] [US2] Create task item component with view, edit, delete, complete actions in `frontend/src/components/TaskItem.tsx`
- [X] T044 [P] [US2] Create edit task form component in `frontend/src/components/EditTaskForm.tsx`
- [X] T045 [P] [US2] Implement confirmation modal for task deletion in `frontend/src/components/DeleteConfirmationModal.tsx`
- [X] T046 [P] [US2] Integrate task list and item components into dashboard page in `frontend/app/(main)/dashboard/page.tsx`
- [X] T047 [P] [US2] Implement logout button on dashboard header in `frontend/src/components/Header.tsx`
- [X] T048 [P] [US2] Add integration tests for viewing, updating, deleting, and completing tasks in `frontend/tests/tasks.test.tsx`
- [X] T049 [P] [US2] Add integration test for logout flow in `frontend/tests/auth.test.tsx`

## Phase 5: User Story 3 - Multi-User Data Isolation [US3]

**Goal**: Ensure complete data isolation between users.
**Independent Test Criteria**: User A cannot view or modify User B's tasks; attempts result in 403 errors.

### Backend - Data Isolation Enforcement (US3)

- [X] T050 [P] [US3] Enhance JWT token verification to extract `user_id` and ensure it matches the `{user_id}` in API path parameters in `backend/src/auth/jwt.py`
- [X] T051 [P] [US3] Implement authorization checks in task services to filter all queries by authenticated `user_id` in `backend/src/services/task_service.py`
- [X] T052 [P] [US3] Add unit/integration tests to verify 403 Forbidden responses for unauthorized access attempts to other users' tasks in `backend/tests/test_security.py`

### Frontend - Data Isolation UI (US3)

- [X] T053 [P] [US3] Ensure frontend API client always sends `user_id` from current user's token in requests, not allowing arbitrary `user_id` input in `frontend/src/lib/api.ts`
- [X] T054 [P] [US3] Implement client-side handling for 401/403 responses (e.g., redirect to login on 401, display generic error on 403) in `frontend/src/lib/error_handling.ts`
- [X] T055 [P] [US3] Add integration tests to simulate unauthorized access attempts and verify correct frontend behavior (e.g., redirection, error messages) in `frontend/tests/security.test.tsx`

## Phase 6: Polish & Cross-Cutting Concerns

This phase addresses non-functional requirements, error handling, deployment, and overall refinement.

### Error Handling & Validation

- [X] T056 [P] Implement comprehensive backend error handling with `HTTPException` for all defined error cases (400, 401, 403, 404) in `backend/src/error_handlers.py`
- [X] T057 [P] Implement frontend global error boundary or centralized error display mechanism in `frontend/app/error.tsx` or `frontend/src/components/ErrorBoundary.tsx`
- [X] T058 [P] Implement frontend input validation (e.g., Zod) for all forms (`Signup`, `Login`, `AddTask`, `EditTask`) in `frontend/src/lib/validation.ts`
- [X] T059 [P] Implement robust backend input validation using Pydantic models for all API request bodies and path parameters in `backend/src/schemas.py` and API routes.

### UI/UX Refinements

- [X] T060 [P] Implement loading indicators for all asynchronous operations (API calls) in frontend components (`AddTaskForm`, `TaskList`, etc.)
- [X] T061 [P] Ensure all forms and interactive elements support keyboard navigation in `frontend/` components
- [X] T062 [P] Implement basic accessibility (`aria-labels`, semantic HTML) for key UI components in `frontend/`
- [X] T063 [P] Refine responsive design using Tailwind CSS for all pages (`frontend/app/`, `frontend/src/components/`)
- [X] T064 [P] Implement clear, user-friendly messages for all success and error scenarios in `frontend/`

### Deployment & CI/CD

- [X] T065 [P] Create `Dockerfile` for backend deployment to Railway/Render in `backend/Dockerfile`
- [X] T066 [P] Create `requirements.txt` for backend dependencies in `backend/requirements.txt`
- [X] T067 [P] Configure Vercel deployment for frontend (if not already handled by Next.js defaults)
- [X] T068 [P] Document deployment steps for both frontend and backend in `README.md`
- [X] T069 [P] Configure CI/CD pipelines (e.g., GitHub Actions) for automated testing and deployment for both frontend and backend

### Documentation & Finalization

- [X] T070 [P] Update `README.md` with project overview, setup instructions, and usage guide
- [X] T071 [P] Create `CLAUDE.md` to summarize AI interaction and development process
- [X] T072 [P] Review and verify all success criteria are met
- [X] T073 [P] Record 90-second demo video

## Suggested MVP Scope

The Minimal Viable Product (MVP) for this feature would encompass **User Story 1: New User Signup and First Task Creation**. This includes:

-   Backend: User signup, login (JWT issuance), Task model, Task creation API.
-   Frontend: Signup/login forms, Dashboard with "Add Task" form, basic task list display (even if empty initially).

Successfully completing Phase 3 (User Story 1) delivers a functional core that allows new users to engage with the application, providing a foundation for subsequent features.

## Independent Test Criteria (per User Story)

These are derived directly from the `spec.md` for quick reference.

### User Story 1: New User Signup and First Task Creation

-   A new user can successfully create an account.
-   The new user is automatically logged in upon signup.
-   The new user can successfully add a task.
-   The created task appears in the user's task list.
-   Validation errors are shown for non-unique email or short password during signup.

### User Story 2: Returning User Task Management

-   An authenticated user can successfully log in.
-   The user can view all their own tasks.
-   The user can update a task's title and/or description.
-   The user can delete a task after confirmation.
-   The user can toggle a task's completion status.
-   An authenticated user can successfully log out.

### User Story 3: Multi-User Data Isolation

-   User A cannot see User B's tasks.
-   User A cannot modify User B's tasks.
-   Attempts to access/modify other users' tasks result in a 403 Forbidden error from the API.
-   All task queries return only tasks belonging to the authenticated user.
