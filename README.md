# 🏀 CS-Hoopers | Tournament Registration Engine

> A custom-built, decoupled backend architecture and registration system designed to handle real-world tournament operations, high-concurrency sign-ups, and strict roster validation for a faculty basketball competition.

![React](https://img.shields.io/badge/REACT-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TYPESCRIPT-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/FIREBASE-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TAILWIND%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🎯 The "Why": Evolving Beyond BaaS

Although I am highly proficient in building full-stack applications, relying entirely on Backend-as-a-Service (BaaS) platforms like Supabase or Firebase abstracts away the true mechanics of software engineering. I realized that to be a genuinely capable developer, I needed to understand what happens under the hood.

With my faculty hosting an upcoming basketball competition, I saw the perfect opportunity to bridge this knowledge gap. I built this system to solve a real-world problem while forcing myself to learn the core concepts of true backend architecture. Rather than having participants fill out a basic Google Form, I wanted to challenge myself and build this custom platform in a one-week timeframe.

**The Strict Project Constraints:**

- 🚫 **No Backend SaaS (Phase 2):** Everything from API routing, data validation, to relational database transactions is coded manually by me. This is to ensure that I truly understand the mechanics of software engineering.
- ⚡ **Tactical Deployment (Phase 1):** To meet real-world deadlines, the initial production launch utilizes Firebase to secure data immediately, allowing parallel development of the custom Python backend without blocking user registration.
- 🤖 **Strategic AI Delegation:** The frontend (UI/UX) and other non-vital boilerplate were accelerated using AI, allowing me to focus 100% of my mental energy on deep backend engineering. It was a very tedious task to build the frontend on my own, so I used AI to help me build it rapidly.

Ultimately, this project is a critical step in my journey to understand the deeper mechanics of the cyber world. By mastering Python to build a robust, standalone server here, I am laying the architectural groundwork needed to eventually build my own advanced servers, host Large Language Models (LLMs), and transition into AI Engineering.

---

## 🛠️ The Tech Stack

This project utilizes a strictly decoupled architecture, separating the client-side presentation from the server-side logic to enforce enterprise-grade engineering practices.

- **Frontend SPA:** React (Vite) & TypeScript
- **Styling:** Tailwind CSS (Custom Arbitrary Values & Keyframes)
- **Phase 1 Database (Live):** Firebase Firestore (NoSQL Document Store)
- **Phase 2 API Engine (In Progress):** Python & FastAPI
- **Phase 2 Database (In Progress):** PostgreSQL (Relational)

---

## 🚀 Execution & Deployment Strategy

To ensure the tournament could begin accepting registrations immediately while I architect the custom backend, the project was split into two deployment phases.

### Phase 1: Rapid Production Deployment (Current)

We deployed a temporary BaaS patch to get the application live on the web in under an hour.

1.  **Firestore Vault Initialization:** Spun up a Firebase NoSQL database configured in test mode to act as a secure, temporary data sink for the unstructured JSON payloads.
2.  **Frontend Network Wiring:** Hijacked the local React state submission and implemented asynchronous Firestore hooks (`addDoc`, `collection`) to securely fire registration payloads across the network.
3.  **Continuous Deployment (CD) Pipeline:** Initialized a Git repository and connected it to **Vercel**. Vercel actively listens to the `main` branch on GitHub, automatically rebuilding and deploying the Vite React app to the edge network within seconds of any code push.

### Phase 2: The Custom Backend Engine (In Development)

With the frontend successfully decoupled and hosted, development is shifting to a separate Git branch (`feature/fastapi-backend`) to construct the permanent Python architecture, complete with strict Pydantic validation and a structured PostgreSQL schema.
