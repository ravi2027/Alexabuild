"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Mic, MicOff, Send, Zap, Cpu, Wifi, ChevronRight,
  BarChart3, Clock, RefreshCw, Layers
} from "lucide-react";
import AmbientRing from "@/components/AmbientRing";
import ChatPanel from "@/components/ChatPanel";
import MCPLogPanel from "@/components/MCPLogPanel";
import { ChatMessage, MCPLogEntry, RingState, WorkflowType } from "@/types";
import {
  QUICK_PROMPTS, MCP_SEQUENCE_TEMPLATES, AI_RESPONSES, genId
} from "@/lib/data";

export default function HomePage() {
  const [ringState, setRingState] = useState<RingState>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mcpLogs, setMcpLogs] = useState<MCPLogEntry[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowType>(null);
  const [currentTime, setCurrentTime] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const processRef = useRef(false);

  // Update clock every minute on the client only
  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  // Simulate MCP tool execution with streaming delays
  const runWorkflow = useCallback(async (workflow: WorkflowType, userMsg: string) => {
    if (!workflow || processRef.current) return;
    processRef.current = true;
    setActiveWorkflow(workflow);

    const userMessage: ChatMessage = {
      id: genId(),
      role: "user",
      content: userMsg,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMcpLogs([]);
    setRingState("listening");

    await delay(600);
    setRingState("processing");

    // Stream MCP log entries with delays
    const sequence = MCP_SEQUENCE_TEMPLATES[workflow];
    for (let i = 0; i < sequence.length; i++) {
      await delay(300 + Math.random() * 400);
      setMcpLogs((prev) => [...prev, { ...sequence[i], timestamp: new Date() }]);
    }

    await delay(500);
    setRingState("responding");

    // Add Alexa response
    const alexaMessage: ChatMessage = {
      id: genId(),
      role: "alexa",
      content: AI_RESPONSES[workflow],
      timestamp: new Date(),
      workflow,
    };
    setMessages((prev) => [...prev, alexaMessage]);

    await delay(1200);
    setRingState("idle");
    processRef.current = false;
    setIsProcessing(false);
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isProcessing) return;

    setInput("");
    setIsProcessing(true);

    // Detect workflow from input keywords
    let workflow: WorkflowType = null;
    if (text.toLowerCase().includes("schedule") || text.toLowerCase().includes("developer") || text.toLowerCase().includes("routine")) {
      workflow = "developer";
    } else if (text.toLowerCase().includes("aws") || text.toLowerCase().includes("cloud") || text.toLowerCase().includes("log") || text.toLowerCase().includes("bedrock")) {
      workflow = "aws";
    } else if (text.toLowerCase().includes("meeting") || text.toLowerCase().includes("calendar") || text.toLowerCase().includes("reminder")) {
      workflow = "meeting";
    }

    if (workflow) {
      await runWorkflow(workflow, text);
    } else {
      // Generic response
      const userMsg: ChatMessage = { id: genId(), role: "user", content: text, timestamp: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setRingState("processing");
      await delay(1500);
      const resp: ChatMessage = {
        id: genId(),
        role: "alexa",
        content: "I'm Alexa+, your ambient AI assistant powered by **AWS Bedrock**. I can help you manage your developer schedule, analyze cloud metrics, or schedule meetings. Try one of the quick-access workflows below! 🚀",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, resp]);
      setRingState("idle");
      setIsProcessing(false);
      processRef.current = false;
    }
  }, [input, isProcessing, runWorkflow]);

  const handleQuickPrompt = useCallback(async (prompt: typeof QUICK_PROMPTS[0]) => {
    if (isProcessing) return;
    setIsProcessing(true);
    await runWorkflow(prompt.workflow, prompt.prompt);
  }, [isProcessing, runWorkflow]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (isProcessing) return;
    setIsMicActive((prev) => {
      if (!prev) setRingState("listening");
      else setRingState("idle");
      return !prev;
    });
  };

  const handleReset = () => {
    if (isProcessing) return;
    setMessages([]);
    setMcpLogs([]);
    setRingState("idle");
    setActiveWorkflow(null);
    processRef.current = false;
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 grid-bg relative overflow-hidden">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="relative z-10 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Branding */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                <path strokeLinecap="round" d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-white truncate leading-tight">
                Alexa+ <span className="shimmer-text">Smart Workspace</span>
              </h1>
              <p className="text-[10px] text-slate-500 truncate">Ambient AI Assistant</p>
            </div>
          </div>

          {/* Center: Badges */}
          <div className="hidden md:flex items-center gap-2 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 badge-glow">
              <Zap className="w-3 h-3 text-orange-400" />
              <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wide">AWS Bedrock Powered</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wide">MCP spec 2025-11-25</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
              <Cpu className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wide">Nova Pro</span>
            </div>
          </div>

          {/* Right: Status & Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* MCP Status */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50">
              <div className="relative">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-emerald-400 font-medium mono">Connected</span>
            </div>

            {/* Reset */}
            <button
              onClick={handleReset}
              disabled={isProcessing}
              title="Reset conversation"
              className="w-8 h-8 rounded-lg btn-ghost flex items-center justify-center transition-all disabled:opacity-40"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Hackathon badge */}
            <div className="hidden lg:block px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/20">
              <span className="text-[10px] text-purple-300 font-semibold">🏆 Build Hackathon 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout ──────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 py-4 h-[calc(100vh-65px)] flex flex-col gap-4">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-4 min-h-0">

          {/* ── Left Panel: Voice/Chat ───────────────────────────────────── */}
          <div className="flex flex-col gap-4 min-h-0">

            {/* Ambient Ring + Ring State */}
            <div className="glass-card p-4 flex flex-col items-center gap-4 shrink-0">
              {/* Ring + Waveform */}
              <div className="flex items-center gap-8 w-full justify-center">
                <AmbientRing state={ringState} />

                {/* Right of ring: system info */}
                <div className="hidden sm:flex flex-col gap-2 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-slate-400 mono">System Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-slate-500 mono">us-east-1 · nova-pro-v1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-cyan-400/60" />
                    <span className="text-xs text-slate-500 mono">{currentTime}</span>
                  </div>
                  {activeWorkflow && (
                    <div className="mt-1 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span className="text-[10px] text-cyan-400 capitalize">{activeWorkflow} workflow</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap gap-2 justify-center w-full">
                {QUICK_PROMPTS.map((qp) => (
                  <button
                    key={qp.workflow}
                    onClick={() => handleQuickPrompt(qp)}
                    disabled={isProcessing}
                    className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                      activeWorkflow === qp.workflow
                        ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
                        : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:bg-slate-700/60 hover:border-slate-600/50 hover:text-slate-200"
                    }`}
                  >
                    <span>{qp.icon}</span>
                    <span>{qp.label}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Transcript */}
            <div className="glass-card p-4 flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
                  Live Transcript
                </span>
                <span className="text-[10px] text-slate-600 mono">{messages.length} messages</span>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                <ChatPanel messages={messages} isProcessing={isProcessing} />
              </div>
            </div>

            {/* Input Area */}
            <div className="glass-card p-3 shrink-0">
              <div className="flex gap-2 items-end">
                {/* Mic button */}
                <button
                  onClick={toggleMic}
                  disabled={isProcessing}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-40 ${
                    isMicActive
                      ? "bg-red-500/30 border border-red-500/50 text-red-400 animate-pulse"
                      : "btn-ghost"
                  }`}
                >
                  {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Text input */}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Ask Alexa+ anything... (e.g. "Plan my day" or "Check AWS health")'
                  disabled={isProcessing}
                  rows={1}
                  className="flex-1 input-field rounded-xl px-4 py-2.5 text-sm resize-none leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-600"
                  style={{ minHeight: "40px", maxHeight: "120px" }}
                />

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={isProcessing || !input.trim()}
                  className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden z-0"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 relative z-10" />
                  )}
                </button>
              </div>

              {/* Hint */}
              <div className="mt-1.5 flex items-center justify-between px-1">
                <span className="text-[10px] text-slate-700">
                  {isMicActive ? "🎤 Listening... speak now" : "↵ Send · Shift+↵ newline"}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-700">
                  <BarChart3 className="w-2.5 h-2.5" />
                  <span>Streamable HTTP · MCP 2025-11-25</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Panel: MCP Execution Log ──────────────────────────── */}
          <div className="glass-card p-4 min-h-0 flex flex-col">
            <MCPLogPanel logs={mcpLogs} />
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper delay
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
