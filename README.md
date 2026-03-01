# 🧠 DualMind  
### AI-Powered Moral Decision Intelligence  

Built for **SFU Mountain Madness Hackathon 2026**

> Every decision reveals a pattern.

---

## 🚀 Overview

**DualMind** is an AI-driven experience that analyzes how users make moral decisions.

Instead of asking what you *believe*, DualMind evaluates what you *choose* under tension.

Users face dilemmas and repeatedly select between two contrasting approaches:

- Rational, ethical, long-term thinking  
- Self-interested, impulsive, short-term thinking  

After multiple decisions, AI generates a structured psychological profile based on behavioral patterns — not static quiz scoring.

---

## 🎯 Why It Stands Out

Most personality tests rely on fixed scoring systems.

DualMind uses AI to:
- Interpret decision history dynamically  
- Detect behavioral tendencies  
- Generate personalized psychological insights  
- Return structured JSON for scalable use  

This turns personality analysis into a behavior-driven AI engine.

---

## 🧠 How It Works

1. Present moral dilemma  
2. AI generates two contrasting responses  
3. User selects their choice  
4. Choices accumulate  
5. Gemini AI produces a deep psychological profile  

Profile includes:
- Persona name  
- Dominant trait  
- Shadow trait  
- Literary parallel  
- Personalized insight  

---

## 🏗 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Gemini 2.5 Flash**
- Server-side API architecture
- Rate limiting + input validation

---

## 🔐 Security Architecture

All AI calls are handled server-side.

```
Browser → /api/gemini → Server → Gemini API
```

- API key stored in environment variables  
- No client-side exposure  
- Basic rate limiting to prevent abuse  

---

## 🔮 Future Expansion

- Visual personality analytics  
- Longitudinal behavior tracking  
- Multiplayer comparison mode  
- Research applications in behavioral psychology  

---

Built for **SFU Mountain Madness Hackathon 2026** 🏔️