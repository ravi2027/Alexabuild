"use client";

import { useRef, useEffect } from "react";
import { ChatMessage, WorkflowType } from "@/types";
import DeveloperScheduleWidget from "./DeveloperScheduleWidget";
import AWSHealthWidget from "./AWSHealthWidget";
import MeetingCardWidget from "./MeetingCardWidget";
import { SCHEDULE_TASKS, AWS_METRICS, MEETING_DETAILS } from "@/lib/data";

interface ChatPanelProps {
  messages: ChatMessage[];
  isProcessing: boolean;
}

const WorkflowWidget = ({ workflow }: { workflow: WorkflowType }) => {
  if (!workflow) return null;
  return (
    <div className="mt-2 animate-[chat-entry_0.4s_ease_forwards]">
      {workflow === "developer" && <DeveloperScheduleWidget tasks={SCHEDULE_TASKS} />}
      {workflow === "aws" && <AWSHealthWidget metrics={AWS_METRICS} />}
      {workflow === "meeting" && <MeetingCardWidget meeting={MEETING_DETAILS} />}
    </div>
  );
};

const Avatar = ({ role }: { role: "user" | "alexa" }) => {
  if (role === "user") {
    return (
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="currentColor">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-600/30 border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
        <path strokeLinecap="round" d="M19 10v2a7 7 0 0 1-14 0v-2" />
      </svg>
    </div>
  );
};

export default function ChatPanel({ messages, isProcessing }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  return (
    <div className="flex flex-col gap-3 overflow-y-auto h-full pr-1">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-400/10 flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-cyan-400/40" fill="none" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
              <path strokeLinecap="round" d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />
            </svg>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Alexa+ is Ready</h3>
          <p className="text-slate-600 text-xs max-w-xs leading-relaxed">
            Use the prompt chips below or type your request to get started. Try a workflow to see full MCP tool execution.
          </p>
        </div>
      )}

      {messages.map((msg, i) => (
        <div
          key={msg.id}
          className={`chat-entry flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          style={{ animationDelay: `${i * 0.02}s` }}
        >
          <Avatar role={msg.role} />
          <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-[10px] text-slate-600">
                {msg.role === "user" ? "You" : "Alexa+"}
              </span>
              <span className="text-[9px] text-slate-700">
                {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <div
              className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-indigo-600/80 to-purple-700/80 text-white border border-indigo-500/30"
                  : "glass-card text-slate-200 rounded-tl-sm"
              }`}
            >
              {/* Simple markdown-ish rendering */}
              {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, pi) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return <strong key={pi} className="text-cyan-300 font-semibold">{part.slice(2, -2)}</strong>;
                }
                return <span key={pi}>{part}</span>;
              })}
            </div>

            {/* Inline widget */}
            {msg.workflow && <WorkflowWidget workflow={msg.workflow} />}
          </div>
        </div>
      ))}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="chat-entry flex gap-2.5">
          <Avatar role="alexa" />
          <div className="flex flex-col gap-1 items-start">
            <span className="text-[10px] text-slate-600 px-1">Alexa+</span>
            <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="text-[10px] text-slate-500 ml-1">Thinking with Bedrock...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
