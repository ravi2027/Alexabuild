"use client";

import { useState } from "react";
import { ScheduleTask } from "@/types";

interface DeveloperScheduleWidgetProps {
  tasks: ScheduleTask[];
}

const priorityColors = {
  high: "text-red-400 bg-red-400/10 border-red-400/20",
  medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  low: "text-slate-400 bg-slate-400/10 border-slate-400/20",
};

const tagColors: Record<string, string> = {
  Meeting: "text-blue-400 bg-blue-400/10",
  Code: "text-purple-400 bg-purple-400/10",
  Focus: "text-cyan-400 bg-cyan-400/10",
  Design: "text-pink-400 bg-pink-400/10",
  Break: "text-emerald-400 bg-emerald-400/10",
  DevOps: "text-orange-400 bg-orange-400/10",
  Docs: "text-indigo-400 bg-indigo-400/10",
  Admin: "text-slate-400 bg-slate-400/10",
};

export default function DeveloperScheduleWidget({ tasks: initialTasks }: DeveloperScheduleWidgetProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [focusActive, setFocusActive] = useState(false);
  const [focusTime, setFocusTime] = useState(90 * 60); // 90 minutes in seconds

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const formatFocusTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="widget-card">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <div>
              <h3 className="text-sm font-bold text-white">Developer Daily Schedule</h3>
              <p className="text-[10px] text-slate-500">AI-optimized by Alexa+ • Bedrock Powered</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-cyan-400 mono">{completedCount}/{tasks.length}</div>
            <div className="text-[9px] text-slate-500">complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Focus Timer */}
      <div className="px-3 py-2 border-b border-slate-800/50 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className={`w-2 h-2 rounded-full ${focusActive ? "bg-cyan-400 animate-pulse" : "bg-slate-600"}`} />
          <span className="text-xs text-slate-400">Focus Timer</span>
          <span className={`text-sm font-bold mono ${focusActive ? "text-cyan-400" : "text-slate-500"}`}>
            {formatFocusTime(focusTime)}
          </span>
        </div>
        <button
          onClick={() => setFocusActive(!focusActive)}
          className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-all ${
            focusActive
              ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
          }`}
        >
          {focusActive ? "⏹ Stop" : "▶ Start"}
        </button>
      </div>

      {/* Task List */}
      <div className="max-h-64 overflow-y-auto">
        {tasks.map((task, i) => (
          <div
            key={task.id}
            className={`flex items-start gap-2.5 px-3 py-2.5 border-b border-slate-800/30 cursor-pointer transition-all duration-200 hover:bg-slate-800/30 group ${
              task.done ? "opacity-50" : ""
            }`}
            onClick={() => toggleTask(task.id)}
          >
            {/* Checkbox */}
            <div
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 ${
                task.done
                  ? "border-emerald-400 bg-emerald-400"
                  : "border-slate-600 group-hover:border-cyan-500/50"
              }`}
            >
              {task.done && (
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-500 mono shrink-0">{task.time}</span>
                <span className={`text-xs font-medium ${task.done ? "line-through text-slate-600" : "text-slate-200"}`}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${tagColors[task.tag] || "text-slate-400 bg-slate-400/10"}`}>
                  {task.tag}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 flex items-center justify-between">
        <span className="text-[10px] text-slate-600">Tap tasks to mark complete</span>
        <button
          className="text-[10px] text-cyan-500 hover:text-cyan-400 transition-colors"
          onClick={() => setTasks(initialTasks.map((t) => ({ ...t, done: false })))}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
