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
## 📧 Email (Resend + React Email)

```bash
npm install resend react-email
```

- Build HTML email templates
- Send email using Resend

Here’s a clean, concise markdown summary of both videos, focusing on the timeline of file creation and the overall flow:

---

# ✅ **User Signup System in Next.js with Custom OTP & Resend Email**  

### 📌 **Goal:**
Build a flexible custom signup flow that:
- Requires unique username + email
- Sends a **6-digit OTP** to the email
- Marks users as unverified until OTP verification
- **Does not hold usernames** for unverified users

### 🛠️ **Key File Creations & Setup Timeline**

| File / Folder                         | Purpose                                                                 |
|--------------------------------------|-------------------------------------------------------------------------|
| `.env`                               | Stores **Resend API key**                                              |
| `lib/resend.ts`                      | Sets up and exports Resend client using API key                        |
| `emails/verification-email.tsx`     | React Email template for sending OTP with `username` and `otp` props  |
| `helpers/sendVerificationEmail.ts`  | Function to send verification email using `resend.emails.send()`       |
| `pages/api/signup/route.ts`         | **API route** that begins the signup logic and email dispatching       |

- We made **resend.ts** to send the email, but we can have many many emails so we will put them all in **helpers** folder. But for sending the email we will use templates (here: **sendVerificationEmail.tsx** component)  
### 🧰 **Packages Installed**
```bash
npm install resend react-email bcryptjs
```
**After receiving** `username`, `email`, and `password` from frontend:

1. ✅ **Check if username already exists** (only if user is verified).
2. ✅ **Check if email already exists.**

- 🔒 **If no user by email**:  
  - Hash password  
  - Generate OTP + expiry  
  - Create new user with `isVerified: false`  
  - Save to DB  
  - Call `sendVerificationEmail()`

- 🔁 **If user exists by email but is unverified**:  
  - Hash new password  
  - Generate new OTP + expiry  
  - Update user record  
  - Resend verification email

3. 🛑 **If user exists and is verified**:  
   Return error: “User already exists with this email.”
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

## 🔐 Authentication (NextAuth)

```bash
npm install next-auth
```

- Setup `auth.ts` in `/lib`
- Use Credentials Provider
- Custom session, JWT callbacks
- Module augmentation for types

---


## 🧠 **What's Our Goal Here?**
We're setting up **authentication in a Next.js project using Auth.js (formerly NextAuth.js)**. This includes:

- Custom login with email/password
- Social logins (like GitHub/Google)
- Secure sessions with JWT
- Route protection using middleware
- Custom UI pages (not the default boring ones)

---

## 🗂️ **Folder & File Structure Overview**

Here’s what we’ll create, *why* we need it, and how it all connects.

---

### ✅ 1. `authOptions`
**📍Location**: Usually in `lib/` or `utils/` or `server/` folder. But we have made it beside auth route.  
**🔧 Purpose**: This file holds the **configuration for NextAuth/Auth.js**.

**Includes:**
- All the **Providers** (Credentials, GitHub, etc.)
- `callbacks` (to customize tokens and session)
- `pages` (to override sign-in UI routes)
- `session` strategy (JWT-based in most cases)
- Custom error throwing & handling (like user not verified)

➡️ This is the *heart* of your Auth.js setup.

---

### ✅ 2. `[...nextauth] route`
**📍Location**: `app/api/auth/[...nextauth]`  
**🔧 Purpose**: It’s the **API route handler** that plugs in the config from `authOptions.ts`.

```ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

➡️ This is where Auth.js *gets activated*. All sign-in/sign-out calls go here.

---

### ✅ 3. `middleware.ts`
**📍Location**: Root of `src/` or project  
**🔧 Purpose**: Runs **before any protected route loads**. Handles:

- Checking if a token exists
- Redirecting to `/signin` if unauthenticated
- Preventing signed-in users from going back to `/signin`, `/signup`, etc.

```ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  // logic to redirect based on token presence
}
```

➡️ It’s like a **security gatekeeper** for your app.

---

### ✅ 4. `types/next-auth.d.ts`
**📍Location**: `types/` or root  
**🔧 Purpose**: This is for **TypeScript module augmentation**.

Why needed?
When you add custom fields like `user._id` or `role` in the JWT/session,
TypeScript doesn’t know those exist. You define them here.

```ts
declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      role: string;
    };
  }

  interface JWT {
    _id: string;
    role: string;
  }
}
```

➡️ Tells TypeScript: "Hey, my session has extra info. Don't freak out."

---

### ✅ 5. `components/SessionProvider.tsx`
**🔧 Purpose**: Wraps your app with Auth context.  
**Why**: To use `useSession()` hook in any component.

```tsx
"use client";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

➡️ Without this, your frontend doesn’t know if a user is logged in.

---

### ✅ 6. Custom Pages
Auth.js gives you default pages, but we’re making it beautiful.

- `app/signin/page.tsx`
- `app/signup/page.tsx`
- `app/dashboard/page.tsx` (protected)
- `app/verify/page.tsx` (optional email verification status page)

➡️ These match the routes you define in `authOptions.pages`.

---

### ✅ 7. `User` Model + DB Utility
If using credentials (email/password), you need to:
- Hash passwords
- Find users
- Store new users

So, you’ll have:

- `models/User.ts`
- `lib/dbConnect.ts`

➡️ Required for custom login (not needed if you only use GitHub/Google).

---

## 🔄 What All Will Be Affected In Your Project?


| Area | What you'll update |
|------|--------------------|
| 🔐 Authentication | `authOptions.ts`, `[...nextauth].ts`, `middleware.ts` |
| 🔄 API Routes | Credential auth hits your DB (`User.ts`, `dbConnect.ts`) |
| 💻 UI Pages | Custom `signin`, `signup`, `dashboard` pages |
| 🧠 Session Access | Wrap app with `SessionProvider.tsx`, use `useSession()` |
| 🔧 Type Safety | Extend types in `next-auth.d.ts` |
| 🔁 App Routing | Route protection via `middleware.ts` logic |


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