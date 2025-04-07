import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard/DashboardComponent";
import RevenueAnalytics from "./components/analytics/RevenueAnalyticsComponent";
import LeadManagement from "./components/leads/LeadManagement";
import DataImportExport from "./components/data/DataImportExport";
import Settings from "./components/settings/Settings";
import CompanyProfile from "./components/company/CompanyProfile";
import GoalsTargets from "./components/goals/GoalsTargets";
import Communications from "./components/communications/Communications";
import Calendar from "./components/calendar/Calendar";
import HelpSupport from "./components/support/HelpSupport";
import Sidebar from "./components/Sidebar";
import { ThemeToggle } from "./components/ui/ThemeToggle";

// Mock data for components
const mockStats = {
  totalLeads: 1234,
  conversionRate: 24.5,
  activeMeetings: 15,
  runningCampaigns: 8,
};

const mockMetrics = {
  mrr: 50000,
  arr: 600000,
  forecast: [55000, 58000, 62000, 65000, 70000, 75000],
  sources: {
    "Direct Sales": 300000,
    "Channel Partners": 200000,
    Online: 100000,
  },
};

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 gradient-bg-light dark:gradient-bg-dark">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 bg-opacity-80 backdrop-blur-sm">
            <div className="max-w-full px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-primary dark:text-primary flex items-center">
                    <svg
                      className="h-8 w-8 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 6V12L16 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    AI-CRM
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-64 px-4 py-2 text-sm text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 rounded-lg focus-ring"
                    />
                    <svg
                      className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <ThemeToggle />
                  <button className="relative p-2 text-gray-400 hover:text-gray-500 focus-ring rounded-full">
                    <span className="sr-only">View notifications</span>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </button>
                  <button className="flex items-center text-sm rounded-full focus-ring">
                    <img
                      className="h-8 w-8 rounded-full ring-2 ring-primary/30"
                      src="https://avatars.githubusercontent.com/u/128896143?v=4"
                      alt="User profile"
                    />
                  </button>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Dashboard stats={mockStats} />} />
                <Route
                  path="/analytics"
                  element={<RevenueAnalytics metrics={mockMetrics} />}
                />
                <Route path="/leads" element={<LeadManagement />} />
                <Route path="/data" element={<DataImportExport />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/company" element={<CompanyProfile />} />
                <Route path="/goals" element={<GoalsTargets />} />
                <Route path="/communications" element={<Communications />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/support" element={<HelpSupport />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
