# DMflow 🚀
> Next-Generation Instagram Professional Automation & AI Auto-Reply Platform (100% Free & Unlimited)

DMflow is a full-featured Instagram Direct Message, comment-to-DM, story mention, and AI-powered auto-reply SaaS built with **Next.js 15**, **TypeScript**, **Supabase**, and **Groq Llama 3.1 AI**.

Inspired by ElevenLabs' quietly editorial print magazine design system (off-white canvas, warm near-black ink, soft atmospheric pastel gradient orbs), DMflow combines visual elegance with high-performance automation.

---

## 📸 Screenshots

### 1. Landing Page & Meta Business Connection
![DMflow Landing Page](./public/screenshots/landing.png)

### 2. Analytics & Performance Dashboard
![DMflow Home Dashboard](./public/screenshots/dashboard.png)

### 3. Centerpiece Automation Builder (Live Mobile Preview)
![DMflow Automation Builder](./public/screenshots/builder.png)

### 4. Automation Rules Engine & Status Management
![DMflow Automation Rules](./public/screenshots/automations.png)

---

## ✨ Features

- **⚡ Centerpiece Automation Builder**:
  - **Step 1**: Target specific Instagram posts/reels or trigger on any post.
  - **Step 2**: Match specific comment keywords (`link`, `shop`, `discount`, etc.) or trigger on any word.
  - **Step 3**: Optional actions — Opening DM (with custom button text), Follow-gate requirement, and Email Capture.
  - **Step 4**: Custom DM response with character limits, CTA buttons, and interactive modal link editor.
  - **Live iPhone Frame Mockup**: Real-time rendering of post comments and direct message thread bubbles.

- **🤖 Groq Llama 3.1 AI Auto-Reply Engine**:
  - Contextual AI auto-replies for unmatched comments or DMs using custom brand voice context and Groq's fast AI model.
  - Automatic fallback guardrails for response length and API timeouts.

- **📊 Comprehensive Analytics & Insights**:
  - Track DMs sent, CTA link clicks, CTR%, and total leads collected.
  - Interactive charts, top commenters leaderboard, and audience segment insights.

- **📁 Contacts Management**:
  - Lead contact directory storing usernames, captured emails, and DM interaction stats.
  - One-click CSV export functionality.

- **💎 100% Free & Unlimited**:
  - Zero paywalls, zero locked features, and no hard DM limits.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Language**: TypeScript
- **Styling**: Modern CSS variables & ElevenLabs Quietly Editorial Design System
- **Database**: Supabase (PostgreSQL, Row Level Security)
- **AI**: Groq SDK (`llama-3.1-8b-instant`)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and `npm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:Ganeshp000/DMflow.git
   cd DMflow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Credentials (optional for mock mode)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Instagram Meta Business Login API
   NEXT_PUBLIC_INSTAGRAM_APP_ID=1234567890
   INSTAGRAM_APP_ID=1234567890
   INSTAGRAM_APP_SECRET=your_app_secret
   NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/auth/callback
   INSTAGRAM_WEBHOOK_VERIFY_TOKEN=dmflow_secret_token_123

   # Groq AI API Key
   GROQ_API_KEY=gsk_your_groq_api_key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

MIT License © 2026 DMflow
