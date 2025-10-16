# SplitEase Frontend

A modern expense splitting application built with Next.js 15, React 19, and TypeScript.

## Features

### 🔐 User Authentication

- Secure JWT-based login and signup
- Persistent sessions with automatic token refresh
- Protected routes that redirect unauthenticated users

### 👥 Group Management

- Create expense groups for different occasions (trips, shared apartments, etc.)
- Add members to groups by searching their email
- Manage group settings and member permissions

### � Group Chat

- Real-time messaging within expense groups
- Share updates about expenses and settlements
- Coordinate with group members about shared costs
- Message history for better expense context

### �💰 Expense Tracking

- Add expenses with custom descriptions and amounts
- Automatically split expenses equally among group members
- View detailed expense history for each group

### 💳 Settlement System

- Automatically calculate who owes money to whom
- Track settlements between group members
- Mark payments as completed to update balances

### ⚡ Real-time Updates

- Email notifications when new expenses are added to groups
- Automatic notification to all group members about expense changes

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Axios** - HTTP client

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

   **Environment Variables Explained:**

   - `NEXT_PUBLIC_API_URL`: The base URL for your backend API server
     - Use `http://localhost:3001/api` for local development
     - Replace with your production API URL when deploying
     - The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser

3. **Run development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License
