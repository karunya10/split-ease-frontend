# SplitEase Frontend

A modern expense splitting application built with Next.js 15, React 19, and TypeScript. SplitEase helps users track shared expenses, split bills among group members, and settle balances easily.

## 🚀 Features

- **User Authentication**: Secure login and signup with JWT tokens
- **Group Management**: Create and manage expense groups with multiple members
- **Expense Tracking**: Add expenses and automatically split them among group members
- **Settlement System**: Track who owes whom and mark settlements as paid
- **Real-time Updates**: Automatic data synchronization with React Query
- **Responsive Design**: Modern UI built with TailwindCSS and custom components
- **Type Safety**: Full TypeScript support throughout the application

## 📁 Project Structure

```
splitease-frontend/
├── public/                     # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── (home)/            # Route group for home page components
│   │   │   └── components/
│   │   │       ├── AuthForms.tsx      # Login/Signup forms
│   │   │       ├── FeatureGrid.tsx    # Feature showcase grid
│   │   │       ├── Hero.tsx           # Landing page hero section
│   │   │       └── WelcomeDashboard.tsx
│   │   ├── dashboard/         # Dashboard route
│   │   │   ├── page.tsx      # Main dashboard page
│   │   │   └── components/   # Dashboard-specific components
│   │   │       ├── AddMemberDialog.tsx        # Add member to group
│   │   │       ├── BalanceSummary.tsx         # Balance overview
│   │   │       ├── CreateExpenseDialog.tsx    # Create new expense
│   │   │       ├── CreateGroupDialog.tsx      # Create new group
│   │   │       ├── DashboardContent.tsx       # Main content area
│   │   │       ├── DashboardSidebar.tsx       # Sidebar navigation
│   │   │       ├── DeleteGroupDialog.tsx      # Delete group confirmation
│   │   │       ├── EmptyState.tsx             # Empty state component
│   │   │       ├── ExpensesList.tsx           # List of expenses
│   │   │       ├── GroupHeader.tsx            # Group header info
│   │   │       ├── GroupMembersDialog.tsx     # View/manage members
│   │   │       ├── index.ts                   # Component exports
│   │   │       └── SettlementsList.tsx        # Settlement tracking
│   │   ├── welcome/           # Welcome route
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── providers.tsx      # App providers (Auth, Query, Toast)
│   ├── components/            # Shared components
│   │   ├── ui/               # UI component library
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── toast.tsx
│   │   ├── AuthForm.tsx      # Authentication form component
│   │   └── Header.tsx        # Navigation header
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication context and provider
│   ├── hooks/                # Custom hooks
│   │   └── useDashboard.ts   # Dashboard data and mutations
│   ├── lib/                  # Utility libraries
│   │   ├── api.ts            # Configured Axios instance
│   │   ├── dashboardApi.ts   # API functions for dashboard
│   │   ├── dashboardUtils.ts # Dashboard utility functions
│   │   └── utils.ts          # General utilities
│   └── types/                # TypeScript type definitions
│       └── dashboard.ts      # Dashboard-related types
├── components.json           # Shadcn/UI configuration
├── eslint.config.mjs        # ESLint configuration
├── next-env.d.ts           # Next.js type declarations
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## 🛠 Tech Stack

### Core Technologies

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React version with modern features
- **TypeScript 5**: Static type checking
- **Tailwind CSS 4**: Utility-first CSS framework

### State Management & Data Fetching

- **TanStack React Query**: Server state management and caching
- **React Context**: Client-side state management for authentication

### UI Components

- **Radix UI**: Headless UI components for accessibility
- **Lucide React**: Icon library
- **Custom UI Components**: Built with Tailwind and Radix

### HTTP Client

- **Axios**: HTTP client for API requests with interceptors

### Development Tools

- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing

## 🏗 Architecture Overview

### Authentication Flow

1. **AuthContext** (`src/contexts/AuthContext.tsx`): Manages user authentication state
2. **Local Storage**: Persists JWT tokens and user data
3. **Axios Interceptors**: Automatically adds auth headers to requests
4. **Route Protection**: Redirects based on authentication status

### Data Management

1. **React Query**: Handles server state, caching, and synchronization
2. **Custom Hooks**: Abstracts data fetching logic (`useDashboard.ts`)
3. **API Layer**: Centralized API functions (`dashboardApi.ts`)
4. **Type Safety**: Full TypeScript coverage for data models

### Component Structure

1. **Route Groups**: Organized by feature (`(home)`, `dashboard`)
2. **Component Hierarchy**: Clear separation of concerns
3. **Reusable UI**: Shared component library in `src/components/ui/`
4. **Feature Components**: Specific to each route/feature

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API server running (for full functionality)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd splitease-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎯 Key Features Explained

### 1. Authentication System

- **JWT-based authentication** with automatic token refresh
- **Persistent sessions** using localStorage
- **Protected routes** with automatic redirects
- **Form validation** with error handling

### 2. Group Management

- **Create groups** for different expense categories
- **Invite members** by email search
- **Role-based permissions** (owner, admin, member)
- **Delete groups** with confirmation dialogs

### 3. Expense Tracking

- **Add expenses** with custom descriptions and amounts
- **Automatic splitting** among group members
- **Custom splits** for unequal distributions
- **Expense history** with detailed views

### 4. Settlement System

- **Calculate balances** automatically
- **Track settlements** between members
- **Mark payments** as completed
- **Net balance** calculations

### 5. Real-time Updates

- **React Query** for automatic background refetching
- **Optimistic updates** for better UX
- **Error handling** with user-friendly messages
- **Loading states** throughout the application

## 🔧 Configuration

### Tailwind CSS

Custom configuration with:

- Extended color palette
- Custom animations
- Responsive breakpoints
- Component classes

### TypeScript

Strict configuration with:

- Path aliases (`@/` for `src/`)
- Strict type checking
- Next.js optimizations

### ESLint

Next.js recommended rules with:

- TypeScript support
- React hooks rules
- Import order enforcement

## 📱 UI Components

### Custom UI Library

Located in `src/components/ui/`, includes:

- **Button**: Various styles and sizes
- **Card**: Content containers
- **Dialog**: Modal dialogs
- **Input**: Form inputs with validation
- **Label**: Accessible form labels
- **Toast**: Notification system

### Feature Components

- **Dashboard**: Main application interface
- **Auth Forms**: Login and signup
- **Group Management**: CRUD operations for groups
- **Expense Management**: Add and track expenses
- **Settlement Tracking**: Balance calculations and payments

## 🌐 API Integration

### Base Configuration

- **Axios client** with base URL configuration
- **Request interceptors** for authentication
- **Response interceptors** for error handling
- **Automatic retries** for failed requests

### API Endpoints

- `POST /auth/login` - User authentication
- `POST /auth/signup` - User registration
- `GET /groups` - Fetch user's groups
- `POST /groups` - Create new group
- `GET /groups/:id` - Get group details
- `POST /groups/:id/expenses` - Add expense
- `GET /groups/:id/settlements/summary` - Get settlement summary

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

Set the following for production:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### Deployment Platforms

- **Vercel**: Optimized for Next.js applications
- **Netlify**: Static site deployment
- **AWS**: Complete cloud infrastructure
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Add proper error handling
- Include loading states for async operations
- Test components thoroughly
- Follow the established folder structure

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Authentication errors**

   - Check API URL configuration
   - Verify backend server is running
   - Clear localStorage and cookies

2. **Build errors**

   - Run `npm install` to update dependencies
   - Check TypeScript errors with `npm run lint`
   - Verify environment variables

3. **API connection issues**
   - Confirm backend server is accessible
   - Check CORS configuration on backend
   - Verify API endpoints match frontend calls

### Debug Mode

Enable React Query DevTools in development:

- DevTools automatically appear in development builds
- Use browser network tab to monitor API calls
- Check console for detailed error messages

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check existing documentation
- Review the troubleshooting section

---

_Last updated: October 2025_
