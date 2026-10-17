# Product Context: AI Internet Monitor (SentinelAI)

> **Document Type:** Product Context Specification  
> **Status:** Approved / Base Reference  
> **Target Audience:** Product Managers, Engineering Leads, Tech Strategists  
> **Version:** 1.0.0  

---

## 1. Product Overview & Context

Modern knowledge workers, founders, product managers, and technology leaders operate in fast-moving industries where timely awareness of competitive and ecosystem shifts is critical. Professionals frequently need to track updates across:
- Competitor pricing and packaging pages
- Product changelogs and release notes
- API documentation and deprecation notices
- Industry announcements, regulatory mandates, and technical blogs

### The Current Breakdown
1. **Manual Inefficiency:** Visiting dozens of URLs weekly is repetitive, error-prone, and unsustainable.
2. **Alert Fatigue:** Generic website change monitors (e.g., visual pixel diffs or raw HTML checkers) generate overwhelming noise—triggering alerts for minor CSS tweaks, dynamic advertising banners, changing timestamps, cookie notices, or re-ordered footer links.
3. **Missing Strategic Context:** Traditional RSS readers merely dump raw article text without identifying *what* actually changed relative to previous states or *why* that change matters to the user's specific business goals.

### The Solution: SentinelAI
**SentinelAI (AI Internet Monitor)** is an intelligent change-monitoring platform that observes a user-defined set of high-value web sources, isolates substantive content shifts from aesthetic noise, and leverages AI to synthesize:
- **Observed Fact:** Objective, verifiable evidence of what changed.
- **Strategic Impact:** Contextual rationale explaining why the change matters against the user's designated monitoring goal.
- **Uncertainty Calibration:** Explicit confidence flags preventing AI hallucinations and ungrounded speculation.

---

## 2. Problem Statement

> *"Users need to remain aware of important changes across selected online sources without repeatedly checking each source or receiving an overwhelming number of low-value alerts."*

### Key User Pain Points
| Pain Point | Impact on User | SentinelAI Solution |
| :--- | :--- | :--- |
| **High Noise-to-Signal Ratio** | Users turn off or ignore traditional alerts. | Semantic diff engine filters out CSS, layout, timestamp, and cookie noise. |
| **Ambiguity in Raw Diffs** | Users spend 10+ minutes deciphering complex HTML or 5,000-word blog posts. | Synthesizes exact side-by-side evidence with an executive summary. |
| **Lack of Relevance Context** | A change is reported, but its business consequence is unknown. | Evaluates changes against a user's defined "Monitoring Objective". |
| **Alert Overload** | Dozens of push notifications fragment the workday. | Clustered alerts with scheduled digests (Daily Briefing / Weekly Review). |

---

## 3. Target User Personas & Use Cases

Rather than attempting to index the entire internet, SentinelAI focuses on high-leverage professional segments:

### Primary Persona: The Product Manager & Tech Founder ("Strategic Sam")
- **Role:** Head of Product, Senior PM, or Startup Founder in SaaS / AI.
- **Core Motivation:** Stay ahead of competitor features, pricing adjustments, platform roadmaps, and partner ecosystem changes.
- **Key Monitoring Goals:**
  - *"Alert me when competitors launch enterprise tier changes or add SSO/compliance features."*
  - *"Track AI model pricing reductions and context-window expansions."*
  - *"Catch API deprecations and breaking changes 30+ days in advance."*

### Secondary Persona: The Technical Architect / Developer Relations ("DevRel Dave")
- **Role:** Solutions Architect, Lead Engineer, or Ecosystem Strategist.
- **Core Motivation:** Prevent service interruptions, anticipate upstream vendor shifts, and track open-source ecosystem updates.

---

## 4. Core Hypothesis

> **Hypothesis:** If users can define custom monitoring targets and receive concise, source-linked alerts containing verified evidence and calibrated significance only when meaningful changes occur, they will reduce manual source checks by over 75% while achieving near-zero alert fatigue.

### Underlying Assumptions
1. **Semantic Granularity:** An LLM + DOM diffing pipeline can accurately discriminate between cosmetic/structural fluff and genuine business/technical modifications.
2. **Separation of Fact & Synthesis:** Users trust AI summaries far more when facts and interpretive commentary are distinctly compartmentalized and linked to exact line quotes.
3. **Feedback Adaptability:** Providing simple feedback mechanisms (Helpful / Irrelevant / Duplicate) creates a high-leverage learning signal to calibrate user-specific relevance thresholds.

---

## 5. Proposed MVP Scope & Boundaries

### Included in MVP
1. **Curated & Custom Source Management:**
   - Pre-loaded with high-value technical and SaaS feeds (e.g., OpenAI, Stripe, Linear, Supabase, Anthropic, AWS).
   - Ability to add custom public URLs and RSS/Atom feeds.
   - User-defined "Monitoring Goal" per source (e.g., "Watch for price drops or enterprise tier updates").
2. **Automated & On-Demand Change Detection:**
   - Scheduled background checks and instantaneous on-demand crawl simulations.
   - Historical snapshot comparison between version $N-1$ and version $N$.
3. **Substantive vs. Cosmetic Noise Filtering:**
   - Cleans DOM content (strips script tags, analytics, cookie banners, rotating ads, dynamic timestamps).
   - Generates line-level normalized diffs.
4. **Structured Multi-Dimensional Alert Cards:**
   - Source metadata and timestamp.
   - Objective observed fact statement.
   - AI strategic interpretation & business impact.
   - Extracted evidence quote / diff snippet.
   - Calibrated uncertainty flag (Low / Medium / High).
   - Original source permalink.
5. **Interactive User Feedback & Tuning:**
   - "Useful", "Irrelevant / Noise", "Duplicate" action buttons that feed into dynamic precision metrics.
6. **Executive Digest Generator:**
   - Consolidated Daily Briefing simulator with Markdown / HTML export.
7. **PM Benchmark & Evaluation Lab:**
   - Pre-labeled test cases with ground truth validation to measure Precision, Recall, and Noise Suppression rates.

### Explicitly Out of Scope (Non-Goals)
- Scraping authenticated, paywalled, or login-gated intranets.
- Bypassing CAPTCHAs, Cloudflare bot-management, or violating `robots.txt`.
- Continuous sub-second real-time web scraping (MVP targets hourly / daily cadence).
- Autonomous agentic executions (e.g., automatically changing internal billing in response to competitor updates).
- Unbounded web-wide spidering / general-purpose search indexing.

---

## 6. Product Differentiation: The Fact-Evidence-Interpretation Triad

Most monitoring tools fail because they are either **too dumb** (alerting on every single changed character) or **too hallucination-prone** (generating vague prose without proof).

SentinelAI introduces a strict triad architecture for every detected change:

```
┌─────────────────────────────────────────────────────────────┐
│                      SENTINEL ALERT                         │
├─────────────────────────────────────────────────────────────┤
│ 1. OBSERVED FACT (Verifiable Truth)                         │
│    "Tier 2 pricing changed from $0.03 to $0.015 per 1k."     │
├─────────────────────────────────────────────────────────────┤
│ 2. EVIDENCE (Ground-Truth Excerpt)                          │
│    - Standard: $0.03 / 1k tokens                            │
│    + Standard: $0.015 / 1k tokens (50% reduction)           │
├─────────────────────────────────────────────────────────────┤
│ 3. STRATEGIC RELEVANCE (AI Interpretation)                  │
│    "Increases margin pressure on our middle-tier plan.       │
│     Suggested action: review volume discount threshold."    │
├─────────────────────────────────────────────────────────────┤
│ 4. UNCERTAINTY CALIBRATION                                  │
│    [ LOW UNCERTAINTY: Direct numerical price adjustment ]   │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Key Product Management Decisions & Heuristics

1. **Defining "Meaningful Change":**
   A change is deemed meaningful if it alters commercial terms, functional capabilities, release state, API contracts, or strategic positioning. Changes to navigation styling, copyright years, or cosmetic layout are discarded.
2. **Frequency vs. Politeness Trade-off:**
   Crawl rates default to reasonable cadences (Hourly for fast changelogs, Daily for pricing pages) respecting HTTP `304 Not Modified` and `ETag` headers to minimize server load.
3. **Noise Suppression Threshold:**
   Confidence scores below 65% are routed to a low-priority backlog rather than triggering immediate notifications.
4. **Degraded Source Strategy:**
   If a source returns HTTP 4xx/5xx or changes structure drastically, the system flags a "Source Health Warning" instead of hallucinating content or silently failing.

---

## 8. Success Metrics & PM Evaluation Framework

| Metric | Target | Formula / Definition |
| :--- | :--- | :--- |
| **Meaningful Change Recall** | $\ge 90\%$ | $\frac{\text{True Meaningful Changes Detected}}{\text{Total Ground-Truth Meaningful Changes}}$ |
| **Alert Relevance Precision** | $\ge 85\%$ | $\frac{\text{Alerts Marked Useful by User}}{\text{Total Alerts Delivered}}$ |
| **Noise Suppression Rate** | $\ge 80\%$ | $\frac{\text{Cosmetic Changes Filtered Out}}{\text{Total Raw DOM Changes}}$ |
| **Duplicate Alert Rate** | $\le 5\%$ | $\frac{\text{Alerts Flagged Duplicate}}{\text{Total Delivered Alerts}}$ |
| **Time-to-Detection Latency** | $< 30 \text{ min}$ | Elapsed time between remote publish and local alert generation |
| **Engagement / Save Rate** | $\ge 40\%$ | Percentage of alerts saved, exported, or viewed in deep diff |

---

## 9. PM Working Checklist

- [x] Define target user persona and core problem statement
- [x] Conduct user pain point analysis and competitive breakdown
- [x] Formulate product hypothesis, assumptions, and validation gates
- [x] Establish strict MVP scope and explicit non-goals
- [x] Define quantitative success metrics and evaluation benchmarks
- [ ] Create system architecture and data pipeline specifications (`doc/architecture.md`)
- [ ] Formulate detailed engineering implementation plan (`doc/implementation-plan.md`)
- [ ] Implement end-to-end web application with rich branding, diff viewer, and PM lab
- [ ] Conduct live verification, benchmark testing, and GitHub Pages readiness
- [ ] Publish PM case study and summary documentation
