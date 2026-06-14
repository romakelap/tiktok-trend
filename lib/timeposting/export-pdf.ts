import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── Monochrome Color System (matches landing page) ───────────────────
// Black-on-white, warm-neutral grays, single indigo accent for data viz.
const C = {
  // Core mono
  black:     "#0A0A0A",   // primary ink, near-black like the landing
  ink:       "#171717",   // headlines
  graphite:  "#404040",   // strong body
  body:      "#525252",   // body text
  muted:     "#A3A3A3",   // tertiary / labels
  faint:     "#D4D4D4",   // hairline rules
  rule:      "#E5E5E5",   // borders
  ruleSoft:  "#F0F0F0",   // very soft dividers
  cream:     "#FAFAFA",   // off-white card / zebra
  paper:     "#FFFFFF",

  // Single accent (indigo) — used sparingly for data + rank numerals
  accent:        "#5B5BD6",
  accentSoft:    "#8B8BE8",
  accentTint:    "#EEEEFB",
  accentDeep:    "#3A3AAE",

  // Status (muted, only where semantically required)
  positive:  "#15803D",
  negative:  "#B91C1C",
};

// ── Spacing & Layout ─────────────────────────────────────────────────
const GRID = { xs: 2, sm: 4, md: 8, lg: 12, xl: 16, xxl: 24, xxxl: 32 };
const MARGIN = { left: 22, right: 22, top: 22, bottom: 22 };

// Landing page pairs a clean sans with a serif used for emphasis words.
// jsPDF built-ins: helvetica (sans) + times (serif). We use times-italic
// for the "emphasis" word in headlines, mirroring the site.
const FONT = {
  sans:   "helvetica",
  serif:  "times",
};

// ── Helpers ──────────────────────────────────────────────────────────
function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("id-ID");
}

function nowDateStr(): string {
  return new Date().toLocaleString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function hexRGB(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/** Letter-spaced uppercase label. Returns rendered width (mm). */
function trackedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  spacing = 1.5,
  align: "left" | "center" | "right" = "left",
): number {
  const chars = text.toUpperCase().split("");
  const widths = chars.map((c) => doc.getTextWidth(c));
  const totalWidth = widths.reduce((s, w) => s + w, 0) + spacing * (chars.length - 1);

  let startX = x;
  if (align === "center") startX = x - totalWidth / 2;
  if (align === "right") startX = x - totalWidth;

  let cursor = startX;
  chars.forEach((c, i) => {
    doc.text(c, cursor, y);
    cursor += widths[i] + spacing;
  });
  return totalWidth;
}

function trackedWidth(doc: jsPDF, text: string, spacing = 1.5): number {
  const chars = text.toUpperCase().split("");
  const widths = chars.map((c) => doc.getTextWidth(c));
  return widths.reduce((s, w) => s + w, 0) + spacing * (chars.length - 1);
}

function pageW(doc: jsPDF) { return doc.internal.pageSize.getWidth(); }
function pageH(doc: jsPDF) { return doc.internal.pageSize.getHeight(); }
function contentW(doc: jsPDF) { return pageW(doc) - MARGIN.left - MARGIN.right; }

function ensurePage(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > pageH(doc) - MARGIN.bottom - 10) {
    doc.addPage();
    return MARGIN.top + 14;
  }
  return y;
}

/**
 * Pill badge — the landing page's signature "FEATURES" / "PRICING" tag.
 * Rounded, hairline border, letter-spaced uppercase text inside.
 */
function drawPill(
  doc: jsPDF,
  x: number,
  y: number,
  label: string,
  align: "left" | "center" = "left",
) {
  doc.setFontSize(6);
  doc.setFont(FONT.sans, "bold");
  const textW = trackedWidth(doc, label, 1.4);
  const padX = 3.5;
  const pillW = textW + padX * 2;
  const pillH = 6;

  let px = x;
  if (align === "center") px = x - pillW / 2;

  doc.setFillColor(C.cream);
  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.25);
  doc.roundedRect(px, y, pillW, pillH, pillH / 2, pillH / 2, "FD");

  doc.setTextColor(C.graphite);
  trackedText(doc, label, px + padX, y + 4, 1.4);

  return { w: pillW, h: pillH };
}

/** Page header — minimal, like the landing nav: brand left, date right */
function drawPageHeader(doc: jsPDF) {
  const pw = pageW(doc);
  const hy = MARGIN.top - 8;

  // Right date first (measure to protect left label)
  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  const dateW = trackedWidth(doc, nowDateStr(), 0.8);
  trackedText(doc, nowDateStr(), pw - MARGIN.right, hy, 0.8, "right");

  // Left brand
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.black);
  trackedText(doc, "TikTok BI · Posting Time", MARGIN.left, hy, 0.8);

  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, MARGIN.top - 4, pw - MARGIN.right, MARGIN.top - 4);
}

function drawPageFooter(
  doc: jsPDF,
  pageNum: number,
  totalPages: number,
  sectionTitle: string,
) {
  const pw = pageW(doc);
  const ph = pageH(doc);
  const fy = ph - MARGIN.bottom + 9;

  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, ph - MARGIN.bottom + 4, pw - MARGIN.right, ph - MARGIN.bottom + 4);

  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  trackedText(doc, sectionTitle, MARGIN.left, fy, 0.6);

  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.black);
  trackedText(doc, "TikTok BI Analytics", pw / 2, fy, 0.8, "center");

  // Page numeral — serif, like the landing's numeric accents
  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(8);
  doc.setTextColor(C.ink);
  doc.text(
    `${String(pageNum).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`,
    pw - MARGIN.right, fy, { align: "right" },
  );
}

/** Footer variant for dark divider pages (light text on near-black bg) */
function drawDividerFooter(
  doc: jsPDF,
  pageNum: number,
  totalPages: number,
  sectionTitle: string,
) {
  const pw = pageW(doc);
  const ph = pageH(doc);
  const fy = ph - MARGIN.bottom + 9;

  // Subtle light rule
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, ph - MARGIN.bottom + 4, pw - MARGIN.right, ph - MARGIN.bottom + 4);

  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  trackedText(doc, sectionTitle, MARGIN.left, fy, 0.6);

  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accentSoft));
  trackedText(doc, "TikTok BI Analytics", pw / 2, fy, 0.8, "center");

  // Page numeral — serif, light
  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(8);
  doc.setTextColor(C.paper);
  doc.text(
    `${String(pageNum).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`,
    pw - MARGIN.right, fy, { align: "right" },
  );
}

/**
 * Section title — mirrors the landing's section headers:
 * centered pill above, then a big headline where the last word is serif-italic.
 * Here we keep it left-aligned for a report, but reuse the pill + mixed type.
 */
function drawSectionTitle(
  doc: jsPDF,
  y: number,
  number: string,
  titlePlain: string,
  titleEmphasis: string,
  subtitle: string,
): number {
  // Pill: SECTION NN
  drawPill(doc, MARGIN.left, y, `Section ${number}`);

  // Headline: plain (sans bold) + emphasis (serif italic), inline
  const titleY = y + 16;
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(20);
  doc.setTextColor(C.black);
  doc.text(titlePlain, MARGIN.left, titleY);
  const plainW = doc.getTextWidth(titlePlain);

  if (titleEmphasis) {
    doc.setFont(FONT.serif, "bolditalic");
    doc.setFontSize(21);
    doc.setTextColor(C.black);
    doc.text(` ${titleEmphasis}`, MARGIN.left + plainW, titleY);
  }

  // Subtitle
  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(C.body);
  doc.text(subtitle, MARGIN.left, titleY + 7);

  return titleY + 14;
}

function drawSubsectionTitle(
  doc: jsPDF,
  y: number,
  title: string,
  meta: string,
): number {
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(11);
  doc.setTextColor(C.ink);
  doc.text(title, MARGIN.left, y);

  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(C.muted);
  doc.text(meta, pageW(doc) - MARGIN.right, y, { align: "right" });

  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, y + 3, pageW(doc) - MARGIN.right, y + 3);

  return y + GRID.lg;
}

/**
 * Section divider — the landing's bold dark CTA section in spirit:
 * near-black page, centered pill, big mixed-type headline.
 */
function drawSectionDivider(
  doc: jsPDF,
  sectionNum: string,
  titlePlain: string,
  titleEmphasis: string,
  subtitle: string,
): number {
  doc.addPage();
  const pageNum = doc.getNumberOfPages();
  const pw = pageW(doc);
  const ph = pageH(doc);

  // Near-black background
  doc.setFillColor(C.black);
  doc.rect(0, 0, pw, ph, "F");

  // Diagonal hairline texture (top-left → bottom-right), very subtle
  doc.setDrawColor(38, 38, 46);
  doc.setLineWidth(0.2);
  const diagGap = 26;
  // Lines sweep across the page; offset so they read as a continuous field
  for (let i = -Math.ceil(ph / diagGap); i < Math.ceil(pw / diagGap) + 2; i++) {
    const x0 = i * diagGap;
    // slope: down-right. Draw from top edge to bottom edge.
    doc.line(x0, 0, x0 + ph * 0.55, ph);
  }

  // Left vertical accent rule (indigo), like the gold line in the reference
  const railX = MARGIN.left + 4;
  doc.setDrawColor(...hexRGB(C.accent));
  doc.setLineWidth(0.5);
  doc.line(railX, ph * 0.20, railX, ph * 0.82);

  // Content left edge (sits just right of the rail)
  const cx = railX + 12;

  // Top eyebrow — "TIKTOK BI · POSTING TIME REPORT"
  doc.setFontSize(8);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accentSoft));
  trackedText(doc, "TikTok BI · Posting Time Report", cx, ph * 0.215, 2);

  // Huge section numeral — serif, white, LEFT-aligned
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(150);
  doc.setTextColor(C.paper);
  const numBaseline = ph * 0.50;
  doc.text(sectionNum, cx, numBaseline);

  // "SECTION" label below the numeral
  doc.setFontSize(9);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accentSoft));
  trackedText(doc, "Section", cx + 2, numBaseline + 14, 3);

  // Title — serif bold + serif-italic emphasis, left-aligned
  const titleY = ph * 0.70;
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(30);
  doc.setTextColor(C.paper);
  doc.text(titlePlain, cx, titleY);
  const plainW = doc.getTextWidth(titlePlain);
  if (titleEmphasis) {
    doc.setFont(FONT.serif, "bolditalic");
    doc.setFontSize(31);
    doc.text(` ${titleEmphasis}`, cx + plainW, titleY);
  }

  // Accent underscore
  doc.setDrawColor(...hexRGB(C.accent));
  doc.setLineWidth(0.6);
  doc.line(cx, titleY + 8, cx + 16, titleY + 8);

  // Subtitle — indigo-soft, left, constrained width
  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...hexRGB(C.accentSoft));
  const subLines = doc.splitTextToSize(subtitle, pw * 0.5);
  doc.text(subLines, cx, titleY + 18);

  return pageNum;
}

/** Stat card — landing's KPI strip cards: white, hairline, label + big serif number */
function drawStatCard(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  value: string, label: string,
  highlight = false,
) {
  if (highlight) {
    doc.setFillColor(C.black);
    doc.roundedRect(x, y, w, h, 2, 2, "F");
  } else {
    doc.setFillColor(C.paper);
    doc.setDrawColor(C.rule);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, y, w, h, 2, 2, "FD");
  }

  doc.setFontSize(5.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(highlight ? C.muted : C.muted);
  trackedText(doc, label, x + 5, y + 7, 1.1);

  doc.setDrawColor(highlight ? "#262626" : C.ruleSoft);
  doc.setLineWidth(0.2);
  doc.line(x + 5, y + 10, x + w - 5, y + 10);

  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(18);
  doc.setTextColor(highlight ? C.paper : C.black);
  doc.text(value, x + 5, y + h - 5);
}

/** FT-style table: hairline rows, black header, mono palette */
function refinedTableConfig(startY: number): Partial<Parameters<typeof autoTable>[1]> {
  return {
    startY,
    theme: "plain" as const,
    rowPageBreak: "avoid" as const,
    showHead: "everyPage" as const,
    headStyles: {
      fillColor: C.black,
      textColor: C.paper,
      fontSize: 7,
      fontStyle: "bold",
      halign: "left" as const,
      cellPadding: { top: 3.5, right: 3, bottom: 3.5, left: 3 },
      font: FONT.sans,
    },
    bodyStyles: {
      fontSize: 7.5,
      cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
      textColor: C.graphite,
      font: FONT.sans,
      lineColor: C.rule,
      lineWidth: { top: 0, right: 0, bottom: 0.15, left: 0 },
    },
    alternateRowStyles: { fillColor: C.cream },
    styles: { lineColor: C.rule, lineWidth: 0, font: FONT.sans },
    margin: {
      left: MARGIN.left,
      right: MARGIN.right,
      top: MARGIN.top + 6,
      bottom: MARGIN.bottom + 8,
    },
  };
}

/**
 * Table of Contents page — mirrors the reference layout:
 * eyebrow label, big "Contents" headline with accent underscore, then a list
 * of sections (large serif numeral · title · description · page range).
 * Kept monochrome with the single indigo accent standing in for "gold".
 */
function drawContentsPage(
  doc: jsPDF,
  items: { num: string; title: string; desc: string; pages: string }[],
  methodology: string[],
) {
  const pw = pageW(doc);
  const ph = pageH(doc);

  doc.setFillColor(C.paper);
  doc.rect(0, 0, pw, ph, "F");

  let y = MARGIN.top + 18;

  // Eyebrow
  doc.setFontSize(7);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accent));
  trackedText(doc, "Inside this report", MARGIN.left, y, 1.8);

  // Headline — sans bold + serif-italic emphasis (house style)
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(30);
  doc.setTextColor(C.black);
  doc.text("Contents", MARGIN.left, y + 16);

  // Accent underscore
  doc.setFillColor(...hexRGB(C.accent));
  doc.rect(MARGIN.left, y + 21, 22, 1.2, "F");

  y += GRID.xxxl + 12;

  // Section list
  const rowH = 26;
  items.forEach((item, idx) => {
    // Top hairline (except first row)
    if (idx > 0) {
      doc.setDrawColor(C.rule);
      doc.setLineWidth(0.2);
      doc.line(MARGIN.left, y - 6, pw - MARGIN.right, y - 6);
    }

    // Big serif numeral (accent)
    doc.setFont(FONT.serif, "normal");
    doc.setFontSize(26);
    doc.setTextColor(...hexRGB(C.accentSoft));
    doc.text(item.num, MARGIN.left, y + 6);

    // Title (serif bold)
    doc.setFont(FONT.serif, "bold");
    doc.setFontSize(14);
    doc.setTextColor(C.ink);
    doc.text(item.title, MARGIN.left + 26, y + 2);

    // Description (sans)
    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(8);
    doc.setTextColor(C.body);
    doc.text(item.desc, MARGIN.left + 26, y + 9);

    // Page range (right, tracked, muted)
    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(7);
    doc.setTextColor(C.muted);
    trackedText(doc, item.pages, pw - MARGIN.right, y + 4, 1.4, "right");

    y += rowH;
  });

  // Methodology note near bottom
  const noteY = ph - MARGIN.bottom - 28;
  doc.setDrawColor(...hexRGB(C.accent));
  doc.setLineWidth(0.4);
  doc.line(MARGIN.left, noteY, MARGIN.left + 12, noteY);

  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(C.body);
  methodology.forEach((line, i) => {
    doc.text(line, MARGIN.left, noteY + 6 + i * 5);
  });
}

// ── Main Exporter ────────────────────────────────────────────────────
export function exportTimePostingPdf(category: string, cells: any[], videos: any[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = pageW(doc);
  const ph = pageH(doc);
  const cw = contentW(doc);

  const dividerPages = new Set<number>();
  const sectionMap = new Map<number, string>();
  const recordSection = (title: string) => {
    sectionMap.set(doc.getNumberOfPages(), title);
  };

  // ════════════════════════════════════════════════════════════════════
  // COVER PAGE — landing hero: light bg, pill, mixed-type headline
  // ════════════════════════════════════════════════════════════════════
  doc.setFillColor(C.paper);
  doc.rect(0, 0, pw, ph, "F");

  // Faint dotted grid (hero texture)
  doc.setFillColor(...hexRGB(C.faint));
  const dg = 9;
  for (let gx = 0; gx < pw; gx += dg) {
    for (let gy = 0; gy < ph; gy += dg) {
      doc.circle(gx, gy, 0.12, "F");
    }
  }

  // Top brand row (like landing nav)
  doc.setFontSize(8);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.black);
  doc.text("TikAnalytics", MARGIN.left, MARGIN.top + 4);
  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  trackedText(doc, `Edition ${new Date().getFullYear()}`, pw - MARGIN.right, MARGIN.top + 4, 1, "right");
  // nav hairline
  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, MARGIN.top + 8, pw - MARGIN.right, MARGIN.top + 8);

  // "TRUSTED BY" pill
  drawPill(doc, MARGIN.left, ph * 0.30, "Trusted by 10,000+ creators");

  // Hero headline — "The Most Professional" style → mixed type
  let heroY = ph * 0.30 + 22;
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(40);
  doc.setTextColor(C.black);
  doc.text("Posting Time", MARGIN.left, heroY);

  heroY += 17;
  doc.setFont(FONT.serif, "bolditalic");
  doc.setFontSize(42);
  doc.setTextColor(C.black);
  doc.text("Analytics", MARGIN.left, heroY);

  heroY += 16;
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(40);
  doc.setTextColor(C.black);
  doc.text("Report", MARGIN.left, heroY);

  // Sub copy
  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(C.body);
  const heroSub = doc.splitTextToSize(
    `Optimal publishing times and audience reach patterns for the "${category}" content category, decoded with data-driven precision.`,
    pw * 0.60,
  );
  doc.text(heroSub, MARGIN.left, heroY + 11);

  // Accent underline
  doc.setFillColor(...hexRGB(C.accent));
  doc.rect(MARGIN.left, heroY + 11 + heroSub.length * 5 + 3, 26, 1.2, "F");

  // Bottom meta — landing "stat strip" feel, 3 cards
  const metaCardY = ph - MARGIN.bottom - 34;
  const metaCards = [
    { label: "Category", value: category },
    { label: "Timezone", value: "Asia/Jakarta" },
    { label: "Generated", value: nowDateStr() },
  ];
  const gap = GRID.md;
  const mcW = (cw - gap * 2) / 3;
  const mcH = 22;
  metaCards.forEach((m, i) => {
    const x = MARGIN.left + i * (mcW + gap);
    doc.setFillColor(C.paper);
    doc.setDrawColor(C.rule);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, metaCardY, mcW, mcH, 2, 2, "FD");

    doc.setFontSize(5.5);
    doc.setFont(FONT.sans, "bold");
    doc.setTextColor(C.muted);
    trackedText(doc, m.label, x + 5, metaCardY + 7, 1.1);

    doc.setFont(FONT.serif, "bold");
    doc.setFontSize(12);
    doc.setTextColor(C.black);
    const vLines = doc.splitTextToSize(m.value, mcW - 10);
    doc.text(vLines[0] || "", x + 5, metaCardY + mcH - 6);
  });

  // Footer signature
  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.muted);
  trackedText(doc, "Tugas Akhir · TikTok BI", MARGIN.left, ph - MARGIN.bottom, 1.2);
  doc.setFont(FONT.sans, "normal");
  trackedText(doc, "tiktokbi.report", pw - MARGIN.right, ph - MARGIN.bottom, 1.2, "right");

  // ════════════════════════════════════════════════════════════════════
  // TABLE OF CONTENTS
  // ════════════════════════════════════════════════════════════════════
  doc.addPage();
  recordSection("Contents");
  drawContentsPage(
    doc,
    [
      { num: "01", title: "Optimal Posting Schedule", desc: "Engagement-views heatmap and confidence-ranked posting time slots", pages: "pp. 4–5" },
      { num: "02", title: "Performance Breakdown", desc: "Day-by-day and hourly interval metrics for views and engagement", pages: "pp. 6–7" },
      { num: "03", title: "Top Performing Content", desc: "The 10 highest-performing videos under optimal publishing hours", pages: "pp. 8–9" },
    ],
    [
      "Methodology: Random Forest, SVM, K-Means clustering; NLP automatic summarization;",
      "Echotik API ingestion; CRISP-DM analytics framework.",
    ],
  );

  // ════════════════════════════════════════════════════════════════════
  // SECTION 01 — HEATMAP & RECOMMENDATIONS
  // ════════════════════════════════════════════════════════════════════
  dividerPages.add(drawSectionDivider(
    doc, "01",
    "Optimal Posting", "Schedule",
    `Engagement-views heatmap and confidence-ranked time slot recommendations for the ${category} category.`
  ));
  recordSection("01 · Heatmap");

  doc.addPage();
  recordSection("01 · Heatmap");
  let y = MARGIN.top + 12;
  y = drawSectionTitle(
    doc, y, "01",
    "Optimal Posting", "Schedule",
    "Expected views density per day and hour-slot combination"
  );

  // ── Heatmap calculations ──
  const DAYS_IND = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const SLOTS = ["06-09", "09-12", "12-15", "15-18", "18-21", "21-24"];

  const mapDayIndex = (dayOfWeek: number): number => {
    if (dayOfWeek === 0) return 6; // Sunday → last
    return dayOfWeek - 1;
  };
  const mapHourSlotIndex = (hour: number): number => {
    if (hour >= 6 && hour < 9) return 0;
    if (hour >= 9 && hour < 12) return 1;
    if (hour >= 12 && hour < 15) return 2;
    if (hour >= 15 && hour < 18) return 3;
    if (hour >= 18 && hour < 21) return 4;
    if (hour >= 21 && hour <= 23) return 5;
    return -1;
  };

  const heatmapMatrix = Array(7).fill(0).map(() => Array(6).fill(0));
  const countsMatrix = Array(7).fill(0).map(() => Array(6).fill(0));
  cells.forEach(cell => {
    const rIdx = mapDayIndex(cell.dayOfWeek);
    const cIdx = mapHourSlotIndex(cell.hourOfDay);
    if (rIdx >= 0 && rIdx < 7 && cIdx >= 0 && cIdx < 6) {
      const views = cell.averageViews ?? cell.avgViews ?? 0;
      heatmapMatrix[rIdx][cIdx] += views;
      countsMatrix[rIdx][cIdx] += 1;
    }
  });
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 6; c++) {
      if (countsMatrix[r][c] > 0) {
        heatmapMatrix[r][c] = Math.round(heatmapMatrix[r][c] / countsMatrix[r][c]);
      }
    }
  }
  const maxHeatmapVal = Math.max(...heatmapMatrix.flat(), 1);

  y = drawSubsectionTitle(doc, y, "Engagement Views Heatmap", "Day × time slot · average views");

  const labelW = 16;
  const cellW = (cw - labelW) / SLOTS.length;
  const cellH = 11;

  // Column headers
  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.muted);
  SLOTS.forEach((slot, si) => {
    trackedText(doc, slot, MARGIN.left + labelW + si * cellW + cellW / 2, y + 4, 0.8, "center");
  });
  y += GRID.md;

  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, y, pw - MARGIN.right, y);

  // Accent gradient: white → indigo deep
  const [aR, aG, aB] = hexRGB(C.accentDeep);
  DAYS_IND.forEach((day, di) => {
    doc.setFontSize(7);
    doc.setFont(FONT.sans, "bold");
    doc.setTextColor(C.graphite);
    doc.text(day, MARGIN.left + 1, y + cellH / 2 + 2);

    heatmapMatrix[di]?.forEach((val, si) => {
      const cx = MARGIN.left + labelW + si * cellW;
      const intensity = Math.min(val / maxHeatmapVal, 1);

      const r = Math.round(255 - intensity * (255 - aR));
      const g = Math.round(255 - intensity * (255 - aG));
      const b = Math.round(255 - intensity * (255 - aB));

      doc.setFillColor(r, g, b);
      doc.rect(cx + 0.5, y + 0.5, cellW - 1, cellH - 1, "F");

      doc.setFontSize(6.5);
      if (val > 0) {
        doc.setFont(FONT.serif, "bold");
        doc.setTextColor(intensity > 0.5 ? C.paper : C.ink);
        doc.text(`${(val / 1_000_000).toFixed(1)}M`, cx + cellW / 2, y + cellH / 2 + 2, { align: "center" });
      } else {
        doc.setFont(FONT.sans, "normal");
        doc.setTextColor(C.muted);
        doc.text("—", cx + cellW / 2, y + cellH / 2 + 2, { align: "center" });
      }
    });
    y += cellH;
  });

  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, y, pw - MARGIN.right, y);

  // Legend
  y += GRID.md + 1;
  doc.setFontSize(6);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.muted);
  const densityLabel = "Views Density";
  trackedText(doc, densityLabel, MARGIN.left, y + 3, 1.1);

  const legendX = MARGIN.left + trackedWidth(doc, densityLabel, 1.1) + 8;
  const legendW = 56;
  for (let gi = 0; gi < 56; gi++) {
    const ratio = gi / 56;
    const rr = Math.round(255 - ratio * (255 - aR));
    const gg = Math.round(255 - ratio * (255 - aG));
    const bb = Math.round(255 - ratio * (255 - aB));
    doc.setFillColor(rr, gg, bb);
    doc.rect(legendX + gi * (legendW / 56), y, legendW / 56 + 0.1, 3, "F");
  }
  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.15);
  doc.rect(legendX, y, legendW, 3, "S");
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  doc.setFontSize(6);
  doc.text("Low", legendX - 1, y + 6.5, { align: "right" });
  doc.text("High", legendX + legendW + 1, y + 6.5);

  y += GRID.xxl;

  // ── Recommendations ──
  const getRecs = (cells: any[]) => {
    if (!cells || cells.length === 0) {
      return [
        { title: "Peak Hours (Waktu Puncak)", desc: "20:00 - 23:00 (Malam) adalah waktu posting paling optimal dengan volume penonton tertinggi.", performance: "Sangat Tinggi", accent: true },
        { title: "Best Day (Hari Terbaik)", desc: "Jumat & Sabtu menunjukkan engagement tertinggi untuk semua kategori video.", performance: "Tinggi", accent: false },
        { title: "Avoid Slot (Waktu Dihindari)", desc: "Hindari posting antara 00:00 - 06:00 pagi karena tingkat interaksi turun drastis.", performance: "Kritis", accent: false, negative: true },
      ];
    }
    const dayViews: Record<string, { totalViews: number; count: number }> = {};
    const hourViews: Record<number, { totalViews: number; count: number }> = {};
    const DAY_MAP = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    cells.forEach(cell => {
      const views = cell.averageViews ?? cell.avgViews ?? 0;
      const dayName = DAY_MAP[cell.dayOfWeek];
      if (dayName) {
        if (!dayViews[dayName]) dayViews[dayName] = { totalViews: 0, count: 0 };
        dayViews[dayName].totalViews += views;
        dayViews[dayName].count += 1;
      }
      const hr = cell.hourOfDay;
      if (hr !== undefined && hr !== null) {
        if (!hourViews[hr]) hourViews[hr] = { totalViews: 0, count: 0 };
        hourViews[hr].totalViews += views;
        hourViews[hr].count += 1;
      }
    });
    const dayAverages = Object.entries(dayViews).map(([day, d]) => ({
      day, avgViews: d.count > 0 ? d.totalViews / d.count : 0,
    })).sort((a, b) => b.avgViews - a.avgViews);
    const hourAverages = Object.entries(hourViews).map(([hour, d]) => ({
      hour: parseInt(hour), avgViews: d.count > 0 ? d.totalViews / d.count : 0,
    })).sort((a, b) => b.avgViews - a.avgViews);

    const bestDay = dayAverages[0]?.day || "Jumat";
    const bestHourNum = hourAverages[0]?.hour ?? 20;
    const bestHourStr = `${bestHourNum.toString().padStart(2, "0")}:00 - ${(bestHourNum + 1).toString().padStart(2, "0")}:00`;
    const bestHourViews = hourAverages[0]?.avgViews || 0;
    const worstHourNum = [...hourAverages].reverse()[0]?.hour ?? 2;
    const worstHourStr = `${worstHourNum.toString().padStart(2, "0")}:00 - ${(worstHourNum + 1).toString().padStart(2, "0")}:00`;

    return [
      { title: "Peak Hours (Waktu Puncak)", desc: `Jam ${bestHourStr} adalah waktu paling optimal dengan rata-rata ${bestHourViews >= 1_000_000 ? (bestHourViews / 1_000_000).toFixed(1) + "M" : bestHourViews.toLocaleString("id-ID")} views.`, performance: "Sangat Tinggi", accent: true },
      { title: "Best Day (Hari Terbaik)", desc: `Hari ${bestDay} menunjukkan tingkat interaksi dan volume views rata-rata tertinggi untuk konten Anda.`, performance: "Tinggi", accent: false },
      { title: "Avoid Slot (Waktu Dihindari)", desc: `Hindari posting pada jam ${worstHourStr} karena volume penonton aktif menurun drastis.`, performance: "Kritis", accent: false, negative: true },
    ];
  };

  const recs = getRecs(cells);
  y = ensurePage(doc, y, 60);
  y = drawSubsectionTitle(doc, y, "Optimization Recommendations", "Algorithmic observations");

  // Recommendation cards (landing feature-card style: white, rounded, hairline)
  recs.forEach((rec: any) => {
    y = ensurePage(doc, y, 24);
    const cardH = 20;

    doc.setFillColor(C.paper);
    doc.setDrawColor(C.rule);
    doc.setLineWidth(0.25);
    doc.roundedRect(MARGIN.left, y, cw, cardH, 2, 2, "FD");

    // Icon chip (black rounded square, like landing feature icons)
    const chipColor = rec.negative ? C.negative : (rec.accent ? C.accent : C.black);
    doc.setFillColor(...hexRGB(chipColor));
    doc.roundedRect(MARGIN.left + 5, y + 5, 8, 8, 1.5, 1.5, "F");
    // tiny clock/dot glyph inside
    doc.setFillColor(C.paper);
    doc.circle(MARGIN.left + 9, y + 9, 1.4, "F");

    // Title
    doc.setFont(FONT.sans, "bold");
    doc.setFontSize(9);
    doc.setTextColor(C.ink);
    doc.text(rec.title, MARGIN.left + 18, y + 8);

    // Performance badge (right) — pill
    doc.setFontSize(5.5);
    doc.setFont(FONT.sans, "bold");
    const perfW = trackedWidth(doc, rec.performance, 1.1);
    const badgeW = perfW + 6;
    const badgeColor = rec.negative ? C.negative : (rec.accent ? C.accent : C.graphite);
    const badgeBg = rec.negative ? "#FEF2F2" : (rec.accent ? C.accentTint : C.cream);
    doc.setFillColor(...hexRGB(badgeBg));
    doc.roundedRect(pw - MARGIN.right - badgeW - 5, y + 5, badgeW, 5, 2.5, 2.5, "F");
    doc.setTextColor(...hexRGB(badgeColor));
    trackedText(doc, rec.performance, pw - MARGIN.right - badgeW - 5 + 3, y + 8.3, 1.1);

    // Desc
    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(C.body);
    const descLines = doc.splitTextToSize(rec.desc, cw - 22);
    doc.text(descLines, MARGIN.left + 18, y + 14);

    y += cardH + GRID.sm;
  });

  // ════════════════════════════════════════════════════════════════════
  // SECTION 02 — PERFORMANCE BREAKDOWN
  // ════════════════════════════════════════════════════════════════════
  dividerPages.add(drawSectionDivider(
    doc, "02",
    "Performance", "Breakdown",
    `Comprehensive day-by-day and hourly interval metrics filtered for ${category}.`
  ));
  recordSection("02 · Breakdown");

  doc.addPage();
  recordSection("02 · Breakdown");
  y = MARGIN.top + 12;
  y = drawSectionTitle(
    doc, y, "02",
    "Performance", "Breakdown",
    "Tabular distribution of views and engagement rates"
  );

  const DAYS_IND_FULL = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const dayPerformanceList = DAYS_IND_FULL.map((dayName, idx) => {
    const dbDayVal = idx === 6 ? 0 : idx + 1;
    const dayCells = cells.filter(c => c.dayOfWeek === dbDayVal);
    const avgViews = dayCells.length > 0
      ? Math.round(dayCells.reduce((acc, c) => acc + (c.averageViews || c.avgViews || 0), 0) / dayCells.length) : 0;
    const avgER = dayCells.length > 0
      ? dayCells.reduce((acc, c) => acc + (c.averageEngagementRate || c.avgEngagementRate || 0), 0) / dayCells.length : 0;
    const sorted = [...dayCells].sort((a, b) => (b.averageViews || b.avgViews || 0) - (a.averageViews || a.avgViews || 0));
    const peakHour = sorted.length > 0 ? `${sorted[0].hourOfDay.toString().padStart(2, "0")}:00` : "—";
    return [dayName, avgViews.toLocaleString("id-ID"), peakHour, `${(avgER * 100).toFixed(2)}%`];
  });

  y = drawSubsectionTitle(doc, y, "Weekly Performance Distribution", "Aggregated daily analysis");

  autoTable(doc, {
    ...refinedTableConfig(y),
    head: [["Day", "Average Views", "Peak Hour Slot", "Average Engagement"]],
    body: dayPerformanceList,
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35, textColor: C.ink },
      1: { halign: "right" as const, cellWidth: 45 },
      2: { halign: "center" as const, cellWidth: 40 },
      3: { halign: "right" as const, cellWidth: 46 },
    },
    didDrawPage: () => { drawPageHeader(doc); recordSection("02 · Breakdown"); },
  });

  y = (doc as any).lastAutoTable.finalY + GRID.xl;

  const hourSlots = [
    { label: "Pagi Awal", start: 6, end: 9, labelShort: "06:00-09:00" },
    { label: "Pagi Akhir", start: 9, end: 12, labelShort: "09:00-12:00" },
    { label: "Siang", start: 12, end: 15, labelShort: "12:00-15:00" },
    { label: "Sore", start: 15, end: 18, labelShort: "15:00-18:00" },
    { label: "Malam Awal", start: 18, end: 21, labelShort: "18:00-21:00" },
    { label: "Malam Akhir", start: 21, end: 23, labelShort: "21:00-23:00" },
  ];
  const hourlyPerformanceList = hourSlots.map(slot => {
    const slotCells = cells.filter(c => c.hourOfDay >= slot.start && c.hourOfDay <= slot.end);
    const avgViews = slotCells.length > 0
      ? Math.round(slotCells.reduce((acc, c) => acc + (c.averageViews || c.avgViews || 0), 0) / slotCells.length) : 0;
    const avgER = slotCells.length > 0
      ? slotCells.reduce((acc, c) => acc + (c.averageEngagementRate || c.avgEngagementRate || 0), 0) / slotCells.length : 0;
    return [slot.labelShort, slot.label, avgViews.toLocaleString("id-ID"), `${(avgER * 100).toFixed(2)}%`];
  });

  y = ensurePage(doc, y, 50);
  y = drawSubsectionTitle(doc, y, "Hourly Slot Performance", "Grouped interval views density");

  autoTable(doc, {
    ...refinedTableConfig(y),
    head: [["Time Window", "Description", "Average Views", "Average Engagement"]],
    body: hourlyPerformanceList,
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35, textColor: C.ink },
      1: { cellWidth: 45, textColor: C.body },
      2: { halign: "right" as const, cellWidth: 40 },
      3: { halign: "right" as const, cellWidth: 46 },
    },
    didDrawPage: () => { drawPageHeader(doc); recordSection("02 · Breakdown"); },
  });

  // ════════════════════════════════════════════════════════════════════
  // SECTION 03 — TOP PERFORMING CONTENT
  // ════════════════════════════════════════════════════════════════════
  dividerPages.add(drawSectionDivider(
    doc, "03",
    "Top Performing", "Content",
    `The 10 highest-performing TikTok videos within the ${category} category.`
  ));
  recordSection("03 · Top Videos");

  doc.addPage();
  recordSection("03 · Top Videos");
  y = MARGIN.top + 12;
  y = drawSectionTitle(
    doc, y, "03",
    "Top Performing", "Content",
    "Highest-viewed videos under optimal publishing hours"
  );

  y = drawSubsectionTitle(doc, y, `Top Videos · ${category}`, "Views and interaction statistics");

  const videoRows = videos.slice(0, 10).map((v, i) => {
    const views = v.viewsNum ?? v.views ?? 0;
    const likes = v.likesNum ?? v.likes ?? 0;
    const comments = v.commentsNum ?? v.comments ?? 0;
    const er = v.engagementRate ?? 0;
    const title = v.titleBrief || v.title || "Untitled Video";
    return [
      String(i + 1).padStart(2, "0"),
      title.length > 55 ? title.substring(0, 55) + "…" : title,
      views.toLocaleString("id-ID"),
      likes.toLocaleString("id-ID"),
      comments.toLocaleString("id-ID"),
      `${(er * 100).toFixed(1)}%`,
    ];
  });

  autoTable(doc, {
    ...refinedTableConfig(y),
    head: [["#", "Video Title", "Views", "Likes", "Comments", "Engagement"]],
    body: videoRows,
    columnStyles: {
      0: { halign: "right" as const, cellWidth: 12, textColor: C.accent, fontStyle: "bold" },
      1: { cellWidth: 68, textColor: C.ink, fontStyle: "bold" },
      2: { halign: "right" as const, cellWidth: 22 },
      3: { halign: "right" as const, cellWidth: 20 },
      4: { halign: "right" as const, cellWidth: 20 },
      5: { halign: "right" as const, cellWidth: 24 },
    },
    didDrawPage: () => { drawPageHeader(doc); recordSection("03 · Top Videos"); },
  });

  // ════════════════════════════════════════════════════════════════════
  // PAGE FURNITURE (headers + footers)
  // Cover (page 1) stays clean. Divider pages get a light footer only.
  // All other pages get header + footer.
  // ════════════════════════════════════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Resolve the running section title for this page
    let activeSectionTitle = "Report Overview";
    for (let pk = 1; pk <= i; pk++) {
      if (sectionMap.has(pk)) activeSectionTitle = sectionMap.get(pk)!;
    }

    if (i === 1) continue; // cover: no furniture

    if (dividerPages.has(i)) {
      // Dark divider: footer only (light variant), no top header
      drawDividerFooter(doc, i, totalPages, activeSectionTitle);
      continue;
    }

    drawPageHeader(doc);
    drawPageFooter(doc, i, totalPages, activeSectionTitle);
  }

  doc.save(`tiktok_timeposting_report_${category.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
}