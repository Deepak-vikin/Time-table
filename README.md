# AI-Based NEP 2020 Timetable Generator

A comprehensive web application for generating AI-powered, NEP 2020 compliant school timetables with intelligent scheduling algorithms and beautiful user interface.

## 🎯 Features

### NEP 2020 Compliance
- **Multidisciplinary Integration**: Supports cross-subject learning sessions
- **Holistic Development**: Balances academic, creative, physical, and value-based education
- **Art Education Priority**: Ensures creative subjects get optimal scheduling
- **Physical Education Balance**: Smart scheduling avoiding post-meal periods
- **Value Education Integration**: Moral and ethical learning throughout the week
- **Flexible Assessment**: Continuous evaluation support

### AI-Powered Scheduling
- **OpenAI Integration**: GPT-4 powered intelligent timetable generation
- **Conflict Resolution**: Automatic detection and resolution of scheduling conflicts
- **Optimization Algorithms**: Maximizes teacher efficiency and student learning outcomes
- **Confidence Scoring**: AI provides confidence scores for each scheduling decision
- **Fallback Generation**: Smart fallback when AI services are unavailable

### Modern User Interface
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Intuitive Dashboard**: Real-time analytics and NEP compliance metrics
- **Drag & Drop**: Interactive timetable editing capabilities
- **Beautiful Animations**: Smooth transitions and micro-interactions
- **Dark/Light Themes**: Customizable appearance preferences

### Comprehensive Management
- **Teacher Management**: Profile management with NEP training status
- **Subject Catalog**: NEP-categorized subjects with priority levels
- **Class Organization**: Multi-grade and multi-section support
- **Time Slot Configuration**: Flexible period and break management
- **Settings Panel**: Comprehensive system configuration

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for modern, responsive styling
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **React Hot Toast** for notifications
- **Lucide React** for beautiful icons

### Backend & Database
- **Node.js** with Express for API services
- **Supabase** (PostgreSQL) for robust data management
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates

### AI & Integration
- **OpenAI GPT-4** for intelligent timetable generation
- **Custom NEP 2020 prompts** for compliance-focused scheduling
- **Fallback algorithms** for offline operation
- **Confidence scoring** for quality assurance

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account for database
- OpenAI API key for AI features

## 🛠️ Installation & Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd nep-timetable-generator
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Add your credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

3. **Database Setup**
   - Create a new Supabase project
   - Run the migration file: `supabase/migrations/create_nep_timetable_schema.sql`
   - This creates all necessary tables with NEP 2020 compliance structure

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Core Tables
- **schools**: Institution information and NEP compliance levels
- **classes**: Grade and section management with NEP streams
- **subjects**: NEP-categorized subject catalog with priorities
- **teachers**: Staff profiles with NEP training status
- **time_slots**: Configurable period and break definitions
- **timetable_entries**: Main scheduling data with AI confidence scores
- **nep_compliance_metrics**: Compliance tracking and analytics

### NEP 2020 Subject Categories
- **Core Subjects**: Mathematics, Sciences, Languages
- **Art Education**: Creative and artistic subjects
- **Physical Education**: Sports and physical activities
- **Value Education**: Moral and ethical learning
- **Vocational Education**: Practical skill development
- **Elective Subjects**: Optional specialized subjects

## 🤖 AI Features

### Intelligent Scheduling
The AI system considers multiple factors:
- NEP 2020 compliance requirements
- Teacher availability and specialization
- Subject priority and credit hours
- Optimal learning time slots
- Multidisciplinary integration opportunities
- Student cognitive load distribution

### NEP Compliance Analysis
- Real-time compliance scoring
- Detailed category-wise analysis
- Improvement recommendations
- Historical compliance tracking

## 🎨 UI/UX Features

### Design Principles
- **Apple-level aesthetics** with attention to detail
- **Educational color palette** promoting focus and learning
- **Consistent spacing** using 8px grid system
- **Readable typography** with proper contrast ratios
- **Intuitive navigation** with clear visual hierarchy

### Interactive Elements
- **Hover states** on all interactive elements
- **Loading animations** for better user feedback
- **Smooth transitions** between different views
- **Responsive breakpoints** for all device sizes

## 📈 Analytics & Reporting

### NEP Compliance Dashboard
- Overall compliance percentage
- Category-wise performance metrics
- Historical trend analysis
- Improvement recommendations

### Timetable Analytics
- Teacher workload distribution
- Subject scheduling patterns
- AI confidence score trends
- Conflict resolution statistics

## 🔧 Configuration

### System Settings
- School information and contact details
- Timetable constraints (periods, breaks, timings)
- AI model configuration and parameters
- NEP compliance strictness levels
- Database connection settings

### NEP 2020 Options
- Strict compliance enforcement
- Multidisciplinary session requirements
- Art education scheduling priority
- Physical education mandatory status
- Value education integration level

## 🚀 Deployment

The application is ready for deployment on modern hosting platforms:

### Frontend Deployment
- Build optimized for production
- Environment variable configuration
- Static asset optimization
- Progressive Web App capabilities

### Backend Deployment
- Scalable Node.js architecture
- Database connection pooling
- API rate limiting and security
- Health check endpoints

## 🤝 Contributing

We welcome contributions to improve the NEP 2020 timetable generator:

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper testing
4. Submit a pull request with detailed description

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation for common solutions
- Contact the development team

## 🙏 Acknowledgments

- National Education Policy 2020 guidelines
- OpenAI for AI capabilities
- Supabase for database infrastructure
- React and TypeScript communities
- All contributors and testers

---

**Built with ❤️ for the future of education in India**