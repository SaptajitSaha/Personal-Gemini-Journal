# Personal Gemini Journal

A production-oriented, security-first personal journaling and reflection platform built for the **Hack2Skill GenAI Academy APAC Challenge**.

Powered by **React + TypeScript**, **Node.js Express backend**, **Firebase Authentication (Google Sign-In)**, **Cloud Firestore**, **Google GenAI SDK (Gemini 2.5)**, and **Google Cloud Secret Manager**.

---

## 🛡️ Executive Security Summary

Security is treated as a mandatory foundational boundary rather than an afterthought:

1. **Zero Client Secret Exposure:** The privileged `GEMINI_API_KEY` is strictly confined to the server backend and resolved dynamically from Google Cloud Secret Manager / environment secrets.
2. **Cryptographic ID Token Authorization:** Client-supplied user identifiers (`UID`) are never trusted. All protected `/api/gemini/*` endpoints require and verify a valid Firebase Bearer token.
3. **Firestore Path-Level User Isolation:** Stored under `users/{uid}/journals/{journalId}` and enforced through restrictive `firestore.rules` where `request.auth.uid == userId`. Cross-tenant reading or writing is impossible.
4. **Prompt Injection & Safety Defenses:** System instructions strictly distinguish trusted directives from untrusted user reflections, preventing instruction tampering. Structured outputs are parsed and validated through rigid **Zod** schemas.
5. **Rate Limiting & Abuse Prevention:** Sliding window rate limiters protect Gemini quotas against denial of service and resource exhaustion.

---

## 🏛️ Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│  React 19 + TypeScript + Tailwind CSS + Lucide Icons        │
│  - Firebase Auth (Google Sign-In / ID Tokens)               │
│  - Path-Isolated Firestore (users/{uid}/journals/{id})      │
└──────────────────────────────┬──────────────────────────────┘
                               │
            HTTPS (Authorization: Bearer <ID_TOKEN>)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Node.js Express Backend                      │
│  - Security Middleware (Token Verification & Rate Limiting) │
│  - Secret Manager (Privileged GEMINI_API_KEY Gateway)       │
│  - Input Length & Prompt Sanitizer                          │
│  - Gemini 2.5 Flash Conversational Proxy                    │
│  - Automated Summarizer & Zod Schema Validator              │
│  - Reflection Evolution Longitudinal Engine                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                    Server-to-Server HTTPS
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       Google GenAI                          │
│              Gemini 2.5 Flash & Secret Manager              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Core Features

### 1. Firebase Authentication with Google Sign-In
- One-click Google Sign-In with OAuth popups.
- Verified session persistence and cryptographic token generation for backend verification.
- Instant test mode for rapid hackathon review.

### 2. Multi-Turn Gemini Journaling Companion
- Mindful, empathetic reflection dialogue with context window retention.
- Supportive prompts for untangling decisions, celebrating wins, and habit refinement.
- Explicit non-clinical disclaimer (reflective companion, not medical diagnosis).

### 3. Automatic Structured Summarization & Synthesis
- Automated distillation at the end of every reflection session.
- Extracts:
  - Concise Title
  - 2-3 paragraph Synthesis Summary
  - Key Insights
  - Actionable Items (with categories: `task`, `habit`, `reflection`, `learning`)
  - Semantic Topics & Tags
- Verified by **Zod** schemas before persisting to Firestore.

### 4. Journal-to-Action Checklist
- Interactive action items extracted directly from AI reflections.
- Toggleable completion states persisted directly to Firestore to close the loop from reflection to execution.

### 5. Signature Original Feature: "Reflection Evolution"
Unlike conventional isolated note apps, **Reflection Evolution** synthesizes longitudinal growth across the authenticated user's entire historical corpus:
- **Narrative Trajectory:** Synthesizes high-level mindset transformations over time (e.g. *"Your reflections have shifted from learning AI fundamentals toward building real AI applications"*).
- **Theme Velocity & Direction:** Visualizes recurring topics with direction tags (`increasing`, `emerging`, `stable`, `completed`).
- **Focus Shifts:** Side-by-side comparison between *Early Reflections Focus* and *Current Reflections Focus*.
- **Goal & Habit Convergence:** Maps recurring commitments across weeks.

### 6. Interactive Security Center
- Live status verification of all 6 security pillars.
- Interactive terminal test runner verifying token validation and schema integrity.
- Full STRIDE threat model defense matrix.

---

## 🔒 Threat Model & STRIDE Defense Matrix

| Threat (STRIDE) | Attack Vector | Security Control Implemented |
| :--- | :--- | :--- |
| **Spoofing** | Forging client UID in request bodies | Backend extracts and verifies UID directly from Firebase cryptographic Bearer token. |
| **Tampering** | Modifying other users' journal records | Firestore Security Rules verify `request.auth.uid == userId` and lock `createdAt`/`userId`. |
| **Repudiation** | Denying creation or edits | Structured timestamps and user IDs strictly bound by Firestore rules. |
| **Information Disclosure** | Sniffing client bundles for API keys | `GEMINI_API_KEY` stored exclusively in Google Cloud Secret Manager / server environment. |
| **Denial of Service** | Flooding Gemini endpoints | In-memory sliding window rate limiter (max 30-40 req/min per IP/UID). |
| **Elevation of Privilege** | Accessing database collections outside user path | Firestore rule `match /{document=**} { allow read, write: if false; }` enforces default deny. |
| **Prompt Injection** | User input attempting to override model directives | Rigid system instructions isolating untrusted reflection text; JSON output validation with Zod. |

---

## 📂 Cloud Firestore Security Isolation

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default deny-all across entire database
    match /{document=**} {
      allow read, write: if false;
    }

    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId}/journals/{journalId} {
      allow read, delete: if isOwner(userId);
      allow create: if isOwner(userId)
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.keys().hasAll(['userId', 'title', 'conversation', 'createdAt', 'updatedAt'])
        && request.resource.data.title.size() <= 300
        && request.resource.data.conversation.size() <= 100;
      allow update: if isOwner(userId)
        && request.resource.data.userId == resource.data.userId
        && request.resource.data.createdAt == resource.data.createdAt;
    }
  }
}
```

---

## 🚀 Setup & Local Development

### 1. Prerequisites
- Node.js 20+
- Google Cloud / Gemini API key

### 2. Environment Configuration
Create a `.env` file from `.env.example`:

```bash
# Gemini API Key (Server-Side Only)
GEMINI_API_KEY="your-gemini-api-key"

# Optional: Google Cloud Secret Manager
GCP_PROJECT_ID="your-gcp-project-id"

# Firebase Client Configuration
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-firebase-project-id"
```

### 3. Run Development Server
```bash
npm install
npm run dev
```
The server will start on `http://localhost:3000` with full Vite development middleware and Express API routes.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🏆 Hack2Skill GenAI Academy APAC Submission
- **Project Name:** Personal Gemini Journal
- **Challenge:** APAC GenAI Academy
- **Target Audience:** Developers, innovators, and mindful professionals seeking secure, self-evolving reflection insights.
