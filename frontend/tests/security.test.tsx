import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/lib/auth_context';
import DashboardPage from '@/app/(main)/dashboard/page';
import { useRouter } from 'next/navigation';
import { AuthError, ForbiddenError } from '@/lib/error_handling';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock API calls from api.ts
jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'), // Keep actual implementations for other exports
  fetchTasks: jest.fn((userId, token) => {
    if (token === 'expired_token') {
      throw new AuthError('Session expired.');
    }
    if (userId === 'unauthorized_user_id') {
      throw new ForbiddenError('Not authorized to view these tasks.');
    }
    return Promise.resolve([]);
  }),
}));

const mockPush = jest.fn();
const mockLogout = jest.fn();

(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

describe('Frontend Security Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockLogout.mockClear();
    jest.spyOn(require('@/lib/auth_context'), 'useAuth').mockReturnValue({
      user: { id: 'test_user_id', email: 'test@example.com', name: 'Test User' },
      token: 'valid_token',
      isAuthenticated: true,
      login: jest.fn(),
      logout: mockLogout,
      signup: jest.fn(),
    });
  });

  it('redirects to login and shows error message on AuthError (401)', async () => {
    jest.spyOn(require('@/lib/auth_context'), 'useAuth').mockReturnValue({
        user: { id: 'test_user_id', email: 'test@example.com', name: 'Test User' },
        token: 'expired_token', // Simulate an expired token
        isAuthenticated: true,
        login: jest.fn(),
        logout: mockLogout,
        signup: jest.fn(),
    });

    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
      expect(screen.getByText('Session expired. Please log in again.')).toBeInTheDocument();
    });
  });

  it('shows forbidden error message on ForbiddenError (403)', async () => {
    jest.spyOn(require('@/lib/auth_context'), 'useAuth').mockReturnValue({
        user: { id: 'unauthorized_user_id', email: 'unauth@example.com', name: 'Unauthorized User' },
        token: 'valid_token',
        isAuthenticated: true,
        login: jest.fn(),
        logout: mockLogout,
        signup: jest.fn(),
    });

    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('You do not have permission to view these tasks.')).toBeInTheDocument();
    });
  });

  it('shows generic error message for other API errors', async () => {
    jest.spyOn(require('@/lib/api'), 'fetchTasks').mockImplementation(() => {
        throw new Error('Something went wrong on the server.');
    });

    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Something went wrong on the server.')).toBeInTheDocument();
    });
  });
});
