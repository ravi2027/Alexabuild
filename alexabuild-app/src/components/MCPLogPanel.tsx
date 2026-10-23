"use client";

import { MCPLogEntry } from "@/types";
import { formatTime } from "@/lib/data";

interface MCPLogPanelProps {
  logs: MCPLogEntry[];
}

const typeConfig = {
  init: { label: "INIT", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", dot: "bg-blue-400" },
  tool_call: { label: "CALL", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", dot: "bg-purple-400" },
  tool_result: { label: "RESULT", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400" },
  stream: { label: "STREAM", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20", dot: "bg-cyan-400" },
  error: { label: "ERROR", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", dot: "bg-red-400" },
  info: { label: "INFO", color: "text-slate-400", bg: "bg-slate-400/10 border-slate-400/20", dot: "bg-slate-400" },
};

const statusIcon = (status?: string) => {
  if (status === "ok") return <span className="text-emerald-400">✓</span>;
  if (status === "running") return <span className="text-amber-400 animate-pulse">●</span>;
  if (status === "error") return <span className="text-red-400">✗</span>;
  return null;
};

export default function MCPLogPanel({ logs }: MCPLogPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 relative">
            <span className="absolute inset-0 rounded-full bg-emerald-400" style={{ animation: "status-ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
          </div>
          <span className="text-xs font-semibold text-emerald-400 mono uppercase tracking-widest">MCP Live Execution Log</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 mono">spec: 2025-11-25</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Protocol info bar */}
      <div className="flex gap-2 mb-3 flex-shrink-0">
        {["Streamable HTTP", "JSON-RPC 2.0", "Tool Calling"].map((tag) => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/20 text-indigo-400 bg-indigo-500/5 mono">
            {tag}
          </span>
        ))}
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-0">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
              </svg>
            </div>
            <p className="text-slate-600 text-xs mono">Awaiting tool execution...</p>
            <p className="text-slate-700 text-[10px] mt-1">Trigger a workflow to see MCP calls</p>
          </div>
        ) : (
          logs.map((entry, i) => {
            const cfg = typeConfig[entry.type];
            return (
              <div
                key={entry.id}
                className="log-entry glass-card p-2.5 group hover:border-indigo-500/20 transition-all duration-200"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start gap-2">
                  {/* Type badge */}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${cfg.bg} ${cfg.color} mono shrink-0 mt-0.5`}>
                    {cfg.label}
                  </span>

                  <div className="flex-1 min-w-0">
                    {/* Message row */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[11px] font-medium mono ${cfg.color}`}>
                        {statusIcon(entry.status)}
                      </span>
                      <span className="text-xs text-slate-300 mono truncate">{entry.message}</span>
                      {entry.latency !== undefined && entry.latency > 0 && (
                        <span className="text-[10px] text-slate-500 ml-auto shrink-0">
                          {entry.latency}ms
                        </span>
                      )}
                    </div>

                    {/* Detail */}
                    {entry.detail && (
                      <div className="mt-0.5 text-[10px] text-slate-500 mono truncate">
                        {entry.detail}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer stats */}
      {logs.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/50 flex-shrink-0">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Tool Calls", value: logs.filter((l) => l.type === "tool_call").length },
              { label: "OK Responses", value: logs.filter((l) => l.status === "ok").length },
              {
                label: "Avg Latency",
                value: `${Math.round(
                  logs
                    .filter((l) => l.latency && l.latency > 0)
                    .reduce((a, l) => a + (l.latency || 0), 0) /
                    Math.max(1, logs.filter((l) => l.latency && l.latency > 0).length)
                )}ms`,
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-sm font-bold text-cyan-400 mono">{stat.value}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
