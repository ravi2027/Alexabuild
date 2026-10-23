"use client";

import { AWSMetric } from "@/types";

interface AWSHealthWidgetProps {
  metrics: AWSMetric[];
}

const Gauge = ({ value, max = 100, label, unit, status }: {
  value: number;
  max?: number;
  label: string;
  unit: string;
  status: "healthy" | "warning" | "critical";
}) => {
  const pct = Math.min(100, (value / max) * 100);
  const strokeColor = status === "healthy" ? "#10b981" : status === "warning" ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${strokeColor}80)`, transition: "stroke-dashoffset 1.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold mono" style={{ color: strokeColor }}>
            {value}{unit === "%" ? "%" : ""}
          </span>
        </div>
      </div>
      <span className="text-[9px] text-slate-500 text-center leading-tight">{label}</span>
    </div>
  );
};

const MetricRow = ({ metric }: { metric: AWSMetric }) => {
  const barWidth = metric.name === "Bedrock Availability" ? metric.value
    : metric.name === "Error Rate" ? Math.min(100, metric.value * 100)
    : 70;

  const statusColor = {
    healthy: "text-emerald-400",
    warning: "text-amber-400",
    critical: "text-red-400",
  }[metric.status];

  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] text-slate-400 truncate">{metric.name}</span>
          <div className="flex items-center gap-1 ml-2">
            <span className={`text-[10px] font-bold mono ${statusColor}`}>
              {metric.value}{metric.unit}
            </span>
            <span className="text-[9px] text-slate-600">{metric.delta}</span>
          </div>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              metric.status === "healthy" ? "bg-emerald-500" :
              metric.status === "warning" ? "bg-amber-500" : "bg-red-500"
            }`}
            style={{ width: `${Math.min(100, barWidth)}%`, filter: "brightness(1.2)" }}
          />
        </div>
      </div>
    </div>
  );
};

const ModelCard = ({ model, latency, rpm, status }: {
  model: string;
  latency: string;
  rpm: number;
  status: "healthy" | "warning";
}) => (
  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/50 hover:border-indigo-500/20 transition-all">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] font-medium text-slate-300 mono truncate">{model}</span>
      <div className={`w-1.5 h-1.5 rounded-full ${status === "healthy" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
    </div>
    <div className="flex gap-2">
      <div>
        <div className="text-[9px] text-slate-600">Latency</div>
        <div className="text-[10px] text-cyan-400 mono font-bold">{latency}</div>
      </div>
      <div>
        <div className="text-[9px] text-slate-600">RPM</div>
        <div className="text-[10px] text-purple-400 mono font-bold">{rpm}</div>
      </div>
    </div>
  </div>
);

export default function AWSHealthWidget({ metrics }: AWSHealthWidgetProps) {
  return (
    <div className="widget-card">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">☁️</span>
            <div>
              <h3 className="text-sm font-bold text-white">AWS Bedrock Health Dashboard</h3>
              <p className="text-[10px] text-slate-500">Real-time • CloudWatch • us-east-1</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-medium">99.7% Healthy</span>
          </div>
        </div>
      </div>

      {/* Gauges */}
      <div className="p-3 border-b border-slate-800/50">
        <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-2">Key Indicators</div>
        <div className="flex justify-around">
          <Gauge value={99.7} label="Availability" unit="%" status="healthy" />
          <Gauge value={142} max={500} label="Avg Latency (ms)" unit="ms" status="healthy" />
          <Gauge value={30} max={100} label="Error Budget" unit="%" status="healthy" />
          <Gauge value={68} label="Capacity Used" unit="%" status="warning" />
        </div>
      </div>

      {/* Metrics */}
      <div className="px-3 py-2 border-b border-slate-800/50">
        <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-1">Metrics Overview</div>
        {metrics.slice(0, 4).map((m) => (
          <MetricRow key={m.name} metric={m} />
        ))}
      </div>

      {/* Model Status */}
      <div className="p-3">
        <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-2">Active Models</div>
        <div className="grid grid-cols-3 gap-1.5">
          <ModelCard model="nova-pro-v1" latency="1.42s" rpm={284} status="healthy" />
          <ModelCard model="claude-3-5-sonnet" latency="1.87s" rpm={142} status="healthy" />
          <ModelCard model="titan-text-v2" latency="0.67s" rpm={512} status="warning" />
        </div>
      </div>

      {/* Anomaly Alert */}
      <div className="mx-3 mb-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
        <span className="text-amber-400 text-sm">⚠️</span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-medium text-amber-400">Anomaly Detected</div>
          <div className="text-[9px] text-slate-500 truncate">Invocation spike at 14:23 UTC — severity: medium</div>
        </div>
        <button className="text-[9px] text-amber-400/70 hover:text-amber-400 shrink-0">View</button>
      </div>
    </div>
  );
}
