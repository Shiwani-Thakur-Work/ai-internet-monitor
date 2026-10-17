/**
 * SentinelAI - Main Application Controller
 * 
 * Orchestrates:
 * - UI Rendering and View Navigation (Feed, Sources, Diff, Benchmark, Digest)
 * - Fact-Evidence-Impact Alert Card interactions
 * - User Feedback Loop (Useful / Irrelevant / Duplicate)
 * - Live Crawl Pipeline Simulation Drawer
 * - Add Monitored Source Modal
 * - Toast Notification System
 */

class SentinelApplication {
  constructor() {
    this.benchmarkLab = new BenchmarkLab();
    this.init();
  }

  init() {
    // 1. Set theme from state
    document.documentElement.setAttribute("data-theme", AppState.state.theme);

    // 2. Wire global event listeners
    this.bindEvents();

    // 3. Subscribe to reactive state updates
    AppState.subscribe((state, event) => this.handleStateChange(state, event));

    // 4. Initial Render
    this.renderMetrics();
    this.renderView();
  }

  bindEvents() {
    // Tab switching
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.currentTarget.getAttribute("data-tab");
        AppState.setTab(tab);
      });
    });

    // Theme Toggle
    const themeBtn = document.getElementById("btn-theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => AppState.toggleTheme());
    }

    // Global Search Input
    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        AppState.setSearchQuery(e.target.value);
      });
    }

    // Category Filter Select
    const categorySelect = document.getElementById("category-filter-select");
    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        AppState.setSelectedCategory(e.target.value);
      });
    }

    // Uncertainty Filter Select
    const uncertaintySelect = document.getElementById("uncertainty-filter-select");
    if (uncertaintySelect) {
      uncertaintySelect.addEventListener("change", (e) => {
        AppState.setSelectedUncertainty(e.target.value);
      });
    }

    // Dynamic Sensitivity Slider
    const sensitivitySlider = document.getElementById("sensitivity-slider");
    const sensitivityVal = document.getElementById("sensitivity-value-display");
    if (sensitivitySlider) {
      sensitivitySlider.addEventListener("input", (e) => {
        const val = e.target.value;
        if (sensitivityVal) sensitivityVal.textContent = Math.round(val * 100) + "%";
        AppState.setSensitivityThreshold(val);
      });
    }

    // Trigger Live Crawl Simulation
    const scanAllBtn = document.getElementById("btn-scan-all");
    if (scanAllBtn) {
      scanAllBtn.addEventListener("click", () => this.runLiveScanSimulation());
    }

    // Add Source Modal Triggers
    const openAddSourceBtn = document.getElementById("btn-open-add-source");
    const modalAddSource = document.getElementById("modal-add-source");
    const closeAddSourceBtn = document.getElementById("btn-close-add-source");
    const cancelAddSourceBtn = document.getElementById("btn-cancel-add-source");
    const addSourceForm = document.getElementById("form-add-source");

    if (openAddSourceBtn && modalAddSource) {
      openAddSourceBtn.addEventListener("click", () => modalAddSource.classList.add("active"));
    }
    if (closeAddSourceBtn && modalAddSource) {
      closeAddSourceBtn.addEventListener("click", () => modalAddSource.classList.remove("active"));
    }
    if (cancelAddSourceBtn && modalAddSource) {
      cancelAddSourceBtn.addEventListener("click", () => modalAddSource.classList.remove("active"));
    }

    if (addSourceForm) {
      addSourceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("source-name-input").value.trim();
        const url = document.getElementById("source-url-input").value.trim();
        const category = document.getElementById("source-category-select").value;
        const goal = document.getElementById("source-goal-input").value.trim();
        const freq = document.getElementById("source-freq-select").value;

        if (!name || !url) {
          this.showToast("Please provide both name and valid URL.", "warning");
          return;
        }

        const categoryLabels = {
          PRICING: "Pricing & Terms",
          API_DOCS: "API & Models",
          CHANGELOG: "Product Changelog",
          INFRASTRUCTURE: "Infrastructure",
          INDUSTRY: "Industry & Cloud"
        };

        AppState.addSource({
          name,
          url,
          category,
          categoryLabel: categoryLabels[category] || "General",
          monitoringGoal: goal || "Track all substantive updates.",
          checkFrequencyMinutes: freq
        });

        addSourceForm.reset();
        modalAddSource.classList.remove("active");
        this.showToast(`Source "${name}" registered for monitoring!`, "success");
      });
    }

    // Close modals on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay.active").forEach(m => m.classList.remove("active"));
      }
    });
  }

  handleStateChange(state, event) {
    this.renderMetrics();

    // If tab changed, update active tab button styling
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === state.activeTab);
    });

    // Update alert count badge on Feed tab
    const alertBadge = document.getElementById("feed-badge-count");
    if (alertBadge) {
      alertBadge.textContent = state.alerts.length;
    }

    this.renderView();
  }

  renderMetrics() {
    const { pmMetrics, sources, alerts } = AppState.state;

    const elRecall = document.getElementById("kpi-meaningful-recall");
    if (elRecall) elRecall.textContent = pmMetrics.meaningfulChangeRecall + "%";

    const elNoise = document.getElementById("kpi-noise-filtered");
    if (elNoise) elNoise.textContent = pmMetrics.noiseSuppressionRate + "%";

    const elPrecision = document.getElementById("kpi-alert-precision");
    if (elPrecision) elPrecision.textContent = pmMetrics.alertRelevancePrecision + "%";

    const elLatency = document.getElementById("kpi-detection-latency");
    if (elLatency) elLatency.textContent = pmMetrics.avgDetectionMinutes + " min";

    const elSources = document.getElementById("kpi-active-sources");
    if (elSources) elSources.textContent = sources.length;
  }

  renderView() {
    const container = document.getElementById("main-view-container");
    const toolbar = document.getElementById("toolbar-panel");
    if (!container) return;

    const activeTab = AppState.state.activeTab;

    // Show toolbar only on Feed view
    if (toolbar) {
      toolbar.style.display = (activeTab === "feed") ? "flex" : "none";
    }

    switch (activeTab) {
      case "feed":
        this.renderAlertFeed(container);
        break;
      case "sources":
        this.renderSourcesCatalog(container);
        break;
      case "diff":
        this.renderDiffInspector(container);
        break;
      case "benchmark":
        this.benchmarkLab.render(container);
        break;
      case "digest":
        DigestGenerator.render(container, AppState.state.alerts);
        break;
      default:
        this.renderAlertFeed(container);
    }
  }

  /**
   * Renders the Live Alert Feed with Fact-Evidence-Impact Cards
   */
  renderAlertFeed(container) {
    const filteredAlerts = AppState.getFilteredAlerts();

    if (filteredAlerts.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
          <div style="font-size: 36px; margin-bottom: 12px;">🛡️</div>
          <h3 style="font-size: 16px; margin-bottom: 6px;">No Alerts Matching Filter Criteria</h3>
          <p style="font-size: 13px; color: var(--text-secondary); max-width: 440px; margin: 0 auto 16px;">
            Adjust your sensitivity threshold slider or clear search filters to view suppressed or lower-confidence items.
          </p>
          <button class="btn btn-secondary" onclick="AppState.setSensitivityThreshold(0.5); document.getElementById('sensitivity-slider').value = 0.5;">
            Lower Sensitivity Threshold
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="alert-feed">
        ${filteredAlerts.map(alert => this.renderAlertCard(alert)).join('')}
      </div>
    `;

    // Wire alert card interactive buttons (Feedback & Diff)
    container.querySelectorAll(".feedback-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const alertId = e.currentTarget.getAttribute("data-alert-id");
        const type = e.currentTarget.getAttribute("data-type");
        AppState.recordFeedback(alertId, type);
        this.showToast(`Feedback noted: ${type.toLowerCase()}. Precision model updated.`, "success");
      });
    });

    container.querySelectorAll(".btn-view-diff").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const diffId = e.currentTarget.getAttribute("data-diff-id");
        AppState.setSelectedDiff(diffId);
        AppState.setTab("diff");
      });
    });
  }

  renderAlertCard(alert) {
    const uncertaintyClass = {
      LOW: "badge-uncertainty-low",
      MED: "badge-uncertainty-med",
      HIGH: "badge-uncertainty-high"
    }[alert.uncertainty] || "badge-uncertainty-low";

    const categoryBadgeClass = {
      PRICING: "badge-pricing",
      API_DOCS: "badge-api",
      CHANGELOG: "badge-feature",
      DEPRECATION: "badge-deprecation",
      INFRASTRUCTURE: "badge-feature",
      INDUSTRY: "badge-competitor"
    }[alert.category] || "badge-feature";

    // Format evidence snippet lines
    const formattedEvidence = alert.evidence.split("\n").map(line => {
      if (line.startsWith("+")) {
        return `<span class="diff-add">${this.escapeHtml(line)}</span>`;
      } else if (line.startsWith("-")) {
        return `<span class="diff-del">${this.escapeHtml(line)}</span>`;
      }
      return this.escapeHtml(line);
    }).join("");

    return `
      <article class="alert-card ${alert.status === 'UNREAD' ? 'unread' : ''}" id="${alert.id}">
        <!-- Alert Top Meta Row -->
        <div class="alert-header-row">
          <div class="alert-source-meta">
            <div class="source-avatar">${alert.sourceName.charAt(0)}</div>
            <div>
              <span class="source-name">${this.escapeHtml(alert.sourceName)}</span>
              <span class="alert-time"> • ${alert.timestamp}</span>
            </div>
          </div>
          <div class="alert-badges">
            <span class="badge ${categoryBadgeClass}">${alert.categoryLabel}</span>
            <span class="badge ${uncertaintyClass}" title="${this.escapeHtml(alert.uncertaintyExplanation || '')}">
              Uncertainty: ${alert.uncertainty}
            </span>
          </div>
        </div>

        <h3 class="alert-title">${this.escapeHtml(alert.title)}</h3>

        <!-- Section 6: Fact-Evidence-Impact Triad -->
        <div class="triad-box">
          <!-- 1. Observed Fact -->
          <div class="triad-item">
            <span class="triad-tag tag-fact">
              <span>●</span> 1. Observed Fact (Verified Ground Truth)
            </span>
            <p class="triad-content fact-text">${this.escapeHtml(alert.observedFact)}</p>
          </div>

          <!-- 2. Evidence Snippet -->
          <div class="triad-item">
            <span class="triad-tag tag-evidence">
              <span>●</span> 2. Evidence (Exact Line Delta)
            </span>
            <div class="evidence-quote">${formattedEvidence}</div>
          </div>

          <!-- 3. Strategic Relevance / AI Interpretation -->
          <div class="triad-item">
            <span class="triad-tag tag-impact">
              <span>●</span> 3. Strategic Rationale &amp; Impact
            </span>
            <p class="triad-content">${this.escapeHtml(alert.strategicImpact)}</p>
          </div>
        </div>

        <!-- Relevance Score & Action Bar -->
        <div class="relevance-score-row">
          <span>AI Relevance Confidence</span>
          <div class="score-bar-bg">
            <div class="score-bar-fill" style="width: ${Math.round(alert.relevanceScore * 100)}%;"></div>
          </div>
          <strong style="color: var(--accent-cyan); font-size: 13px;">${Math.round(alert.relevanceScore * 100)}%</strong>
        </div>

        <!-- Section 7 & 8: User Feedback & PM Action Loop -->
        <div class="alert-action-footer">
          <div class="feedback-buttons">
            <span style="font-size: 11px; color: var(--text-muted); margin-right: 4px;">PM Feedback:</span>
            <button class="feedback-btn ${alert.userFeedback === 'USEFUL' ? 'active-useful' : ''}" 
                    data-alert-id="${alert.id}" data-type="USEFUL" title="Mark as Useful / Relevant">
              👍 Useful
            </button>
            <button class="feedback-btn ${alert.userFeedback === 'IRRELEVANT' ? 'active-irrelevant' : ''}" 
                    data-alert-id="${alert.id}" data-type="IRRELEVANT" title="Mark as Noise / Irrelevant">
              👎 Noise / Irrelevant
            </button>
            <button class="feedback-btn ${alert.userFeedback === 'DUPLICATE' ? 'active-duplicate' : ''}" 
                    data-alert-id="${alert.id}" data-type="DUPLICATE" title="Mark as Duplicate">
              🔄 Duplicate
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="btn btn-secondary btn-view-diff" data-diff-id="${alert.diffId}" style="padding: 4px 10px; font-size: 11.5px;">
              🔍 Deep Diff View
            </button>
            <a href="${alert.sourceUrl}" target="_blank" rel="noopener noreferrer" class="alert-link-btn">
              Source ↗
            </a>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Renders the Monitored Sources Catalog
   */
  renderSourcesCatalog(container) {
    const sources = AppState.state.sources;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 18px; margin-bottom: 4px;">🌐 Monitored Web Sources &amp; Feeds</h2>
            <p style="font-size: 13px; color: var(--text-secondary);">
              Configure target URLs, monitoring goals, and check cadences. Respects robots.txt and HTTP 304 caching.
            </p>
          </div>
          <button id="btn-open-add-source-inline" class="btn btn-primary">
            <span>+</span> Add Custom Source
          </button>
        </div>

        <div class="sources-grid">
          ${sources.map(src => `
            <div class="source-card">
              <div>
                <div class="source-card-top">
                  <div class="source-brand-wrap">
                    <div class="source-icon-box">${src.icon}</div>
                    <div class="source-meta-text">
                      <span class="source-title">${this.escapeHtml(src.name)}</span>
                      <a href="${src.url}" target="_blank" rel="noopener noreferrer" class="source-url">${src.url}</a>
                    </div>
                  </div>
                  <span class="source-status-badge status-healthy">● ${src.healthStatus}</span>
                </div>

                <div class="source-goal-box" style="margin-top: 14px;">
                  <div class="source-goal-label">🎯 Targeted Monitoring Goal</div>
                  ${this.escapeHtml(src.monitoringGoal)}
                </div>
              </div>

              <div class="source-card-footer">
                <span>Check: Every ${src.checkFrequencyMinutes}m</span>
                <span>Last checked: ${src.lastCheckedAt}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const inlineAdd = container.querySelector("#btn-open-add-source-inline");
    const modal = document.getElementById("modal-add-source");
    if (inlineAdd && modal) {
      inlineAdd.addEventListener("click", () => modal.classList.add("active"));
    }
  }

  /**
   * Renders the Side-by-Side Diff Inspector
   */
  renderDiffInspector(container) {
    const selectedDiffId = AppState.state.selectedDiffId;
    const diffData = AppState.state.diffSnapshots[selectedDiffId] || AppState.state.diffSnapshots["diff_stripe_01"];

    if (!diffData) {
      container.innerHTML = `<div style="padding: 40px; text-align: center;">No diff selected.</div>`;
      return;
    }

    // Split previous and current content
    const prevLines = diffData.previousSnapshot.split("\n");
    const currLines = diffData.currentSnapshot.split("\n");

    container.innerHTML = `
      <div class="diff-inspector-panel">
        <div class="diff-toolbar">
          <div>
            <h2 style="font-size: 16px; margin-bottom: 2px;">
              🔍 Deep Diff Inspector: ${this.escapeHtml(diffData.sourceName)}
            </h2>
            <div style="font-size: 11.5px; color: var(--text-muted);">
              Snapshot Timestamp: ${diffData.timestamp} • <a href="${diffData.sourceUrl}" target="_blank" rel="noopener">Open Source Page ↗</a>
            </div>
          </div>

          <div class="diff-stat-chips">
            <span class="chip chip-add">+${diffData.linesAdded} Added</span>
            <span class="chip chip-del">-${diffData.linesRemoved} Removed</span>
            <span class="chip chip-noise">🛡️ ${diffData.suppressedNoiseLines} Noise Lines Filtered</span>
          </div>
        </div>

        <div class="diff-viewer-grid">
          <!-- Previous Snapshot Column -->
          <div class="diff-column">
            <div class="diff-col-header">Previous Baseline (Version N-1)</div>
            <div class="diff-lines-container">
              ${prevLines.map((line, idx) => {
                const isDel = line.startsWith("-");
                return `
                  <div class="diff-line ${isDel ? 'line-del' : ''}">
                    <span class="line-num">${idx + 1}</span>
                    <span class="line-content">${this.escapeHtml(line)}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Current Snapshot Column -->
          <div class="diff-column">
            <div class="diff-col-header">Current Snapshot (Version N)</div>
            <div class="diff-lines-container">
              ${currLines.map((line, idx) => {
                const isAdd = line.startsWith("+");
                return `
                  <div class="diff-line ${isAdd ? 'line-add' : ''}">
                    <span class="line-num">${idx + 1}</span>
                    <span class="line-content">${this.escapeHtml(line)}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Runs the Live Scan Simulation with animated multi-stage Pipeline Drawer
   */
  runLiveScanSimulation() {
    const drawer = document.getElementById("pipeline-simulation-drawer");
    const scanBtn = document.getElementById("btn-scan-all");
    const pulseDot = document.getElementById("live-pulse-dot");
    const pulseStatus = document.getElementById("system-status-text");

    if (!drawer) return;

    drawer.classList.add("active");
    if (scanBtn) scanBtn.disabled = true;
    if (pulseDot) pulseDot.classList.add("checking");
    if (pulseStatus) pulseStatus.textContent = "Scanning 8 Sources...";

    const steps = [
      { id: "step-1", delay: 300, name: "Fetching remote feeds & HTTP 304 cache check" },
      { id: "step-2", delay: 900, name: "Sanitizing DOM & stripping boilerplate noise" },
      { id: "step-3", delay: 1500, name: "Computing Myers LCS line-by-line delta" },
      { id: "step-4", delay: 2100, name: "Heuristic noise filter: suppressed 12 footer lines" },
      { id: "step-5", delay: 2700, name: "Semantic AI Evaluator: Fact & Impact extraction" },
      { id: "step-6", delay: 3300, name: "Alert calibrated & delivered to Executive Feed" }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        const el = document.getElementById(step.id);
        if (el) {
          el.classList.add("active");
          if (index > 0) {
            const prev = document.getElementById(steps[index - 1].id);
            if (prev) {
              prev.classList.remove("active");
              prev.classList.add("done");
              prev.querySelector(".step-icon").textContent = "✓";
            }
          }
        }

        // Final step completion
        if (index === steps.length - 1) {
          setTimeout(() => {
            el.classList.remove("active");
            el.classList.add("done");
            el.querySelector(".step-icon").textContent = "✓";

            // Inject a live simulated alert into state
            const simulatedAlert = {
              id: "alt_live_" + Date.now().toString(36),
              sourceId: "src_openai",
              sourceName: "OpenAI Platform & Models",
              timestamp: "Just now (Live Scan)",
              category: "API_DOCS",
              categoryLabel: "API & Models",
              title: "Context Window Expanded to 256k Tokens on GPT-4o-Mini",
              observedFact: "OpenAI updated model parameter tables, raising gpt-4o-mini context window from 128k to 256k tokens with zero price increase.",
              evidence: `- gpt-4o-mini context_window: 128,000 tokens
+ gpt-4o-mini context_window: 256,000 tokens (effective immediately)
+ Max output tokens: 16,384 tokens`,
              strategicImpact: "Allows doubling the size of automated document ingest chunks in our vector index without upgrading to full-scale GPT-4o.",
              relevanceScore: 0.98,
              uncertainty: "LOW",
              uncertaintyExplanation: "Direct numerical specification adjustment in official developer documentation.",
              status: "UNREAD",
              userFeedback: null,
              diffId: "diff_openai_live",
              sourceUrl: "https://platform.openai.com/docs/models",
              tags: ["Context Window", "Cost Efficiency", "OpenAI"]
            };

            const simulatedDiff = {
              id: "diff_openai_live",
              sourceId: "src_openai",
              sourceName: "OpenAI Platform & Models",
              sourceUrl: "https://platform.openai.com/docs/models",
              timestamp: "Just now",
              linesAdded: 2,
              linesRemoved: 1,
              suppressedNoiseLines: 8,
              previousSnapshot: `gpt-4o-mini Specification:
- context_window: 128,000 tokens
- training_cutoff: Oct 2023`,
              currentSnapshot: `gpt-4o-mini Specification:
+ gpt-4o-mini context_window: 256,000 tokens (effective immediately)
+ Max output tokens: 16,384 tokens
- training_cutoff: Oct 2023`
            };

            AppState.addAlert(simulatedAlert, simulatedDiff);

            if (scanBtn) scanBtn.disabled = false;
            if (pulseDot) pulseDot.classList.remove("checking");
            if (pulseStatus) pulseStatus.textContent = "Live Monitoring (8 Sources)";

            this.showToast("Scan complete: 1 substantive change detected, 14 noise lines suppressed!", "success");

            setTimeout(() => {
              drawer.classList.remove("active");
              // Reset step classes
              steps.forEach(s => {
                const elReset = document.getElementById(s.id);
                if (elReset) {
                  elReset.className = "step-item";
                  elReset.querySelector(".step-icon").textContent = s.id.split("-")[1];
                }
              });
            }, 1800);
          }, 600);
        }
      }, step.delay);
    });
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "✓" : type === "warning" ? "⚠️" : "ℹ️";
    toast.innerHTML = `<span>${icon}</span> <span>${this.escapeHtml(message)}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.SentinelApp = new SentinelApplication();
});
