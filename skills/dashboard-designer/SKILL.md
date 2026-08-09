---
name: dashboard-designer
description: 'Use this skill when designing a data dashboard—choosing KPIs, structuring layout, applying visual hierarchy, or deciding which BI tool to use. Trigger phrases: ''design a dashboard'', ''build a KPI dashboard'', ''what should my dashboard show'', ''help me layout a dashboard'', ''dashboard for monitoring''. Not for building chart code from scratch (use chart-builder), writing SQL queries (use sql-analyst), or designing marketing landing pages.'
version: 1.0.0
author: community
tags:
  - data
  - dashboard
  - visualization
  - business-intelligence
license: MIT
keywords:
  - design dashboard
  - KPI dashboard
  - BI tool
  - dashboard layout
  - dashboard
  - designer
  - dashboard designer
---

# Dashboard Designer

## Overview
This skill provides a structured approach to dashboard design—from defining the right KPIs and audience through information architecture, visual hierarchy, color coding, and tool selection. A well-designed dashboard surfaces the right information to the right person at the right time. This skill combines data visualization principles with UX thinking to create dashboards that drive decisions, not just display data.

## When to Use
- You're building a new dashboard and need to decide what to show and how to arrange it
- An existing dashboard is cluttered, ignored, or confusing to users
- You need to choose between BI tools (Tableau, Power BI, Looker, Grafana)
- You want to design a KPI framework before building the technical implementation
- You're presenting data to an executive audience and need to structure the narrative

## When NOT to Use
- Writing SQL queries to power the dashboard (use sql-analyst skill)
- Building chart code in Python/JavaScript (use chart-builder skill)
- Creating a static report or slide deck (use a presentation skill)
- Designing the underlying data model or warehouse (use a data engineering skill)

## Quick Reference
| Design Principle | Rule |
|-----------------|------|
| Visual hierarchy | Most important KPI top-left; details bottom-right |
| White space | 15–20% of dashboard area; prevents cognitive overload |
| Color coding | Max 4–5 colors; use red/green for status, grey for context |
| Chart density | Max 6–8 charts per screen; prefer fewer, larger charts |
| KPI count | Executive: 3–5 KPIs. Operational: 8–12. Analyst: unlimited |
| Text | Titles as insights ("Revenue Up 12%"), not labels ("Revenue") |
| Refresh rate | Real-time for ops, daily for management, weekly/monthly for strategy |
| Interactivity | Filters at top; drill-down by click; default to most common view |
| Mobile | Stack charts vertically for mobile; limit to top 3 KPIs |
| Accessibility | Colorblind-safe palette; min contrast ratio 4.5:1 |

## Instructions

### Step 1: Define the Audience and Purpose
Answer these questions before designing anything:
1. **Who uses this dashboard?** Executive, team manager, analyst, engineer, customer?
2. **What decision does it inform?** ("Should we increase marketing spend in the West region?")
3. **How often will they look at it?** Real-time (ops), daily, weekly, monthly?
4. **What action can they take?** If no action → reconsider whether a dashboard is the right format.

**Dashboard archetypes:**
| Type | Audience | Refresh | KPI Count | Example |
|------|----------|---------|-----------|---------|
| Strategic | C-suite, VPs | Weekly/Monthly | 3–5 | Company health scorecard |
| Operational | Team leads, managers | Daily | 8–15 | Sales pipeline dashboard |
| Analytical | Data analysts | On-demand | Unlimited | Cohort analysis explorer |
| Real-time monitoring | Engineers, support | Live | 10–20 | System uptime & error rates |

### Step 2: Select the Right KPIs
A KPI must be:
- **Actionable**: the viewer can change it based on what they see
- **Timely**: available at the frequency the dashboard refreshes
- **Comparable**: has a target, benchmark, or prior period to compare against
- **Unambiguous**: has one clear definition shared by all stakeholders

**KPI selection process:**
1. List 20 metrics the audience cares about
2. Filter to metrics the audience can act on (eliminate vanity metrics)
3. Group remaining into 3–5 themes (e.g., Revenue, Customers, Operations, Quality)
4. Pick 1–3 primary metrics per theme
5. Define calculation, data source, and owner for each

**KPI tiers:**
- **Level 1 (headline)**: 3–5 KPIs shown large at the top (Total Revenue, MAU, NPS)
- **Level 2 (supporting)**: 6–10 charts providing context (by region, by product, trend)
- **Level 3 (detail)**: Tables or drill-downs for investigation

### Step 3: Information Architecture (Layout Patterns)

**F-pattern layout** (most common): Users scan top-left → top-right → down the left.
```
┌─────────────────────────────────────────────────────┐
│  KPI 1        KPI 2        KPI 3        KPI 4       │  ← Headline KPIs
├───────────────────────┬─────────────────────────────┤
│                       │                             │
│  Primary chart        │  Secondary chart            │  ← Primary context
│  (e.g. revenue trend) │  (e.g. by region)           │
│                       │                             │
├───────────────────────┴─────────────────────────────┤
│  Detail chart 1    │  Detail chart 2  │  Table      │  ← Supporting detail
└────────────────────┴──────────────────┴─────────────┘
```

**Z-pattern layout** (executive dashboards): Fewer elements, high-level summary.

### Step 4: Visual Hierarchy & Chart Selection
- **Card/KPI Tile**: single big number + comparison (e.g., $1.2M ▲ 12% vs last month)
- **Line chart**: trend over time (use continuous time series)
- **Bar chart**: comparison across categories (rank descending)
- **Stacked bar chart**: part-to-whole comparison over categories (max 3–4 stacks)
- **Scatter plot**: relationship between two continuous variables
- **Heatmap**: density or pattern across two dimensions (e.g., hour of day vs day of week)
- **Table**: exact values, multi-metric comparison, or searching specific entities

### Step 5: Color System & Coding
- 🔴 **Red**: problem, target missed, alert, negative trend
- 🟢 **Green**: target met, positive trend, healthy status
- 🟡 **Yellow/Amber**: warning, approaching threshold
- 🔵 **Blue**: primary data, neutral information
- ⬜ **Grey**: secondary data, prior period, context

**Colorblind-safe alternative palette:**
- Use: `#0077BB` (blue), `#EE7733` (orange), `#009988` (teal), `#CC3311` (red)
- Avoid: pure red + pure green together without texture or label differentiation

### Step 6: BI Tool Selection Guide
| Tool | Best For | Strengths | Limitations |
|------|----------|-----------|-------------|
| **Tableau** | Enterprise BI, complex visualizations | Powerful viz, strong community, drag-and-drop | Expensive, steep learning curve |
| **Power BI** | Microsoft-centric orgs, self-service BI | Deep Excel/Azure integration, affordable | Less flexible layout, DAX complexity |
| **Looker** | Data-team-driven, engineering-heavy orgs | LookML modeling, governed metrics, Git integration | Requires data engineers, expensive |
| **Grafana** | Real-time monitoring, engineering metrics | Live data, alerting, open source | Not for business users, limited chart types |
| **Metabase** | Small teams, SQL-first analytics | Open source, easy SQL → dashboard | Limited advanced features |
| **Google Data Studio (Looker Studio)** | Google Workspace users, quick sharing | Free, easy to share, Google Sheets integration | Limited transformations, basic visuals |
| **Retool** | Operational dashboards with actions | CRUD operations, internal tools | Requires developer to set up |

### Step 7: Dashboard Quality Checklist
Before publishing, verify:
- [ ] Every chart has a title stating the insight (not just the metric name)
- [ ] Every KPI has a comparison value (vs. target, vs. last period)
- [ ] Color coding is consistent throughout
- [ ] Date range is clearly labeled and user-controlled
- [ ] Filters are at the top and default to the most common view
- [ ] All numbers are formatted with appropriate precision (revenue: $1.2M not $1,234,567.89)
- [ ] Data source and refresh date are visible in a footer
- [ ] Mobile layout tested (if relevant)

## Best Practices
- Design for the question, not the data—start with "what decision does this enable?" not "what data do I have?"
- One dashboard, one audience—don't try to serve executives and analysts with the same view
- KPIs need targets: a number without a benchmark is meaningless
- "Alert" color (red) loses impact if overused; reserve it for genuine problems
- Show the trend, not just the snapshot—a current value without history lacks context
- Label data directly on charts when possible rather than relying on legend lookups
- Build the mobile version after the desktop version, not as an afterthought

## Common Mistakes
- Too many KPIs: 20+ metrics creates analysis paralysis, not insight
- Vanity metrics: page views, social followers, total registered users (not actionable)
- Missing comparison context: showing $1.2M revenue without target or prior period
- Inconsistent date filters: one chart shows "last 30 days" while another shows "this month"
- Using pie charts for more than 5 segments—switch to a ranked bar chart
- Auto-refreshing a dashboard that users need to study calmly—adds cognitive load
- Forgetting mobile: 40%+ of dashboard views happen on tablets or phones
