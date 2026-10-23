"use client";

import { useState } from "react";
import { MeetingDetails } from "@/types";

interface MeetingCardWidgetProps {
  meeting: MeetingDetails;
}

export default function MeetingCardWidget({ meeting: initialMeeting }: MeetingCardWidgetProps) {
  const [meeting, setMeeting] = useState(initialMeeting);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfirm = () => {
    setMeeting((m) => ({ ...m, status: "confirmed" }));
    showToast("✅ Meeting confirmed! Invites sent to all attendees.");
  };

  const handleReschedule = () => {
    setMeeting((m) => ({ ...m, status: "rescheduled", time: "3:30 PM EST", date: "Tomorrow, Oct 24, 2026" }));
    showToast("🔄 Meeting rescheduled to 3:30 PM EST. All attendees notified.");
  };

  const handleAddNotes = () => {
    showToast("📝 Meeting notes template opened in Notion.");
  };

  const statusConfig = {
    pending: { label: "Pending Confirmation", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
    confirmed: { label: "Confirmed ✓", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
    rescheduled: { label: "Rescheduled", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  };

  const sc = statusConfig[meeting.status];

  return (
    <div className="widget-card relative overflow-visible">
      {/* Toast notification */}
      {toast && (
        <div className="absolute -top-12 left-0 right-0 flex justify-center z-50">
          <div className="px-3 py-2 rounded-lg bg-slate-800 border border-cyan-500/30 text-xs text-slate-200 shadow-lg animate-[chat-entry_0.3s_ease_forwards]">
            {toast}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-3 border-b border-slate-800/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center">
              <span className="text-sm">📅</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">{meeting.title}</h3>
              <p className="text-[10px] text-slate-500">Scheduled by Alexa+ • Amazon Chime</p>
            </div>
          </div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${sc.color}`}>
            {sc.label}
          </span>
        </div>
      </div>

      {/* Meeting details */}
      <div className="p-3 space-y-2 border-b border-slate-800/50">
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: "🗓", label: "Date", value: meeting.date },
            { icon: "🕐", label: "Time", value: meeting.time },
            { icon: "⏱", label: "Duration", value: meeting.duration },
            { icon: "📍", label: "Location", value: "Amazon Chime" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-1.5">
              <span className="text-xs mt-0.5">{item.icon}</span>
              <div>
                <div className="text-[9px] text-slate-600 uppercase tracking-wide">{item.label}</div>
                <div className="text-[10px] text-slate-300 font-medium">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendees */}
      <div className="px-3 py-2 border-b border-slate-800/50">
        <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-1.5">Attendees ({meeting.attendees.length})</div>
        <div className="flex flex-wrap gap-1">
          {meeting.attendees.map((a, i) => (
            <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50">
              <div
                className="w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold"
                style={{
                  background: `hsl(${(i * 47 + 200) % 360}, 70%, 50%)`,
                }}
              >
                {a[0]}
              </div>
              <span className="text-[9px] text-slate-400">{a.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agenda */}
      <div className="px-3 py-2 border-b border-slate-800/50">
        <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-1.5">Agenda</div>
        <ol className="space-y-0.5">
          {meeting.agenda.map((item, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-[9px] text-cyan-600 font-mono mt-0.5">{String(i + 1).padStart(2, "0")}.</span>
              <span className="text-[10px] text-slate-400">{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Action buttons */}
      <div className="p-3 flex gap-2">
        <button
          onClick={handleConfirm}
          disabled={meeting.status === "confirmed"}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
            meeting.status === "confirmed"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
              : "btn-primary rounded-lg"
          }`}
        >
          {meeting.status === "confirmed" ? "✓ Confirmed" : "Confirm"}
        </button>
        <button
          onClick={handleReschedule}
          className="flex-1 py-2 rounded-lg text-xs font-semibold btn-ghost"
        >
          Reschedule
        </button>
        <button
          onClick={handleAddNotes}
          className="px-3 py-2 rounded-lg text-xs btn-ghost"
          title="Add Notes"
        >
          📝
        </button>
      </div>
    </div>
  );
}
