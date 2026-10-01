# AI_LOG.md

Every time you update your project, please make a note of what you did in the `AI_LOG.md` file, according to the following template.

---

## [Milestone name] — [Date]
**Tool(s) used:**
**What I asked for:**
**What I kept as-is:**
**What I changed or rejected, and why:**
**Something the AI got wrong that I had to catch:**

---
# AI Usage Log

This document records how AI tools were used during the development of K-Learn Hub.

## 2026-09-17 — Project Idea and MVP Scope

### Tool
ChatGPT / Codex

### Purpose
Refine the initial project idea and define a realistic MVP for Week 3.

### Prompt Summary
Asked AI to analyze the K-Learn Hub idea and identify the smallest working product that could demonstrate the main concept.

### AI Contribution
AI suggested the following core workflow:

1. A teacher creates and publishes a class.
2. A student browses available classes.
3. A student registers for a class.
4. The teacher views the class roster.

### Human Review
The team reviewed the proposed scope and selected these functions as the Week 3 MVP. Optional features such as payments, attendance, lessons, and an AI tutor were postponed.

---

## 2026-09-18 — MVP Implementation

### Tool
ChatGPT / Codex

### Purpose
Generate an initial working prototype.

### Prompt Summary
Asked AI to create a web-based MVP based on the approved K-Learn Hub workflow.

### AI Contribution
AI assisted with:

- User interface implementation.
- Class creation and publishing.
- Student registration.
- Teacher roster display.
- Database schema and migration.
- API routes and validation.

### Human Review
The team downloaded the source code, installed the dependencies, initialized the database, ran the application locally, and manually tested the main workflow.

---

## 2026-09-19 — Debugging and Local Setup

### Tool
ChatGPT / Codex

### Purpose
Resolve local installation and runtime problems on Windows.

### Problems Encountered

- `pnpm` permission error caused by Corepack.
- Node.js version incompatibility.
- Missing `node:sqlite` module.
- Cloudflare/Vinext development server connection error.

### AI Contribution
AI recommended:

- Upgrading to Node.js 22.13 or later.
- Running pnpm through `npx`.
- Applying the local D1 database migration.
- Running the built application through Wrangler.

### Human Review
The commands were executed manually in VS Code, and the application was verified locally.

---

## 2026-09-19 — Documentation

### Tool
ChatGPT / Codex

### Purpose
Prepare the Week 3 project documentation.

### AI Contribution
AI assisted in drafting:

- Product Vision.
- MVP Status.
- Core Workflow.
- Current Limitations.
- Product Roadmap.
- Acceptance Criteria.
- Product Backlog suggestions.

### Human Review
The team reviewed the documentation and updated it to match the actual state of the project.

---

## Verification Statement

AI-generated suggestions and code were reviewed and tested by the project team. The team remains responsible for the final implementation, documentation, and submitted repository.
