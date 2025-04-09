export interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  score: number;
  value: number;
  probability: number;
  tags: string[];
  notes: string;
  nextFollowUp: Date;
  lastContact: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadUpload {
  id: number;
  filename: string;
  status: "pending" | "processing" | "completed" | "failed";
  totalLeads: number;
  processedLeads: number;
  priority: "high" | "medium" | "low";
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowUp {
  id: number;
  leadId: number;
  type: "email" | "call";
  status: "pending" | "sent" | "failed";
  scheduledAt: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
