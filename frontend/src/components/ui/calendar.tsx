"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-base font-semibold text-gray-900 dark:text-gray-100",
        nav: "space-x-1 flex items-center",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-white dark:bg-gray-700 p-0 opacity-70 hover:opacity-100 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 absolute left-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-white dark:bg-gray-700 p-0 opacity-70 hover:opacity-100 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 absolute right-1"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-gray-600 dark:text-gray-400 rounded-md w-10 font-semibold text-sm uppercase tracking-wide",
        week: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-gradient-to-br [&:has([aria-selected])]:from-indigo-50 [&:has([aria-selected])]:to-purple-50",
          "dark:[&:has([aria-selected])]:from-indigo-900/30 dark:[&:has([aria-selected])]:to-purple-900/30",
          "first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        ),
        selected: cn(
          "bg-gradient-to-br from-indigo-500 to-purple-600",
          "text-white font-bold",
          "hover:from-indigo-600 hover:to-purple-700",
          "focus:from-indigo-600 focus:to-purple-700",
          "shadow-md hover:shadow-lg",
          "transform hover:scale-105 transition-all duration-200"
        ),
        today: cn(
          "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30",
          "text-green-700 dark:text-green-400",
          "font-bold border-2 border-green-500 dark:border-green-400",
          "hover:bg-green-100 dark:hover:bg-green-800/40"
        ),
        outside: cn(
          "text-gray-400 dark:text-gray-600 opacity-40",
          "hover:text-gray-500 dark:hover:text-gray-500"
        ),
        disabled: "text-gray-300 dark:text-gray-700 opacity-40 cursor-not-allowed hover:bg-transparent",
        range_middle: cn(
          "aria-selected:bg-gradient-to-r aria-selected:from-indigo-100 aria-selected:to-purple-100",
          "dark:aria-selected:from-indigo-900/20 dark:aria-selected:to-purple-900/20",
          "aria-selected:text-gray-900 dark:aria-selected:text-gray-100"
        ),
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight
          return <Icon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }