# Ambi-Sight Reloaded

**A fresh new build for the future of AI-driven strategic decision intelligence.**

Ambi-Sight Reloaded is a demo-ready platform designed to showcase AI-powered strategic decision intelligence for executives and strategy teams. It provides real-time portfolio insights, risk analysis, scenario simulation, and more—all through an intuitive, human-centered interface.

## Features

- **AI Risk Advisor** - Natural language interface to query risk intelligence and get actionable recommendations
- **Scenario Simulator** - Model strategic alternatives and see real-time impact on KPIs
- **Portfolio Heatmap** - Visual matrix of initiatives across key strategic dimensions
- **Strategy Workspace** - Comprehensive dashboard with KPIs, charts, and insights
- **Multi-Persona Views** - Role-specific dashboards for different stakeholders
- **Admin Studio** - Configure demo settings and control platform behavior

## Personas

1. **Strategy Leader** (default) - Executive view focused on strategic agility and portfolio health
2. **Risk Officer** - Risk-focused view highlighting exposure and early warning signals
3. **Product Owner** - Initiative-focused view with execution tracking
4. **Admin** - Platform configuration and demo controls

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Zustand** - Lightweight state management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Imomazin/ambi_sight-reloaded.git

# Navigate to the project
cd ambi_sight-reloaded

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Running on StackBlitz

This project is optimized for StackBlitz. Simply open the repository in StackBlitz and the dev server will start automatically on port 3000.

## Project Structure

```
ambi_sight-reloaded/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── workspace/         # Strategy Workspace Dashboard
│   ├── advisor/           # AI Risk Advisor
│   ├── scenarios/         # Scenario Library
│   ├── portfolio/         # Portfolio Heatmap
│   └── admin/             # Admin Studio
├── components/
│   ├── AppShell.tsx       # Layout wrapper with nav and sidebar
│   ├── Navbar.tsx         # Top navigation bar
│   ├── SidebarNav.tsx     # Side navigation
│   ├── PersonaSwitcher.tsx# Persona selection dropdown
│   ├── KpiCard.tsx        # KPI display card
│   ├── ChartCard.tsx      # Chart wrapper component
│   ├── InsightFeed.tsx    # AI insights panel
│   ├── ScenarioCard.tsx   # Scenario display card
│   ├── HeatmapGrid.tsx    # Portfolio heatmap matrix
│   └── HelpModal.tsx      # Help and onboarding modal
├── lib/
│   └── demoData.ts        # Mock data and types
├── state/
│   └── useAppState.ts     # Zustand store
└── tailwind.config.js     # Tailwind configuration
```

## Demo Features

### Scenario Loading
Select a scenario from the Scenario Library to see KPIs and charts update in real-time across the platform.

### Admin Controls
Switch to the Admin persona to access:
- **Risk Multiplier** - Adjust global risk levels
- **Noise Level** - Add variance to simulate market volatility
- **Onboarding Checklist** - Track demo setup progress

### AI Advisor
The AI Advisor uses keyword matching to provide intelligent-seeming responses. Try asking about:
- "Where are my top 3 risk clusters?"
- "Which initiatives carry disproportionate downside?"
- "Show me early warning signals"
- "How can I improve strategic agility?"

## Design System

### Colors
- **Navy Background**: `#0B0B0F`, `#12121A`, `#1A1A25`
- **Teal Accent**: `#2DD4BF` (primary actions, positive)
- **Amber Accent**: `#FBBF24` (warnings, medium risk)
- **Magenta Accent**: `#E879F9` (highlights, volatility)
- **Purple Accent**: `#A855F7` (secondary elements)
- **Lime Accent**: `#A3E635` (success, growth)

### Typography
- Font: Inter
- Headings: Bold, white
- Body: Regular, gray-300/400

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```

## License

This is a demo platform for educational and demonstration purposes.

---

Built with ❤️ for strategic decision intelligence.
