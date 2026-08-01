# Architecture — AI Health Monitoring & Remote Patient Tracking System

> System design reference for the repo. For the full build plan (week-by-week roadmap, checklist, cost estimates) see `AI_Health_Monitoring_Implementation_Blueprint.md`. For UI specs see `Patient_App_Design_Prompt.md`.

## 1. Overview

An AI-powered remote patient monitoring platform. Wearables stream vitals through a mobile app into a backend; a rule-based + ML engine flags anomalies and alerts doctors/patients/emergency contacts in real time. Doctors monitor their patient panel via a web dashboard; an admin layer manages hospitals/doctors/platform config.

**Repo layout:** `/mobile /backend /dashboard /ai-engine` — no `/shared` (deliberately dropped; team is 2 people, verbal sync is enough for now, add it later only if type-duplication becomes a real problem).

## 2. System architecture

```
                              ┌────────────────────────┐
                              │   Patient Mobile App    │
                              │   (React Native/Expo)   │
                              └───────────┬─────────────┘
                                          │ HTTPS / WSS
                              ┌───────────▼─────────────┐
                              │      API Gateway /       │
                              │   Express/FastAPI (BFF)  │
                              └───┬───────┬───────┬──────┘
              ┌───────────────────┘       │       └───────────────────┐
   ┌──────────▼─────────┐     ┌───────────▼───────────┐   ┌───────────▼──────────┐
   │   Auth (Firebase)    │     │   Vitals Ingestion     │   │  Notification Service │
   │  ID token + RBAC      │     │  Service (queue-backed)│   │  (FCM/Twilio/SendGrid) │
   └──────────┬──────────┘     └───────────┬────────────┘   └───────────┬──────────┘
              │                            │                            │
   ┌──────────▼────────────────────────────▼────────────────────────────▼──────────┐
   │                              PostgreSQL + TimescaleDB                          │
   │            (users, patients, doctors, appointments, vitals_readings)           │
   └──────────┬───────────────────────────────────────────────────────┬────────────┘
              │                                                        │
   ┌──────────▼─────────┐                                   ┌──────────▼──────────┐
   │   Redis (cache +     │                                   │   AI Engine           │
   │   queue + rate-limit)│◄──────────────consumes───────────│  (rule engine + model)│
   └───────────┬───────────┘                                   └──────────┬──────────┘
              │                                                            │
   ┌──────────▼─────────────────────────────────────────────────────────▼──────────┐
   │                       Doctor / Hospital Web Dashboard (Next.js)                 │
   │                     WebSocket live alert feed + REST for CRUD                   │
   └───────────────────────────────────────────────────────────────────────────────┘
```

Started as a **modular monolith** inside `/backend` (clean module boundaries, one deployable) rather than real microservices — not justified at 2-person/4-month scale. `/ai-engine` is the one piece that's already a separate service by necessity (different runtime — Python — and different scaling profile, CPU-bound and batchable).

## 3. Components

| Folder | Responsibility | Stack |
|---|---|---|
| `/mobile` | Patient-facing app: vitals view, device connect, alerts, SOS, doctor messaging | React Native (Expo) |
| `/backend` | Auth verification/RBAC, patient/doctor/hospital CRUD, vitals ingestion, alert + notification orchestration, admin APIs | Node.js/Express or FastAPI, Prisma |
| `/dashboard` | Doctor/hospital web console: patient panel, live alert feed, patient detail, admin views | Next.js |
| `/ai-engine` | Rule-threshold engine, per-patient baseline job, anomaly-detection model (Isolation Forest → autoencoder later), scoring endpoint | Python, scikit-learn |

## 4. Data architecture

```
┌─────────────── Relational (OLTP, PostgreSQL) ───────────────┐   ┌──── Time-series (Timescale hypertable) ────┐
│ users, patients, doctors, hospitals, admins,                  │   │ vitals_readings (device_id, patient_id,      │
│ emergency_contacts, appointments, medical_records,             │   │  metric_type, value, recorded_at, source)    │
│ devices, alerts, audit_logs, notifications, refresh_tokens*    │   │  partitioned by time, continuous aggregates  │
└──────────────────────────────────────────────────────────────┘   │  for hourly/daily rollups                     │
                                                                       └───────────────────────────────────────────┘
```
\* `refresh_tokens` is only needed if a custom-JWT fallback is ever added; with Firebase Auth as the primary auth path, token lifecycle is mostly handled by Firebase — the backend still logs auth events to `audit_logs`.

One database engine (Postgres + Timescale extension) for both relational and time-series data — one connection pool, one ORM, one backup story — rather than running a separate InfluxDB instance.

## 5. Key flows

### 5.1 Auth flow (Firebase Auth)
```
Mobile/Dashboard client
   │  Firebase Auth SDK: sign in (email/password)
   ▼
Firebase issues ID token
   │
   ▼
Client attaches ID token to every API request (Authorization: Bearer <idToken>)
   │
   ▼
Backend verifies token via Firebase Admin SDK, reads custom claim `role`
   │
   ▼
RBAC middleware checks role + (for doctors) assigned-patient relationship
```
Roles (`patient` / `doctor` / `hospital_admin` / `super_admin`) are set as **Firebase custom claims** by the backend after registration — Firebase Auth itself has no concept of roles.

### 5.2 Wearable data flow
```
Smartwatch (Wear OS / Mi Band / Galaxy Watch / Apple Watch)
     │  BLE sync to companion app
     ▼
Phone-side Health Layer:  Health Connect (Android)  —or—  HealthKit (iOS)
     │  native module read (foreground on-demand + WorkManager/BGTaskScheduler background)
     ▼
React Native App → batches readings → POST /vitals/ingest
     │
     ▼
Backend validates + dedupes (patient_id + device_id + metric_type + time) → TimescaleDB
     │
     ▼
Rule Engine (sync) → AI Scorer (async, batched) → Alerts
```
> **Note:** Google Fit REST API is not used — new developer sign-ups closed May 2024, full shutdown end of 2026. Health Connect (on-device, no approval) + the Google Health API (cloud path, launched March 2026) + Apple HealthKit are the integration surfaces. A synthetic data generator feeds the same `/vitals/ingest` endpoint as a permanent demo-reliability fallback, not just a stopgap.

### 5.3 Alert & notification flow
```
Rule Engine / AI Scorer detects anomaly
        │
        ▼
Create Alert (severity, patient_id, metric, value, source=rule|ml)
        │
        ├──► Redis queue (BullMQ: "notify" job)
        ▼
Notification Worker
   ┌────┼──────────────┬───────────────┐
   ▼    ▼               ▼               ▼
 FCM   Socket.IO      Twilio SMS      SendGrid Email
(patient+doctor app)  (dashboard      (critical only)  (weekly summaries)
                        live feed)
```

### 5.4 AI flow
```
Reading ingested ──► Rule Engine (synchronous, hard thresholds — e.g. SpO2 < 92%)
                          │ no breach
                          ▼
                Enqueue for ML scoring (async, batched)
                          │
              Per-patient rolling baseline (14-day mean/std)
                          │
              Isolation Forest anomaly score
                          │ above threshold
                          ▼
                 Create alert (source=ml)
```
Rules ship first and stay authoritative for safety-critical thresholds; ML adds sensitivity on top, never replaces the rule layer.

## 6. Tech stack

| Layer | Choice | Why (brief) |
|---|---|---|
| Mobile | React Native (Expo) | Team's existing JS skillset; Health Connect/HealthKit need Expo Dev Client, not plain Expo Go |
| Dashboard | Next.js + Tailwind | SSR for dashboard first-paint, easy Vercel deploy |
| Backend | Node/Express or FastAPI | I/O-bound API work; FastAPI if AI-engine team wants one language end-to-end |
| DB | PostgreSQL + TimescaleDB | One engine for relational + time-series |
| Cache/Queue | Redis (Upstash) + BullMQ | Rate limiting, session bits, ingestion/notification job queue |
| Auth | Firebase Auth | Faster to ship than custom JWT; custom claims cover RBAC |
| Push/SMS/Email | FCM / Twilio or MSG91 / SendGrid | Free-tier friendly, matches functional requirements |
| AI | Python + scikit-learn | Isolation Forest first — explainable, no GPU, fast to train |
| ORM | Prisma | Type-safe queries, clean migrations |
| Hosting | Vercel (dashboard) + Render/Railway (backend, worker) + Supabase/Neon (DB) | Real free tiers sufficient for a student demo |

## 7. Key architectural decisions (rationale)

- **Modular monolith, not microservices** — team size (2) and timeline (4 months) don't justify service-mesh overhead; `/ai-engine` is the one natural split due to runtime difference.
- **Health Connect/HealthKit over direct vendor APIs (Google Fit, Fitbit, Garmin)** — vendor APIs are either dead (Google Fit), sunsetting (Fitbit Web API), or gated behind partner approval unlikely to clear in time (Garmin, full Samsung partner API). Platform-level aggregators require no approval and are the officially current path. *(Team sign-off on this switch is still pending — confirm before writing wearable-integration code.)*
- **Firebase Auth over custom JWT** — cuts build time; RBAC implemented via custom claims + backend middleware rather than a self-rolled token system.
- **TimescaleDB extension over a separate InfluxDB instance** — one database to run, back up, and query from one ORM/connection pool.
- **No `/shared` package for now** — at 2-person scale, verbal coordination on shared types is cheap enough; revisit only if type drift actually causes bugs.
- **Synthetic data generator as a permanent feature, not a temporary crutch** — demo/evaluation should never depend on a live wearable being present and cooperative.

## 8. Open / pending decisions

- [ ] Confirm Google Fit → Health Connect/Google Health API/HealthKit switch as a team decision
- [ ] Node/Express vs FastAPI for `/backend` — not yet finalized
- [ ] Doctor/hospital dashboard architecture detail (currently only the patient app has a full design pass; dashboard design not started)
- [ ] Whether to split `/ai-engine` out as a truly separate deployed service from day one, or start it as a module the backend calls in-process