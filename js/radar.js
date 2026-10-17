/**
 * SentinelAI - Interactive Mission Control Radar Canvas Engine
 * 
 * Renders a real-time rotating radar display with:
 * - Concentric circular distance grids and bearing angle lines
 * - Sweeping radar beam with phosphor trail effect
 * - Interactive signal blips representing active monitored sources
 * - Click and hover interaction that links to source intelligence
 */

class SentinelRadar {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.angle = 0;
    this.sweepSpeed = 0.025; // Radians per frame
    this.blips = [];
    this.hoveredBlip = null;
    this.animationFrameId = null;

    this.initCanvasSize();
    this.generateBlips();
    this.bindEvents();
    this.startAnimation();
  }

  initCanvasSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const size = Math.min(rect.width, 360);
    this.canvas.width = size;
    this.canvas.height = size;
    this.center = { x: size / 2, y: size / 2 };
    this.radius = (size / 2) - 16;
  }

  generateBlips() {
    const sources = (window.AppState && window.AppState.state.sources) || [];
    const sourceIcons = {
      src_stripe: { dist: 0.72, angle: 0.8, color: "#10B981", label: "Stripe Pricing" },
      src_openai: { dist: 0.45, angle: 2.3, color: "#06B6D4", label: "OpenAI Models" },
      src_linear: { dist: 0.85, angle: 3.7, color: "#8B5CF6", label: "Linear Changelog" },
      src_supabase: { dist: 0.58, angle: 4.8, color: "#F59E0B", label: "Supabase Platform" },
      src_anthropic: { dist: 0.35, angle: 5.6, color: "#EC4899", label: "Anthropic Claude" },
      src_aws: { dist: 0.90, angle: 1.6, color: "#3B82F6", label: "AWS Architecture" }
    };

    this.blips = sources.map(src => {
      const preset = sourceIcons[src.id] || {
        dist: 0.3 + Math.random() * 0.55,
        angle: Math.random() * Math.PI * 2,
        color: "#06B6D4",
        label: src.name
      };

      return {
        id: src.id,
        name: src.name,
        dist: preset.dist * this.radius,
        angle: preset.angle,
        color: preset.color,
        intensity: 0.2, // Flash intensity when swept
        size: 5
      };
    });
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      if (this.canvas) {
        this.initCanvasSize();
        this.generateBlips();
      }
    });

    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let found = null;
      for (const blip of this.blips) {
        const blipX = this.center.x + Math.cos(blip.angle) * blip.dist;
        const blipY = this.center.y + Math.sin(blip.angle) * blip.dist;
        const d = Math.hypot(mouseX - blipX, mouseY - blipY);
        if (d < 12) {
          found = blip;
          break;
        }
      }
      this.hoveredBlip = found;
      this.canvas.style.cursor = found ? "pointer" : "crosshair";
    });

    this.canvas.addEventListener("click", () => {
      if (this.hoveredBlip && window.AppState) {
        window.AppState.setSelectedCategory("ALL");
        window.AppState.setSearchQuery(this.hoveredBlip.name.split(" ")[0]);
        const searchInput = document.getElementById("global-search-input");
        if (searchInput) searchInput.value = this.hoveredBlip.name.split(" ")[0];
        window.SentinelApp && window.SentinelApp.showToast(`Radar locked onto signal: ${this.hoveredBlip.name}`, "info");
      }
    });
  }

  startAnimation() {
    const render = () => {
      this.draw();
      this.angle = (this.angle + this.sweepSpeed) % (Math.PI * 2);
      this.animationFrameId = requestAnimationFrame(render);
    };
    render();
  }

  draw() {
    const ctx = this.ctx;
    const { x: cx, y: cy } = this.center;
    const r = this.radius;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Radar Circular Background
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(7, 14, 28, 0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Concentric Distance Rings
    const ringSteps = [0.25, 0.5, 0.75, 1.0];
    ringSteps.forEach(step => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * step, 0, Math.PI * 2);
      ctx.strokeStyle = step === 1.0 ? "rgba(6, 182, 212, 0.5)" : "rgba(6, 182, 212, 0.15)";
      ctx.lineWidth = 1;
      if (step < 1.0) ctx.setLineDash([3, 4]);
      else ctx.setLineDash([]);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // 3. Coordinate Crosshairs (N/S, E/W)
    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 4. Bearing angle indicators
    ctx.fillStyle = "rgba(6, 182, 212, 0.6)";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("000°", cx, cy - r + 13);
    ctx.fillText("090°", cx + r - 12, cy + 3);
    ctx.fillText("180°", cx, cy + r - 4);
    ctx.fillText("270°", cx - r + 12, cy + 3);

    // 5. Sweeping Radar Beam with Gradient Arc Trail
    const sweepTrail = 0.55; // Angle of the fading beam trail
    const trailSegments = 24;
    for (let i = 0; i < trailSegments; i++) {
      const startA = this.angle - (sweepTrail * (i + 1) / trailSegments);
      const endA = this.angle - (sweepTrail * i / trailSegments);
      const alpha = (1 - (i / trailSegments)) * 0.18;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startA, endA);
      ctx.closePath();
      ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
      ctx.fill();
    }

    // Leading bright sweep line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(this.angle) * r, cy + Math.sin(this.angle) * r);
    ctx.strokeStyle = "#22D3EE";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 6. Draw Signal Blips
    this.blips.forEach(blip => {
      const bx = cx + Math.cos(blip.angle) * blip.dist;
      const by = cy + Math.sin(blip.angle) * blip.dist;

      // Check if sweep line just touched blip
      let diffAngle = this.angle - blip.angle;
      while (diffAngle < 0) diffAngle += Math.PI * 2;
      while (diffAngle > Math.PI * 2) diffAngle -= Math.PI * 2;

      if (diffAngle < 0.2) {
        blip.intensity = 1.0;
      } else {
        blip.intensity = Math.max(0.2, blip.intensity - 0.012);
      }

      // Blip outer pulse ring
      if (blip.intensity > 0.4) {
        ctx.beginPath();
        ctx.arc(bx, by, blip.size + (1 - blip.intensity) * 14, 0, Math.PI * 2);
        ctx.strokeStyle = blip.color;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Blip core
      ctx.beginPath();
      ctx.arc(bx, by, blip.size, 0, Math.PI * 2);
      ctx.fillStyle = blip.color;
      ctx.shadowColor = blip.color;
      ctx.shadowBlur = 10 * blip.intensity;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label on hover or peak pulse
      const isHovered = (this.hoveredBlip && this.hoveredBlip.id === blip.id);
      if (isHovered || blip.intensity > 0.7) {
        ctx.fillStyle = isHovered ? "#FFFFFF" : blip.color;
        ctx.font = "10px 'Inter', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(blip.name.split(" ")[0], bx + 8, by - 4);
      }
    });

    // 7. Center Hub Ping
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#06B6D4";
    ctx.fill();
  }
}

window.SentinelRadar = SentinelRadar;
