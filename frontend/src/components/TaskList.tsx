"use client";

import React, { useMemo, useState } from "react";
import { TaskRead } from "@/lib/api";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: TaskRead[];
  onTaskUpdate: () => void;
}

type FilterType = "all" | "pending" | "completed";

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdate }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "completed"
          ? task.completed
          : !task.completed;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  return (
    <div className="space-y-5">
      {/* Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            flex-1 rounded-xl border-2 border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-900
            px-4 py-3 text-sm
            text-gray-800 dark:text-gray-200
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition-all duration-200
          "
        />

        {/* Filter */}
        <div className="flex rounded-xl border-2 border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
          {(["all", "pending", "completed"] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`
                px-5 py-3 text-sm font-semibold transition-all duration-200
                ${
                  filter === type
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }
              `}
            >
              {type === "all"
                ? "All"
                : type === "pending"
                ? "Pending"
                : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="w-16 h-16 text-gray-300 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No tasks found
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {search
                ? "Try adjusting your search or filter"
                : "Add a new task to get started!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in-up">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onTaskUpdate={onTaskUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;