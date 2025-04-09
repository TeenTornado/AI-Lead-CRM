import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: Date;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "read" | "createdAt">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(
  null
);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

interface NotificationsProviderProps {
  children: ReactNode;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Lead Assigned",
    message: "A new lead from Acme Corp has been assigned to you.",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "2",
    title: "Meeting Reminder",
    message: "You have a client meeting with TechNova in 30 minutes.",
    type: "warning",
    read: false,
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
  },
  {
    id: "3",
    title: "Deal Closed",
    message:
      "Congratulations! The deal with GlobalTech has been successfully closed.",
    type: "success",
    read: true,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: "4",
    title: "Task Deadline",
    message: "The quarterly report submission deadline is approaching.",
    type: "error",
    read: true,
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
];

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Try to get notifications from localStorage
    const savedNotifications = localStorage.getItem("notifications");
    return savedNotifications
      ? JSON.parse(savedNotifications)
      : mockNotifications;
  });

  // Persist notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const addNotification = (
    notification: Omit<Notification, "id" | "read" | "createdAt">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
