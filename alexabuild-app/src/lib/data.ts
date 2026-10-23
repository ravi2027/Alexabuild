// ─── Simulated Data & AI Responses ───────────────────────────────────────────
import {
  MCPLogEntry,
  ScheduleTask,
  AWSMetric,
  MeetingDetails,
  QuickPrompt,
  WorkflowType,
} from "@/types";

// ── Quick Prompt Chips ────────────────────────────────────────────────────────
export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    label: "Developer Daily Routine",
    prompt: "Plan my developer schedule for today with focus blocks and AWS task priorities",
    workflow: "developer",
    icon: "📋",
  },
  {
    label: "AWS Cloud Health Check",
    prompt: "Analyze AWS system server logs and Bedrock usage metrics for anomalies",
    workflow: "aws",
    icon: "☁️",
  },
  {
    label: "Smart Meeting & Reminder",
    prompt: "Draft a calendar invite for the AWS Bedrock integration review and set reminder",
    workflow: "meeting",
    icon: "📅",
  },
];

// Helper to create a log entry without a live Date (date assigned at runtime)
type LogTemplate = Omit<MCPLogEntry, "timestamp">;

export const MCP_SEQUENCE_TEMPLATES: Record<NonNullable<WorkflowType>, LogTemplate[]> = {
  developer: [
    { id: "d1", type: "init", message: "MCP Session initialized", detail: "spec: 2025-11-25 | transport: Streamable HTTP", status: "ok" },
    { id: "d2", type: "tool_call", message: "Calling tool: aws_bedrock_reasoning", detail: 'model: "us.amazon.nova-pro-v1:0" | tokens: 4096', status: "running", latency: 0 },
    { id: "d3", type: "tool_call", message: "Calling tool: calendar_get_events", detail: "range: today | timezone: UTC-5", status: "running", latency: 0 },
    { id: "d4", type: "tool_result", message: "Status: 200 OK — calendar_get_events", detail: "Events fetched: 6 | next: Standup @ 09:30", status: "ok", latency: 142 },
    { id: "d5", type: "tool_call", message: "Calling tool: task_manager_list", detail: "filter: in_progress | project: aws-integration", status: "running", latency: 0 },
    { id: "d6", type: "tool_result", message: "Status: 200 OK — task_manager_list", detail: "Tasks: 8 open | 3 high-priority", status: "ok", latency: 98 },
    { id: "d7", type: "tool_call", message: "Calling tool: focus_timer_create", detail: "duration: 90min | type: deep_work | label: Bedrock Integration", status: "running", latency: 0 },
    { id: "d8", type: "tool_result", message: "Status: 200 OK — focus_timer_create", detail: "Timer ID: ft-2847 | start: 10:00 AM", status: "ok", latency: 67 },
    { id: "d9", type: "stream", message: "Streaming response: schedule_widget generated", detail: "tokens_out: 612 | time_to_first_token: 0.38s", status: "ok" },
  ],
  aws: [
    { id: "a1", type: "init", message: "MCP Session initialized", detail: "spec: 2025-11-25 | transport: Streamable HTTP", status: "ok" },
    { id: "a2", type: "tool_call", message: "Calling tool: aws_cloudwatch_logs", detail: "group: /aws/bedrock/model-invocations | period: 1h", status: "running", latency: 0 },
    { id: "a3", type: "tool_result", message: "Status: 200 OK — cloudwatch_logs", detail: "Log events: 2,847 | Errors: 3 | Warnings: 18", status: "ok", latency: 287 },
    { id: "a4", type: "tool_call", message: "Calling tool: bedrock_model_metrics", detail: "models: [nova-pro, claude-3-5, titan-text] | region: us-east-1", status: "running", latency: 0 },
    { id: "a5", type: "tool_result", message: "Status: 200 OK — bedrock_model_metrics", detail: "Avg latency: 1.42s | P99: 3.8s | Success rate: 99.7%", status: "ok", latency: 198 },
    { id: "a6", type: "tool_call", message: "Calling tool: aws_cost_explorer", detail: "service: bedrock | period: MTD | granularity: daily", status: "running", latency: 0 },
    { id: "a7", type: "tool_result", message: "Status: 200 OK — cost_explorer", detail: "MTD spend: $247.82 | projected: $519.40", status: "ok", latency: 156 },
    { id: "a8", type: "tool_call", message: "Calling tool: anomaly_detector_run", detail: "dataset: invocations | sensitivity: HIGH", status: "running", latency: 0 },
    { id: "a9", type: "tool_result", message: "Status: 200 OK — anomaly_detector", detail: "Anomalies: 1 detected | severity: medium | 14:23 UTC", status: "ok", latency: 412 },
    { id: "a10", type: "stream", message: "Streaming response: aws_dashboard_widget generated", detail: "tokens_out: 784 | time_to_first_token: 0.29s", status: "ok" },
  ],
  meeting: [
    { id: "m1", type: "init", message: "MCP Session initialized", detail: "spec: 2025-11-25 | transport: Streamable HTTP", status: "ok" },
    { id: "m2", type: "tool_call", message: "Calling tool: aws_bedrock_reasoning", detail: 'model: "us.amazon.nova-pro-v1:0" | mode: draft', status: "running", latency: 0 },
    { id: "m3", type: "tool_call", message: "Calling tool: calendar_find_slot", detail: "attendees: 5 | duration: 45min | range: next 3 days", status: "running", latency: 0 },
    { id: "m4", type: "tool_result", message: "Status: 200 OK — calendar_find_slot", detail: "Best slot: Tomorrow 2:30 PM EST | conflicts: 0", status: "ok", latency: 231 },
    { id: "m5", type: "tool_call", message: "Calling tool: calendar_create_event", detail: "title: AWS Bedrock Review | date: Tomorrow | time: 14:30", status: "running", latency: 0 },
    { id: "m6", type: "tool_result", message: "Status: 200 OK — calendar_create_event", detail: "Event ID: cal-8f3a9 | invite sent to 5 attendees", status: "ok", latency: 189 },
    { id: "m7", type: "tool_call", message: "Calling tool: notification_schedule", detail: "remind_at: 30min_before | channel: email+push", status: "running", latency: 0 },
    { id: "m8", type: "tool_result", message: "Status: 200 OK — notification_schedule", detail: "Reminder set: Tomorrow 2:00 PM EST", status: "ok", latency: 77 },
    { id: "m9", type: "stream", message: "Streaming response: meeting_card_widget generated", detail: "tokens_out: 428 | time_to_first_token: 0.22s", status: "ok" },
  ],
};

// ── AI Response Messages ──────────────────────────────────────────────────────
export const AI_RESPONSES: Record<NonNullable<WorkflowType>, string> = {
  developer: `Great! I've analyzed your calendar, tasks, and priorities. Here's your **optimized developer schedule** for today, with deep focus blocks, Bedrock integration tasks, and team syncs intelligently arranged. Your first 90-minute focus block starts at 10:00 AM — I've blocked notifications and activated your Pomodoro timer. 🚀`,

  aws: `I've completed a full analysis of your **AWS Bedrock infrastructure**. All core models are healthy with 99.7% success rate. I detected one medium-severity anomaly in model invocations at 14:23 UTC — likely a traffic spike from the batch job. CloudWatch alarms are configured. Month-to-date spend is on track at $247 with a projected $519 — within your $600 budget. ✅`,

  meeting: `Done! I've scheduled the **AWS Bedrock Integration Review** for tomorrow at 2:30 PM EST. All 5 attendees have received calendar invites. I've also drafted the agenda, attached relevant architecture docs, and set a 30-minute reminder via email and push notification. The meeting includes a Chime video link. 📅`,
};

// ── Schedule Tasks ────────────────────────────────────────────────────────────
export const SCHEDULE_TASKS: ScheduleTask[] = [
  { id: "t1", time: "09:00 AM", title: "Team Standup", description: "Daily sync with engineering team", done: false, priority: "medium", tag: "Meeting" },
  { id: "t2", time: "09:30 AM", title: "PR Review: Bedrock Connector", description: "Review 3 open pull requests", done: false, priority: "high", tag: "Code" },
  { id: "t3", time: "10:00 AM", title: "🎯 Deep Work: MCP Integration", description: "90min focus — No interruptions", done: false, priority: "high", tag: "Focus" },
  { id: "t4", time: "11:30 AM", title: "AWS Bedrock Architecture Design", description: "Finalize multi-agent system design", done: false, priority: "high", tag: "Design" },
  { id: "t5", time: "01:00 PM", title: "Lunch Break", description: "Recharge & walk", done: false, priority: "low", tag: "Break" },
  { id: "t6", time: "02:00 PM", title: "Deploy to staging env", description: "Deploy nova-pro integration to ECS", done: false, priority: "medium", tag: "DevOps" },
  { id: "t7", time: "03:30 PM", title: "Documentation Sprint", description: "Update API docs and README", done: false, priority: "medium", tag: "Docs" },
  { id: "t8", time: "05:00 PM", title: "End-of-day Review", description: "Journal progress, update Jira", done: false, priority: "low", tag: "Admin" },
];

// ── AWS Metrics ───────────────────────────────────────────────────────────────
export const AWS_METRICS: AWSMetric[] = [
  { name: "Bedrock Availability", value: 99.7, unit: "%", status: "healthy", delta: "+0.1%" },
  { name: "Avg Inference Latency", value: 1.42, unit: "s", status: "healthy", delta: "-0.08s" },
  { name: "P99 Latency", value: 3.8, unit: "s", status: "warning", delta: "+0.4s" },
  { name: "Token Throughput", value: 84200, unit: "tok/hr", status: "healthy", delta: "+12%" },
  { name: "Error Rate", value: 0.3, unit: "%", status: "healthy", delta: "-0.1%" },
  { name: "MTD Cost", value: 247, unit: "$", status: "healthy", delta: "+$18" },
];

// ── Meeting Details ───────────────────────────────────────────────────────────
export const MEETING_DETAILS: MeetingDetails = {
  title: "AWS Bedrock Integration Review",
  date: "Tomorrow, Oct 24, 2026",
  time: "2:30 PM EST",
  duration: "45 minutes",
  attendees: ["Sarah Chen (Lead)", "Marcus Rodriguez", "Priya Patel", "James Okonkwo", "You"],
  location: "Amazon Chime (link auto-generated)",
  agenda: [
    "MCP tool chain architecture review",
    "Nova Pro model performance benchmarks",
    "Multi-agent orchestration design",
    "Q3 cost optimization strategies",
    "Demo: Alexa+ ambient assistant prototype",
  ],
  status: "pending",
};

// ── Generate unique IDs ───────────────────────────────────────────────────────
export const genId = () => Math.random().toString(36).slice(2, 9);
