import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  Users,
  FileInput,
  Settings,
  UserCircle,
  Building2,
  Target,
  Mail,
  Calendar,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Revenue Analytics", icon: BarChart2, href: "/analytics" },
  { name: "Lead Management", icon: Users, href: "/leads" },
  { name: "Data Import/Export", icon: FileInput, href: "/data" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

const secondaryNavigation = [
  { name: "Company Profile", icon: Building2, href: "/company" },
  { name: "Goals & Targets", icon: Target, href: "/goals" },
  { name: "Communications", icon: Mail, href: "/communications" },
  { name: "Calendar", icon: Calendar, href: "/calendar" },
  { name: "Help & Support", icon: HelpCircle, href: "/support" },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
          <div className="flex items-center flex-shrink-0 px-4">
            <UserCircle className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
              TaskFlow
            </span>
          </div>
          <nav className="mt-8 flex-1 space-y-1 px-2" aria-label="Sidebar">
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  <item.icon
                    className="mr-3 h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
            </div>
            <div className="mt-8">
              <h3 className="px-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Additional Features
              </h3>
              <div className="mt-1 space-y-1">
                {secondaryNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`
                    }
                  >
                    <item.icon
                      className="mr-3 h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>
          <div className="mt-auto p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://avatars.githubusercontent.com/u/128896143?v=4"
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.fullName || "Sreeram Kumar V R"}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {user?.role || "Admin"}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
