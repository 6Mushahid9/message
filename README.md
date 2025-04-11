# 🧠 Full Stack AI-Powered App with Next.js – Timeline Guide

Build a modern full-stack app using **Next.js**, **MongoDB**, **AI integration**, and more – following best practices.

---

## 🚀 Project Setup

```bash
npx create-next-app@latest .
```
## 📁 Folder Structure

- `/app` for routes and layout (Next.js 13+)
- `/lib`, `/schemas`, `/components`, `/models`, `/utils`, `/types`

---

## 🧪 Zod Schemas

- Define user schema
- Use for validation (registration, login, URL params)

```bash
npm install zod
```

---

## 🧬 MongoDB & Mongoose

```bash
npm install mongoose
```

- Setup DB connection in `lib/dbConnect.ts`
- Handle model re-registration in edge runtime

---

## 🔐 Authentication (NextAuth)

```bash
npm install next-auth
```

- Setup `auth.ts` in `/lib`
- Use Credentials Provider
- Custom session, JWT callbacks
- Module augmentation for types

---

## 🔑 User Signup & Verification

- Check user existence
- Hash password with `bcryptjs`

```bash
npm install bcryptjs
```

- Generate OTP
- Store & expire verification code

---

## 📧 Email (Resend + React Email)

```bash
npm install resend react-email
```

- Build HTML email templates
- Send email using Resend

---

## 📡 API Routes

- Create `/api/signup`, `/api/signin`, `/api/check-username-unique`
- Use Zod for input validation
- Standard API response structure (`success`, `message`, `data?`)

---

## ✅ Postman Testing

- Test signup & signin endpoints

---

## 🧠 AI Integration (OpenAI + Vercel SDK)

```bash
npm install ai openai
```

- Use `useCompletion` hook
- Stream AI responses

---

## 📬 Messaging System

- Toggle `isAcceptingMessages`
- Create `/api/send-message`, `/api/messages`
- Use MongoDB Aggregation (match, unwind, group)

---

## 📦 React Hook Form + Zod

```bash
npm install react-hook-form @hookform/resolvers
```

- Use for all forms (signup, OTP)
- Integrate Zod for schema validation

---

## 💅 UI with Shadcn UI

```bash
npx shadcn-ui@latest init
```

- Build with `Button`, `Input`, `Switch`, `Card`, etc.
- Theme: Tailwind + Radix UI

---

## 🎠 Carousel (react-slick)

```bash
npm install react-slick slick-carousel
```

- Use on homepage to show messages

---

## 👤 Profile Page

- Show username, copy profile link
- Toggle accept messages

---

## 🧭 Navbar

- Show Sign In / Sign Out based on session

---

## 🧼 Misc

- Standardize API responses
- Protect routes with NextAuth middleware
- Setup `.env` with MongoDB URI, NEXTAUTH_SECRET, RESEND_API_KEY, OPENAI_API_KEY

---

## 🧾 Commands Summary

```bash
# Init
npx create-next-app@latest ai-fullstack-app --typescript

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Zod
npm install zod

# MongoDB
npm install mongoose

# Auth
npm install next-auth bcryptjs

# Email
npm install resend react-email

# AI
npm install ai openai

# Forms
npm install react-hook-form @hookform/resolvers

# UI
npx shadcn-ui@latest init

# Carousel
npm install react-slick slick-carousel
```

---

## ✅ Final Checklist

- [ ] Tailwind + UI setup  
- [ ] Zod schemas  
- [ ] MongoDB connection  
- [ ] Signup + OTP flow  
- [ ] Email templates with Resend  
- [ ] Auth with NextAuth  
- [ ] AI Message Suggestions  
- [ ] Messaging system APIs  
- [ ] Profile Page  
- [ ] Protected Routes  

---