import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  MapPin,
} from "lucide-react";
import { cn } from "../../lib/utils";

const CalendarView: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Helper functions for calendar rendering
  const getDaysInMonth = (month: number, year: number): number =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number): number =>
    new Date(year, month, 1).getDay();

  // Calendar navigation
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Generate calendar grid
  const renderCalendarDays = () => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = getFirstDayOfMonth(month, year);

    // Sample events data for demonstration
    const events: Record<
      number,
      Array<{ title: string; time: string; type: string }>
    > = {
      5: [{ title: "Team Standup", time: "09:00 AM", type: "meeting" }],
      12: [{ title: "Product Demo", time: "02:00 PM", type: "presentation" }],
      15: [
        { title: "Client Meeting", time: "11:30 AM", type: "meeting" },
        { title: "Marketing Call", time: "03:30 PM", type: "call" },
      ],
      20: [{ title: "Sprint Planning", time: "10:00 AM", type: "planning" }],
      25: [{ title: "Quarterly Review", time: "01:00 PM", type: "review" }],
    };

    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Render day names
    dayNames.forEach((day) => {
      days.push(
        <div
          key={`header-${day}`}
          className="h-10 flex items-center justify-center font-medium text-sm text-gray-500 dark:text-gray-400"
        >
          {day}
        </div>
      );
    });

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-28 p-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        ></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      days.push(
        <div
          key={`day-${day}`}
          className={cn(
            "h-28 p-1 border border-gray-200 dark:border-gray-700 transition-all duration-200",
            isToday
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          <div className="flex justify-between items-start">
            <span
              className={cn(
                "inline-flex h-6 w-6 rounded-full items-center justify-center text-xs font-medium",
                isToday
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              {day}
            </span>
            {day === 1 && (
              <span className="text-xs font-medium text-gray-500">
                {currentMonth.toLocaleDateString("en-US", { month: "short" })}
              </span>
            )}
          </div>

          {/* Render events for this day */}
          {events[day] && (
            <div className="mt-1 space-y-1">
              {events[day].map((event, index) => (
                <div
                  key={`event-${day}-${index}`}
                  className={cn(
                    "text-xs p-1 rounded truncate",
                    event.type === "meeting"
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
                      : event.type === "presentation"
                      ? "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200"
                      : event.type === "call"
                      ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                      : event.type === "planning"
                      ? "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  )}
                >
                  {event.title}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
    </div>
  );
};

interface EventCardProps {
  title: string;
  time: string;
  location?: string;
  attendees?: string;
  type: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  time,
  location,
  attendees,
  type,
}) => {
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div
        className={cn(
          "w-full h-1 rounded mb-2",
          type === "meeting"
            ? "bg-blue-500"
            : type === "presentation"
            ? "bg-purple-500"
            : type === "call"
            ? "bg-green-500"
            : type === "planning"
            ? "bg-amber-500"
            : "bg-gray-500"
        )}
      />
      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h4>

      <div className="mt-2 space-y-1.5">
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          <span>{time}</span>
        </div>

        {location && (
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            <span>{location}</span>
          </div>
        )}

        {attendees && (
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            <span>{attendees}</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface EventData {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: string;
  type: string;
}

const Calendar: React.FC = () => {
  // Mock events data with more details
  const upcomingEvents: EventData[] = [
    {
      id: 1,
      title: "Team Strategy Meeting",
      date: "July 28",
      time: "10:00 AM - 11:30 AM",
      location: "Conference Room A",
      attendees: "8 team members",
      type: "meeting",
    },
    {
      id: 2,
      title: "Client Demo: New Dashboard",
      date: "July 29",
      time: "2:00 PM - 3:00 PM",
      location: "Zoom Meeting",
      attendees: "Client & Product Team",
      type: "presentation",
    },
    {
      id: 3,
      title: "Sales Pipeline Review",
      date: "July 31",
      time: "11:00 AM - 12:00 PM",
      location: "Meeting Room B",
      attendees: "Sales Team",
      type: "planning",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
          <CalendarIcon className="mr-2 h-6 w-6 text-blue-500" /> Calendar &
          Events
        </h2>
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            Month View
            <div className="ml-2 h-2 w-2 rounded-full bg-blue-500"></div>
          </CardTitle>
          <CardDescription>
            Manage your schedule and plan your activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarView />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700 col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              Upcoming Events
              <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
            </CardTitle>
            <CardDescription>Your next scheduled activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  time={`${event.date}, ${event.time}`}
                  location={event.location}
                  attendees={event.attendees}
                  type={event.type}
                />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                View All Events
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700 col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              Quick Actions
              <div className="ml-2 h-2 w-2 rounded-full bg-amber-500"></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus className="mr-2 h-4 w-4 text-green-500" /> Schedule Meeting
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Users className="mr-2 h-4 w-4 text-blue-500" /> Invite
              Participants
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-purple-500" /> Sync
              Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
