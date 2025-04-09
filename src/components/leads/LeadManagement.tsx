import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  UniqueIdentifier,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {
  Users,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Phone,
  Mail,
  Building,
  Calendar,
  BarChart4,
  Search,
  Filter,
  Trash2,
  Edit3,
  CreditCard,
  AlertTriangle,
  MessageSquare,
  List,
  Kanban,
  ChevronDown,
  ArrowUpDown,
  ChevronUp,
  MoveHorizontal,
  Copy,
  Send,
  Loader2,
  ClipboardCheck,
  BellRing,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "../../lib/utils";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "closed";
  score: number;
  lastContact: Date;
  nextFollowUp: Date;
  tags: string[];
  notes?: string;
  value?: number;
  probability?: number;
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Doe",
    company: "Tech Corp",
    email: "john@techcorp.com",
    phone: "+1 (234) 567-890",
    status: "new",
    score: 85,
    lastContact: new Date(2023, 4, 15),
    nextFollowUp: new Date(Date.now() + 86400000),
    tags: ["software", "enterprise"],
    notes:
      "Initial contact made via LinkedIn. Interested in our enterprise solution.",
    value: 25000,
    probability: 35,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    company: "Marketing Pro",
    email: "sarah@marketingpro.com",
    phone: "+1 (345) 678-901",
    status: "contacted",
    score: 72,
    lastContact: new Date(2023, 4, 18),
    nextFollowUp: new Date(Date.now() + 172800000),
    tags: ["marketing", "smb"],
    notes:
      "Had an initial call, they need a solution by Q3. Following up next week.",
    value: 15000,
    probability: 45,
  },
  {
    id: "3",
    name: "Michael Brown",
    company: "Retail Giants",
    email: "michael@retailgiants.com",
    phone: "+1 (456) 789-012",
    status: "qualified",
    score: 91,
    lastContact: new Date(2023, 4, 10),
    nextFollowUp: new Date(Date.now() + 259200000),
    tags: ["retail", "enterprise", "urgent"],
    notes: "Decision maker engaged. Demo scheduled for next Tuesday.",
    value: 80000,
    probability: 65,
  },
  {
    id: "4",
    name: "Emily Parker",
    company: "Healthcare Solutions",
    email: "emily@healthcaresolutions.com",
    phone: "+1 (567) 890-123",
    status: "proposal",
    score: 88,
    lastContact: new Date(2023, 4, 5),
    nextFollowUp: new Date(Date.now() + 345600000),
    tags: ["healthcare", "enterprise", "priority"],
    notes: "Proposal sent. Waiting for feedback from their IT department.",
    value: 120000,
    probability: 75,
  },
  {
    id: "5",
    name: "Robert Wilson",
    company: "Finance First",
    email: "robert@financefirst.com",
    phone: "+1 (678) 901-234",
    status: "negotiation",
    score: 94,
    lastContact: new Date(2023, 4, 2),
    nextFollowUp: new Date(Date.now() + 86400000),
    tags: ["finance", "enterprise", "high-value"],
    notes: "Final negotiations in progress. Legal team reviewing contract.",
    value: 200000,
    probability: 90,
  },
  {
    id: "6",
    name: "Amanda Lewis",
    company: "Educational Partners",
    email: "amanda@edpartners.com",
    phone: "+1 (789) 012-345",
    status: "closed",
    score: 100,
    lastContact: new Date(2023, 3, 28),
    nextFollowUp: new Date(Date.now() + 2592000000),
    tags: ["education", "smb", "closed-won"],
    notes: "Deal closed! Implementation starting next month.",
    value: 45000,
    probability: 100,
  },
  {
    id: "7",
    name: "Daniel Taylor",
    company: "Construction Experts",
    email: "daniel@constructionexperts.com",
    phone: "+1 (890) 123-456",
    status: "new",
    score: 65,
    lastContact: new Date(2023, 4, 20),
    nextFollowUp: new Date(Date.now() + 172800000),
    tags: ["construction", "smb"],
    notes: "Found us through Google search. Requesting more information.",
    value: 18000,
    probability: 25,
  },
  {
    id: "8",
    name: "Jessica White",
    company: "Travel Anywhere",
    email: "jessica@travelanywhere.com",
    phone: "+1 (901) 234-567",
    status: "contacted",
    score: 77,
    lastContact: new Date(2023, 4, 17),
    nextFollowUp: new Date(Date.now() + 259200000),
    tags: ["travel", "smb"],
    notes:
      "Had a discovery call. They have an urgent need to replace current vendor.",
    value: 35000,
    probability: 50,
  },
];

// Function to generate AI email script based on lead stage
async function generateEmailScript(lead: Lead): Promise<string> {
  try {
    // Call to Python backend service instead of local simulation
    const response = await fetch("http://localhost:5000/api/ai/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lead }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error generating email script:", error);
    return "An error occurred while generating the email script. Please try again.";
  }
}

// Function to generate AI follow-up recommendations
async function generateFollowUpRecommendation(
  lead: Lead,
  prompt: string
): Promise<string> {
  try {
    const response = await fetch("http://localhost:5000/api/ai/followup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lead,
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error generating follow-up recommendation:", error);
    return "An error occurred while generating recommendations. Please try again.";
  }
}

const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lead | "";
    direction: "asc" | "desc";
  }>({ key: "", direction: "asc" });
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailScript, setEmailScript] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [followUpPrompt, setFollowUpPrompt] = useState<string>("");
  const [followUpRecommendation, setFollowUpRecommendation] = useState("");
  const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("pipeline");
  const [reportPrompt, setReportPrompt] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const statusColumns = [
    { id: "new", title: "New Leads", icon: Star, color: "blue" },
    { id: "contacted", title: "Contacted", icon: Clock, color: "purple" },
    { id: "qualified", title: "Qualified", icon: CheckCircle, color: "green" },
    { id: "proposal", title: "Proposal", icon: CreditCard, color: "orange" },
    {
      id: "negotiation",
      title: "Negotiation",
      icon: MessageSquare,
      color: "pink",
    },
    { id: "closed", title: "Closed", icon: CheckCircle, color: "emerald" },
  ];

  // Calculate statistics for the dashboard
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const avgScore =
      leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads;
    const weightedPipeline = leads.reduce((sum, lead) => {
      return sum + ((lead.value || 0) * (lead.probability || 0)) / 100;
    }, 0);

    const statusCounts = statusColumns.reduce((acc, column) => {
      acc[column.id] = leads.filter((lead) => lead.status === column.id).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalLeads,
      totalValue,
      avgScore,
      weightedPipeline,
      statusCounts,
    };
  }, [leads]);

  // Filter leads based on search query and active filter
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        searchQuery === "" ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = !activeFilter || lead.tags.includes(activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [leads, searchQuery, activeFilter]);

  // Get all unique tags for filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    leads.forEach((lead) => {
      lead.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [leads]);

  // Handle drag end event to move leads between columns
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // The id of the lead being dragged
      const leadId = active.id as string;
      // The id of the column it's being dropped into (e.g., 'new', 'contacted', etc.)
      const newStatus = over.id as string;

      // Update the lead's status
      setLeads(
        leads.map((lead) =>
          lead.id === leadId
            ? { ...lead, status: newStatus as Lead["status"] }
            : lead
        )
      );
    }

    setActiveDragId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id);
  };

  // Sort function for table view
  const handleSort = (key: keyof Lead) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Sort the leads for table view
  const sortedLeads = useMemo(() => {
    if (!sortConfig.key) return filteredLeads;

    return [...filteredLeads].sort((a, b) => {
      if (sortConfig.key === "") return 0;

      const aValue = a[sortConfig.key as keyof Lead];
      const bValue = b[sortConfig.key as keyof Lead];

      // Handle potential undefined values or different types
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1; // undefined values go last
      if (bValue === undefined) return -1;

      // Handle date objects separately
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Convert to strings for comparison if different types
      const aString = String(aValue);
      const bString = String(bValue);

      if (aString < bString) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aString > bString) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredLeads, sortConfig]);

  // Table row component with drag functionality
  const TableRow = ({ lead }: { lead: Lead }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: lead.id,
      data: { type: "lead", lead },
    });

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

    return (
      <tr
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-grab"
        onClick={() => setSelectedLead(lead)}
      >
        <td className="px-4 py-3 text-gray-900 dark:text-white">
          <div className="flex items-center">
            <MoveHorizontal className="h-4 w-4 mr-2 text-gray-400" />
            {lead.name}
          </div>
        </td>
        <td className="px-4 py-3 text-gray-900 dark:text-white">
          {lead.company}
        </td>
        <td className="px-4 py-3">
          <div
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full inline-flex items-center",
              `bg-${getStatusColor(lead.status)}-100 text-${getStatusColor(
                lead.status
              )}-800`,
              `dark:bg-${getStatusColor(
                lead.status
              )}-900/50 dark:text-${getStatusColor(lead.status)}-300`
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </div>
        </td>
        <td className="px-4 py-3 text-gray-900 dark:text-white">
          <div
            className={cn(
              "text-xs font-semibold rounded-full px-1.5 py-0.5 inline-flex items-center",
              getScoreBadgeClass(lead.score)
            )}
          >
            {lead.score}
          </div>
        </td>
        <td className="px-4 py-3 text-gray-900 dark:text-white">
          ${lead.value?.toLocaleString() || "0"}
        </td>
        <td className="px-4 py-3 text-gray-900 dark:text-white">
          {lead.nextFollowUp.toLocaleDateString()}
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-1 flex-wrap">
            {lead.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {lead.tags.length > 2 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                +{lead.tags.length - 2}
              </span>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLead(lead);
              setIsEditingLead(true);
            }}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </td>
      </tr>
    );
  };

  // Column Droppable component
  const DropColumn = ({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) => {
    const { setNodeRef } = useDroppable({
      id,
    });

    return (
      <div ref={setNodeRef} className="w-full h-full">
        {children}
      </div>
    );
  };

  // Get appropriate style for score badge
  const getScoreBadgeClass = (score: number) => {
    if (score >= 90)
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (score >= 70)
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    if (score >= 50)
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    if (score >= 30)
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  };

  // Define Lead Card component for DnD
  const LeadCard = ({ lead, onClick }: { lead: Lead; onClick: () => void }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: lead.id,
      data: { type: "lead", lead },
    });

    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 1000 : 1,
    };

    // Get appropriate style for score badge
    const getScoreBadgeClass = (score: number) => {
      if (score >= 90)
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      if (score >= 70)
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      if (score >= 50)
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      if (score >= 30)
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    };

    // Format date in relative form (today, yesterday, or date)
    const formatRelativeDate = (date: Date) => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700",
          "hover:shadow-md transition-all duration-200 cursor-grab",
          "overflow-hidden"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-gray-900 dark:text-white truncate mr-2">
              {lead.name}
            </div>
            <div
              className={cn(
                "text-xs font-semibold rounded-full px-1.5 py-0.5 flex items-center",
                getScoreBadgeClass(lead.score)
              )}
            >
              {lead.score}
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Building className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{lead.company}</span>
          </div>

          {lead.value && (
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-2">
              <CreditCard className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="font-medium">
                ${lead.value.toLocaleString()}
              </span>
              {lead.probability && (
                <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">
                  ({lead.probability}%)
                </span>
              )}
            </div>
          )}

          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
            <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span>Follow-up: {formatRelativeDate(lead.nextFollowUp)}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {lead.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Handle email follow-up
  const handleEmailFollowUp = async (lead: Lead) => {
    setSelectedLead(lead);
    setIsEmailDialogOpen(true);
    setIsGeneratingScript(true);

    try {
      const script = await generateEmailScript(lead);
      setEmailScript(script);
      setCustomEmail(script);
    } catch (error) {
      console.error("Error generating email script:", error);
      showNotification(
        "Failed to generate email script. Please try again.",
        "error"
      );
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Handle AI-powered follow-up
  const handleFollowUp = async (lead: Lead) => {
    setSelectedLead(lead);
    setIsEmailDialogOpen(true);

    // Default prompt based on lead status
    const defaultPrompt = getDefaultFollowUpPrompt(lead.status);
    setFollowUpPrompt(defaultPrompt);
  };

  // Generate follow-up recommendation
  const generateFollowUp = async () => {
    if (!selectedLead || !followUpPrompt.trim()) return;

    setIsGeneratingFollowUp(true);
    try {
      const recommendation = await generateFollowUpRecommendation(
        selectedLead,
        followUpPrompt
      );
      setFollowUpRecommendation(recommendation);
    } catch (error) {
      console.error("Error generating follow-up recommendation:", error);
      showNotification("Failed to generate follow-up recommendation", "error");
    } finally {
      setIsGeneratingFollowUp(false);
    }
  };

  // Get default follow-up prompt based on lead status
  const getDefaultFollowUpPrompt = (status: Lead["status"]): string => {
    switch (status) {
      case "new":
        return "What's the best approach to qualify this new lead?";
      case "contacted":
        return "How should I follow up with this lead who hasn't responded yet?";
      case "qualified":
        return "What's the best way to move this qualified lead to the proposal stage?";
      case "proposal":
        return "How can I effectively follow up on the proposal I sent?";
      case "negotiation":
        return "What negotiation tactics would be effective for this lead?";
      case "closed":
        return "What's the best way to ensure customer satisfaction and potential upsells?";
      default:
        return "What's the recommended follow-up action for this lead?";
    }
  };

  // Show notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Send email (simulated)
  const sendEmail = () => {
    // In a real application, this would call your backend API to send the email
    showNotification(
      `Follow-up email sent to ${selectedLead?.name} at ${selectedLead?.email}`,
      "success"
    );
    setIsEmailDialogOpen(false);

    // Update the lead's lastContact date
    if (selectedLead) {
      setLeads(
        leads.map((lead) =>
          lead.id === selectedLead.id
            ? { ...lead, lastContact: new Date() }
            : lead
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-md transition-opacity duration-300 ${
            notification.type === "success"
              ? "bg-green-100 border-l-4 border-green-500 text-green-800 dark:bg-green-900/50 dark:text-green-300"
              : "bg-red-100 border-l-4 border-red-500 text-red-800 dark:bg-red-900/50 dark:text-red-300"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            )}
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      {/* Header with title and action button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Users className="mr-2 h-6 w-6 text-primary" /> Lead Management
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="text"
              placeholder="Search leads..."
              className="pl-9 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddingLead(true)} className="shrink-0">
            <Plus className="h-4 w-4 mr-1" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Leads
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalLeads}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              {statusColumns.map((column) => (
                <div
                  key={column.id}
                  className={`h-full float-left ${getColumnColor(
                    column.color,
                    true
                  )}`}
                  style={{
                    width: `${
                      (stats.statusCounts[column.id] / stats.totalLeads) * 100
                    }%`,
                  }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                By Stage
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(
                  ((stats.statusCounts.qualified +
                    stats.statusCounts.proposal +
                    stats.statusCounts.negotiation) /
                    stats.totalLeads) *
                    100
                )}
                % in pipeline
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pipeline Value
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${stats.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 dark:bg-green-600"
                  style={{
                    width: `${
                      (stats.weightedPipeline / stats.totalValue) * 100
                    }%`,
                  }}
                />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                ${Math.round(stats.weightedPipeline).toLocaleString()}
              </span>
            </div>
            <div className="mt-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Weighted by probability
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Average Lead Score
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Math.round(stats.avgScore)}
                </p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <BarChart4 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getScoreColor(
                    Math.round(stats.avgScore)
                  )}`}
                  style={{ width: `${stats.avgScore}%` }}
                />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {getScoreLabel(Math.round(stats.avgScore))}
              </span>
            </div>
            <div className="mt-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Overall lead quality
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Follow-ups Due
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {
                    leads.filter(
                      (lead) =>
                        lead.nextFollowUp.getTime() < Date.now() + 86400000
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                {
                  leads.filter(
                    (lead) => lead.nextFollowUp.getTime() < Date.now()
                  ).length
                }{" "}
                overdue
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                {
                  leads.filter((lead) => {
                    const time = lead.nextFollowUp.getTime();
                    return time >= Date.now() && time < Date.now() + 86400000;
                  }).length
                }{" "}
                today
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                {
                  leads.filter((lead) => {
                    const time = lead.nextFollowUp.getTime();
                    return (
                      time >= Date.now() + 86400000 &&
                      time < Date.now() + 172800000
                    );
                  }).length
                }{" "}
                tomorrow
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tag filters and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <Filter className="h-4 w-4 mr-1" /> Filters:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={activeFilter === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() =>
                  setActiveFilter(activeFilter === tag ? null : tag)
                }
              >
                {tag}
                {activeFilter === tag && (
                  <XCircle
                    className="h-3 w-3 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFilter(null);
                    }}
                  />
                )}
              </Badge>
            ))}
          </div>
          {activeFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveFilter(null)}
              className="h-7 px-2 text-xs"
            >
              Clear filter
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            View:
          </span>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 px-2",
                viewMode === "kanban"
                  ? ""
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              )}
              onClick={() => setViewMode("kanban")}
            >
              <Kanban className="h-4 w-4 mr-1" /> Kanban
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 px-2",
                viewMode === "table"
                  ? ""
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              )}
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4 mr-1" /> Table
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board or Table View */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mt-6">
            {statusColumns.map((column) => (
              <div
                key={column.id}
                className="flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden h-[calc(100vh-280px)]"
              >
                <div
                  className={cn(
                    "flex items-center px-4 py-3",
                    `bg-${column.color}-50 dark:bg-${column.color}-900/20`,
                    `border-b border-${column.color}-100 dark:border-${column.color}-900/30`
                  )}
                >
                  <column.icon
                    className={cn(
                      "h-5 w-5 mr-2",
                      `text-${column.color}-500 dark:text-${column.color}-400`
                    )}
                  />
                  <h3 className="font-medium text-gray-900 dark:text-white flex-1">
                    {column.title}
                  </h3>
                  <div
                    className={cn(
                      "px-1.5 py-0.5 text-xs font-medium rounded-full",
                      `bg-${column.color}-100 text-${column.color}-800`,
                      `dark:bg-${column.color}-900/50 dark:text-${column.color}-300`
                    )}
                  >
                    {
                      filteredLeads.filter((lead) => lead.status === column.id)
                        .length
                    }
                  </div>
                </div>

                <DropColumn id={column.id}>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    <SortableContext
                      items={filteredLeads
                        .filter((lead) => lead.status === column.id)
                        .map((l) => l.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <AnimatePresence>
                        {filteredLeads
                          .filter((lead) => lead.status === column.id)
                          .map((lead) => (
                            <motion.div
                              key={lead.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <LeadCard
                                lead={lead}
                                onClick={() => setSelectedLead(lead)}
                              />
                            </motion.div>
                          ))}
                      </AnimatePresence>
                    </SortableContext>

                    {filteredLeads.filter((lead) => lead.status === column.id)
                      .length === 0 && (
                      <div className="flex flex-col items-center justify-center h-24 text-center text-gray-400 dark:text-gray-600">
                        <p className="text-sm mb-2">No leads in this stage</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddingLead(true)}
                          className="text-xs h-7"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Lead
                        </Button>
                      </div>
                    )}
                  </div>
                </DropColumn>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="ml-1 h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="ml-1 h-3.5 w-3.5" />
                          ))}
                        {sortConfig.key !== "name" && (
                          <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("company")}
                    >
                      <div className="flex items-center">
                        Company
                        {sortConfig.key === "company" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="ml-1 h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="ml-1 h-3.5 w-3.5" />
                          ))}
                        {sortConfig.key !== "company" && (
                          <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {sortConfig.key === "status" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="ml-1 h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="ml-1 h-3.5 w-3.5" />
                          ))}
                        {sortConfig.key !== "status" && (
                          <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("score")}
                    >
                      <div className="flex items-center">
                        Score
                        {sortConfig.key === "score" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="ml-1 h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="ml-1 h-3.5 w-3.5" />
                          ))}
                        {sortConfig.key !== "score" && (
                          <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("value")}
                    >
                      <div className="flex items-center">
                        Value
                        {sortConfig.key === "value" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="ml-1 h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="ml-1 h-3.5 w-3.5" />
                          ))}
                        {sortConfig.key !== "value" && (
                          <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("nextFollowUp")}
                    >
                      <div className="flex items-center">
                        Follow-up
                        {sortConfig.key === "nextFollowUp" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="ml-1 h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="ml-1 h-3.5 w-3.5" />
                          ))}
                        {sortConfig.key !== "nextFollowUp" && (
                          <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Tags
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeads.map((lead) => (
                    <TableRow key={lead.id} lead={lead} />
                  ))}
                </tbody>
              </table>

              {sortedLeads.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
                  <p className="mb-3">No leads found</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingLead(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Lead
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        <DragOverlay>
          {activeDragId ? (
            <div className="scale-105 shadow-xl opacity-90">
              {viewMode === "kanban" ? (
                <LeadCard
                  lead={leads.find((l) => l.id === activeDragId)!}
                  onClick={() => {}}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[300px]">
                  <div className="font-medium">
                    {leads.find((l) => l.id === activeDragId)?.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {leads.find((l) => l.id === activeDragId)?.company}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Lead Details Modal */}
      <Dialog
        open={!!selectedLead}
        onOpenChange={(open: boolean) => !open && setSelectedLead(null)}
      >
        <DialogContent className="sm:max-w-[700px]">
          {selectedLead && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Lead Details
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLead(null);
                        setIsEditingLead(true);
                      }}
                    >
                      <Edit3 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setLeads(leads.filter((l) => l.id !== selectedLead.id));
                        setSelectedLead(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="contact">Contact Info</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Name
                      </p>
                      <p className="text-base text-gray-900 dark:text-white font-medium">
                        {selectedLead.name}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Company
                      </p>
                      <p className="text-base text-gray-900 dark:text-white font-medium">
                        {selectedLead.company}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </p>
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full mr-2",
                            `bg-${getStatusColor(selectedLead.status)}-500`
                          )}
                        ></div>
                        <p className="text-base text-gray-900 dark:text-white font-medium capitalize">
                          {selectedLead.status}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Lead Score
                      </p>
                      <div className="flex items-center">
                        <p
                          className={cn(
                            "text-base font-medium",
                            getScoreTextColor(selectedLead.score)
                          )}
                        >
                          {selectedLead.score} -{" "}
                          {getScoreLabel(selectedLead.score)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Deal Value
                      </p>
                      <p className="text-base text-gray-900 dark:text-white font-medium">
                        ${selectedLead.value?.toLocaleString() || "0"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Close Probability
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{
                              width: `${selectedLead.probability || 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedLead.probability || 0}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Last Contact
                      </p>
                      <p className="text-base text-gray-900 dark:text-white font-medium">
                        {selectedLead.lastContact.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Next Follow-up
                      </p>
                      <p className="text-base text-gray-900 dark:text-white font-medium">
                        {selectedLead.nextFollowUp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedLead.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Email
                        </p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {selectedLead.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Phone
                        </p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {selectedLead.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Building className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Company
                        </p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {selectedLead.company}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="mb-2 flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Important Dates
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Last Contact:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedLead.lastContact.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Next Follow-up:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedLead.nextFollowUp.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <div className="relative group">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleEmailFollowUp(selectedLead)}
                      >
                        <Mail className="h-4 w-4 mr-2" /> Send Email
                      </Button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Generate AI email script based on lead stage
                      </div>
                    </div>

                    {/* Add new AI Follow-up Button */}
                    <div className="relative group">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleFollowUp(selectedLead)}
                      >
                        <BellRing className="h-4 w-4 mr-2" /> Follow Up
                      </Button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Get AI-powered follow-up recommendations
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Phone className="h-4 w-4 mr-2" /> Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Calendar className="h-4 w-4 mr-2" /> Schedule
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[200px]">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedLead.notes || "No notes available."}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Textarea
                      placeholder="Add a note..."
                      className="min-h-[100px] resize-none"
                      onChange={(e) => {
                        const newNotes = e.target.value;
                        setLeads(
                          leads.map((l) =>
                            l.id === selectedLead.id
                              ? { ...l, notes: newNotes }
                              : l
                          )
                        );
                      }}
                      value={selectedLead.notes || ""}
                    />
                    <Button className="mt-2">Save Note</Button>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setSelectedLead(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // Implement status update
                    const currentIndex = statusColumns.findIndex(
                      (c) => c.id === selectedLead.status
                    );
                    const nextIndex = (currentIndex + 1) % statusColumns.length;
                    const nextStatus = statusColumns[nextIndex]
                      .id as Lead["status"];

                    setLeads(
                      leads.map((l) =>
                        l.id === selectedLead.id
                          ? { ...l, status: nextStatus }
                          : l
                      )
                    );
                    setSelectedLead(null);
                  }}
                >
                  Move to Next Stage
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Script Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Email Follow-up</DialogTitle>
            <DialogDescription>
              Send a personalized follow-up email to {selectedLead?.name} at{" "}
              {selectedLead?.company}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">
                  AI-Generated Email Template
                </h3>
                <p className="text-sm text-gray-500">
                  Based on {selectedLead?.status} stage
                </p>
              </div>

              {!isGeneratingScript && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(emailScript);
                    showNotification(
                      "Email template copied to clipboard",
                      "success"
                    );
                  }}
                >
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              )}
            </div>

            {isGeneratingScript ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">
                  Generating personalized email script...
                </span>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 whitespace-pre-wrap text-sm">
                {emailScript}
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">
                Customize Email (Optional)
              </h3>
              <Textarea
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEmailDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={sendEmail}
              disabled={isGeneratingScript || !customEmail.trim()}
            >
              <Send className="h-4 w-4 mr-1" /> Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Follow-up Recommendation Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>AI-Powered Follow-up</DialogTitle>
            <DialogDescription>
              Get personalized follow-up recommendations for{" "}
              {selectedLead?.name} at {selectedLead?.company}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div>
              <h3 className="text-sm font-medium mb-2">
                What would you like to know?
              </h3>
              <div className="flex gap-2">
                <Textarea
                  value={followUpPrompt}
                  onChange={(e) => setFollowUpPrompt(e.target.value)}
                  placeholder="Enter your question about how to follow up with this lead..."
                  className="flex-1"
                />
                <Button
                  onClick={generateFollowUp}
                  disabled={isGeneratingFollowUp || !followUpPrompt.trim()}
                  className="self-end"
                >
                  {isGeneratingFollowUp ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ClipboardCheck className="h-4 w-4 mr-1" />
                  )}
                  {isGeneratingFollowUp ? "Generating..." : "Get Advice"}
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Suggested Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  "What's the best next step with this lead?",
                  "How can I improve conversion chances?",
                  "What objections might they have?",
                  "When should I follow up next?",
                  "What resources should I share?",
                  "How can I add more value?",
                ].map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setFollowUpPrompt(question)}
                    className="justify-start"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            {followUpRecommendation && (
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium mb-2">
                    AI Recommendation
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(followUpRecommendation);
                      showNotification(
                        "Recommendation copied to clipboard",
                        "success"
                      );
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 whitespace-pre-wrap text-sm">
                  {followUpRecommendation}
                </div>
              </div>
            )}

            {!followUpRecommendation && !isGeneratingFollowUp && (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                <ClipboardCheck className="h-12 w-12 mb-2 opacity-30" />
                <p>
                  Enter your question and click "Get Advice" to receive
                  AI-powered follow-up recommendations
                </p>
              </div>
            )}

            {isGeneratingFollowUp && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">
                  Generating personalized follow-up recommendations...
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEmailDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsEmailDialogOpen(false);
                // Update the lead's lastContact date
                if (selectedLead) {
                  setLeads(
                    leads.map((lead) =>
                      lead.id === selectedLead.id
                        ? { ...lead, lastContact: new Date() }
                        : lead
                    )
                  );
                  showNotification("Follow-up action recorded", "success");
                }
              }}
              disabled={!followUpRecommendation}
            >
              Mark as Followed Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Lead Dialog */}
      <Dialog
        open={isAddingLead || isEditingLead}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setIsAddingLead(false);
            setIsEditingLead(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditingLead ? "Edit Lead" : "Add New Lead"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);

              const newLead: Lead = {
                id:
                  isEditingLead && selectedLead
                    ? selectedLead.id
                    : Date.now().toString(),
                name: formData.get("name") as string,
                company: formData.get("company") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                status: (formData.get("status") as Lead["status"]) || "new",
                score: parseInt(formData.get("score") as string) || 50,
                lastContact: new Date(),
                nextFollowUp: new Date(formData.get("nextFollowUp") as string),
                tags: (formData.get("tags") as string)
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
                value: parseInt(formData.get("value") as string) || undefined,
                probability:
                  parseInt(formData.get("probability") as string) || undefined,
                notes: (formData.get("notes") as string) || "",
              };

              if (isEditingLead && selectedLead) {
                setLeads(
                  leads.map((l) => (l.id === selectedLead.id ? newLead : l))
                );
              } else {
                setLeads([...leads, newLead]);
              }

              setIsAddingLead(false);
              setIsEditingLead(false);
              setSelectedLead(null);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={
                    isEditingLead && selectedLead ? selectedLead.name : ""
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="company"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  defaultValue={
                    isEditingLead && selectedLead ? selectedLead.company : ""
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={
                    isEditingLead && selectedLead ? selectedLead.email : ""
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={
                    isEditingLead && selectedLead ? selectedLead.phone : ""
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Status
                </label>
                <Select
                  name="status"
                  defaultValue={
                    isEditingLead && selectedLead ? selectedLead.status : "new"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusColumns.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="score"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Lead Score (0-100)
                </label>
                <Input
                  id="score"
                  name="score"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={
                    isEditingLead && selectedLead ? selectedLead.score : "50"
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="value"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Deal Value ($)
                </label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  min="0"
                  defaultValue={
                    isEditingLead && selectedLead ? selectedLead.value : ""
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="probability"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Probability (%)
                </label>
                <Input
                  id="probability"
                  name="probability"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={
                    isEditingLead && selectedLead
                      ? selectedLead.probability
                      : ""
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="nextFollowUp"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Next Follow-up
                </label>
                <Input
                  id="nextFollowUp"
                  name="nextFollowUp"
                  type="date"
                  defaultValue={
                    isEditingLead && selectedLead
                      ? selectedLead.nextFollowUp.toISOString().slice(0, 10)
                      : new Date().toISOString().slice(0, 10)
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tags"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tags (comma-separated)
                </label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={
                    isEditingLead && selectedLead
                      ? selectedLead.tags.join(", ")
                      : ""
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="notes"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={
                  isEditingLead && selectedLead ? selectedLead.notes : ""
                }
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsAddingLead(false);
                  setIsEditingLead(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditingLead ? "Update Lead" : "Add Lead"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadManagement;

// Helper function to get color class for a column
function getColumnColor(color: string, asBg: boolean = false) {
  const prefix = asBg ? "bg" : "text";

  switch (color) {
    case "blue":
      return `${prefix}-blue-500`;
    case "purple":
      return `${prefix}-purple-500`;
    case "green":
      return `${prefix}-green-500`;
    case "orange":
      return `${prefix}-orange-500`;
    case "pink":
      return `${prefix}-pink-500`;
    case "emerald":
      return `${prefix}-emerald-500`;
    default:
      return `${prefix}-gray-500`;
  }
}

// Helper function to get color for score
function getScoreColor(score: number) {
  if (score >= 90) return "bg-green-500";
  if (score >= 70) return "bg-blue-500";
  if (score >= 50) return "bg-amber-500";
  if (score >= 30) return "bg-orange-500";
  return "bg-red-500";
}

// Helper function to get label for score
function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  if (score >= 30) return "Fair";
  return "Poor";
}

// Helper function to get color for a status
function getStatusColor(status: string): string {
  switch (status) {
    case "new":
      return "blue";
    case "contacted":
      return "purple";
    case "qualified":
      return "green";
    case "proposal":
      return "orange";
    case "negotiation":
      return "pink";
    case "closed":
      return "emerald";
    default:
      return "gray";
  }
}

// Helper function to get text color for score
function getScoreTextColor(score: number): string {
  if (score >= 90) return "text-green-600 dark:text-green-400";
  if (score >= 70) return "text-blue-600 dark:text-blue-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  if (score >= 30) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}
