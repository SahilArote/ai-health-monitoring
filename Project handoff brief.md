# Project Handoff Brief — AI Health Monitoring & Remote Patient Tracking System

> Give this whole document to your agent so it has full context before touching any code. Two other documents exist alongside this one — mention them to your agent and share them too:
> - `AI_Health_Monitoring_Implementation_Blueprint.md` — the full 19-section engineering build plan (architecture, DB schema, REST API design, AI module, week-by-week roadmap, checklist)
> - `Patient_App_Design_Prompt.md` — the complete design spec/prompt for the patient mobile app's 19 screens

---

## 1. What this project is

Final-year engineering project (aligned with UN SDG 3 — Good Health & Well-Being): an AI-powered remote patient monitoring platform. Smartwatches/fitness bands stream real-time vitals (heart rate, SpO₂, sleep, steps, activity) through a mobile app into a backend, where a rule-based + ML anomaly detection engine flags abnormal readings and alerts doctors/patients/emergency contacts in real time. Doctors get a web dashboard to monitor their patient panel; there's an admin panel for hospital/user management.

## 2. Team & constraints

- Two developers of similar experience level (not solo) — no professor/mentor named yet for this specific build (a separate related project has a mentor, see note below)
- **4-month build timeline**, starting from scratch — **nothing has been coded yet**. Everything so far is planning, architecture, environment setup, and design.
- Repo folder naming decided: `/mobile /backend /dashboard /ai-engine` (a `/shared` folder for cross-service TypeScript types was considered and deliberately **dropped** — team judged it overkill for a 2-person project; can be added later if type-duplication actually becomes a problem)

## 3. Everything decided so far, in order

### 3.1 Original project documentation
The team already has a formal project-documentation doc (Executive Summary, Problem Statement, Objectives, Scope, System Modules, Tech Stack, Architecture Overview, AI/ML Component Details, Feasibility Study, SDG Alignment, Risks, Future Scope, Conclusion) — this is the report content used for academic submission. It was cross-checked against the engineering blueprint below and confirmed consistent — no conflicts, just different altitude (report = narrative/rationale, blueprint = actual build plan).

### 3.2 Full engineering blueprint produced
A complete 19-section implementation blueprint was generated covering: system understanding, functional/non-functional requirements, tech stack with justifications, architecture diagrams, wearable integration deep-dive, external API integrations, database design, REST API design, the AI module's rule-first-then-ML strategy, folder structures, a week-by-week development roadmap, security, DevOps, testing, deployment steps, cost estimation, risks, and a ~340-item final checklist. This is the primary build reference — treat it as the source of truth for architecture/scope questions.

### 3.3 Critical correction flagged — Google Fit API is deprecated
⚠️ **This needs explicit team confirmation before building wearable integration** — it has not yet been formally re-confirmed as a team decision, only recommended:
- Google stopped accepting **new developer sign-ups** for the Google Fit REST/Android APIs on **May 1, 2024**; the APIs are being fully shut down by **end of 2026**. Building new integration work against Google Fit is not viable.
- Recommended replacement: **Health Connect** (Android, on-device, no approval needed, free) as the primary path + the new **Google Health API** (`health.googleapis.com/v4`, launched March 2026, cloud/server-to-server successor to both Google Fit and Fitbit Web API) for backend-side pulls + **Apple HealthKit** for iOS.
- Garmin Health API and full Samsung Health partner API were flagged as **not realistically obtainable** for a student project in this timeframe (manual partner approval, weeks-long or closed sign-up) — treat as out of scope, not a dependency.
- A **synthetic vitals data generator** was recommended as a permanent fallback/demo-reliability feature (not just a stopgap) so the AI/alerting demo never depends on a live device being present during evaluation.

### 3.4 Tech stack (current, confirmed)
React Native (mobile) · React.js/Next.js (dashboard) · Node.js/Express or FastAPI (backend API) · PostgreSQL + TimescaleDB/InfluxDB (storage) · Python (scikit-learn/TensorFlow/PyTorch) for anomaly detection · **Firebase Auth + Firebase Cloud Messaging** (auth + push — this replaced an earlier plain-JWT plan) · Prisma ORM · Docker + Vercel/Render/AWS (deployment).

Note on Firebase Auth: Firebase Auth doesn't issue roles itself — the plan is to set **custom claims** (`role: patient/doctor/admin`) via the Firebase Admin SDK after signup, and verify the ID token + role claim on every backend request (this is the RBAC layer).

### 3.5 Local development environment
Two setup paths were worked through:
- **Docker-based** (Postgres+TimescaleDB image, Redis container) — the simpler, recommended default.
- **Windows-native, no Docker** (one teammate's preference) — PostgreSQL via the official EDB Windows installer (PG 16, since TimescaleDB doesn't yet support PG 18 natively on Windows) + TimescaleDB's native Windows `.zip` installer/`setup.exe` + **Memurai Developer** (free, Redis-protocol-compatible native Windows service) in place of Redis, since Redis itself has no official native Windows build.

### 3.6 Kickoff tasks (in progress — check with your teammate on completion status of each)
1. **Architecture/scope decision session** — go through the blueprint together, mark each feature "Build now" vs "Skip/future" given the 4-month timeline, and assign ownership (recommended split: vertical, e.g. one person owns mobile+ai-engine, the other backend+dashboard).
2. **GitHub monorepo** — a ready-to-run prompt was prepared for a coding agent to scaffold `/mobile /backend /dashboard /ai-engine`, root `.gitignore`, npm workspaces `package.json` (backend + dashboard only — mobile is a separate Expo project, ai-engine is Python), and a README. Branch protection on `main` (PR + 1 approval required) and a `feature/<area>-<description>` naming convention were agreed, since it's now a 2-person team rather than solo.
3. **Firebase + Render/Railway accounts** — a manual checklist was prepared: create Firebase project, enable Email/Password auth, generate a service-account key (never commit it), add the teammate as an Editor; create a **shared team account** (not personal) on Render/Railway and connect GitHub — no services deployed yet, that happens once backend code exists.
4. **Figma wireframes** — plan is to create a Figma team, two files ("Patient App Wireframes" and "Doctor Dashboard Wireframes"), start low-fidelity, optionally import a free healthcare/mobile UI kit from Figma Community to speed things up.

### 3.7 Patient mobile app design (dashboard design not started yet)
A full design pass was done for the **patient app only** — the doctor dashboard has not been designed yet.
- **19 screens** identified, grouped: Onboarding & Auth (5), Device Connection (2), Core — Home/Vitals/Trends/Alerts (5), Emergency (2), Care & Records (3), Account (2).
- **Navigation**: bottom tab bar with exactly 4 tabs (Home / Trends / Alerts / Profile); SOS is a floating action button, not a tab, always reachable from Home.
- **Design tokens** were fully specified: color palette (`#1C2B39` primary, `#3E7C74` brand accent, status colors for normal/warning/critical, `#F5F7F8` cool off-white background — deliberately avoiding the generic warm-cream/terracotta look common in AI-generated designs), typography (Sora for headers, IBM Plex Sans for body, **tabular/monospaced numerals specifically for live vitals numbers** so digits don't jitter on update), 8px spacing system, 12px card radius.
- **Signature design element**: a pulse ring around the Home screen's live heart-rate number that animates at the patient's actual measured BPM — the one deliberate motion moment in the app, everything else stays still.
- **Accessibility floor** specified as non-negotiable: status must always pair color with text+icon (never color alone), 44×44pt minimum touch targets, Dynamic Type support, visible focus states, reduced-motion respected.
- A full **design prompt document** (`Patient_App_Design_Prompt.md`) was produced, listing every screen with required states (loading/empty/error) and a build priority order (Home Dashboard, Connect Device, Alert Detail, SOS flow, and Login first — these are the MVP-critical, most-visible-in-demo screens).

## 4. Current actual build status

**Nothing has been coded yet.** Everything above is planning, environment setup instructions, and design specification. No repo commits beyond the (possibly not-yet-run) scaffold prompt, no backend code, no mobile screens built, no Figma files confirmed created.

## 5. What to do next (in order)

1. Confirm/close out the four kickoff tasks in 3.6 if not already done.
2. **Get explicit team sign-off on the Google Fit → Health Connect/Google Health API/HealthKit switch (3.3)** before any wearable-integration code is written — this affects mobile app native module choices from day one.
3. Once repo + local dev environment are live: start Week 1–2 of the blueprint's roadmap — Prisma schema for core tables (users, patients, doctors, hospitals, devices, vitals_readings, alerts — see blueprint Section 8), then Firebase Auth wiring + RBAC middleware.
4. Feed `Patient_App_Design_Prompt.md` to a design/coding agent to start building the Priority-1 patient app screens (Home Dashboard, Connect Device, Alert Detail, SOS flow, Login).
5. **Doctor/hospital dashboard design has not been started** — needs its own design pass (same process as 3.7) before dashboard screens are built.
6. Everything else follows the blueprint's week-by-week roadmap (Section 12) — vitals ingestion pipeline, rule engine, AI scoring, notifications, admin panel, testing, deployment.