"use client";

import React, { useState } from "react";
import { TaskRead, deleteTask, toggleTaskCompletion } from "@/lib/api";
import { useAuth } from "@/lib/auth_context";
import EditTaskForm from "./EditTaskForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { format } from "date-fns";

interface TaskItemProps {
  task: TaskRead;
  onTaskUpdate: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdate }) => {
  const { user, token } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleCompletion = async () => {
    if (!user || !token) return;
    setLoading(true);
    await toggleTaskCompletion(user.id, task.id, !task.completed, token);
    onTaskUpdate();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!user || !token) return;
    setLoading(true);
    await deleteTask(user.id, task.id, token);
    onTaskUpdate();
    setShowDeleteModal(false);
    setLoading(false);
  };

  // Format dates cleanly
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div
      className="
        rounded-xl border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900
        px-4 py-3
        transition hover:shadow-md
      "
    >
      {isEditing ? (
        <EditTaskForm
          task={task}
          onSave={() => {
            setIsEditing(false);
            onTaskUpdate();
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Left */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleCompletion}
              disabled={loading}
              className="mt-1 h-5 w-5 accent-indigo-600 cursor-pointer"
            />

            <div>
              <h3
                className={`font-semibold text-base ${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {task.title}
              </h3>

              {task.description && (
                <p
                  className={`mt-1 text-sm ${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {task.description}
                </p>
              )}

              <div className="mt-3 flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Created:</span>
                  <span>{formatDate(task.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Updated:</span>
                  <span>{formatDate(task.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="
                rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold
                text-white hover:bg-indigo-600 transition-all duration-200
                shadow-sm hover:shadow-md
              "
            >
              Edit
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="
                rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold
                text-white hover:bg-red-600 transition-all duration-200
                shadow-sm hover:shadow-md
              "
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default TaskItem;