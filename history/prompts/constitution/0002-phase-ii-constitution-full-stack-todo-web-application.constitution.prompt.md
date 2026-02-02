---
id: "0002"
title: "Phase II Constitution - Full-Stack Todo Web Application"
stage: "constitution"
date: "2026-01-25"
surface: "agent"
model: "gemini-1.5-flash-latest"
feature: "none"
branch: "main"
user: "user"
command: "/sp.constitution PHASE II CONSTITUTION - FULL-STACK TODO WEB APPLICATION

PROJECT OVERVIEW
Build a multi-user todo web application with Next.js frontend, FastAPI backend, and Neon PostgreSQL database using spec-driven development with AI agents.

CORE PRINCIPLES

1. Spec-Driven Development
- No code without specification
- Human writes specs, AI generates code
- Iteration through spec refinement
- Every feature traceable to spec

2. Security First
- JWT authentication mandatory
- User data completely isolated
- No user can access another's data
- Passwords hashed, tokens expire

3. Clean Code
- TypeScript strict mode
- Python type hints required
- Descriptive names
- Proper error handling

4. AI-Generated Code
- All code via Gemini CLI or Claude Code
- Zero manual coding
- Spec-Kit Plus workflow

5. User Experience
- Responsive design
- Clear error messages
- Loading indicators
- Accessible UI

TECHNOLOGY STACK

Frontend:
- Next.js 16+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Better Auth (JWT tokens)
- No localStorage

Backend:
- Python FastAPI
- SQLModel ORM
- Async/await patterns
- JWT verification
- Pydantic validation

Database:
- Neon Serverless PostgreSQL
- Two tables: users, tasks
- Indexes on user_id, completed
- Foreign key constraints

ARCHITECTURE RULES

Project Structure:
```
hackathon-todo/
├── specs/
│   ├── features/
│   ├── api/
│   ├── database/
│   └── ui/
├── frontend/
│   ├── app/
│   ├── components/
│   └── lib/
├── backend/
│   ├── main.py
│   ├── models.py
│   └── routes/
├── CLAUDE.md
└── README.md
```

Frontend Patterns:
- Server Components default
- Client Components for interactivity
- API client in /lib/api.ts
- JWT in React state only
- Forms with validation

Backend Patterns:
- RESTful API design
- All routes: /api/{user_id}/...
- JWT verification middleware
- User-specific queries
- Async database operations

Security Flow:
1. User logs in → Better Auth issues JWT
2. Token stored in React state
3. Every API call: Authorization: Bearer <token>
4. Backend verifies token signature
5. Extract user_id from token
6. Validate user_id matches URL
7. Filter all queries by user_id

API DESIGN

Endpoints:
- GET /api/{user_id}/tasks
- POST /api/{user_id}/tasks
- GET /api/{user_id}/tasks/{id}
- PUT /api/{user_id}/tasks/{id}
- PATCH /api/{user_id}/tasks/{id}/complete
- DELETE /api/{user_id}/tasks/{id}

Request Format:
- JSON only
- Authorization header required
- Pydantic validation

Response Format:
- JSON with proper status codes
- 200: Success (GET, PUT, PATCH)
- 201: Created (POST)
- 204: Deleted (DELETE)
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden
- 404: Not found

DATABASE SCHEMA

users table (Better Auth):
- id: string PRIMARY KEY
- email: string UNIQUE NOT NULL
- name: string
- password_hash: string NOT NULL
- created_at: timestamp
- updated_at: timestamp

tasks table:
- id: serial PRIMARY KEY
- user_id: string REFERENCES users(id)
- title: varchar(200) NOT NULL
- description: text
- completed: boolean DEFAULT false
- created_at: timestamp DEFAULT now()
- updated_at: timestamp DEFAULT now()

Indexes:
- CREATE INDEX idx_tasks_user_id ON tasks(user_id)
- CREATE INDEX idx_tasks_completed ON tasks(completed)

CODE QUALITY STANDARDS

TypeScript Rules:
- Explicit types on functions
- Interfaces for data structures
- No implicit any
- PascalCase for components
- camelCase for functions

Python Rules:
- Type hints on all functions
- Async for I/O operations
- snake_case naming
- HTTPException for errors
- Docstrings on complex functions

Error Handling:
- Try-catch blocks
- User-friendly messages
- Log errors server-side
- Never expose stack traces

SECURITY REQUIREMENTS

Authentication:
- JWT tokens expire in 7 days
- BETTER_AUTH_SECRET env variable
- Never log passwords or tokens
- Hash passwords (Better Auth handles)

Authorization:
- Verify token on every request
- Match user_id from token to URL
- Return 403 if unauthorized
- Filter queries by user_id

Data Protection:
- SQL injection prevented (SQLModel)
- XSS prevented (React escaping)
- CORS for specific frontend only
- HTTPS in production
- Environment variables for secrets

DEPLOYMENT REQUIREMENTS

Frontend (Vercel):
- Deploy from /frontend
- Environment variables set
- Public URL accessible
- Auto HTTPS enabled

Backend (Railway/Render):
- Start: uvicorn main:app --host 0.0.0.0 --port $PORT
- Environment variables set
- Public API URL
- CORS allows frontend

Database (Neon):
- Serverless PostgreSQL
- SSL required
- Connection pooling
- DATABASE_URL env variable

DEVELOPMENT WORKFLOW

1. Write specification
2. Generate plan
3. Break into tasks
4. Implement via AI
5. Test functionality
6. Iterate if needed
7. Commit to GitHub
8. Deploy to production

CONSTRAINTS

Development:
- No manual coding
- Must use Spec-Kit Plus
- Individual work only
- Specified tech stack only

Technical:
- JWT expires max 7 days
- No localStorage usage
- Next.js 16+ App Router
- Python 3.11+ FastAPI
- Neon PostgreSQL only

Timeline:
- Deadline: Dec 14, 2025
- Demo video: 90 seconds max
- Public GitHub repo required

SUCCESS CRITERIA

Functional:
- All 5 CRUD operations work
- Authentication functional
- Multi-user data isolation
- Deployed with public URLs
- Zero manual code

Technical:
- API response < 500ms
- Frontend load < 3 seconds
- No security vulnerabilities
- 100% spec coverage

Submission:
- GitHub repo with specs
- CLAUDE.md and README
- Deployed frontend URL
- Deployed backend URL
- 90-second demo video

---

## Prompt

{{PROMPT_TEXT}}

## Response snapshot

{{RESPONSE_TEXT}}

## Outcome

- ✅ Impact: {{OUTCOME_IMPACT}}
- 🧪 Tests: {{TESTS_SUMMARY}}
- 📁 Files: {{FILES_SUMMARY}}
- 🔁 Next prompts: {{NEXT_PROMPTS}}
- 🧠 Reflection: {{REFLECTION_NOTE}}

## Evaluation notes (flywheel)

- Failure modes observed: {{FAILURE_MODES}}
- Graders run and results (PASS/FAIL): {{GRADER_RESULTS}}
- Prompt variant (if applicable): {{PROMPT_VARIANT_ID}}
- Next experiment (smallest change to try): {{NEXT_EXPERIMENT}}