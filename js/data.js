/**
 * SentinelAI - Initial Data & Curated Source Catalog
 * 
 * Provides:
 * - Curated initial sources (APIs, Pricing, Changelogs, AI Models)
 * - Seed alerts following the strict Fact-Evidence-Impact Triad
 * - Ground truth benchmark evaluation test cases (for PM evaluation)
 */

const INITIAL_SOURCES = [
  {
    id: "src_stripe",
    name: "Stripe Billing & Pricing",
    url: "https://stripe.com/pricing",
    category: "PRICING",
    categoryLabel: "Pricing & Terms",
    monitoringGoal: "Track transaction fee changes, cross-border surcharges, and new enterprise payment tiers.",
    checkFrequencyMinutes: 60,
    lastCheckedAt: "10 mins ago",
    lastChangedAt: "2 hours ago",
    healthStatus: "HEALTHY",
    historySnapshotsCount: 24,
    icon: "💳"
  },
  {
    id: "src_openai",
    name: "OpenAI Platform & Models",
    url: "https://platform.openai.com/docs/models",
    category: "API_DOCS",
    categoryLabel: "API & Models",
    monitoringGoal: "Watch for model price drops, batch discounts, context window expansions, and deprecation dates.",
    checkFrequencyMinutes: 30,
    lastCheckedAt: "5 mins ago",
    lastChangedAt: "4 hours ago",
    healthStatus: "HEALTHY",
    historySnapshotsCount: 38,
    icon: "🤖"
  },
  {
    id: "src_linear",
    name: "Linear Product Changelog",
    url: "https://linear.app/changelog",
    category: "CHANGELOG",
    categoryLabel: "Product Changelog",
    monitoringGoal: "Track team collaboration features, Jira migration tooling, and customer triage integrations.",
    checkFrequencyMinutes: 120,
    lastCheckedAt: "25 mins ago",
    lastChangedAt: "1 day ago",
    healthStatus: "HEALTHY",
    historySnapshotsCount: 19,
    icon: "📐"
  },
  {
    id: "src_supabase",
    name: "Supabase Platform Announcements",
    url: "https://supabase.com/blog",
    category: "INFRASTRUCTURE",
    categoryLabel: "Infrastructure",
    monitoringGoal: "Alert on breaking database schema changes, auth library migrations, and edge function pricing.",
    checkFrequencyMinutes: 60,
    lastCheckedAt: "12 mins ago",
    lastChangedAt: "1 day ago",
    healthStatus: "HEALTHY",
    historySnapshotsCount: 31,
    icon: "⚡"
  },
  {
    id: "src_anthropic",
    name: "Anthropic Claude Release Notes",
    url: "https://docs.anthropic.com/en/release-notes/overview",
    category: "API_DOCS",
    categoryLabel: "API & Models",
    monitoringGoal: "Detect prompt caching updates, rate limit changes, and Claude 3.5 Sonnet token pricing.",
    checkFrequencyMinutes: 30,
    lastCheckedAt: "8 mins ago",
    lastChangedAt: "2 days ago",
    healthStatus: "HEALTHY",
    historySnapshotsCount: 29,
    icon: "🧠"
  },
  {
    id: "src_aws",
    name: "AWS Cloud Architecture Blog",
    url: "https://aws.amazon.com/blogs/architecture",
    category: "INDUSTRY",
    categoryLabel: "Industry & Cloud",
    monitoringGoal: "Monitor multi-region resilience patterns, serverless scaling limits, and egress pricing adjustments.",
    checkFrequencyMinutes: 180,
    lastCheckedAt: "45 mins ago",
    lastChangedAt: "3 days ago",
    healthStatus: "HEALTHY",
    historySnapshotsCount: 15,
    icon: "☁️"
  }
];

const INITIAL_ALERTS = [
  {
    id: "alt_001",
    sourceId: "src_stripe",
    sourceName: "Stripe Billing & Pricing",
    timestamp: "2 hours ago",
    category: "PRICING",
    categoryLabel: "Pricing & Terms",
    title: "Cross-Border Transaction Fee Surcharge Introduced for APAC",
    observedFact: "Stripe modified its fee schedule to introduce a 0.5% surcharge on cross-border transactions processed through APAC merchant accounts effective Nov 1, 2026.",
    evidence: `- Standard Cross-Border: 1.0% + $0.30 per transaction
+ Standard Cross-Border (APAC origin): 1.5% + $0.30 per transaction (effective Nov 1, 2026)
+ Standard Cross-Border (Global): 1.0% + $0.30 per transaction`,
    strategicImpact: "Directly compresses unit margins for our international expansion into Singapore and Tokyo. Recommend reviewing payment routing to local entities to mitigate the 50 bps surcharge.",
    relevanceScore: 0.96,
    uncertainty: "LOW",
    uncertaintyExplanation: "Direct numerical pricing adjustment with an explicitly stated effective date.",
    status: "UNREAD",
    userFeedback: "USEFUL",
    diffId: "diff_stripe_01",
    sourceUrl: "https://stripe.com/pricing",
    tags: ["Pricing", "Margin Impact", "APAC", "Stripe"]
  },
  {
    id: "alt_002",
    sourceId: "src_openai",
    sourceName: "OpenAI Platform & Models",
    timestamp: "4 hours ago",
    category: "API_DOCS",
    categoryLabel: "API & Models",
    title: "50% Discount on Batch API Processing for GPT-4o",
    observedFact: "OpenAI updated the Batch API pricing tier for GPT-4o, cutting input token costs from $2.50 to $1.25 per 1M tokens and output tokens from $10.00 to $5.00 per 1M tokens.",
    evidence: `- GPT-4o Batch API Input: $2.50 / 1M tokens
+ GPT-4o Batch API Input: $1.25 / 1M tokens (50% reduction)
- GPT-4o Batch API Output: $10.00 / 1M tokens
+ GPT-4o Batch API Output: $5.00 / 1M tokens (50% reduction)`,
    strategicImpact: "Substantial cost reduction opportunity for our overnight customer analysis batch jobs. Migrating background summaries from synchronous calls will save an estimated 42% in monthly LLM spend.",
    relevanceScore: 0.94,
    uncertainty: "LOW",
    uncertaintyExplanation: "Verifiable mathematical reduction published in the official platform pricing table.",
    status: "UNREAD",
    userFeedback: "USEFUL",
    diffId: "diff_openai_01",
    sourceUrl: "https://platform.openai.com/docs/models",
    tags: ["Cost Optimization", "Batch API", "OpenAI", "GPT-4o"]
  },
  {
    id: "alt_003",
    sourceId: "src_linear",
    sourceName: "Linear Product Changelog",
    timestamp: "1 day ago",
    category: "CHANGELOG",
    categoryLabel: "Product Changelog",
    title: "Customer Requests Integration & Zendesk Bi-directional Sync",
    observedFact: "Linear introduced native Customer Requests linking, enabling product teams to aggregate feedback from Zendesk, Intercom, and Slack directly onto roadmaps.",
    evidence: `+ ## Customer Requests & Support Desk Sync
+ Now link customer support tickets directly to issues and projects.
+ Real-time sync with Zendesk and Intercom with automated status propagation.`,
    strategicImpact: "Addresses a core workflow overlap with our customer feedback ingestion module. Competitive pressure increases on our feedback portal. Need to assess our roadmap differentiation.",
    relevanceScore: 0.88,
    uncertainty: "MED",
    uncertaintyExplanation: "Feature capability is clearly confirmed, but enterprise pricing gating details remain unannounced.",
    status: "READ",
    userFeedback: null,
    diffId: "diff_linear_01",
    sourceUrl: "https://linear.app/changelog",
    tags: ["Competitor Move", "Feedback Tooling", "Linear"]
  },
  {
    id: "alt_004",
    sourceId: "src_supabase",
    sourceName: "Supabase Platform Announcements",
    timestamp: "1 day ago",
    category: "INFRASTRUCTURE",
    categoryLabel: "Infrastructure",
    title: "Breaking Migration: Auth v1 Helper Libraries Scheduled for EOL",
    observedFact: "Supabase announced the formal deprecation of `@supabase/auth-helpers-nextjs` in favor of the unified SSR package `@supabase/ssr`, setting end-of-support for Q1 2027.",
    evidence: `- Package: @supabase/auth-helpers-nextjs [Active]
+ Package: @supabase/auth-helpers-nextjs [Deprecated - EOL Q1 2027]
+ Recommendation: Migrate to @supabase/ssr for server-component session management.`,
    strategicImpact: "Engineering action required within 2 quarters to prevent authentication token refresh vulnerabilities in our client portal.",
    relevanceScore: 0.91,
    uncertainty: "LOW",
    uncertaintyExplanation: "Explicit deprecation roadmap with documented migration guidelines.",
    status: "READ",
    userFeedback: "USEFUL",
    diffId: "diff_supabase_01",
    sourceUrl: "https://supabase.com/blog",
    tags: ["Deprecation", "Security", "Auth", "Supabase"]
  },
  {
    id: "alt_005",
    sourceId: "src_anthropic",
    sourceName: "Anthropic Claude Release Notes",
    timestamp: "2 days ago",
    category: "API_DOCS",
    categoryLabel: "API & Models",
    title: "Prompt Caching Released for Claude 3.5 Sonnet",
    observedFact: "Anthropic enabled 5-minute ephemeral prompt caching on Claude 3.5 Sonnet, reducing repeated prompt processing costs by up to 90% and latency by up to 80%.",
    evidence: `+ Prompt Caching (Beta): Cache prompts >= 1,024 tokens for 5 minutes.
+ Cached prompt reads: 10% of base input token price ($0.30 per 1M tokens).`,
    strategicImpact: "Critical for our interactive document chat interface. Enables near-instant response times for large codebases without billing spikes.",
    relevanceScore: 0.93,
    uncertainty: "LOW",
    uncertaintyExplanation: "Direct documentation update with verified technical parameters.",
    status: "READ",
    userFeedback: null,
    diffId: "diff_anthropic_01",
    sourceUrl: "https://docs.anthropic.com",
    tags: ["Latency", "Prompt Caching", "Claude 3.5"]
  }
];

/**
 * Detailed Diff Snapshots for Side-by-Side Visual Inspector
 */
const DIFF_SNAPSHOTS = {
  diff_stripe_01: {
    id: "diff_stripe_01",
    sourceId: "src_stripe",
    sourceName: "Stripe Billing & Pricing",
    sourceUrl: "https://stripe.com/pricing",
    timestamp: "2026-10-17 08:32 UTC",
    linesAdded: 2,
    linesRemoved: 1,
    suppressedNoiseLines: 14,
    previousSnapshot: `Stripe Global Payments
Integrated per-transaction pricing. No setup fees, no monthly fees.

Cards and Digital Wallets:
- Domestic cards: 2.9% + $0.30 per successful card charge
- Standard Cross-Border: 1.0% + $0.30 per transaction
- Currency conversion: 1.0% additional fee

Support: 24/7 phone, chat, and email support included.
© 2026 Stripe, Inc. All rights reserved.`,
    currentSnapshot: `Stripe Global Payments
Integrated per-transaction pricing. No setup fees, no monthly fees.

Cards and Digital Wallets:
- Domestic cards: 2.9% + $0.30 per successful card charge
+ Standard Cross-Border (APAC origin): 1.5% + $0.30 per transaction (effective Nov 1, 2026)
+ Standard Cross-Border (Global): 1.0% + $0.30 per transaction
- Currency conversion: 1.0% additional fee

Support: 24/7 phone, chat, and email support included.
© 2026 Stripe, Inc. All rights reserved.`
  },
  diff_openai_01: {
    id: "diff_openai_01",
    sourceId: "src_openai",
    sourceName: "OpenAI Platform & Models",
    sourceUrl: "https://platform.openai.com/docs/models",
    timestamp: "2026-10-17 06:14 UTC",
    linesAdded: 2,
    linesRemoved: 2,
    suppressedNoiseLines: 9,
    previousSnapshot: `OpenAI Pricing Table (Model Family 2026)
Standard Synchronous Endpoints:
- gpt-4o: $5.00 / 1M input tokens, $15.00 / 1M output tokens

Batch API (24-hour turnaround):
- GPT-4o Batch API Input: $2.50 / 1M tokens
- GPT-4o Batch API Output: $10.00 / 1M tokens`,
    currentSnapshot: `OpenAI Pricing Table (Model Family 2026)
Standard Synchronous Endpoints:
- gpt-4o: $5.00 / 1M input tokens, $15.00 / 1M output tokens

Batch API (24-hour turnaround):
+ GPT-4o Batch API Input: $1.25 / 1M tokens (50% reduction)
+ GPT-4o Batch API Output: $5.00 / 1M tokens (50% reduction)`
  }
};

/**
 * PM Benchmark Evaluation Test Suite (Ground Truth)
 * Covers the 6 critical scenarios specified in Section 7, 8, 9 of context.txt:
 * 1. Price restructuring -> Expected: Meaningful Alert (High)
 * 2. Cookie consent banner / Footer update -> Expected: Suppress as Noise
 * 3. API Deprecation Notice -> Expected: Meaningful Alert (Critical)
 * 4. Cosmetic Marketing Copy Rephrase -> Expected: Suppress / Low Relevance
 * 5. Feature Launch -> Expected: Meaningful Alert (Relevant)
 * 6. Transient Server 500 / Network glitch -> Expected: Reschedule without Alert
 */
const BENCHMARK_TEST_CASES = [
  {
    id: "bench_01",
    title: "SaaS Enterprise Tier Pricing Restructure",
    source: "Competitor CRM Pricing Page",
    simulatedDiff: "- Enterprise Plan: $99/seat/month (Annual contract)\n+ Enterprise Plan: $149/seat/month with mandatory $2k onboarding fee",
    groundTruth: "MEANINGFUL_CHANGE",
    expectedAction: "ALERT_DELIVERED",
    rationale: "Direct commercial pricing revision with major margin and positioning implications.",
    simulatedLLMResult: {
      isSubstantive: true,
      category: "PRICING",
      relevanceScore: 0.95,
      uncertainty: "LOW",
      fact: "Enterprise seat price increased by 50% ($99 to $149) plus mandatory $2,000 onboarding."
    }
  },
  {
    id: "bench_02",
    title: "Cookie Consent Banner & Footer Copyright Year",
    source: "Cloudflare Developer Docs",
    simulatedDiff: "- © 2025 Cloudflare Inc. All rights reserved.\n+ © 2026 Cloudflare Inc. All rights reserved.\n+ <div class=\"cookie-consent-v2\">We respect your GDPR privacy preferences</div>",
    groundTruth: "COSMETIC_NOISE",
    expectedAction: "SUPPRESS_NOISE",
    rationale: "Legal boilerplate and year rollover contains zero actionable product signal.",
    simulatedLLMResult: {
      isSubstantive: false,
      category: "BOILERPLATE",
      relevanceScore: 0.05,
      uncertainty: "LOW",
      fact: "Copyright year updated to 2026 and standard GDPR banner refreshed."
    }
  },
  {
    id: "bench_03",
    title: "V1 Payment API Deprecation Notice",
    source: "Payment Gateway Documentation",
    simulatedDiff: "+ [DEPRECATION NOTICE] The /v1/charges API endpoint will be decommissioned on July 31, 2027. All merchants must migrate to /v2/payment_intents.",
    groundTruth: "MEANINGFUL_CHANGE",
    expectedAction: "ALERT_DELIVERED",
    rationale: "Contractual API breaking change requiring engineering roadmap intervention.",
    simulatedLLMResult: {
      isSubstantive: true,
      category: "DEPRECATION",
      relevanceScore: 0.98,
      uncertainty: "LOW",
      fact: "Charges endpoint decommission date fixed for July 31, 2027."
    }
  },
  {
    id: "bench_04",
    title: "Marketing Copy Cosmetic Rephrase",
    source: "Competitor Landing Page",
    simulatedDiff: "- The smartest way to manage customer conversations.\n+ The most intelligent platform empowering modern conversational teams.",
    groundTruth: "COSMETIC_NOISE",
    expectedAction: "SUPPRESS_NOISE",
    rationale: "Marketing copy adjustment without underlying product or pricing change.",
    simulatedLLMResult: {
      isSubstantive: false,
      category: "MARKETING_FLUFF",
      relevanceScore: 0.22,
      uncertainty: "HIGH",
      fact: "Hero tagline rephrased with synonymous adjectives."
    }
  },
  {
    id: "bench_05",
    title: "Real-time Multi-User Collaboration Launch",
    source: "Design Tool Platform Changelog",
    simulatedDiff: "+ ## Real-time Multiplayer Canvas\n+ Teams can now co-edit wireframes simultaneously with multiplayer cursors and audio huddles.",
    groundTruth: "MEANINGFUL_CHANGE",
    expectedAction: "ALERT_DELIVERED",
    rationale: "Significant feature launch expanding core competitive capabilities.",
    simulatedLLMResult: {
      isSubstantive: true,
      category: "FEATURE_LAUNCH",
      relevanceScore: 0.90,
      uncertainty: "MED",
      fact: "Multiplayer live co-editing and voice huddles released for all paid tiers."
    }
  },
  {
    id: "bench_06",
    title: "Transient 503 CDN Gateway Timeout",
    source: "Vendor Status Page",
    simulatedDiff: "HTTP 503 Service Unavailable (Cloudflare Ray ID: 894f29...)",
    groundTruth: "DEGRADED_SOURCE",
    expectedAction: "RESCHEDULE_NO_ALERT",
    rationale: "Temporary network failure must not trigger a false content change alert.",
    simulatedLLMResult: {
      isSubstantive: false,
      category: "ERROR_STATE",
      relevanceScore: 0.0,
      uncertainty: "LOW",
      fact: "Source returned 503 HTTP status code."
    }
  }
];
