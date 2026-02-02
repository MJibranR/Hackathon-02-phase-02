import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/lib/auth_context';
import DashboardPage from '@/app/(main)/dashboard/page';
import { useRouter } from 'next/navigation';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock API calls from api.ts
jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'), // Keep actual implementations for other exports
  createTask: jest.fn((userId, taskData, token) => {
    if (!token) throw new Error('Unauthorized');
    if (!taskData.title) throw new Error('Title is required');
    return Promise.resolve({
      id: Math.floor(Math.random() * 1000) + 1, // Simulate a new ID
      user_id: userId,
      title: taskData.title,
      description: taskData.description || null,
      completed: false,
    });
  }),
  fetchTasks: jest.fn((userId, token) => {
    if (!token) throw new Error('Unauthorized');
    // Simulate some tasks
    return Promise.resolve([
      { id: 2, user_id: userId, title: 'Existing Task 2', description: 'Desc 2', completed: false },
      { id: 1, user_id: userId, title: 'Existing Task 1', description: 'Desc 1', completed: true },
    ]);
  }),
  updateTask: jest.fn((userId, taskId, taskData, token) => {
    if (!token) throw new Error('Unauthorized');
    return Promise.resolve({
      id: taskId,
      user_id: userId,
      title: taskData.title || 'Updated Title',
      description: taskData.description || 'Updated Desc',
      completed: taskData.completed || false,
    });
  }),
  deleteTask: jest.fn((userId, taskId, token) => {
    if (!token) throw new Error('Unauthorized');
    return Promise.resolve(); // Simulate successful deletion
  }),
  toggleTaskCompletion: jest.fn((userId, taskId, completed, token) => {
    if (!token) throw new Error('Unauthorized');
    return Promise.resolve({
      id: taskId,
      user_id: userId,
      title: 'Toggled Task',
      description: 'Desc',
      completed: completed,
    });
  }),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

// Mock window.alert
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});


describe('Dashboard and Task Management Flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAlert.mockClear();
    // Mock successful authentication for the dashboard page
    jest.spyOn(require('@/lib/auth_context'), 'useAuth').mockReturnValue({
      user: { id: 'user123', email: 'test@example.com', name: 'Test User' },
      token: 'mock_token',
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      signup: jest.fn(),
    });
  });

  afterAll(() => {
    mockAlert.mockRestore(); // Restore original alert
  });

  it('renders dashboard with tasks and allows task creation', async () => {
    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Welcome, Test User!')).toBeInTheDocument();
      expect(screen.getByText('Existing Task 2')).toBeInTheDocument();
      expect(screen.getByText('Existing Task 1')).toBeInTheDocument();
    });

    // Test task creation
    fireEvent.change(screen.getByLabelText(/Title \(required\)/i), {
      target: { value: 'Buy groceries' },
    });
    fireEvent.change(screen.getByLabelText(/Description \(optional\)/i), {
      target: { value: 'Milk, bread, eggs' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));

    await waitFor(() => {
      expect(require('@/lib/api').createTask).toHaveBeenCalledWith(
        'user123',
        { title: 'Buy groceries', description: 'Milk, bread, eggs' },
        'mock_token'
      );
      expect(mockAlert).toHaveBeenCalledWith('Task created successfully!');
      expect(screen.getByLabelText(/Title \(required\)/i)).toHaveValue('');
      expect(screen.getByLabelText(/Description \(optional\)/i)).toHaveValue('');
    });
  });

  it('allows a user to edit a task', async () => {
    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Existing Task 2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', { name: /Edit/i })[0]); // Click edit on first task

    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Task 2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Desc 2')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Edited Task Title' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(require('@/lib/api').updateTask).toHaveBeenCalledWith(
        'user123',
        2, // ID of 'Existing Task 2'
        { title: 'Edited Task Title', description: 'Desc 2' },
        'mock_token'
      );
      // After save, the edit form should close, so 'Save' button should disappear
      expect(screen.queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
    });
  });

  it('allows a user to delete a task', async () => {
    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Existing Task 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', { name: /Delete/i })[1]); // Click delete on 'Existing Task 1'

    await waitFor(() => {
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Delete/i, exact: true })); // Confirm deletion

    await waitFor(() => {
      expect(require('@/lib/api').deleteTask).toHaveBeenCalledWith('user123', 1, 'mock_token');
      // After deletion, the modal should be gone
      expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
    });
  });

  it('allows a user to toggle task completion', async () => {
    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Existing Task 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Existing Task 2')).not.toBeChecked(); // Should be false initially
    });

    fireEvent.click(screen.getByLabelText('Existing Task 2')); // Click checkbox to mark complete

    await waitFor(() => {
      expect(require('@/lib/api').toggleTaskCompletion).toHaveBeenCalledWith('user123', 2, true, 'mock_token');
    });

    fireEvent.click(screen.getByLabelText('Existing Task 2')); // Click checkbox to mark incomplete again

    await waitFor(() => {
      expect(require('@/lib/api').toggleTaskCompletion).toHaveBeenCalledWith('user123', 2, false, 'mock_token');
    });
  });

  it('displays an error if task title is empty during creation', async () => {
    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Title \(required\)/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));

    await waitFor(() => {
      expect(screen.getByText('Title cannot be empty.')).toBeInTheDocument();
      expect(require('@/lib/api').createTask).not.toHaveBeenCalled();
    });
  });

  it('displays an error if task title is too long during creation', async () => {
    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );

    const longTitle = 'a'.repeat(201); // > 200 chars
    fireEvent.change(screen.getByLabelText(/Title \(required\)/i), { target: { value: longTitle } });
    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));

    await waitFor(() => {
      expect(screen.getByText('Title must be less than 200 characters.')).toBeInTheDocument();
      expect(require('@/lib/api').createTask).not.toHaveBeenCalled();
    });
  });
});
