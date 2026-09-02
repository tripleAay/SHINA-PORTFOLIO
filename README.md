# Shina Adedokun — Portfolio

> A production-ready personal portfolio and digital product showcase built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

**Live website:** [shinaadedokun.com](https://shinaadedokun.com/)

---

## Overview

This repository contains the source code for my personal software engineering portfolio.

The portfolio is designed to do more than present a résumé. It is a working web application that demonstrates how I approach **frontend engineering, full-stack development, product interfaces, responsive design, data management, authentication, and modern web architecture**.

The experience combines a refined visual system with a functional backend-powered project management workflow.

---

## What It Demonstrates

The project brings together several areas of modern software development:

* Full-stack web development
* React and Next.js application architecture
* TypeScript development
* Responsive interface engineering
* Component-driven UI architecture
* Database-backed content
* Authentication and protected admin functionality
* Supabase integration
* Image upload and project management
* Multi-image project galleries
* Dynamic project filtering
* Light and dark themes
* Motion and interaction design
* Form handling and validation
* Production deployment with Vercel

---

## Features

### Portfolio Experience

* Responsive portfolio experience across desktop, tablet, and mobile
* Hero section with personal introduction and social links
* About and professional journey sections
* Technical skills and capabilities
* Dynamic project showcase
* Project category filtering
* Featured project indicators
* Project image galleries
* Project overview modal
* Previous/next project navigation
* Previous/next image navigation
* Keyboard navigation inside project galleries
* External project links
* Smooth scrolling
* Light and dark theme support
* Responsive mobile navigation
* Contact form

### Project Management

The portfolio includes a private administrative interface for managing portfolio content.

Administrators can:

* Sign in securely
* View portfolio projects
* Create projects
* Edit projects
* Delete projects
* Upload multiple project images
* Preview uploaded images
* Manage project categories
* Add project technologies
* Mark projects as featured
* Manage project links
* View incoming contact messages
* Mark messages as read
* Delete messages

---

## Architecture

The application uses the **Next.js App Router** with a component-based architecture.

```text
SHINA-PORTFOLIO
│
├── public/
│   └── static assets
│
├── src/
│   └── app/
│       ├── admin/
│       │   ├── login/
│       │   ├── dashboard/
│       │   ├── projects/
│       │   └── ...
│       │
│       ├── components/
│       │   ├── Hero
│       │   ├── Header
│       │   ├── About
│       │   ├── Skills
│       │   ├── Portfolio
│       │   ├── ContactForm
│       │   └── Footer
│       │
│       ├── contexts/
│       │   └── ThemeContext
│       │
│       ├── lib/
│       │   ├── client
│       │   └── server
│       │
│       ├── globals.css
│       └── page.tsx
│
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── package.json
└── README.md
```

---

## Technology Stack

### Frontend

* **Next.js 16**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Framer Motion**
* **React Icons**
* **Font Awesome**
* **Next/Image**

### Backend & Data

* **Supabase**
* **PostgreSQL**
* **Supabase Auth**
* **Supabase Storage**
* **Row Level Security (RLS)**

### Deployment

* **Vercel**

---

## Backend Architecture

The application uses Supabase as its backend platform.

### Database

The main application data is stored in PostgreSQL.

The portfolio system includes tables for:

```text
portfolio
messages
admin_users
```

### Portfolio

The `portfolio` table stores project information including:

* Title
* Description
* Primary image
* Multiple project images
* Project URL
* Category
* Technologies
* Featured status
* Creation date

Projects can contain multiple images, allowing the frontend to present a project as a visual case-study-style gallery.

### Messages

The contact form stores submissions in the `messages` table.

Stored information includes:

* Name
* Email
* Subject
* Message
* Read status
* Creation timestamp

### Admin Users

Administrative access is controlled through Supabase authentication and an `admin_users` table.

The application uses database-level authorization to restrict administrative operations.

---

## Security

Security is handled at the database level using **Row Level Security (RLS)**.

Public users can:

* Read published portfolio projects
* Submit contact messages

Administrative operations are restricted to authenticated administrators.

The application does not expose private administrative data to unauthenticated users.

Supabase Storage policies are also used to control administrative image uploads, updates, and deletion.

---

## Image Management

Projects support multiple images rather than being limited to a single project thumbnail.

The system supports:

* Multiple image uploads
* Image previews
* Image validation
* Supabase Storage
* Public project image URLs
* Project image galleries
* Thumbnail navigation
* Full-size project viewing

Existing projects using the original single-image structure are also normalized by the frontend for backwards compatibility.

---

## UI & Design System

The interface follows a deliberately restrained visual direction.

The design focuses on:

* Strong typography
* Generous spacing
* Clear visual hierarchy
* Subtle motion
* Minimal visual noise
* Responsive layouts
* Accessible interaction patterns
* Light and dark themes
* Yellow accent color
* Soft background grids
* Editorial-style composition

Animations are primarily used to reinforce interaction and hierarchy rather than overwhelm the interface.

---

## Theme System

The application includes a custom React theme context.

The theme system supports:

```text
Light Mode
     ↕
Dark Mode
```

The selected theme is persisted using browser storage so the user's preference remains available between visits.

The interface dynamically adapts backgrounds, typography, borders, controls, and other visual elements based on the active theme.

---

## Responsive Design

The portfolio is designed mobile-first and adapts across:

* Mobile phones
* Tablets
* Laptops
* Desktop displays

Particular attention is given to:

* Touch-friendly controls
* Mobile navigation
* Responsive project grids
* Image galleries
* Modal layouts
* Form usability
* Typography scaling
* Spacing and visual balance

---

## Project Gallery Interaction

Opening a project displays an interactive project overview.

Users can:

* Browse project images
* Select thumbnails
* Navigate images with arrows
* Navigate images with keyboard controls
* Move between projects
* Open the live project
* Close the project with Escape

Keyboard controls include:

```text
← / →
Navigate project images

↑ / ↓
Navigate projects

Esc
Close project overview
```

---

## Contact System

The contact form is connected directly to Supabase.

A visitor can submit a message containing:

```text
Name
Email
Subject
Message
```

Submissions are stored in PostgreSQL and can be reviewed from the protected administrative interface.

The form includes client-side validation and user feedback for successful and failed submissions.

---

## Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Do not commit environment files or private credentials to the repository.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tripleAay/SHINA-PORTFOLIO.git
```

### 2. Enter the project

```bash
cd SHINA-PORTFOLIO
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create:

```text
.env.local
```

and add your Supabase project credentials.

### 5. Start the development server

```bash
npm run dev
```

Open the development server in your browser:

```text
http://localhost:3000
```

---

## Production Build

To create a production build:

```bash
npm run build
```

To run the production build locally:

```bash
npm start
```

---

## Code Quality

The project uses ESLint for code quality and consistency.

Run:

```bash
npm run lint
```

---

## Deployment

The application is deployed using Vercel.

The production deployment is connected to the repository and automatically builds the Next.js application from the configured branch.

**Live application:** [shinaadedokun.com](https://shinaadedokun.com/)

---

## Development Philosophy

This portfolio is intentionally treated as a real software product rather than a static résumé.

The goal is to demonstrate the ability to move across the complete product development process:

```text
Idea
  ↓
UX / Interface
  ↓
Frontend Architecture
  ↓
Backend Integration
  ↓
Database
  ↓
Authentication
  ↓
Storage
  ↓
Testing & Refinement
  ↓
Production Deployment
```

The portfolio itself therefore becomes part of the work being demonstrated.

---

## Author

### Shina Adedokun

Software Engineer focused on building thoughtful digital products and scalable web experiences.

**Focus areas:**

* Full-stack web development
* React
* Next.js
* TypeScript
* Node.js
* Supabase
* Product development
* UI/UX
* AI integration
* Digital platforms

---

## Connect

* **Portfolio:** [shinaadedokun.com](https://shinaadedokun.com/)
* **GitHub:** [github.com/tripleAay](https://github.com/tripleAay)

---

## License

This project is a personal portfolio and is primarily intended to showcase my work, experience, and technical capabilities.

© 2026 Shina Adedokun. All rights reserved.

```

### One thing I would change on GitHub itself

Your repository is currently named **`SHINA-PORTFOLIO`**. It works, but for a professional developer portfolio I would consider:

**`shina-portfolio`**

rather than the all-caps version.

Also, your current GitHub description:

> Web developer portfolio showcasing modern web applications, software engineering projects, and technical experience.

is a little generic.

I'd use:

> **Production-ready software engineering portfolio built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Supabase.**

That immediately tells a recruiter or developer **what the project is and what technologies you actually used**.

And I would add GitHub repository topics such as:

`nextjs` · `react` · `typescript` · `tailwindcss` · `framer-motion` · `supabase` · `postgresql` · `portfolio` · `full-stack` · `vercel`

That will make the repository look substantially more intentional and technically credible.
```
