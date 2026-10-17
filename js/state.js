/**
 * SentinelAI - Reactive State Store
 * 
 * Manages:
 * - Persistent source lists, alerts, diff snapshots
 * - User feedback adaptation (Thumbs Up/Down/Duplicate)
 * - Dynamic PM Success Metrics recalculation
 * - UI filters, active tab, sensitivity thresholds, and theme state
 */

class StateStore {
  constructor() {
    this.storageKey = "sentinel_ai_state_v1";
    this.listeners = [];
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          sources: parsed.sources || INITIAL_SOURCES,
          alerts: parsed.alerts || INITIAL_ALERTS,
          diffSnapshots: parsed.diffSnapshots || DIFF_SNAPSHOTS,
          activeTab: "feed",
          searchQuery: "",
          selectedCategory: "ALL",
          selectedUncertainty: "ALL",
          sensitivityThreshold: 0.70,
          theme: parsed.theme || "dark",
          selectedDiffId: "diff_stripe_01",
          pmMetrics: parsed.pmMetrics || {
            meaningfulChangeRecall: 94.2,
            noiseSuppressionRate: 89.1,
            alertRelevancePrecision: 92.4,
            avgDetectionMinutes: 12,
            totalNoiseFiltered: 142
          }
        };
      } catch (e) {
        console.warn("Failed to parse saved state, resetting to defaults", e);
      }
    }

    return {
      sources: [...INITIAL_SOURCES],
      alerts: [...INITIAL_ALERTS],
      diffSnapshots: { ...DIFF_SNAPSHOTS },
      activeTab: "feed",
      searchQuery: "",
      selectedCategory: "ALL",
      selectedUncertainty: "ALL",
      sensitivityThreshold: 0.70,
      theme: "dark",
      selectedDiffId: "diff_stripe_01",
      pmMetrics: {
        meaningfulChangeRecall: 94.2,
        noiseSuppressionRate: 89.1,
        alertRelevancePrecision: 92.4,
        avgDetectionMinutes: 12,
        totalNoiseFiltered: 142
      }
    };
  }

  save() {
    const persistable = {
      sources: this.state.sources,
      alerts: this.state.alerts,
      diffSnapshots: this.state.diffSnapshots,
      theme: this.state.theme,
      pmMetrics: this.state.pmMetrics
    };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(persistable));
    } catch (e) {
      console.error("Failed to persist state", e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event) {
    this.save();
    this.listeners.forEach(fn => fn(this.state, event));
  }

  // State Mutators
  setTab(tab) {
    this.state.activeTab = tab;
    this.notify("TAB_CHANGED");
  }

  setSearchQuery(query) {
    this.state.searchQuery = query;
    this.notify("FILTER_CHANGED");
  }

  setSelectedCategory(cat) {
    this.state.selectedCategory = cat;
    this.notify("FILTER_CHANGED");
  }

  setSelectedUncertainty(level) {
    this.state.selectedUncertainty = level;
    this.notify("FILTER_CHANGED");
  }

  setSensitivityThreshold(val) {
    this.state.sensitivityThreshold = parseFloat(val);
    this.notify("SENSITIVITY_CHANGED");
  }

  toggleTheme() {
    this.state.theme = this.state.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", this.state.theme);
    this.notify("THEME_CHANGED");
  }

  setSelectedDiff(diffId) {
    this.state.selectedDiffId = diffId;
    this.notify("DIFF_SELECTED");
  }

  /**
   * Records user feedback (Useful / Irrelevant / Duplicate)
   * Directly implements Section 7 & 8 of Product Context:
   * Dynamically adjusts precision metrics and adapts noise suppression.
   */
  recordFeedback(alertId, feedbackType) {
    const alert = this.state.alerts.find(a => a.id === alertId);
    if (!alert) return;

    // Toggle off if already clicked
    if (alert.userFeedback === feedbackType) {
      alert.userFeedback = null;
    } else {
      alert.userFeedback = feedbackType;
    }

    // Recalculate PM Precision & Noise metrics
    const ratedAlerts = this.state.alerts.filter(a => a.userFeedback !== null);
    if (ratedAlerts.length > 0) {
      const usefulCount = ratedAlerts.filter(a => a.userFeedback === "USEFUL").length;
      const irrelevantCount = ratedAlerts.filter(a => a.userFeedback === "IRRELEVANT").length;
      
      const newPrecision = (usefulCount / (usefulCount + irrelevantCount || 1)) * 100;
      this.state.pmMetrics.alertRelevancePrecision = parseFloat(newPrecision.toFixed(1));

      if (feedbackType === "IRRELEVANT") {
        this.state.pmMetrics.totalNoiseFiltered += 1;
        this.state.pmMetrics.noiseSuppressionRate = Math.min(99.0, parseFloat((this.state.pmMetrics.noiseSuppressionRate + 0.4).toFixed(1)));
      }
    }

    this.notify("FEEDBACK_RECORDED");
  }

  addSource(sourceData) {
    const newSource = {
      id: "src_" + Date.now().toString(36),
      name: sourceData.name || "Custom Monitored Source",
      url: sourceData.url || "https://example.com",
      category: sourceData.category || "CHANGELOG",
      categoryLabel: sourceData.categoryLabel || "Product Changelog",
      monitoringGoal: sourceData.monitoringGoal || "Track all breaking changes and new feature releases.",
      checkFrequencyMinutes: parseInt(sourceData.checkFrequencyMinutes, 10) || 60,
      lastCheckedAt: "Just now",
      lastChangedAt: "Pending first scan",
      healthStatus: "HEALTHY",
      historySnapshotsCount: 1,
      icon: "🌐"
    };

    this.state.sources.unshift(newSource);
    this.notify("SOURCE_ADDED");
    return newSource;
  }

  addAlert(alertData, diffSnapshotData) {
    this.state.alerts.unshift(alertData);
    if (diffSnapshotData && alertData.diffId) {
      this.state.diffSnapshots[alertData.diffId] = diffSnapshotData;
    }
    this.notify("ALERT_ADDED");
  }

  getFilteredAlerts() {
    return this.state.alerts.filter(alert => {
      // Sensitivity threshold filter: alerts below threshold are suppressed
      if (alert.relevanceScore < this.state.sensitivityThreshold) {
        return false;
      }

      // Search Query filter
      if (this.state.searchQuery) {
        const q = this.state.searchQuery.toLowerCase();
        const matchTitle = alert.title.toLowerCase().includes(q);
        const matchFact = alert.observedFact.toLowerCase().includes(q);
        const matchSource = alert.sourceName.toLowerCase().includes(q);
        const matchTags = alert.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchFact && !matchSource && !matchTags) return false;
      }

      // Category filter
      if (this.state.selectedCategory !== "ALL" && alert.category !== this.state.selectedCategory) {
        return false;
      }

      // Uncertainty filter
      if (this.state.selectedUncertainty !== "ALL" && alert.uncertainty !== this.state.selectedUncertainty) {
        return false;
      }

      return true;
    });
  }
}

// Global singleton instance
const AppState = new StateStore();
