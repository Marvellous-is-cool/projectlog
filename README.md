# 🎓 Topics Log - Modern Project Topic Submission System

A stunning, ultra-modern Next.js web application for submitting and managing project topics in linguistics and communication disciplines. Built with MongoDB Atlas, featuring beautiful animations, and comprehensive admin functionality.

![Topics Log](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 Ultra-Modern Design

- **Beautiful gradient backgrounds** with glassmorphism effects
- **Smooth animations** powered by Framer Motion
- **Responsive design** that works on all devices
- **Premium UI components** with backdrop blur and shadows

### 📝 Smart Form System

- **Real-time validation** with Zod schema validation
- **Duplicate prevention** for names and matric numbers
- **Auto-formatting** for matric numbers (uppercase)
- **Character limits** and input sanitization
- **Beautiful error messages** with icons

### 🔐 Robust Backend

- **MongoDB Atlas** integration with connection pooling
- **Duplicate detection** at database level
- **Input validation** and sanitization
- **Error handling** with custom error types
- **Optimized queries** with indexes

### 👨‍💼 Powerful Admin Dashboard

- **Real-time statistics** with animated counters
- **Advanced filtering** by discipline and search
- **Export functionality** (CSV, JSON)
- **Detailed view modal** for each submission
- **Responsive data tables** with sorting
- **Beautiful charts** and metrics

### 📊 Export Capabilities

- **CSV Export** - Perfect for Excel and spreadsheet applications
- **JSON Export** - For data analysis and API integration
- **Automatic filename** with timestamps
- **Download progress** indicators

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd topicslog
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/topicslog?retryWrites=true&w=majority

   # NextAuth Secret (generate a random string)
   NEXTAUTH_SECRET=your-secret-key-here

   # Admin credentials (optional)
   ADMIN_EMAIL=admin@topicslog.com
   ADMIN_PASSWORD=admin123
   ```

4. **Set up MongoDB Atlas**

   - Create a MongoDB Atlas account at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a new cluster
   - Create a database user
   - Whitelist your IP address
   - Get your connection string and add it to `.env.local`

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

### For Students

1. Visit the home page
2. Fill out the beautiful submission form:
   - **Full Name** - Your complete name
   - **Matric Number** - Your student ID (automatically formatted)
   - **Discipline** - Choose between Linguistics or Communication
   - **Project Topic** - Describe your project in detail
3. Submit and receive instant feedback

### For Administrators

1. Navigate to `/admin`
2. View comprehensive dashboard with:
   - **Live statistics** showing total submissions by discipline
   - **Search and filter** capabilities
   - **Export options** for data analysis
   - **Detailed submission views**

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation and type safety
- **Lucide React** - Beautiful, customizable icons

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB Atlas** - Cloud database with global clusters
- **Mongoose** - Elegant MongoDB object modeling

## 🎯 Project Structure

```
topicslog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── submissions/   # CRUD operations
│   │   │   └── export/        # Export functionality
│   │   ├── admin/             # Admin dashboard page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/            # React components
│   │   ├── AdminDashboard.tsx # Admin interface
│   │   └── SubmissionForm.tsx # Student form
│   ├── lib/                   # Utility functions
│   │   ├── mongodb.ts         # Database connection
│   │   └── utils.ts          # Helper functions
│   └── models/               # Database models
│       └── TopicSubmission.ts # Submission schema
├── .env.local               # Environment variables
├── package.json             # Dependencies
└── README.md               # Documentation
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

---

<div align="center">
  <strong>Built with ❤️ for academic excellence</strong>
  <br>
  <em>Making project topic submission beautiful and effortless</em>
</div>
