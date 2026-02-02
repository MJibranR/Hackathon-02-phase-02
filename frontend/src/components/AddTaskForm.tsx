"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth_context';
import { createTask, TaskCreate } from '@/lib/api';

interface AddTaskFormProps {
  onTaskCreated: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!title.trim()) {
      setError('Title cannot be empty.');
      setLoading(false);
      return;
    }
    if (title.length > 200) {
      setError('Title must be less than 200 characters.');
      setLoading(false);
      return;
    }
    if (description && description.length > 1000) {
      setError('Description must be less than 1000 characters.');
      setLoading(false);
      return;
    }

    try {
      if (!user || !token) {
        throw new Error('User not authenticated.');
      }
      const taskData: TaskCreate = { title, description: description || undefined };
      await createTask(user.id, taskData, token);
      setTitle('');
      setDescription('');
      onTaskCreated();
      alert('Task created successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-fade-in-up"
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          placeholder="e.g. Finish hackathon TODO app 🚀"
          className="
            w-full rounded-xl border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-900
            px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition
          "
        />
        <p className="mt-1 text-xs text-gray-400 text-right">
          {title.length}/200
        </p>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          placeholder="Extra details, notes, or reminders…"
          className="
            w-full rounded-xl border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-900
            px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition resize-none
          "
        />
        <p className="mt-1 text-xs text-gray-400 text-right">
          {description.length}/1000
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full flex items-center justify-center gap-2
          rounded-xl
          bg-gradient-to-r from-indigo-600 to-purple-600
          px-5 py-3
          text-sm font-semibold text-white
          hover:from-indigo-700 hover:to-purple-700
          active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all
        "
      >
        {loading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Adding Task...
          </>
        ) : (
          '➕ Add Task'
        )}
      </button>
    </form>
  );
};

export default AddTaskForm;
