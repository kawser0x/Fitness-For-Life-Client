# 🏋️ Fitness For Life — Frontend Web Application

A modern, full-stack fitness and wellness management platform built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **HeroUI**, **Better Auth**, and **Stripe Checkout**.

---

## 🔗 Live Links & Repositories

- 🌐 **Frontend Live Application**: [https://fitness-for-life-client.vercel.app/](https://fitness-for-life-client.vercel.app/)
- 🐙 **Frontend GitHub Repository**: [https://github.com/kawser0x/Fitness-For-Life-Client](https://github.com/kawser0x/Fitness-For-Life-Client)
- ⚡ **Backend Live API Server**: [https://fitness-for-life-server.vercel.app/](https://fitness-for-life-server.vercel.app/)
- 🐙 **Backend GitHub Repository**: [https://github.com/kawser0x/fitness-for-life-server](https://github.com/kawser0x/fitness-for-life-server)

---

## ✨ Key Features

### 👤 Multi-Role Dashboard Architecture
- **Student Members**: Browse workout classes, save favorite workouts, book sessions via Stripe Checkout, track enrolled classes, and apply to become certified trainers.
- **Certified Trainers**: Submit new workout classes for Admin approval, manage authored fitness programs, view enrolled student rosters, publish articles on the Community Forum, and review trainer statistics.
- **Super Administrators**: Overview platform growth, approve/reject pending trainer applications, manage class listings, moderate forum posts, toggle user block/unblock statuses (Soft Block), promote members to Admin, and review payment transactions.

### 💳 Stripe Hosted Checkout Integration
- Secure server-to-server booking persistence upon successful Stripe payment completion.
- Automated `bookingCount` increments and "Already Booked" button state recognition.

### 📊 Live Recharts Visual Analytics
- **Platform Growth & Revenue ($)**: 7-month rolling trajectory Area Chart tracking live revenue and member subscription growth.
- **Class Category Ratio**: Dynamic Donut/Pie Chart illustrating workout category distribution across MongoDB collections.

### 💬 Interactive Community Forum
- Multi-role discussion forum supporting article publishing, liking/disliking (one vote per user rule), commenting, and author/trainer/admin message moderation.

### 🛡️ Built-in Authorization & Role Protection
- Role-based action scoping: Trainer and Admin accounts automatically blur and disable class booking and favoriting buttons on class details pages.
- Client-side hydration safety checks preventing SSR/Client mismatch warnings.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (Turbopack App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/), [HeroUI v3](https://heroui.com/), [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Animations**: [Framer Motion](https://www.framer.com/motion/), [Recharts](https://recharts.org/), [React Icons](https://react-icons.github.io/react-icons/)
- **Authentication & Security**: [Better Auth](https://www.better-auth.com/), JWT Token Generation
- **Payments**: [Stripe JS SDK](https://stripe.com/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)

---

## 🚀 Local Development Setup

### 1. Prerequisites
Ensure you have **Node.js 18+** and **npm** installed on your system.

### 2. Clone Repository
```bash
git clone https://github.com/kawser0x/Fitness-For-Life-Client.git
cd Fitness-For-Life-Client
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NEXT_PUBLIC_IMGBB_API_KEY=c3f15c7e0c46645367b1297e68e4c029
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📦 Production Build

To test the production build locally:
```bash
npm run build
npm run start
```

---

## 📄 License
This project is licensed under the **ISC License**.
