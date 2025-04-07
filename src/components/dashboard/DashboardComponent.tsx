import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  TrendingUp,
  Calendar as CalendarIcon,
  BarChart,
  Plus,
  MessageSquare,
  Phone,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  ListChecks,
  Clock,
  Sun,
  Moon,
  Palette,
} from "lucide-react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  TooltipProps,
} from "recharts";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ErrorBoundary } from "react-error-boundary";
import { cn } from "../../lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "../../hooks/useTheme";

interface DashboardStats {
  totalLeads: number;
  conversionRate: number;
  activeMeetings: number;
  runningCampaigns: number;
}

interface DashboardComponentProps {
  stats: DashboardStats;
  isLoading?: boolean;
  onError?: (error: Error) => void;
}

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
    <h3 className="text-lg font-medium text-red-800 dark:text-red-200 flex items-center">
      <span className="bg-red-100 dark:bg-red-800 p-1 rounded mr-2">⚠️</span>
      Something went wrong
    </h3>
    <p className="mt-3 text-sm text-red-700 dark:text-red-300">
      {error.message}
    </p>
    <Button
      onClick={resetErrorBoundary}
      className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-800/50 dark:hover:bg-red-800 dark:text-red-200"
    >
      Try again
    </Button>
  </div>
);

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: number;
  color?: string;
  description?: string;
}

const StatCard = React.memo(
  ({
    title,
    value,
    icon: Icon,
    trend,
    color = "blue",
    description,
  }: StatCardProps) => {
    const getGradient = () => {
      switch (color) {
        case "purple":
          return "from-purple-500/20 to-purple-500/5 dark:from-purple-500/10";
        case "green":
          return "from-green-500/20 to-green-500/5 dark:from-green-500/10";
        case "amber":
          return "from-amber-500/20 to-amber-500/5 dark:from-amber-500/10";
        default:
          return "from-blue-500/20 to-blue-500/5 dark:from-blue-500/10";
      }
    };

    const getIconColor = () => {
      switch (color) {
        case "purple":
          return "text-purple-500 dark:text-purple-400";
        case "green":
          return "text-green-500 dark:text-green-400";
        case "amber":
          return "text-amber-500 dark:text-amber-400";
        default:
          return "text-blue-500 dark:text-blue-400";
      }
    };

    const getTrendColor = () => {
      if (trend === undefined) return "";
      return trend >= 0
        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-hover"
      >
        <Card className="border-0 shadow-md overflow-hidden">
          <div
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${getGradient()} rounded-bl-full opacity-70`}
          ></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {title}
                </p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {value}
                </p>
                {description && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {description}
                  </p>
                )}
              </div>
              <div
                className={`p-3 rounded-full ${getIconColor()} bg-gray-100 dark:bg-gray-800`}
              >
                <Icon className="h-8 w-8" />
              </div>
            </div>
            {trend !== undefined && (
              <div className="mt-4 flex items-center">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}
                >
                  {trend >= 0 ? (
                    <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                  )}
                  {Math.abs(trend)}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
                  vs last month
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

StatCard.displayName = "StatCard";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
      ))}
    </div>
    <div className="bg-gray-200 dark:bg-gray-700 h-80 rounded-lg" />
    <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />
  </div>
);

// Custom tooltip component for charts
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm font-medium"
            style={{ color: entry.color }}
          >
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardComponent: React.FC<DashboardComponentProps> = ({
  stats,
  isLoading,
  onError,
}) => {
  const { theme, toggleTheme } = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const chartData = useMemo(
    () => [
      { date: "Jan", leads: 100, conversions: 32 },
      { date: "Feb", leads: 150, conversions: 45 },
      { date: "Mar", leads: 130, conversions: 40 },
      { date: "Apr", leads: 180, conversions: 58 },
      { date: "May", leads: 220, conversions: 70 },
      { date: "Jun", leads: 210, conversions: 72 },
    ],
    []
  );

  const tasks = useMemo(
    () => [
      {
        id: "1",
        title: "Follow up with Acme Corp about partnership opportunity",
        priority: "high" as const,
        dueDate: new Date(),
      },
      {
        id: "2",
        title: "Prepare quarterly revenue presentation for board meeting",
        priority: "medium" as const,
        dueDate: new Date(Date.now() + 86400000),
      },
      {
        id: "3",
        title: "Schedule demo with potential client from conference",
        priority: "low" as const,
        dueDate: new Date(Date.now() + 172800000),
      },
      {
        id: "4",
        title: "Review marketing campaign results with team",
        priority: "medium" as const,
        dueDate: new Date(Date.now() + 259200000),
      },
    ],
    []
  );

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={onError}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            <PieChart className="mr-2 h-6 w-6 text-blue-500" /> Dashboard
            Overview
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Leads"
            value={stats.totalLeads.toLocaleString()}
            description="Total number of leads in pipeline"
            icon={Users}
            trend={12}
            color="blue"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            description="Lead-to-customer conversion"
            icon={TrendingUp}
            trend={5}
            color="purple"
          />
          <StatCard
            title="Active Meetings"
            value={stats.activeMeetings}
            description="Scheduled for this week"
            icon={CalendarIcon}
            trend={-2}
            color="green"
          />
          <StatCard
            title="Running Campaigns"
            value={stats.runningCampaigns}
            description="Across all channels"
            icon={BarChart}
            trend={8}
            color="amber"
          />
        </div>

        {/* Theme Control Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md overflow-hidden col-span-full lg:col-span-1">
            <CardHeader className="px-6 pt-6 pb-0">
              <CardTitle className="flex items-center text-lg font-medium">
                <Palette className="mr-2 h-5 w-5 text-blue-500" />
                Theme Settings
                <div className="ml-2 h-2 w-2 rounded-full bg-blue-500"></div>
              </CardTitle>
              <CardDescription>
                Customize your dashboard appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Current Theme
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Toggle between light and dark modes
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Theme Preview
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={cn(
                      "p-3 rounded-lg border flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all",
                      theme === "light"
                        ? "border-blue-500 bg-white shadow-sm"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    )}
                    onClick={() => theme === "dark" && toggleTheme()}
                  >
                    <div className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                      <Sun className="h-6 w-6 text-amber-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      Light Mode
                    </span>
                  </div>

                  <div
                    className={cn(
                      "p-3 rounded-lg border flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all",
                      theme === "dark"
                        ? "border-blue-500 bg-gray-800 shadow-sm"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    )}
                    onClick={() => theme === "light" && toggleTheme()}
                  >
                    <div className="w-10 h-10 bg-gray-900 rounded-full border border-gray-700 flex items-center justify-center">
                      <Moon className="h-6 w-6 text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-gray-200">
                      Dark Mode
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
              <div className="w-full flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {theme === "light"
                    ? "Light theme active"
                    : "Dark theme active"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={toggleTheme}
                >
                  Switch to {theme === "light" ? "Dark" : "Light"}
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Lead Trends Chart */}
          <Card className="border-0 shadow-md overflow-hidden col-span-full lg:col-span-2">
            <CardHeader className="px-6 pt-6 pb-0">
              <CardTitle className="flex items-center text-lg font-medium">
                Performance Metrics
                <div className="ml-2 h-2 w-2 rounded-full bg-blue-500"></div>
              </CardTitle>
              <CardDescription>
                Lead acquisition and conversion over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="leadGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="rgba(59, 130, 246, 0.8)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="rgba(59, 130, 246, 0.1)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="convGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="rgba(16, 185, 129, 0.8)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="rgba(16, 185, 129, 0.1)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ccc"
                      opacity={0.1}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="leads"
                      name="Leads"
                      stroke="#3B82F6"
                      fill="url(#leadGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="conversions"
                      name="Conversions"
                      stroke="#10B981"
                      fill="url(#convGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Management */}
        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-0">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center text-lg font-medium">
                  <ListChecks className="mr-2 h-5 w-5 text-purple-500" />
                  Task Management
                  <div className="ml-2 h-2 w-2 rounded-full bg-purple-500"></div>
                </CardTitle>
                <CardDescription>
                  Drag tasks to reorder by priority
                </CardDescription>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <DndContext sensors={sensors} collisionDetection={closestCenter}>
              <SortableContext
                items={tasks}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full mr-4",
                          task.priority === "high"
                            ? "bg-red-500"
                            : task.priority === "medium"
                            ? "bg-amber-500"
                            : "bg-green-500"
                        )}
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </h4>
                        <div className="mt-1 flex items-center space-x-3">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              Due: {task.dueDate.toLocaleDateString()}
                            </span>
                          </div>
                          <div
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              task.priority === "high"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                : task.priority === "medium"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            )}
                          >
                            {task.priority}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                          />
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>

        {/* Quick Actions Floating Menu */}
        <div className="fixed bottom-8 right-8 flex flex-col space-y-3 z-10">
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
            >
              {["message", "call", "email"].map((action, index) => (
                <motion.button
                  key={action}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className={cn(
                    "p-3 rounded-full shadow-md block mb-2 last:mb-0",
                    action === "message"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : action === "call"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-purple-500 hover:bg-purple-600",
                    "text-white"
                  )}
                  aria-label={`Quick ${action}`}
                >
                  {action === "message" && (
                    <MessageSquare className="h-5 w-5" />
                  )}
                  {action === "call" && <Phone className="h-5 w-5" />}
                  {action === "email" && <Mail className="h-5 w-5" />}
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(DashboardComponent);
