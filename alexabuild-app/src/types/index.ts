// ─── Types & Interfaces ───────────────────────────────────────────────────────

export type WorkflowType = "developer" | "aws" | "meeting" | null;
export type RingState = "idle" | "listening" | "processing" | "responding";

export interface ChatMessage {
  id: string;
  role: "user" | "alexa";
  content: string;
  timestamp: Date;
  workflow?: WorkflowType;
}

export interface MCPLogEntry {
  id: string;
  timestamp: Date;
  type: "init" | "tool_call" | "tool_result" | "stream" | "error" | "info";
  message: string;
  detail?: string;
  status?: "ok" | "running" | "error";
  latency?: number;
}

export interface ScheduleTask {
  id: string;
  time: string;
  title: string;
  description: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  tag: string;
}

export interface AWSMetric {
  name: string;
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  delta: string;
}

export interface MeetingDetails {
  title: string;
  date: string;
  time: string;
  duration: string;
  attendees: string[];
  location: string;
  agenda: string[];
  status: "pending" | "confirmed" | "rescheduled";
}

export interface QuickPrompt {
  label: string;
  prompt: string;
  workflow: WorkflowType;
  icon: string;
}
