import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  ChevronRight,
  Edit,
  BarChart,
  ArrowUp,
  ArrowDown,
  Calendar,
  Target,
  TrendingUp,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

// Define the goal type
interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: string;
  current: string;
  trend: "up" | "down";
  trendValue: string;
  dueDate: string;
  category: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  owner: string;
  lastUpdated: string;
}

const GoalsTargets = () => {
  const [viewMode, setViewMode] = useState<"cards" | "compact">("cards");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target: "",
    category: "",
    priority: "",
    dueDate: "",
    owner: "",
  });

  // Enhanced mock data
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Increase Q3 Sales Revenue by 15%",
      description:
        "Boost overall sales performance through new client acquisition and upselling strategies",
      progress: 75,
      target: "$150,000",
      current: "$112,500",
      trend: "up",
      trendValue: "+3.2%",
      dueDate: "Sep 30, 2025",
      category: "Sales",
      priority: "High",
      owner: "Sarah Johnson",
      lastUpdated: "2 days ago",
    },
    {
      id: 2,
      title: "Acquire 50 New Leads in July",
      description:
        "Generate qualified leads through marketing campaigns and partnerships",
      progress: 40,
      target: "50 Leads",
      current: "20 Leads",
      trend: "up",
      trendValue: "+5.8%",
      dueDate: "Jul 31, 2025",
      category: "Marketing",
      priority: "Medium",
      owner: "Michael Chen",
      lastUpdated: "Today",
    },
    {
      id: 3,
      title: "Improve Customer Satisfaction Score to 4.5",
      description:
        "Enhance customer experience through better support and product improvements",
      progress: 90,
      target: "4.5 Stars",
      current: "4.4 Stars",
      trend: "up",
      trendValue: "+0.2%",
      dueDate: "Aug 15, 2025",
      category: "Customer Success",
      priority: "Medium",
      owner: "Emma Rodriguez",
      lastUpdated: "5 days ago",
    },
    {
      id: 4,
      title: "Reduce Churn Rate by 5%",
      description:
        "Implement retention strategies to decrease customer attrition",
      progress: 20,
      target: "5% Reduction",
      current: "1% Reduction",
      trend: "down",
      trendValue: "-0.5%",
      dueDate: "Oct 1, 2025",
      category: "Retention",
      priority: "Critical",
      owner: "David Park",
      lastUpdated: "Yesterday",
    },
    {
      id: 5,
      title: "Launch New Product Feature",
      description:
        "Complete development and release of the AI assistant feature",
      progress: 60,
      target: "100% Complete",
      current: "60% Complete",
      trend: "up",
      trendValue: "+10%",
      dueDate: "Aug 20, 2025",
      category: "Product",
      priority: "High",
      owner: "Alex Turner",
      lastUpdated: "3 days ago",
    },
    {
      id: 6,
      title: "Reduce Customer Support Response Time",
      description: "Decrease average first response time to under 2 hours",
      progress: 85,
      target: "2 Hours",
      current: "2.3 Hours",
      trend: "up",
      trendValue: "+15%",
      dueDate: "Jul 15, 2025",
      category: "Customer Success",
      priority: "Medium",
      owner: "Jessica Liu",
      lastUpdated: "1 week ago",
    },
  ]);

  const categories = [
    "All",
    "Sales",
    "Marketing",
    "Customer Success",
    "Retention",
    "Product",
  ];

  const filteredGoals =
    selectedCategory === "All"
      ? goals
      : goals.filter((goal) => goal.category === selectedCategory);

  // Summary metrics
  const totalGoals = goals.length;
  const completedGoals = goals.filter((goal) => goal.progress === 100).length;
  const atRiskGoals = goals.filter((goal) => goal.progress < 30).length;
  const averageProgress = Math.round(
    goals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals
  );

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "Critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "High":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Medium":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Sales":
        return "from-blue-500 to-blue-600";
      case "Marketing":
        return "from-purple-500 to-purple-600";
      case "Customer Success":
        return "from-green-500 to-green-600";
      case "Retention":
        return "from-orange-500 to-orange-600";
      case "Product":
        return "from-indigo-500 to-indigo-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getCategoryBadgeColor = (category: string): string => {
    switch (category) {
      case "Sales":
        return "bg-blue-100 text-blue-800";
      case "Marketing":
        return "bg-purple-100 text-purple-800";
      case "Customer Success":
        return "bg-green-100 text-green-800";
      case "Retention":
        return "bg-orange-100 text-orange-800";
      case "Product":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressStatus = (progress: number): string => {
    if (progress >= 100) return "complete";
    if (progress < 30) return "at-risk";
    if (progress >= 70) return "on-track";
    return "in-progress";
  };

  const handleViewDetails = (goal: Goal): void => {
    setSelectedGoal(goal);
    setShowDetailsModal(true);
  };

  const handleViewInsights = (goal: Goal): void => {
    setSelectedGoal(goal);
    setShowInsightsModal(true);
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="h-8 w-8 mr-3 text-blue-600" />
            Goals & Targets Dashboard
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Track, analyze, and achieve your strategic business objectives
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className={
                viewMode === "cards"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : ""
              }
            >
              <svg
                className="h-4 w-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Cards
            </Button>
            <Button
              variant={viewMode === "compact" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("compact")}
              className={
                viewMode === "compact"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : ""
              }
            >
              <svg
                className="h-4 w-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              List
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Goal
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Goals
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalGoals}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Completed
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedGoals}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                At Risk
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {atRiskGoals}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg. Progress
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {averageProgress}%
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 items-start md:items-center">
        <div className="flex overflow-x-auto pb-1 gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? `bg-gradient-to-r ${getCategoryColor(category)} text-white`
                  : "bg-white dark:bg-gray-800"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <Button variant="outline" size="sm" className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => {
            const progressStatus = getProgressStatus(goal.progress);

            return (
              <Card
                key={goal.id}
                className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border-0 group"
              >
                <div
                  className={`h-2 w-full bg-gradient-to-r ${getCategoryColor(
                    goal.category
                  )}`}
                ></div>
                <CardHeader className="pb-2 relative">
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryBadgeColor(
                        goal.category
                      )}`}
                    >
                      {goal.category}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${getPriorityColor(
                        goal.priority
                      )}`}
                    >
                      {goal.priority}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-2 pr-8">
                    {goal.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {goal.description}
                  </p>
                  <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Current
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {goal.current}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {goal.trend === "up" ? (
                        <span className="flex items-center text-green-600 dark:text-green-400 font-medium text-sm">
                          <ArrowUp className="h-3 w-3 mr-1" strokeWidth={3} />
                          {goal.trendValue}
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 dark:text-red-400 font-medium text-sm">
                          <ArrowDown className="h-3 w-3 mr-1" strokeWidth={3} />
                          {goal.trendValue}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Target
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {goal.target}
                      </span>
                    </div>
                  </div>

                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Due: {goal.dueDate}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          progressStatus === "at-risk"
                            ? "text-red-600 dark:text-red-400"
                            : progressStatus === "in-progress"
                            ? "text-yellow-600 dark:text-yellow-400"
                            : progressStatus === "on-track"
                            ? "text-green-600 dark:text-green-400"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {goal.progress}% Complete
                      </span>
                    </div>
                    <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        style={{ width: `${goal.progress}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          progressStatus === "at-risk"
                            ? "bg-red-500"
                            : progressStatus === "in-progress"
                            ? "bg-yellow-500"
                            : progressStatus === "on-track"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 mr-1">
                        {goal.owner
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <span>{goal.owner}</span>
                    </div>
                    <span>Updated {goal.lastUpdated}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-4 px-4">
                  <div className="w-full flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                      onClick={() => handleViewInsights(goal)}
                    >
                      <BarChart className="h-3 w-3 mr-1" /> Insights
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      onClick={() => handleViewDetails(goal)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Progress
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Owner
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Priority
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredGoals.map((goal) => {
                  const progressStatus = getProgressStatus(goal.progress);

                  return (
                    <tr
                      key={goal.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-750"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {goal.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {goal.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryBadgeColor(
                            goal.category
                          )}`}
                        >
                          {goal.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 mr-2">
                            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                style={{ width: `${goal.progress}%` }}
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                  progressStatus === "at-risk"
                                    ? "bg-red-500"
                                    : progressStatus === "in-progress"
                                    ? "bg-yellow-500"
                                    : progressStatus === "on-track"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                                }`}
                              ></div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {goal.progress}%
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {goal.dueDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 mr-2">
                            {goal.owner
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {goal.owner}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full border ${getPriorityColor(
                            goal.priority
                          )}`}
                        >
                          {goal.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInsights(goal)}
                          >
                            <BarChart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(goal)}
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredGoals.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">
                No goals found in this category.
              </p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Goal
              </Button>
            </div>
          )}
        </Card>
      )}

      {filteredGoals.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Target className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No goals found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            No goals found in the {selectedCategory} category.
          </p>
          <Button
            className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
            onClick={() => setShowCreateModal(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Goal
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoalsTargets;
