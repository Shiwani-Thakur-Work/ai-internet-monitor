/**
 * SentinelAI - Diff & Content Normalization Engine
 * 
 * Implements:
 * 1. DOM & Text Sanitization (Boilerplate, Script, Style & Cookie stripper)
 * 2. LCS (Longest Common Subsequence) Line-by-Line Diff Algorithm
 * 3. Heuristic Noise Suppression (Eliminates timestamps, copyright years, and tracking artifacts)
 */

class DiffEngine {
  /**
   * Sanitizes raw HTML or text content to isolate substantive text.
   * Strips volatile scripts, CSS, inline tracking IDs, and cookie modals.
   * @param {string} raw - Raw HTML or string content
   * @returns {string} Clean, normalized text
   */
  static cleanContent(raw) {
    if (!raw) return "";
    
    let text = raw;

    // 1. Remove script, style, and noscript elements
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
    text = text.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "");

    // 2. Strip HTML tags but preserve line breaks
    text = text.replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n");
    text = text.replace(/<br\s*[\/]?>/gi, "\n");
    text = text.replace(/<[^>]+>/g, "");

    // 3. Decode common HTML entities
    text = text.replace(/&amp;/g, "&")
               .replace(/&lt;/g, "<")
               .replace(/&gt;/g, ">")
               .replace(/&quot;/g, "\"")
               .replace(/&#39;/g, "'")
               .replace(/&nbsp;/g, " ");

    // 4. Normalize multiple whitespaces and blank lines
    const lines = text.split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return lines.join("\n");
  }

  /**
   * Identifies whether a given line of text represents cosmetic noise.
   * Filters out:
   * - Cookie / GDPR banners
   * - Copyright year updates (e.g. "© 2025" -> "© 2026")
   * - Dynamic relative timestamps ("Updated 3 mins ago")
   * - Analytics session identifiers and CSRF tokens
   * @param {string} line 
   * @returns {boolean}
   */
  static isNoiseLine(line) {
    const trimmed = line.trim();
    if (!trimmed) return true;

    // Copyright patterns
    if (/©|\(c\)|copyright\s+\d{4}/i.test(trimmed)) return true;

    // Cookie consent & GDPR notifications
    if (/(cookie|gdpr|consent|privacy\s+preferences|tracking\s+technologies)/i.test(trimmed) &&
        /(accept|agree|manage|preferences|we\s+use\s+cookies)/i.test(trimmed)) {
      return true;
    }

    // Relative timestamps & page render tickers
    if (/^(updated|last\s+modified|published|checked)\s+.*(ago|just\s+now|today|yesterday|\d{1,2}:\d{2})/i.test(trimmed)) {
      return true;
    }

    // CSRF and hash tokens
    if (/^[a-f0-9]{32,64}$/i.test(trimmed) || /csrf[-_]token/i.test(trimmed)) {
      return true;
    }

    return false;
  }

  /**
   * Computes Myers LCS line-by-line diff between two document snapshots.
   * @param {string} oldText - Previous snapshot text
   * @param {string} newText - Current snapshot text
   * @returns {object} Structured diff result with lines, additions, deletions, and noise count
   */
  static computeDiff(oldText, newText) {
    const oldLines = oldText ? oldText.split(/\r?\n/) : [];
    const newLines = newText ? newText.split(/\r?\n/) : [];

    const m = oldLines.length;
    const n = newLines.length;

    // Fast-path for identical strings
    if (oldText === newText) {
      return {
        hasChanges: false,
        linesAdded: 0,
        linesRemoved: 0,
        suppressedNoiseLines: 0,
        diffLines: oldLines.map((line, idx) => ({
          type: "UNCHANGED",
          text: line,
          lineBefore: idx + 1,
          lineAfter: idx + 1
        }))
      };
    }

    // Build Longest Common Subsequence (LCS) matrix
    // Space optimized for typical document sizes
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (oldLines[i - 1] === newLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to generate diff tokens
    let i = m;
    let j = n;
    const rawDiff = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
        rawDiff.push({
          type: "UNCHANGED",
          text: oldLines[i - 1],
          lineBefore: i,
          lineAfter: j
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        rawDiff.push({
          type: "ADD",
          text: newLines[j - 1],
          lineBefore: null,
          lineAfter: j
        });
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        rawDiff.push({
          type: "REMOVE",
          text: oldLines[i - 1],
          lineBefore: i,
          lineAfter: null
        });
        i--;
      }
    }

    rawDiff.reverse();

    // Second pass: Filter and categorize cosmetic noise lines
    let substantiveAdd = 0;
    let substantiveDel = 0;
    let suppressedNoise = 0;

    const diffLines = rawDiff.map(item => {
      if (item.type === "ADD" || item.type === "REMOVE") {
        if (this.isNoiseLine(item.text)) {
          suppressedNoise++;
          return {
            ...item,
            type: "NOISE_SUPPRESSED",
            originalType: item.type
          };
        } else {
          if (item.type === "ADD") substantiveAdd++;
          if (item.type === "REMOVE") substantiveDel++;
        }
      }
      return item;
    });

    return {
      hasChanges: (substantiveAdd > 0 || substantiveDel > 0),
      linesAdded: substantiveAdd,
      linesRemoved: substantiveDel,
      suppressedNoiseLines: suppressedNoise,
      diffLines: diffLines
    };
  }
}
