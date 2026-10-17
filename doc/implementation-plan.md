# Implementation Plan: AI Internet Monitor (SentinelAI)

> **Document Type:** Engineering Implementation Plan  
> **References:** [context.md](file:///c:/MyDeveloper-Projects/Project%205%20%E2%80%94%20AI%20Internet%20Monitor/doc/context.md), [architecture.md](file:///c:/MyDeveloper-Projects/Project%205%20%E2%80%94%20AI%20Internet%20Monitor/doc/architecture.md)  
> **Status:** Execution Ready  
> **Target Date:** Immediate Full Delivery  

---

## 1. Executive Summary & Objective

This document outlines the end-to-end implementation roadmap for **SentinelAI (AI Internet Monitor)**. The goal is to build an aesthetically stunning, enterprise-grade, client-executable web application deployable directly to **GitHub Pages**. 

The application solves the critical Product Management problem of internet change monitoring without alert fatigue. It features an intelligent noise filter, side-by-side diff inspector, structured Fact-Evidence-Interpretation alert cards, PM benchmark evaluation lab, dynamic user feedback loop, and executive digest generator.

---

## 2. Technical Stack & File Directory Structure

### Selected Technology Stack
- **HTML5:** Semantic, accessible, optimized for OpenGraph meta tags, SEO, and PWA capabilities.
- **Vanilla CSS3:** Custom design system with CSS custom properties (variables), HSL color tokens, dark/light themes, glassmorphism, responsive grid & flexbox layouts, micro-animations.
- **Vanilla ES6+ JavaScript:** Modular, zero-dependency, event-driven reactive state pattern, client-side diff engine (LCS line algorithm), heuristic noise suppression, and prompt simulator.
- **Branding Assets:** Custom vector SVG logo, SVG favicon, and Apple Touch icon.

### Project Directory Layout
```
Project 5 — AI Internet Monitor/
├── index.html                  # Core application entry point
├── manifest.json               # Progressive Web App manifest
├── .gitignore                  # Git hygiene configuration
├── README.md                   # Repository overview, architecture, live demo guide
├── assets/
│   ├── logo.svg                # Vector SentinelAI brand mark
│   └── favicon.svg             # Modern vector favicon
├── css/
│   ├── main.css                # Color tokens, typography, layout, animations
│   ├── components.css          # Cards, diff inspector, modal, tabs, toast
│   └── responsive.css          # Tablet & mobile optimizations
├── js/
│   ├── state.js                # State management, local storage, event bus
│   ├── data.js                 # Curated sources, sample diffs, and benchmark cases
│   ├── diff-engine.js          # DOM normalizer, noise stripper, line diff algorithm
│   ├── evaluator.js            # Semantic analysis, uncertainty tagging, relevance scoring
│   ├── benchmark.js            # PM Benchmark & Confusion Matrix calculation
│   ├── digest.js               # Executive Daily Briefing & Slack/Markdown exporter
│   └── app.js                  # UI controllers, event listeners, view navigation
└── doc/
    ├── context.md              # Product context & PM checklist
    ├── architecture.md         # System architecture & data flow
    └── implementation-plan.md  # Engineering execution plan
```

---

## 3. Phased Implementation Roadmap

### Phase 1: Brand Identity, Design Tokens & Project Scaffolding
- [x] Create project documentation (`doc/context.md`, `doc/architecture.md`, `doc/implementation-plan.md`).
- [ ] Design high-fidelity vector brand identity:
  - Custom SVG logo with geometric radar/lens motif and modern typography.
  - SVG favicon and PWA icons.
  - Comprehensive metadata (`og:title`, `og:description`, `og:image`, `twitter:card`, `theme-color`).
- [ ] Build CSS Design System (`css/main.css`, `css/components.css`, `css/responsive.css`):
  - Dark mode by default with light mode switch.
  - Color palette: Deep space indigo/obsidian (`#0B0F19`), crisp slate surfaces, electric cyan accent (`#06B6D4`), violet intelligence glow (`#8B5CF6`), emerald for confirmed facts (`#10B981`), amber for uncertainty (`#F59E0B`), rose for breaking/critical alerts (`#EF4444`).
  - Fluid typography with Google Fonts (`Inter` and `JetBrains Mono` for diff lines).
  - Glassmorphic panels, subtle glow borders, and transition micro-animations.

### Phase 2: Ingestion, Normalization & Diff Engine
- [ ] Implement `js/diff-engine.js`:
  - `cleanContent(rawHtml)`: Strips tags, scripts, tracking params, cookie banners, volatile timestamps.
  - `computeDiff(oldText, newText)`: Computes Myers LCS line-by-line delta with line numbers.
  - `classifyNoise(diffLine)`: Identifies copyright updates, footer noise, minor whitespace shifts.
  - Returns structured `DiffResult` with substantive additions, substantive deletions, and suppressed noise counts.

### Phase 3: AI Semantic Evaluation & Uncertainty Calibration
- [ ] Implement `js/evaluator.js`:
  - Simulates the LLM evaluation pipeline matching the exact specification from Section 6 of `context.md`.
  - Generates:
    1. **Observed Fact:** Grounded, immutable change statement.
    2. **Evidence:** Line diff quote with $+/-$ markers.
    3. **Strategic Impact:** Contextual consequence against user's monitoring goal.
    4. **Uncertainty Level:** Low (direct price/spec), Medium (feature shift), High (marketing prose).
    5. **Relevance Score:** 0.0 to 1.0.

### Phase 4: State Management & Dynamic Feedback Adaptation
- [ ] Implement `js/state.js` & `js/data.js`:
  - Reactive central store subscribing UI components to state changes.
  - Persistent storage in `localStorage` with initial seed data.
  - User feedback handlers:
    - **Mark Useful:** Increments precision, reinforces category weight.
    - **Mark Irrelevant:** Increments false-positive count, raises noise suppression threshold.
    - **Mark Duplicate:** Merges into cluster group.
  - Live metric recalculation (Meaningful Change Recall, Alert Precision, Noise Suppressed %, Time-to-Detection).

### Phase 5: Interactive UI Components & User Views
- [ ] **Navigation & Executive Metric Bar:**
  - Real-time KPIs with animated counter pulses.
  - Global search bar, sensitivity threshold slider (High Precision vs High Recall), and "Scan All Sources" button.
- [ ] **Tab 1: Live Alert Feed:**
  - Categorized alert cards with Fact-Evidence-Impact badges.
  - Instant action buttons: Useful, Irrelevant, Duplicate, View Diff.
  - Filtering by category (Pricing, API, Feature, Security, Competitor), uncertainty, and read status.
- [ ] **Tab 2: Source Manager:**
  - Grid of monitored sources with live health status pills (Healthy, 304 Not Modified, Degraded).
  - Add Source Modal with URL validation, category picker, and custom Monitoring Goal field.
  - Quick-crawl action per source.
- [ ] **Tab 3: Side-by-Side Diff Inspector:**
  - Interactive split or unified diff viewer.
  - Color-coded additions (green) and deletions (red) with mono line numbering.
  - Toggle: "Show Suppressed Noise" to visualize the exact CSS/timestamp lines the engine filtered out.
- [ ] **Tab 4: PM Benchmark & Evaluation Lab:**
  - 6 pre-labeled ground truth test cases (Pricing jump, Cookie banner, Deprecation, Marketing fluff, Feature launch, Transient 500 error).
  - "Run Full Benchmark" button that runs test suite, calculates Confusion Matrix (TP, FP, TN, FN), Precision, Recall, and F1 Score in real time.
- [ ] **Tab 5: Executive Digest Builder:**
  - Generates a polished Daily Briefing.
  - Instant copy in Markdown, HTML, and Slack webhook JSON format.

### Phase 6: GitHub Deployment, Quality Assurance & Documentation
- [ ] Add `.gitignore`, `manifest.json`, and `README.md` with full product overview, architecture diagram, and deployment instructions.
- [ ] Test in live browser subagent to verify visual aesthetics, interactive states, responsive behavior, and zero console errors.
- [ ] Verify clean, professional comments across every source file.

---

## 4. Verification & Testing Matrix

| Component | Test Scenario | Acceptance Criteria |
| :--- | :--- | :--- |
| **Noise Filter** | Input raw HTML with updated 2026 footer copyright | Suppresses alert; increments noise counter by 1 |
| **Diff Inspector** | Click "View Diff" on Stripe Pricing alert | Opens side-by-side view with highlighted $-1.0\% / +1.5\%$ lines |
| **Feedback Loop** | Click "Mark Useful" on alert card | Metric precision increases; card shows confirmed badge |
| **Benchmark Lab** | Run full test suite | Computes Precision $\ge 90\%$, Recall $\ge 85\%$, renders confusion matrix |
| **New Source** | Add custom URL with goal | Validates fields, adds card to Source Manager, persists to LocalStorage |
| **Digest Export** | Click "Copy Markdown Digest" | Copies formatted executive briefing to clipboard with toast confirmation |
| **Dark/Light Theme**| Click theme toggle | Smooth color transition; all tokens adjust seamlessly |
