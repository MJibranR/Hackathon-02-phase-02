export interface UserRead {
    id: string;
    email: string;
    name: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface UserCreate {
    email: string;
    name: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface TaskCreate {
    title: string;
    description?: string;
}

export interface TaskRead {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export class AuthError extends Error {
    constructor(message = "Authentication required or session expired.") {
        super(message);
        this.name = "AuthError";
    }
}

export class ForbiddenError extends Error {
    constructor(message = "You do not have permission to perform this action.") {
        super(message);
        this.name = "ForbiddenError";
    }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://hackathon-02-phase-02-j7c4.vercel.app";

async function apiRequest<T>(
    method: string,
    path: string,
    data?: any,
    token?: string
): Promise<T> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new AuthError();
        }
        if (response.status === 403) {
            throw new ForbiddenError();
        }

        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: response.statusText };
        }
        throw new Error(errorData.detail || "API request failed");
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json() as Promise<T>;
}

export const signup = async (userData: UserCreate): Promise<UserRead> => {
    return apiRequest<UserRead>("POST", "/api/signup", userData);
};

export const login = async (loginData: UserLogin): Promise<Token> => {
    const formBody = new URLSearchParams();
    formBody.append("username", loginData.email);
    formBody.append("password", loginData.password);

    const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: response.statusText };
        }
        throw new Error(errorData.detail || "Login failed");
    }
    return response.json() as Promise<Token>;
};

export const fetchCurrentUser = async (token: string): Promise<UserRead> => {
    return apiRequest<UserRead>("GET", "/api/me", undefined, token);
};

export const createTask = async (userId: string, taskData: TaskCreate, token: string): Promise<TaskRead> => {
    return apiRequest<TaskRead>("POST", `/api/${userId}/tasks`, taskData, token);
};

export const fetchTasks = async (userId: string, token: string): Promise<TaskRead[]> => {
    return apiRequest<TaskRead[]>("GET", `/api/${userId}/tasks`, undefined, token);
};

export const fetchTaskById = async (userId: string, taskId: number, token: string): Promise<TaskRead> => {
    return apiRequest<TaskRead>("GET", `/api/${userId}/tasks/${taskId}`, undefined, token);
};

export const updateTask = async (userId: string, taskId: number, taskData: TaskCreate, token: string): Promise<TaskRead> => {
    return apiRequest<TaskRead>("PUT", `/api/${userId}/tasks/${taskId}`, taskData, token);
};

export const deleteTask = async (userId: string, taskId: number, token: string): Promise<void> => {
    return apiRequest<void>("DELETE", `/api/${userId}/tasks/${taskId}`, undefined, token);
};

export const toggleTaskCompletion = async (userId: string, taskId: number, completed: boolean, token: string): Promise<TaskRead> => {
    return apiRequest<TaskRead>("PATCH", `/api/${userId}/tasks/${taskId}/complete`, { completed }, token);
};