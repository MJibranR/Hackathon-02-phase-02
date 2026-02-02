import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/lib/auth_context';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import Header from '@/components/Header'; // Import Header for logout test
import { useRouter } from 'next/navigation';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock API calls
jest.mock('@/lib/api', () => ({
  signup: jest.fn((userData) => {
    if (userData.email === 'existing@example.com') {
      throw new Error('Email already registered');
    }
    return Promise.resolve({ id: 'user123', ...userData });
  }),
  login: jest.fn((loginData) => {
    if (loginData.email === 'test@example.com' && loginData.password === 'password123') {
      return Promise.resolve({ access_token: 'mock_token', token_type: 'bearer' });
    }
    throw new Error('Incorrect username or password');
  }),
  fetchCurrentUser: jest.fn((token) => {
    if (token === 'mock_token') {
      return Promise.resolve({ id: 'user123', email: 'test@example.com', name: 'Test User' });
    }
    throw new Error('Unauthorized');
  }),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

describe('Authentication Flows', () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();
  const mockSignup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for useAuth, can be overridden per test
    jest.spyOn(require('@/lib/auth_context'), 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      login: mockLogin,
      logout: mockLogout,
      signup: mockSignup,
    });
  });

  it('allows a user to sign up successfully and redirects to dashboard', async () => {
    jest.spyOn(require('@/lib/auth_context'), 'useAuth').mockReturnValue({
      user: null, token: null, isAuthenticated: false, login: mockLogin, logout: mockLogout, signup: mockSignup
    });
    require('@/lib/api').login.mockResolvedValueOnce({ access_token: 'new_mock_token', token_type: 'bearer' });
    require('@/lib/api').fetchCurrentUser.mockResolvedValueOnce({ id: 'user123', email: 'new@example.com', name: 'New User' });


    render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'securepassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(require('@/lib/api').signup).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        password: 'securepassword',
      });
      expect(mockLogin).toHaveBeenCalledWith('new_mock_token', { id: 'user123', email: 'new@example.com', name: 'New User' });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays an error if signup email is already registered', async () => {
    jest.spyOn(require('@/lib/auth_context'), 'useAuth').mockReturnValue({
      user: null, token: null, isAuthenticated: false, login: mockLogin, logout: mockLogout, signup: mockSignup
    });

    render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Existing User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'securepassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already registered')).toBeInTheDocument();
    });
  });

  it('displays an error if signup password is too short', async () => {
    jest.spyOn(require('@/lib/auth_context'), 'useAuth').mockReturnValue({
      user: null, token: null, isAuthenticated: false, login: mockLogin, logout: mockLogout, signup: mockSignup
    });

    render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Short Pass' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'short@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long.')).toBeInTheDocument();
    });
  });


  it('allows a user to log in successfully and redirects to dashboard', async () => {
    jest.spyOn(require('@/lib/auth_context'), 'useAuth').mockReturnValue({
      user: null, token: null, isAuthenticated: false, login: mockLogin, logout: mockLogout, signup: mockSignup
    });
    require('@/lib/api').login.mockResolvedValueOnce({ access_token: 'mock_token', token_type: 'bearer' });
    require('@/lib/api').fetchCurrentUser.mockResolvedValueOnce({ id: 'user123', email: 'test@example.com', name: 'Test User' });

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

    await waitFor(() => {
      expect(require('@/lib/api').login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith('mock_token', { id: 'user123', email: 'test@example.com', name: 'Test User' });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays an error for invalid login credentials', async () => {
    jest.spyOn(require('@/lib/auth_context'), 'useAuth').mockReturnValue({
      user: null, token: null, isAuthenticated: false, login: mockLogin, logout: mockLogout, signup: mockSignup
    });
    require('@/lib/api').login.mockRejectedValueOnce(new Error('Incorrect username or password'));

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

    await waitFor(() => {
      expect(screen.getByText('Incorrect username or password')).toBeInTheDocument();
    });
  });

  it('allows a logged-in user to log out and redirects to homepage', async () => {
    // Mock an authenticated state for the Header component
    jest.spyOn(require('@/lib/auth_context'), 'useAuth').mockReturnValue({
      user: { id: 'user123', email: 'test@example.com', name: 'Test User' },
      token: 'mock_token',
      isAuthenticated: true,
      login: mockLogin,
      logout: mockLogout,
      signup: mockSignup,
    });

    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
