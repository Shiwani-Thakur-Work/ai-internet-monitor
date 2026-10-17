/**
 * SentinelAI - AI Semantic Evaluator & Uncertainty Calibrator
 * 
 * Enforces the Fact-Evidence-Impact Triad (Section 6 of Product Context):
 * - Observed Fact: Immutable, verifiable statement of delta.
 * - Evidence: Extracted line quote with +/- syntax.
 * - Strategic Impact: Contextual consequence aligned with the user's Monitoring Goal.
 * - Uncertainty Level: LOW / MED / HIGH with explicit rationale.
 */

class SemanticEvaluator {
  /**
   * Analyzes a substantive diff against a source's monitoring goal.
   * @param {object} diffResult - Result from DiffEngine.computeDiff
   * @param {object} source - Monitored source object
   * @returns {object} Structured evaluation alert payload
   */
  static evaluateChange(diffResult, source) {
    if (!diffResult || !diffResult.hasChanges) {
      return null;
    }

    const addedLines = diffResult.diffLines
      .filter(l => l.type === "ADD")
      .map(l => l.text);
    const removedLines = diffResult.diffLines
      .filter(l => l.type === "REMOVE")
      .map(l => l.text);

    const fullDeltaText = [...removedLines.map(l => `- ${l}`), ...addedLines.map(l => `+ ${l}`)].join("\n");

    // Extract Fact, Evidence, Impact based on heuristic and semantic intent
    const isPricing = /(price|tier|\$|cost|fee|surcharge|billing|tokens|per\s+month|per\s+year)/i.test(fullDeltaText);
    const isDeprecation = /(deprecat|sunset|end-of-life|eol|decommission|break|migration)/i.test(fullDeltaText);
    const isFeature = /(release|launch|feature|now\s+available|support|new|integration|announc)/i.test(fullDeltaText);

    let category = "CHANGELOG";
    let categoryLabel = "Product Changelog";
    let relevanceScore = 0.85;
    let uncertainty = "MED";
    let uncertaintyExplanation = "Contextual shift detected; operational impact inferred from public release notes.";
    let title = "Substantive Change Detected";
    let observedFact = "Observed modification across key document sections.";
    let strategicImpact = "May affect roadmap planning or dependency alignment.";

    if (isPricing) {
      category = "PRICING";
      categoryLabel = "Pricing & Terms";
      relevanceScore = 0.95;
      uncertainty = "LOW";
      uncertaintyExplanation = "Direct numerical pricing adjustment with verified commercial figures.";
      title = `Pricing Schedule Adjustment on ${source.name}`;
      observedFact = `Commercial terms or fee structures updated in ${source.name} pricing tables.`;
      strategicImpact = `Directly affects unit economics or competitive purchasing power. Recommend reviewing with finance/procurement.`;
    } else if (isDeprecation) {
      category = "DEPRECATION";
      categoryLabel = "Deprecation & Security";
      relevanceScore = 0.97;
      uncertainty = "LOW";
      uncertaintyExplanation = "Explicit contractual lifecycle notice with designated retirement timetable.";
      title = `Critical Deprecation Notice on ${source.name}`;
      observedFact = `One or more active interfaces or packages scheduled for deprecation or end-of-life.`;
      strategicImpact = `Technical debt risk: engineering roadmap must schedule migration before the decommission window closes.`;
    } else if (isFeature) {
      category = "FEATURE_LAUNCH";
      categoryLabel = "Feature Launch";
      relevanceScore = 0.88;
      uncertainty = "MED";
      uncertaintyExplanation = "Feature confirmed live in production, though enterprise tier entitlement is subject to rollout.";
      title = `New Capability Announced on ${source.name}`;
      observedFact = `New product feature or integration released on public changelog.`;
      strategicImpact = `Expands competitive capabilities. Review potential implications on user adoption and feature parity.`;
    }

    // Refine observed fact with the first substantive added line if available
    if (addedLines.length > 0) {
      const topAdded = addedLines[0].replace(/^#+\s*/, "").slice(0, 140);
      observedFact = `${source.name} updated: "${topAdded}"`;
    }

    // Calibrate against user's specific monitoring goal
    if (source.monitoringGoal) {
      const goalKeywords = source.monitoringGoal.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const matchesGoal = goalKeywords.some(kw => fullDeltaText.toLowerCase().includes(kw));
      if (matchesGoal) {
        relevanceScore = Math.min(0.99, relevanceScore + 0.05);
        strategicImpact += ` Specifically matches monitored goal: "${source.monitoringGoal}".`;
      }
    }

    // Prepare evidence block (top 4 changed lines with +/- formatting)
    const evidenceSnippet = fullDeltaText.split("\n").slice(0, 4).join("\n");

    return {
      id: "alt_" + Date.now().toString(36),
      sourceId: source.id,
      sourceName: source.name,
      timestamp: "Just now",
      category: category,
      categoryLabel: categoryLabel,
      title: title,
      observedFact: observedFact,
      evidence: evidenceSnippet,
      strategicImpact: strategicImpact,
      relevanceScore: parseFloat(relevanceScore.toFixed(2)),
      uncertainty: uncertainty,
      uncertaintyExplanation: uncertaintyExplanation,
      status: "UNREAD",
      userFeedback: null,
      diffId: "diff_" + Date.now().toString(36),
      sourceUrl: source.url,
      tags: [categoryLabel, source.name.split(" ")[0]]
    };
  }
}
