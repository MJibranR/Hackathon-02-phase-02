"use client";
import React, { useEffect } from 'react';
import { TaskRead } from '@/lib/api';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, TrendingUp, CheckCircle2, Clock, ArrowUpDown, X } from 'lucide-react';
import { format } from 'date-fns';

interface TaskReportCardProps {
  tasks: TaskRead[];
  onSortChange: (order: 'asc' | 'desc') => void;
  onDateChange: (date: Date | undefined) => void;
  currentSortOrder?: 'asc' | 'desc';
  selectedDate?: Date; // ✅ Add this prop
}

const TaskReportCard: React.FC<TaskReportCardProps> = ({ 
  tasks, 
  onSortChange, 
  onDateChange,
  currentSortOrder = 'desc',
  selectedDate // ✅ Receive selected date from parent
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleDateChange = (newDate: Date | undefined) => {
    console.log('Date selected:', newDate);
    onDateChange(newDate);
  };

  const handleSortToggle = () => {
    const newOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    console.log('Sort button clicked. Current:', currentSortOrder, '→ New:', newOrder);
    onSortChange(newOrder);
  };

  const clearDateFilter = () => {
    console.log('Clearing date filter');
    onDateChange(undefined);
  };

  // Debug: Log when props change
  useEffect(() => {
    console.log('TaskReportCard - currentSortOrder:', currentSortOrder, 'selectedDate:', selectedDate);
  }, [currentSortOrder, selectedDate]);

  // Get the button text based on current sort order
  const sortButtonText = currentSortOrder === 'asc' ? 'Oldest First' : 'Newest First';

  return (
    <section className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl animate-fade-in-up border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Task Report</h2>
        </div>
        {completionRate > 0 && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              {completionRate}% Complete
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Tasks */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Tasks</p>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{totalTasks}</p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-800/50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Completed</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{completedTasks}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-800/50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-yellow-100 dark:border-yellow-800 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pending</p>
              <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{pendingTasks}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-800/50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
              style={{ width: `${100 - completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Completion Rate Progress (Mobile) */}
      <div className="md:hidden mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion Rate</span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{completionRate}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        {/* Sort Button */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by Date:</span>
          <Button
            key={currentSortOrder}
            onClick={handleSortToggle}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-sm"
            size="sm"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span key={sortButtonText}>{sortButtonText}</span>
          </Button>
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full md:w-auto justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selectedDate ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Filter by date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" align="end">
              <Calendar
                mode="single"
                selected={selectedDate} // ✅ Use prop from parent
                onSelect={handleDateChange}
                initialFocus
                className="rounded-md"
              />
            </PopoverContent>
          </Popover>
          
          {selectedDate && ( // ✅ Use prop from parent
            <Button
              onClick={clearDateFilter}
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TaskReportCard;