/**
 * Account Comparison PDF Export — matches the monochrome landing-page design
 * system (same as timePostingExport.ts).
 *
 *   - Black on white, warm-neutral grays, single indigo accent
 *   - Sans bold + serif-italic emphasis for mixed-type headlines
 *   - Pill badges, dotted-grid cover, diagonal-lined dark dividers
 *   - Editorial Contents page, FT-style hairline tables
 *   - Running footer with section title + serif page numerals
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Account } from "./api";

// ── Monochrome Color System (identical to timePostingExport) ─────────
const C = {
  black:     "#0A0A0A",
  ink:       "#171717",
  graphite:  "#404040",
  body:      "#525252",
  muted:     "#A3A3A3",
  faint:     "#D4D4D4",
  rule:      "#E5E5E5",
  ruleSoft:  "#F0F0F0",
  cream:     "#FAFAFA",
  paper:     "#FFFFFF",

  accent:        "#5B5BD6",
  accentSoft:    "#8B8BE8",
  accentTint:    "#EEEEFB",
  accentDeep:    "#3A3AAE",

  positive:  "#15803D",
  negative:  "#B91C1C",
};

const GRID = { xs: 2, sm: 4, md: 8, lg: 12, xl: 16, xxl: 24, xxxl: 32 };
const MARGIN = { left: 22, right: 22, top: 22, bottom: 22 };

const FONT = {
  sans:  "helvetica",
  serif: "times",
};

// ── Helpers ──────────────────────────────────────────────────────────
function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("id-ID");
}

function nowStr(): string {
  return new Date().toLocaleString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
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

/** Pill badge — rounded hairline label */
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

function drawPageHeader(doc: jsPDF) {
  const pw = pageW(doc);
  const hy = MARGIN.top - 8;

  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  trackedText(doc, nowDateStr(), pw - MARGIN.right, hy, 0.8, "right");

  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.black);
  trackedText(doc, "TikTok BI · Account Benchmark", MARGIN.left, hy, 0.8);

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

  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(8);
  doc.setTextColor(C.ink);
  doc.text(
    `${String(pageNum).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`,
    pw - MARGIN.right, fy, { align: "right" },
  );
}

function drawDividerFooter(
  doc: jsPDF,
  pageNum: number,
  totalPages: number,
  sectionTitle: string,
) {
  const pw = pageW(doc);
  const ph = pageH(doc);
  const fy = ph - MARGIN.bottom + 9;

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

  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(8);
  doc.setTextColor(C.paper);
  doc.text(
    `${String(pageNum).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`,
    pw - MARGIN.right, fy, { align: "right" },
  );
}

function drawSectionTitle(
  doc: jsPDF,
  y: number,
  number: string,
  titlePlain: string,
  titleEmphasis: string,
  subtitle: string,
): number {
  drawPill(doc, MARGIN.left, y, `Section ${number}`);

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

/** Section divider — dark, diagonal lines, left-aligned, accent indigo */
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

  doc.setFillColor(C.black);
  doc.rect(0, 0, pw, ph, "F");

  // Diagonal hairline texture
  doc.setDrawColor(38, 38, 46);
  doc.setLineWidth(0.2);
  const diagGap = 26;
  for (let i = -Math.ceil(ph / diagGap); i < Math.ceil(pw / diagGap) + 2; i++) {
    const x0 = i * diagGap;
    doc.line(x0, 0, x0 + ph * 0.55, ph);
  }

  // Left vertical accent rule
  const railX = MARGIN.left + 4;
  doc.setDrawColor(...hexRGB(C.accent));
  doc.setLineWidth(0.5);
  doc.line(railX, ph * 0.20, railX, ph * 0.82);

  const cx = railX + 12;

  // Top eyebrow
  doc.setFontSize(8);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accentSoft));
  trackedText(doc, "TikTok BI · Account Benchmark", cx, ph * 0.215, 2);

  // Huge serif numeral (left-aligned)
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(150);
  doc.setTextColor(C.paper);
  const numBaseline = ph * 0.50;
  doc.text(sectionNum, cx, numBaseline);

  // "SECTION" label
  doc.setFontSize(9);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accentSoft));
  trackedText(doc, "Section", cx + 2, numBaseline + 14, 3);

  // Title — mixed type
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

  // Subtitle
  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...hexRGB(C.accentSoft));
  const subLines = doc.splitTextToSize(subtitle, pw * 0.5);
  doc.text(subLines, cx, titleY + 18);

  return pageNum;
}

/** Stat card — white, hairline, label + big serif number */
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
  doc.setTextColor(C.muted);
  trackedText(doc, label, x + 5, y + 7, 1.1);

  doc.setDrawColor(highlight ? "#262626" : C.ruleSoft);
  doc.setLineWidth(0.2);
  doc.line(x + 5, y + 10, x + w - 5, y + 10);

  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(18);
  doc.setTextColor(highlight ? C.paper : C.black);
  doc.text(value, x + 5, y + h - 5);
}

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

function typeMeta(type: Account["type"]): { label: string; color: string } {
  switch (type) {
    case "own":         return { label: "Own Account", color: C.black };
    case "competitor":  return { label: "Competitor", color: C.negative };
    default:            return { label: "Inspiration", color: C.accent };
  }
}

/** Paginated horizontal bar chart (overflow continues on a new page) */
function drawHorizontalBars(
  doc: jsPDF,
  startY: number,
  rows: { label: string; value: number; color: string }[],
  valueFmt: (v: number) => string,
  recordSection: (t: string) => void,
  sectionTitle: string,
): number {
  const pw = pageW(doc);
  const cw = contentW(doc);
  const chartX = MARGIN.left;
  const labelW = 42;
  const valueW = 22;
  const barAreaX = chartX + labelW;
  const barAreaW = cw - labelW - valueW;
  const rowH = 8.5;
  const barH = 5;

  const maxVal = Math.max(...rows.map(r => r.value), 0.000001);
  let y = startY;

  rows.forEach((row) => {
    if (y + rowH > pageH(doc) - MARGIN.bottom - 10) {
      doc.addPage();
      drawPageHeader(doc);
      recordSection(sectionTitle);
      y = MARGIN.top + 14;
    }

    const barLen = Math.max((row.value / maxVal) * barAreaW, 0);

    doc.setFont(FONT.sans, "bold");
    doc.setFontSize(7);
    doc.setTextColor(C.ink);
    const label = row.label.length > 20 ? row.label.substring(0, 20) + "…" : row.label;
    doc.text(label, chartX, y + barH / 2 + 1.8);

    doc.setFillColor(C.ruleSoft);
    doc.rect(barAreaX, y, barAreaW, barH, "F");

    const [r, g, b] = hexRGB(row.color);
    doc.setFillColor(r, g, b);
    doc.rect(barAreaX, y, barLen, barH, "F");

    if (barLen > 1.5) {
      doc.setFillColor(...hexRGB(C.accent));
      doc.rect(barAreaX + barLen - 1, y, 1, barH, "F");
    }

    doc.setFont(FONT.serif, "bold");
    doc.setFontSize(7);
    doc.setTextColor(C.black);
    const valueStr = valueFmt(row.value);
    let valueX = barAreaX + barLen + 2;
    const maxValueX = pw - MARGIN.right - doc.getTextWidth(valueStr);
    if (valueX > maxValueX) valueX = maxValueX;
    doc.text(valueStr, valueX, y + barH / 2 + 1.8);

    y += rowH;
  });

  return y;
}

/** Table of Contents page */
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

  doc.setFontSize(7);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accent));
  trackedText(doc, "Inside this report", MARGIN.left, y, 1.8);

  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(30);
  doc.setTextColor(C.black);
  doc.text("Contents", MARGIN.left, y + 16);

  doc.setFillColor(...hexRGB(C.accent));
  doc.rect(MARGIN.left, y + 21, 22, 1.2, "F");

  y += GRID.xxxl + 12;

  const rowH = 26;
  items.forEach((item, idx) => {
    if (idx > 0) {
      doc.setDrawColor(C.rule);
      doc.setLineWidth(0.2);
      doc.line(MARGIN.left, y - 6, pw - MARGIN.right, y - 6);
    }

    doc.setFont(FONT.serif, "normal");
    doc.setFontSize(26);
    doc.setTextColor(...hexRGB(C.accentSoft));
    doc.text(item.num, MARGIN.left, y + 6);

    doc.setFont(FONT.serif, "bold");
    doc.setFontSize(14);
    doc.setTextColor(C.ink);
    doc.text(item.title, MARGIN.left + 26, y + 2);

    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(8);
    doc.setTextColor(C.body);
    doc.text(item.desc, MARGIN.left + 26, y + 9);

    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(7);
    doc.setTextColor(C.muted);
    trackedText(doc, item.pages, pw - MARGIN.right, y + 4, 1.4, "right");

    y += rowH;
  });

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

// ═══════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════
export function exportComparisonToPDF(accounts: Account[]) {
  const doc = new jsPDF("p", "mm", "a4");
  const pw = pageW(doc);
  const ph = pageH(doc);
  const cw = contentW(doc);

  const dividerPages = new Set<number>();
  const sectionMap = new Map<number, string>();
  const recordSection = (title: string) => {
    sectionMap.set(doc.getNumberOfPages(), title);
  };

  // ════════════════════════════════════════════════════════════════════
  // COVER PAGE
  // ════════════════════════════════════════════════════════════════════
  doc.setFillColor(C.paper);
  doc.rect(0, 0, pw, ph, "F");

  // Dotted grid texture
  doc.setFillColor(...hexRGB(C.faint));
  const dg = 9;
  for (let gx = 0; gx < pw; gx += dg) {
    for (let gy = 0; gy < ph; gy += dg) {
      doc.circle(gx, gy, 0.12, "F");
    }
  }

  // Top brand row
  doc.setFontSize(8);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.black);
  doc.text("TikAnalytics", MARGIN.left, MARGIN.top + 4);
  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  trackedText(doc, `Edition ${new Date().getFullYear()}`, pw - MARGIN.right, MARGIN.top + 4, 1, "right");

  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, MARGIN.top + 8, pw - MARGIN.right, MARGIN.top + 8);

  // Pill
  drawPill(doc, MARGIN.left, ph * 0.30, "Benchmark Report · Competitive Analysis");

  // Hero headline — Account / Benchmark (serif italic) / Report
  let heroY = ph * 0.30 + 22;
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(42);
  doc.setTextColor(C.black);
  doc.text("Account", MARGIN.left, heroY);

  heroY += 17;
  doc.setFont(FONT.serif, "bolditalic");
  doc.setFontSize(44);
  doc.setTextColor(C.black);
  doc.text("Benchmark", MARGIN.left, heroY);

  heroY += 16;
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(42);
  doc.setTextColor(C.black);
  doc.text("Report", MARGIN.left, heroY);

  // Sub copy
  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(C.body);
  const heroSub = doc.splitTextToSize(
    "Perbandingan performa akun dan analisis kompetitor — pengikut, produktivitas video, interaksi rata-rata, dan pertumbuhan mingguan.",
    pw * 0.60,
  );
  doc.text(heroSub, MARGIN.left, heroY + 11);

  // Accent underline
  doc.setFillColor(...hexRGB(C.accent));
  doc.rect(MARGIN.left, heroY + 11 + heroSub.length * 5 + 3, 26, 1.2, "F");

  // Bottom meta cards
  const ownCount = accounts.filter(a => a.type === "own").length;
  const compCount = accounts.filter(a => a.type === "competitor").length;
  const inspCount = accounts.filter(a => a.type === "inspiration").length;

  const metaCardY = ph - MARGIN.bottom - 34;
  const metaCards = [
    { label: "Compared", value: `${accounts.length} accounts` },
    { label: "Own", value: String(ownCount) },
    { label: "Competitors", value: String(compCount) },
    { label: "Inspiration", value: String(inspCount) },
  ];
  const gap = GRID.sm;
  const mcW = (cw - gap * 3) / 4;
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
    doc.setFontSize(11);
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
      { num: "01", title: "Benchmark Overview", desc: "Aggregate KPIs, leaders, and a detailed comparison table across accounts", pages: "pp. 4–5" },
      { num: "02", title: "Visual Comparison", desc: "Horizontal bar charts ranking followers and engagement rate", pages: "pp. 6–7" },
    ],
    [
      "Methodology: Aggregated TikTok account metrics from internal data warehouse.",
      "Engagement = (likes + comments + shares) / views across the 12-week window.",
    ],
  );

  // ════════════════════════════════════════════════════════════════════
  // SECTION 01 — OVERVIEW + COMPARISON TABLE
  // ════════════════════════════════════════════════════════════════════
  dividerPages.add(drawSectionDivider(
    doc, "01",
    "Benchmark", "Overview",
    `Membandingkan ${accounts.length} akun · pengikut, produktivitas video, engagement, dan pertumbuhan mingguan.`,
  ));
  recordSection("01 · Benchmark Overview");

  doc.addPage();
  recordSection("01 · Benchmark Overview");
  let y = MARGIN.top + 12;
  y = drawSectionTitle(
    doc, y, "01",
    "Benchmark", "Overview",
    `${accounts.length} akun dibandingkan · pengikut, video, engagement, pertumbuhan`,
  );

  // ── Aggregate KPI cards ──
  if (accounts.length > 0) {
    const totalFollowers = accounts.reduce((s, a) => s + a.followers, 0);
    const totalVideos = accounts.reduce((s, a) => s + a.videos, 0);
    const avgEngagement = accounts.reduce((s, a) => s + a.avgEngagement, 0) / accounts.length;
    const avgGrowth = accounts.reduce((s, a) => s + a.growthPct, 0) / accounts.length;

    const topFollower = [...accounts].sort((a, b) => b.followers - a.followers)[0];
    const topEngagement = [...accounts].sort((a, b) => b.avgEngagement - a.avgEngagement)[0];

    const cgap = GRID.sm;
    const cardW = (cw - cgap * 3) / 4;
    const cardH = 26;

    const cards = [
      { value: formatNum(totalFollowers), label: "Total Followers", hl: true },
      { value: formatNum(totalVideos), label: "Total Videos", hl: false },
      { value: `${avgEngagement.toFixed(1)}%`, label: "Avg Engagement", hl: false },
      { value: `${avgGrowth >= 0 ? "+" : ""}${avgGrowth.toFixed(1)}%`, label: "Avg Growth 12w", hl: false },
    ];

    cards.forEach((c, i) => {
      drawStatCard(doc, MARGIN.left + i * (cardW + cgap), y, cardW, cardH, c.value, c.label, c.hl);
    });
    y += cardH + GRID.lg;

    // ── Leader callout (feature-card style with icon chip) ──
    const calloutH = 18;
    doc.setFillColor(C.paper);
    doc.setDrawColor(C.rule);
    doc.setLineWidth(0.25);
    doc.roundedRect(MARGIN.left, y, cw, calloutH, 2, 2, "FD");

    doc.setFillColor(...hexRGB(C.accent));
    doc.roundedRect(MARGIN.left + 5, y + 5, 8, 8, 1.5, 1.5, "F");
    doc.setFillColor(C.paper);
    doc.circle(MARGIN.left + 9, y + 9, 1.4, "F");

    doc.setFontSize(6);
    doc.setFont(FONT.sans, "bold");
    doc.setTextColor(...hexRGB(C.accent));
    trackedText(doc, "Leaders", MARGIN.left + 18, y + 6, 1.4);

    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(C.body);
    doc.text("Most followers:", MARGIN.left + 18, y + 13);
    doc.setFont(FONT.serif, "bold");
    doc.setFontSize(9);
    doc.setTextColor(C.black);
    doc.text(`@${topFollower.username} (${formatNum(topFollower.followers)})`, MARGIN.left + 44, y + 13);

    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(C.body);
    doc.text("Highest engagement:", pw / 2 + 6, y + 13);
    doc.setFont(FONT.serif, "bold");
    doc.setFontSize(9);
    doc.setTextColor(C.black);
    doc.text(`@${topEngagement.username} (${topEngagement.avgEngagement.toFixed(1)}%)`, pw / 2 + 42, y + 13);

    y += calloutH + GRID.lg;
  }

  // ── Comparison table ──
  y = drawSubsectionTitle(doc, y, "Metrik Utama", `${accounts.length} akun`);

  autoTable(doc, {
    ...refinedTableConfig(y),
    head: [["#", "Akun", "Tipe", "Followers", "Video", "Eng %", "Avg Views", "Growth 12w"]],
    body: accounts.map((acc, idx) => [
      String(idx + 1).padStart(2, "0"),
      `@${acc.username}\n${acc.displayName}`,
      typeMeta(acc.type).label,
      formatNum(acc.followers),
      acc.videos.toLocaleString("id-ID"),
      `${acc.avgEngagement.toFixed(1)}%`,
      formatNum(acc.avgViews),
      `${acc.growthPct >= 0 ? "+" : ""}${acc.growthPct.toFixed(1)}%`,
    ]),
    columnStyles: {
      0: { halign: "right" as const, cellWidth: 9, textColor: C.accent, fontStyle: "bold" },
      1: { cellWidth: 42, fontStyle: "bold", textColor: C.ink },
      2: { cellWidth: 24, textColor: C.body },
      3: { halign: "right" as const, cellWidth: 20 },
      4: { halign: "right" as const, cellWidth: 16 },
      5: { halign: "right" as const, cellWidth: 14 },
      6: { halign: "right" as const, cellWidth: 20 },
      7: { halign: "right" as const, cellWidth: 20 },
    },
    didDrawPage: () => {
      drawPageHeader(doc);
      recordSection("01 · Benchmark Overview");
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 7) {
        const raw = String(data.cell.raw);
        data.cell.styles.textColor = raw.startsWith("-") ? C.negative : C.positive;
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + GRID.lg;

  // ── Type legend ──
  if (y > ph - MARGIN.bottom - 14) {
    doc.addPage();
    drawPageHeader(doc);
    recordSection("01 · Benchmark Overview");
    y = MARGIN.top + 14;
  }
  const legendItems = [
    { label: "Own Account", color: C.black },
    { label: "Competitor", color: C.negative },
    { label: "Inspiration", color: C.accent },
  ];
  let legX = MARGIN.left;
  doc.setFontSize(6);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.muted);
  trackedText(doc, "Type", legX, y + 3, 1.2);
  legX += 12;
  legendItems.forEach((item) => {
    const [r, g, b] = hexRGB(item.color);
    doc.setFillColor(r, g, b);
    doc.rect(legX, y, 3, 3, "F");
    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(7);
    doc.setTextColor(C.ink);
    doc.text(item.label, legX + 5, y + 2.5);
    legX += doc.getTextWidth(item.label) + 14;
  });

  // ════════════════════════════════════════════════════════════════════
  // SECTION 02 — VISUAL COMPARISON
  // ════════════════════════════════════════════════════════════════════
  if (accounts.length > 0) {
    const SECTION_2 = "02 · Visual Comparison";

    dividerPages.add(drawSectionDivider(
      doc, "02",
      "Visual", "Comparison",
      "Perbandingan pengikut dan engagement rate antar akun, diurutkan secara visual.",
    ));
    recordSection(SECTION_2);

    doc.addPage();
    drawPageHeader(doc);
    recordSection(SECTION_2);

    y = MARGIN.top + 12;
    y = drawSectionTitle(
      doc, y, "02",
      "Visual", "Comparison",
      "Horizontal bars · diurutkan dari nilai tertinggi",
    );

    // ── Followers bar chart ──
    y = drawSubsectionTitle(doc, y, "Followers", "Diurutkan dari terbesar");

    const followerRows = [...accounts]
      .sort((a, b) => b.followers - a.followers)
      .map((acc) => ({
        label: `@${acc.username}`,
        value: acc.followers,
        color: typeMeta(acc.type).color,
      }));

    y = drawHorizontalBars(
      doc, y, followerRows,
      (v) => formatNum(v),
      recordSection, SECTION_2,
    );

    y += GRID.xl;

    // ── Engagement bar chart ──
    if (y + 40 > pageH(doc) - MARGIN.bottom - 10) {
      doc.addPage();
      drawPageHeader(doc);
      recordSection(SECTION_2);
      y = MARGIN.top + 14;
    }

    y = drawSubsectionTitle(doc, y, "Engagement Rate", "Persentase interaksi rata-rata");

    const engRows = [...accounts]
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .map((acc) => ({
        label: `@${acc.username}`,
        value: acc.avgEngagement,
        color: typeMeta(acc.type).color,
      }));

    y = drawHorizontalBars(
      doc, y, engRows,
      (v) => `${v.toFixed(1)}%`,
      recordSection, SECTION_2,
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // PAGE FURNITURE
  // ════════════════════════════════════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    let activeSectionTitle = "Report Overview";
    for (let pk = 1; pk <= i; pk++) {
      if (sectionMap.has(pk)) activeSectionTitle = sectionMap.get(pk)!;
    }

    if (i === 1) continue;

    if (dividerPages.has(i)) {
      drawDividerFooter(doc, i, totalPages, activeSectionTitle);
      continue;
    }

    drawPageHeader(doc);
    drawPageFooter(doc, i, totalPages, activeSectionTitle);
  }

  doc.save(`Tiktok_BI_Benchmark_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}