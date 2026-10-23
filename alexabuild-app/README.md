# 🎙️ Alexa+ Smart Productivity Agent

> **Amazon Build Hackathon 2026** — Alexa+ Simulated Experience Track

An ambient AI assistant powered by **AWS Bedrock** with **Model Context Protocol (MCP)** tool calling, real-time voice waveform visualization, and intelligent multi-modal workflow automation.

---

## 🏆 Hackathon Details

| Field | Value |
|---|---|
| **Hackathon** | Amazon Build Hackathon 2026 |
| **Track** | Alexa+ (Simulated Experience) |
| **Mini Challenge** | AWS Builder (Bedrock integration architecture) & Open Source |
| **License** | MIT |

---

## ✨ Features

### 🌐 Ambient AI Interface
- **Glowing Alexa+ Ring** — Animated ambient ring with state-reactive cyan/purple gradients (`idle → listening → processing → responding`)
- **Live Canvas Waveform** — Real-time SVG/canvas audio visualizer showing voice activity
- **State Transitions** — Smooth animations reflecting the assistant's current cognitive state

### 🧠 AI Workflows (MCP Tool Calling)
Three fully simulated workflows with step-by-step **Model Context Protocol (MCP)** execution logs:

| Workflow | Tools Called | Output |
|---|---|---|
| 📋 Developer Daily Routine | `calendar_get_events`, `task_manager_list`, `focus_timer_create`, `aws_bedrock_reasoning` | Interactive schedule with checkboxes & focus timer |
| ☁️ AWS Cloud Health Check | `cloudwatch_logs`, `bedrock_model_metrics`, `cost_explorer`, `anomaly_detector_run` | Dashboard with gauges, latency metrics & model status |
| 📅 Smart Meeting & Reminder | `calendar_find_slot`, `calendar_create_event`, `notification_schedule` | Calendar invite card with Confirm/Reschedule actions |

### 🔌 MCP Protocol Simulation
- **Streamable HTTP Transport** — Simulated per MCP spec `2025-11-25`
- **JSON-RPC 2.0** — Tool invocations with status, latency, and result streaming
- **Live Execution Log** — Real-time tool call feed with color-coded type badges

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + custom animations
- **Icons**: Lucide React
- **Fonts**: Inter + JetBrains Mono (Google Fonts)
- **AI Backend** *(simulated)*: AWS Bedrock (Nova Pro `us.amazon.nova-pro-v1:0`)
- **Protocol** *(simulated)*: MCP 2025-11-25 over Streamable HTTP

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone or open in your workspace
cd alexabuild-app

# Install dependencies
npm install

# Start development server
npm run dev
```


### Build for Production

```bash
npm run build
npm start
```

---

Deployed Link --https://alexabuild.vercel.app/

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Main dashboard page (orchestrator)
│   └── globals.css         # Design system, animations, glassmorphism
├── components/
│   ├── AmbientRing.tsx     # Animated ring + canvas waveform visualizer
│   ├── ChatPanel.tsx       # Live transcript with inline widgets
│   ├── MCPLogPanel.tsx     # Real-time MCP tool execution log
│   ├── DeveloperScheduleWidget.tsx  # Interactive task list + focus timer
│   ├── AWSHealthWidget.tsx          # Bedrock metrics dashboard + gauges
│   └── MeetingCardWidget.tsx        # Calendar invite card + actions
├── lib/
│   └── data.ts             # Simulated MCP sequences, AI responses, mock data
└── types/
    └── index.ts            # TypeScript interfaces and types
```

---

## 🎨 Design System

- **Background**: `bg-slate-950` (#020617) — deep space dark
- **Primary Accent**: Cyan `#06b6d4` — Alexa ring color
- **Secondary Accent**: Purple `#8b5cf6` — processing state
- **Glass Cards**: `backdrop-blur-xl` with `rgba(15,23,42,0.6)` background
- **Animations**: Orbit dots, waveform bars, typing indicators, shimmer text, glow pulses

---

## 🔐 AWS Bedrock Integration Architecture

```
User Input → Alexa+ Frontend
    → MCP Client (Streamable HTTP, spec 2025-11-25)
    → Tool Router
        ├── aws_bedrock_reasoning (Nova Pro model)
        ├── calendar_* tools (Google/Amazon Calendar)
        ├── cloudwatch_logs (AWS CloudWatch)
        ├── bedrock_model_metrics (Bedrock console API)
        └── notification_schedule (SNS/SES)
    → Streaming Response → UI Widget Render
```

---

## 📄 License

MIT License

Copyright (c) 2026 Alexa+ Hackathon Team

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

*Built with ❤️ for the Amazon Build Hackathon 2026 · Alexa+ Track*
