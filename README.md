
  # NourishNet SaaS Platform

  This is a code bundle for NourishNet SaaS Platform. The original project is available at https://www.figma.com/design/3xr1XXwBLcM1xek5rN928Z/NourishNet-SaaS-Platform.
NourishNet

A SaaS platform for modernizing tiffin services in urban India

Abstract

The tiffin service is a lifeline for millions of urban households in India, built on efficiency, affordability, and trust. However, most local providers face logistical challenges and operate with thin margins due to their reliance on manual processes. These challenges lead to wasted resources, delays, and limited customer satisfaction in an increasingly competitive on-demand economy.

NourishNet is a comprehensive Software-as-a-Service (SaaS) platform designed to digitize and optimize the operations of local tiffin services. It provides a dual-sided solution:

B2B Vendor Dashboard: Helps providers manage subscribers, publish menus, track delivery staff, analyze sales, and optimize logistics.

B2C Mobile App: Enables consumers to easily subscribe, customize meals, track deliveries in real-time, and manage their daily plans.

Key innovations include:

AI-powered route optimization for delivery staff.

Flexible subscription and billing management with pause/resume and donation options.

Real-time delivery tracking with ETAs and notifications.

AI-driven allergy scanner and sentiment analysis for customer feedback and menu safety.

Community features like recipe voting hubs, festive meal themes, and donation tracking.

NourishNet empowers vendors to scale their businesses while delivering a modern, seamless experience to customers.

Domain

Domain: FoodTech / SaaS / Logistics Optimization

Focus: Tiffin service digitization, delivery route optimization, subscription management, and customer engagement

Tech Stack & Tools Used
Frontend

Web Dashboard (B2B): Next.js (TypeScript) + Tailwind CSS

Mobile App (B2C): React Native (Expo)

Backend & APIs

Framework: NestJS / Fastify (TypeScript)

Database: PostgreSQL with Prisma ORM

Queue Management: BullMQ + Redis

Routing Optimization: Mapbox Optimization API + OR-Tools (for VRP/CVRP solver)

Real-Time Communication: WebSockets (Socket.IO) or Firebase

Payments: Razorpay Node SDK

Infrastructure & Hosting

Frontend Hosting: Vercel

Backend Hosting: Google Cloud Run / AWS Fargate

Observability: Sentry, Prometheus

Extras / AI Features

Allergy Scanner: AI-driven menu safety alerts

Sentiment Analysis: Feedback analysis for vendors

Predictive Delays: ML-based traffic/weather forecasts

Community Engagement: Recipe voting, loyalty points, festival meal themes

Team Details
Team name: Polymorphism
Team members : 
- Scarlett Menezes
- Avril Fernandes
- Suzan Cardoz
- Rebekah Mthew
  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
