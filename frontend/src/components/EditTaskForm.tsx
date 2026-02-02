"use client";

import React, { useState } from 'react';
import { TaskRead, updateTask, TaskCreate } from '@/lib/api';
import { useAuth } from '@/lib/auth_context';

interface EditTaskFormProps {
  task: TaskRead;
  onSave: () => void;
  onCancel: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
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
      const updatedData: TaskCreate = {
        title,
        description: description || undefined,
      };
      await updateTask(user.id, task.id, updatedData, token);
      onSave(); // Close form and refresh parent
    } catch (err: any) {
      setError(err.message || 'Failed to update task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <div>
        <label
          htmlFor="editTitle"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="editTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          className="
            w-full rounded-xl border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-900
            px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition
          "
        />
      </div>
      <div>
        <label
          htmlFor="editDescription"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="editDescription"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          className="
            w-full rounded-xl border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-900
            px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition resize-none
          "
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="
            rounded-lg px-4 py-2 text-sm font-medium
            border border-gray-300 dark:border-gray-600
            text-gray-700 dark:text-gray-300
            bg-white dark:bg-gray-800
            hover:bg-gray-50 dark:hover:bg-gray-700
            transition
          "
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="
            rounded-lg px-4 py-2 text-sm font-medium
            text-white
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-700 hover:to-purple-700
            disabled:opacity-60
            transition
          "
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditTaskForm;
