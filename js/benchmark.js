/**
 * SentinelAI - PM Evaluation & Benchmark Lab
 * 
 * Implements Section 7, 8, 9 of Product Context:
 * - Runs pre-labeled ground truth test cases
 * - Computes Confusion Matrix (TP, FP, TN, FN)
 * - Calculates Precision, Recall, F1 Score, and Noise Suppression Rate
 * - Renders interactive diagnostic tables for PM review
 */

class BenchmarkLab {
  constructor() {
    this.testCases = BENCHMARK_TEST_CASES;
    this.results = null;
  }

  /**
   * Executes the full benchmark evaluation suite
   * @returns {object} Diagnostic metrics and individual case evaluations
   */
  runEvaluation() {
    let tp = 0; // True Positive: Meaningful change alerted
    let fp = 0; // False Positive: Cosmetic noise alerted
    let tn = 0; // True Negative: Cosmetic noise suppressed
    let fn = 0; // False Negative: Meaningful change suppressed or missed

    const evaluatedCases = this.testCases.map(tc => {
      // Simulate classification rule
      const isPredictedMeaningful = tc.simulatedLLMResult.isSubstantive && (tc.simulatedLLMResult.relevanceScore >= 0.70);
      const isActualMeaningful = tc.groundTruth === "MEANINGFUL_CHANGE";

      let classification = "";
      if (isActualMeaningful && isPredictedMeaningful) {
        tp++;
        classification = "TRUE_POSITIVE";
      } else if (!isActualMeaningful && isPredictedMeaningful) {
        fp++;
        classification = "FALSE_POSITIVE";
      } else if (!isActualMeaningful && !isPredictedMeaningful) {
        tn++;
        classification = "TRUE_NEGATIVE";
      } else if (isActualMeaningful && !isPredictedMeaningful) {
        fn++;
        classification = "FALSE_NEGATIVE";
      }

      return {
        ...tc,
        classification,
        isPredictedMeaningful,
        isPassed: (isActualMeaningful === isPredictedMeaningful)
      };
    });

    const precision = tp / (tp + fp || 1);
    const recall = tp / (tp + fn || 1);
    const f1Score = (2 * precision * recall) / (precision + recall || 1);
    const noiseSuppressionRate = tn / (tn + fp || 1);

    this.results = {
      tp,
      fp,
      tn,
      fn,
      total: this.testCases.length,
      precision: parseFloat((precision * 100).toFixed(1)),
      recall: parseFloat((recall * 100).toFixed(1)),
      f1Score: parseFloat((f1Score * 100).toFixed(1)),
      noiseSuppressionRate: parseFloat((noiseSuppressionRate * 100).toFixed(1)),
      cases: evaluatedCases
    };

    return this.results;
  }

  /**
   * Renders the interactive Confusion Matrix & PM Metric dashboard
   */
  render(container) {
    if (!this.results) {
      this.runEvaluation();
    }

    const { tp, fp, tn, fn, precision, recall, f1Score, noiseSuppressionRate, cases } = this.results;

    container.innerHTML = `
      <div class="benchmark-panel">
        <div class="benchmark-intro">
          <div>
            <h2 style="font-size: 18px; margin-bottom: 6px;">🧪 PM Evaluation &amp; Ground Truth Benchmark Lab</h2>
            <p style="font-size: 13px; color: var(--text-secondary); max-width: 680px;">
              Validates change-detection accuracy against 6 pre-labeled ground-truth scenarios (pricing changes, cookie banners, deprecation notices, and server errors) as mandated by Section 8 &amp; 9 of the Product Context.
            </p>
          </div>
          <button id="btn-rerun-benchmark" class="btn btn-primary">
            <span>⚡</span> Re-run Benchmark Suite
          </button>
        </div>

        <!-- Metric KPI Cards for Benchmark -->
        <div class="benchmark-score-grid">
          <div class="metric-card">
            <div class="metric-title">Precision (Signal Quality)</div>
            <div class="metric-value" style="color: var(--color-success);">${precision}%</div>
            <div class="metric-subtext">Alerts users consider relevant</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Recall (Detection Rate)</div>
            <div class="metric-value" style="color: var(--accent-cyan);">${recall}%</div>
            <div class="metric-subtext">True meaningful changes detected</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">F1 Score (Balanced Accuracy)</div>
            <div class="metric-value" style="color: var(--accent-violet);">${f1Score}%</div>
            <div class="metric-subtext">Harmonic mean of precision &amp; recall</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Noise Suppression Rate</div>
            <div class="metric-value" style="color: #60A5FA;">${noiseSuppressionRate}%</div>
            <div class="metric-subtext">Boilerplate &amp; cosmetic noise filtered</div>
          </div>
        </div>

        <!-- Confusion Matrix Visualization -->
        <div class="confusion-matrix-box">
          <h3 style="font-size: 15px;">📊 Empirical Confusion Matrix</h3>
          <p style="font-size: 12px; color: var(--text-secondary);">
            Compares Ground Truth expectations against AI Filter predictions across test cases.
          </p>

          <div class="matrix-grid">
            <div></div>
            <div style="text-align: center; font-weight: 700; color: var(--text-secondary); font-size: 11px; text-transform: uppercase;">
              Predicted: ALERT (Meaningful)
            </div>
            <div style="text-align: center; font-weight: 700; color: var(--text-secondary); font-size: 11px; text-transform: uppercase;">
              Predicted: SUPPRESS (Noise)
            </div>

            <div style="font-weight: 700; color: var(--text-secondary); font-size: 11px; text-transform: uppercase;">
              Actual: MEANINGFUL
            </div>
            <div class="matrix-cell tp">
              <span class="matrix-count">${tp}</span>
              <span class="matrix-sub">True Positive (TP)</span>
              <span style="font-size: 10px; color: var(--color-success);">Correctly Alerted</span>
            </div>
            <div class="matrix-cell fn">
              <span class="matrix-count">${fn}</span>
              <span class="matrix-sub">False Negative (FN)</span>
              <span style="font-size: 10px; color: var(--color-danger);">Missed Change</span>
            </div>

            <div style="font-weight: 700; color: var(--text-secondary); font-size: 11px; text-transform: uppercase;">
              Actual: NOISE / COSMETIC
            </div>
            <div class="matrix-cell fp">
              <span class="matrix-count">${fp}</span>
              <span class="matrix-sub">False Positive (FP)</span>
              <span style="font-size: 10px; color: var(--color-danger);">Unwanted Noise Alert</span>
            </div>
            <div class="matrix-cell tn">
              <span class="matrix-count">${tn}</span>
              <span class="matrix-sub">True Negative (TN)</span>
              <span style="font-size: 10px; color: var(--accent-cyan);">Successfully Filtered</span>
            </div>
          </div>
        </div>

        <!-- Labeled Test Cases Diagnostic Table -->
        <div class="benchmark-table-box">
          <table class="benchmark-table">
            <thead>
              <tr>
                <th>Test Case</th>
                <th>Source</th>
                <th>Ground Truth</th>
                <th>AI Decision</th>
                <th>Relevance Score</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              ${cases.map(c => `
                <tr>
                  <td>
                    <div style="font-weight: 600; color: var(--text-primary);">${c.title}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${c.rationale}</div>
                  </td>
                  <td>${c.source}</td>
                  <td><span class="badge" style="background: var(--bg-tertiary);">${c.groundTruth}</span></td>
                  <td>
                    <span class="badge ${c.isPredictedMeaningful ? 'badge-pricing' : 'badge-uncertainty-low'}">
                      ${c.isPredictedMeaningful ? 'DELIVER ALERT' : 'SUPPRESS NOISE'}
                    </span>
                  </td>
                  <td><strong>${(c.simulatedLLMResult.relevanceScore * 100).toFixed(0)}%</strong></td>
                  <td>
                    <span class="badge ${c.isPassed ? 'badge-uncertainty-low' : 'badge-uncertainty-high'}">
                      ${c.isPassed ? '✓ PASS' : '✗ FAIL'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Attach re-run event listener
    const rerunBtn = container.querySelector("#btn-rerun-benchmark");
    if (rerunBtn) {
      rerunBtn.addEventListener("click", () => {
        rerunBtn.innerHTML = `<span>⏳</span> Evaluating...`;
        setTimeout(() => {
          this.runEvaluation();
          this.render(container);
          window.SentinelApp && window.SentinelApp.showToast("Benchmark suite evaluated successfully!", "success");
        }, 400);
      });
    }
  }
}
