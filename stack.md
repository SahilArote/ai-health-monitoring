# Stack — AI Health Monitoring & Remote Patient Tracking System

> Quick reference for the full tech stack. For *why* each choice was made in more depth, see `ARCHITECTURE.md` and Section 4 of `AI_Health_Monitoring_Implementation_Blueprint.md`.

## Quick reference

| Layer | Technology | Status |
|---|---|---|
| Mobile app | React Native (Expo) | Confirmed |
| Dashboard (web) | Next.js + Tailwind | Confirmed |
| Backend API | Node.js/Express **or** FastAPI | ⚠️ Not finalized — pick one |
| ORM | Prisma | Confirmed (Node path) |
| Primary DB | PostgreSQL | Confirmed |
| Time-series storage | TimescaleDB (Postgres extension) | Confirmed |
| Cache / rate-limit | Redis (Upstash) | Confirmed |
| Queue | BullMQ (Redis-backed) | Confirmed |
| Real-time (dashboard live feed) | Socket.IO | Confirmed |
| Auth | Firebase Auth | Confirmed (replaced earlier plain-JWT plan) |
| Push notifications | Firebase Cloud Messaging (FCM) | Confirmed |
| SMS (critical alerts) | Twilio or MSG91 | Confirmed, vendor TBD |
| Email | SendGrid | Confirmed |
| Wearable integration — Android | Health Connect | Confirmed replacement for Google Fit |
| Wearable integration — iOS | Apple HealthKit | Confirmed |
| Wearable integration — cloud/server pull | Google Health API (`health.googleapis.com/v4`) | Confirmed replacement for Google Fit REST |
| AI/ML | Python + scikit-learn (Isolation Forest first) | Confirmed |
| Object storage | Cloudflare R2 or Supabase Storage | Confirmed, either works |
| Hosting — dashboard | Vercel | Confirmed |
| Hosting — backend + worker | Render or Railway | Confirmed, vendor TBD (team account, not personal) |
| Hosting — DB | Supabase or Neon (Postgres+Timescale) | Confirmed, vendor TBD |
| Containerization | Docker + Docker Compose | Confirmed for prod; one teammate runs local dev without Docker (native installs) |
| CI/CD | GitHub Actions | Confirmed |
| Error tracking | Sentry | Confirmed |
| Uptime monitoring | UptimeRobot | Confirmed |
| Mobile build | EAS Build (Expo) | Confirmed |

## Why each choice, briefly

**React Native (Expo)** — matches the team's existing JS skillset. Note: Health Connect and HealthKit both need **native modules**, so the project must move to **Expo Dev Client / EAS Build** early — plain Expo Go won't support them once those modules are added.

**Next.js** — SSR gives fast first paint on data-heavy dashboard pages; file-based routing and easy Vercel deploy.

**Node/Express vs FastAPI — still open.** Node keeps one language across mobile+dashboard+backend. FastAPI keeps the AI-engine and backend in one language (Python) if the AI work becomes the more complex half of the project. Whoever owns the backend should make this call before Week 2 (Prisma schema + auth) starts.

**PostgreSQL + TimescaleDB (not a separate InfluxDB)** — one database engine, one connection pool, one ORM, one backup process for both relational data (users, patients, doctors) and time-series vitals.

**Firebase Auth (not custom JWT)** — faster to ship than rolling your own token system. Roles aren't native to Firebase Auth — set as **custom claims** (`role: patient/doctor/hospital_admin/super_admin`) via the Firebase Admin SDK after signup, verified server-side on every request.

**Redis + BullMQ** — Redis for caching dashboard aggregates and rate-limiting; BullMQ (Redis-backed queue) keeps vitals ingestion fast by deferring rule/AI evaluation and notification sends into background jobs rather than blocking the write.

**Socket.IO** — the doctor dashboard needs a live alert feed without polling every few seconds; well-documented, deploys fine on Render/Railway.

**Health Connect / HealthKit / Google Health API (not Google Fit)** — Google Fit REST API stopped accepting new developer sign-ups in May 2024 and is fully shutting down by end of 2026; Fitbit Web API sunsets September 2026. Health Connect (Android, on-device, no approval) and HealthKit (iOS, on-device) are the current platform-recommended layers; the Google Health API (launched March 2026) is the cloud/server-to-server successor for backend-side pulls. Garmin and full Samsung Health partner APIs are out of scope — approval timelines don't fit a student project.

**scikit-learn / Isolation Forest first** — unsupervised, explainable, trains in seconds without labeled data or a GPU. An autoencoder (TensorFlow/PyTorch) is a possible v2, not a v1 requirement.

**Vercel + Render/Railway + Supabase/Neon + Upstash** — all have free tiers that comfortably cover a student build and demo; no billing lock-in required to get started.

**Docker for production, optional for local dev** — one teammate develops locally without Docker (native Postgres+TimescaleDB Windows install + Memurai in place of Redis, since Redis has no official Windows build); production deployment still assumes Docker images per service. Document this asymmetry in the report if asked — it's a reasonable, explainable tradeoff, not an inconsistency.

## Accounts to set up (if not already done)

- [ ] Google Cloud project — Google Health API enabled, OAuth consent screen configured
- [ ] Firebase project — Email/Password auth enabled, service account key generated (never committed), FCM auto-enabled with the project
- [ ] Twilio or MSG91 account (SMS)
- [ ] SendGrid account (email), sender identity verified
- [ ] Render or Railway — **team account**, not personal, GitHub connected
- [ ] Supabase or Neon — Postgres project with TimescaleDB extension enabled
- [ ] Upstash — Redis instance
- [ ] Cloudflare R2 or Supabase Storage — bucket for PDF reports/profile photos
- [ ] Sentry project (error tracking)
- [ ] Expo/EAS account (mobile builds)

## Explicitly not in the stack (and why)

- **Kubernetes** — not justified at this team size/timeline; one Render/Railway service each is simpler to operate.
- **A separate `/shared` TypeScript package** — dropped for now at 2-person scale; revisit only if type duplication becomes a real problem.
- **AWS/Azure/GCP full production infra** — free-tier platforms (Vercel/Render/Supabase) are sufficient for a student demo; full cloud-provider setup is mentioned only in the blueprint's cost-estimation section for report-writing purposes, not as something to actually stand up.
- **Garmin Health API / Samsung Health partner API / native Fitbit integration** — approval timelines make these impractical; accessed indirectly via Health Connect where the source device already syncs there.