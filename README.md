# AI Health Monitoring & Remote Patient Tracking System

> AI-powered remote patient monitoring platform — final year project

---

## Team

| Member | Role |
|--------|------|
| [Member 1 Name] | Mobile App (React Native) + AI Engine (Python / ML) |
| [Member 2 Name] | Backend API (Node.js) + Dashboard (React / Next.js) |

---

## Repo Structure

```
ai-health-monitoring/
├── mobile/          # React Native (Expo) patient-facing mobile app
│                    # Handles wearable sync, vitals view, alerts, and emergency contacts
│
├── backend/         # Node.js + Express REST/WebSocket API
│                    # Data ingestion, auth (JWT/OAuth), alert logic, and Prisma ORM
│
├── dashboard/       # React / Next.js doctor & hospital web dashboard
│                    # Multi-patient monitoring, alert queue, trend graphs, clinical notes
│
├── ai-engine/       # Python AI/ML service
│                    # Anomaly detection models (Isolation Forest, LSTM), baseline building
│
└── shared/          # Shared constants, TypeScript types, and utility helpers
                     # Used across backend and dashboard via npm workspaces
```

---

## How to Run Locally

> ⚙️ Setup instructions will be added as each service is scaffolded.

<!-- 
  Planned entries:
    - backend:    cd backend && npm install && npm run dev
    - dashboard:  cd dashboard && npm install && npm run dev
    - mobile:     cd mobile && npx expo start
    - ai-engine:  cd ai-engine && pip install -r requirements.txt && python main.py
-->

---

## Branching

- `main` is **protected** — direct pushes are not allowed.
- All development happens on **feature branches**, merged via Pull Request.
- Branch naming convention:

  ```
  feature/<area>-<short-description>
  ```

  Examples:
  - `feature/mobile-auth-screen`
  - `feature/backend-vitals-ingestion-api`
  - `feature/dashboard-alert-queue`
  - `feature/ai-engine-isolation-forest`

- Hotfixes use: `fix/<area>-<short-description>`

---

## Tech Stack (Summary)

| Layer | Technology |
|-------|------------|
| Mobile | React Native (Expo) |
| Backend | Node.js + Express + Prisma |
| Dashboard | React / Next.js |
| AI Engine | Python (scikit-learn, TensorFlow) |
| Primary DB | PostgreSQL |
| Time-Series DB | TimescaleDB / InfluxDB |
| Real-Time | WebSockets / Firebase |
| Auth | JWT + OAuth 2.0 |
| Notifications | Firebase Cloud Messaging |
| Hosting | Vercel (dashboard), Render/AWS (backend), Docker |

---

*Aligned with UN SDG 3 — Good Health and Well-being*
