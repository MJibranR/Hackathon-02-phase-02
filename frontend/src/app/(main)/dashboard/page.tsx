"use client";

import { useAuth } from '@/lib/auth_context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import AddTaskForm from '@/components/AddTaskForm';
import TaskList from '@/components/TaskList';
import TaskReportCard from '@/components/TaskReportCard';
import { fetchTasks, TaskRead } from '@/lib/api';
import { AuthError, ForbiddenError } from '@/lib/error_handling';

export default function DashboardPage() {
  const { user, isAuthenticated, token, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskRead[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorFetchingTasks, setErrorFetchingTasks] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // 👇 Client-only rendering to avoid hydration mismatch
  const [showClientContent, setShowClientContent] = useState(false);
  useEffect(() => {
    setShowClientContent(true);
  }, []);

  const getTasks = useCallback(async () => {
    if (!user || !token) return;
    setLoadingTasks(true);
    setErrorFetchingTasks(null);

    try {
      const fetchedTasks = await fetchTasks(user.id, token);
      setTasks(fetchedTasks);
    } catch (err: any) {
      if (err instanceof AuthError) {
        logout();
        router.push('/login');
        setErrorFetchingTasks('Session expired. Please log in again.');
      } else if (err instanceof ForbiddenError) {
        setErrorFetchingTasks('You do not have permission to view these tasks.');
      } else {
        setErrorFetchingTasks(err.message || 'Failed to fetch tasks.');
      }
    } finally {
      setLoadingTasks(false);
    }
  }, [user, token, logout, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch tasks after authentication
  useEffect(() => {
    if (isAuthenticated && user && token) {
      getTasks();
    }
  }, [isAuthenticated, user, token, getTasks]);

  const sortedAndFilteredTasks = useMemo(() => {
    let filtered = tasks;

    if (selectedDate) {
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.created_at);
        return taskDate.toDateString() === selectedDate.toDateString();
      });
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [tasks, sortOrder, selectedDate]);

  if (!showClientContent) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <p className="text-gray-700 dark:text-gray-300 text-lg">Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-4 md:p-8 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden font-sans">
      
      {/* Floating background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 opacity-30 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 opacity-30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>

      <main className="relative z-10 space-y-8 md:space-y-12 max-w-4xl mx-auto">
        {/* Add Task Section */}
        <section className="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-xl animate-fade-in-up">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Add a New Task</h2>
          <AddTaskForm onTaskCreated={getTasks} />
        </section>

        {/* Task Report Section */}
<TaskReportCard 
  tasks={tasks}
  onSortChange={setSortOrder}
  onDateChange={setSelectedDate}
  currentSortOrder={sortOrder}
  selectedDate={selectedDate}
/>

        {/* Task List Section */}
        <section className="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-xl animate-fade-in-up">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Your Tasks</h2>
          {errorFetchingTasks && <p className="text-red-500 mb-4">{errorFetchingTasks}</p>}
          {loadingTasks ? (
            <p className="text-gray-700 dark:text-gray-300">Loading tasks...</p>
          ) : (
            <TaskList tasks={sortedAndFilteredTasks} onTaskUpdate={getTasks} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center bg-indigo-100 dark:bg-gray-800 relative z-10 mt-12 md:mt-16">
        <p className="text-gray-700 dark:text-gray-300">Made with 💓 by Muhammad Jibran Rehan</p>
      </footer>

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }

        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 1s ease forwards; }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 1s ease forwards; }
      `}</style>
    </div>
  );
}