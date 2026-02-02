# Data Model: PHASE II SPECIFICATION - FULL-STACK TODO WEB APPLICATION

**Date**: 2026-01-25
**Feature**: `1-multiuser-todo-app`
**Source**: Feature specification from `specs/1-multiuser-todo-app/spec.md` and project constitution from `.specify/memory/constitution.md`

## Entities

### User

Represents an individual user of the application, managed by the Better Auth library.

| Attribute       | Type      | Constraints             | Description                                  |
| :-------------- | :-------- | :---------------------- | :------------------------------------------- |
| `id`            | String    | PRIMARY KEY             | Unique identifier for the user.              |
| `email`         | String    | UNIQUE, NOT NULL        | User's email address, used for login.        |
| `name`          | String    |                         | User's display name.                         |
| `password_hash` | String    | NOT NULL                | Hashed password for security.                |
| `created_at`    | Timestamp |                         | Timestamp of user creation.                  |
| `updated_at`    | Timestamp |                         | Timestamp of last user update.               |

### Task

Represents a single to-do item belonging to a user.

| Attribute       | Type      | Constraints                                  | Description                                            |
| :-------------- | :-------- | :------------------------------------------- | :----------------------------------------------------- |
| `id`            | Integer   | PRIMARY KEY, Auto-incrementing               | Unique identifier for the task.                        |
| `user_id`       | String    | FOREIGN KEY (REFERENCES `User.id`), NOT NULL | Identifier of the user who owns this task.             |
| `title`         | String    | NOT NULL, Max 200 characters                 | Brief description of the task.                         |
| `description`   | Text      | Optional, Max 1000 characters                | Detailed description of the task.                      |
| `completed`     | Boolean   | DEFAULT `false`                              | Indicates if the task is completed.                    |
| `created_at`    | Timestamp | DEFAULT `now()`                              | Timestamp of task creation.                            |
| `updated_at`    | Timestamp | DEFAULT `now()`                              | Timestamp of last task update.                         |

## Relationships

### User to Task (One-to-Many)

-   A `User` can create and own multiple `Tasks`.
-   Each `Task` is owned by exactly one `User`.
-   The relationship is enforced by the `user_id` foreign key in the `Task` entity, referencing the `id` of the `User` entity.

## Validation Rules

### User

-   `email`: Must be unique across all users.
-   `password`: Minimum 8 characters during signup.

### Task

-   `title`: Required, must be between 1 and 200 characters.
-   `description`: Optional, maximum 1000 characters.