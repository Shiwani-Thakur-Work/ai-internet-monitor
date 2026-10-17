/**
 * SentinelAI - Executive Digest & Exporter
 * 
 * Implements Section 5 of Product Context:
 * "Offer a basic digest rather than sending an alert for every event."
 * 
 * Generates:
 * - Markdown Executive Briefing for leadership/email
 * - Clean HTML Email template
 * - Webhook JSON payload compatible with Slack / Microsoft Teams
 */

class DigestGenerator {
  /**
   * Generates a structured Markdown briefing from active alerts
   * @param {Array} alerts - Current alert records
   * @returns {string} Markdown text
   */
  static generateMarkdown(alerts) {
    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    let md = `# 🛡️ SentinelAI Executive Briefing\n`;
    md += `*Generated on ${dateStr}*\n\n`;
    md += `> **Executive Summary:** Monitored ${alerts.length} high-signal shifts across industry sources. Filtered out cosmetic noise.\n\n`;

    // Group alerts by category
    const categories = {
      "PRICING": "💳 Commercial & Pricing Adjustments",
      "API_DOCS": "🤖 API, Models & Technical Documentation",
      "DEPRECATION": "⚠️ Breaking Deprecations & Security",
      "CHANGELOG": "📐 Competitor Product Changelogs",
      "INFRASTRUCTURE": "⚡ Infrastructure & Platform Alerts",
      "INDUSTRY": "☁️ Cloud & Ecosystem Developments"
    };

    Object.keys(categories).forEach(catKey => {
      const catAlerts = alerts.filter(a => a.category === catKey);
      if (catAlerts.length > 0) {
        md += `## ${categories[catKey]}\n\n`;
        catAlerts.forEach(a => {
          md += `### [${a.sourceName}] ${a.title}\n`;
          md += `- **Observed Fact:** ${a.observedFact}\n`;
          md += `- **Strategic Impact:** ${a.strategicImpact}\n`;
          md += `- **Uncertainty:** ${a.uncertainty} | **Relevance:** ${(a.relevanceScore * 100).toFixed(0)}%\n`;
          md += `- **Original Source:** [${a.sourceUrl}](${a.sourceUrl})\n\n`;
        });
      }
    });

    md += `---\n*Report generated automatically by SentinelAI Intelligent Monitor.*`;
    return md;
  }

  /**
   * Generates a Slack-compatible Block Kit webhook payload
   * @param {Array} alerts 
   * @returns {string} JSON string
   */
  static generateSlackWebhook(alerts) {
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🛡️ SentinelAI: Daily Executive Intelligence Digest",
          emoji: true
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${alerts.length} high-impact changes* detected across monitored ecosystem feeds.`
        }
      },
      { type: "divider" }
    ];

    alerts.slice(0, 4).forEach(a => {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*<${a.sourceUrl}|${a.sourceName}>: ${a.title}*\n*Fact:* ${a.observedFact}\n*Strategic Impact:* ${a.strategicImpact}\n_Relevance: ${(a.relevanceScore * 100).toFixed(0)}% | Uncertainty: ${a.uncertainty}_`
        }
      });
    });

    return JSON.stringify({ blocks }, null, 2);
  }

  /**
   * Renders the Digest tab interface
   */
  static render(container, alerts) {
    const markdown = this.generateMarkdown(alerts);
    const slackPayload = this.generateSlackWebhook(alerts);

    container.innerHTML = `
      <div class="digest-panel">
        <div class="digest-header">
          <div>
            <h2 style="font-size: 18px; margin-bottom: 4px;">📋 Executive Daily Briefing &amp; Export</h2>
            <p style="font-size: 13px; color: var(--text-secondary);">
              Consolidates granular alerts into an executive summary for leadership, Slack, or email distribution.
            </p>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button id="btn-copy-md" class="btn btn-primary">
              <span>📝</span> Copy Markdown
            </button>
            <button id="btn-copy-slack" class="btn btn-secondary">
              <span>💬</span> Copy Slack Webhook JSON
            </button>
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: -6px;">
          <button id="view-digest-md" class="view-toggle-btn active" style="padding: 6px 14px; font-size: 12px;">Markdown Preview</button>
          <button id="view-digest-slack" class="view-toggle-btn" style="padding: 6px 14px; font-size: 12px;">Slack Payload</button>
        </div>

        <div id="digest-preview-content" class="digest-preview-card">
          <pre style="white-space: pre-wrap; font-family: inherit;">${this.escapeHtml(markdown)}</pre>
        </div>
      </div>
    `;

    // View toggle listeners
    const previewBox = container.querySelector("#digest-preview-content");
    const mdTab = container.querySelector("#view-digest-md");
    const slackTab = container.querySelector("#view-digest-slack");

    mdTab.addEventListener("click", () => {
      mdTab.classList.add("active");
      slackTab.classList.remove("active");
      previewBox.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit;">${this.escapeHtml(markdown)}</pre>`;
    });

    slackTab.addEventListener("click", () => {
      slackTab.classList.add("active");
      mdTab.classList.remove("active");
      previewBox.innerHTML = `<pre style="white-space: pre-wrap; font-family: 'JetBrains Mono', monospace; font-size: 11.5px;">${this.escapeHtml(slackPayload)}</pre>`;
    });

    // Copy handlers
    container.querySelector("#btn-copy-md").addEventListener("click", () => {
      navigator.clipboard.writeText(markdown).then(() => {
        window.SentinelApp && window.SentinelApp.showToast("Markdown digest copied to clipboard!", "success");
      });
    });

    container.querySelector("#btn-copy-slack").addEventListener("click", () => {
      navigator.clipboard.writeText(slackPayload).then(() => {
        window.SentinelApp && window.SentinelApp.showToast("Slack JSON payload copied to clipboard!", "success");
      });
    });
  }

  static escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
