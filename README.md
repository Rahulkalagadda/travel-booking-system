# 🌍 Travel Booking System

A comprehensive, modern travel and accommodation booking platform built with Next.js 15, featuring hotel reservations, flight bookings, bus tickets, and railway services. This full-stack application provides a seamless experience for travelers while offering powerful management tools for property owners and administrators.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9-orange)](https://firebase.google.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11-purple)](https://redux-toolkit.js.org/)

## ✨ Features

### 🏨 Hotel Booking
- **Advanced Search & Filtering**: Search hotels by location, price range, amenities, and ratings
- **Detailed Property Listings**: Comprehensive hotel information with images, amenities, and reviews
- **Real-time Availability**: Check room availability and pricing in real-time
- **Seamless Booking Flow**: User-friendly booking process with instant confirmation
- **Property Management**: Hotel owners can list and manage their properties

### ✈️ Flight Booking
- **Domestic & International Flights**: Search and book flights worldwide
- **Flexible Search**: One-way, round-trip, and multi-city options
- **Real-time Pricing**: Live fare updates and seat availability
- **Flight Comparison**: Compare multiple airlines and routes
- **Amadeus API Integration**: Powered by industry-leading flight data

### 🚌 Bus Booking
- **Route Search**: Find bus routes between cities
- **Seat Selection**: Interactive seat map for choosing preferred seats
- **Multiple Operators**: Compare different bus operators and services
- **Real-time Tracking**: Track your bus in real-time

### 🚆 Railway Services
- **Train Search**: Search trains by route, date, and class
- **PNR Status**: Check PNR status and booking details
- **Live Train Tracking**: Real-time train location and status
- **Seat Availability**: Check seat availability across different classes
- **IRCTC Integration**: Seamless integration with railway booking systems

### 👥 Multi-Role System
- **Guest Users**: Browse and book travel services
- **Hotel Owners**: Submit properties, manage listings, and view bookings
- **Administrators**: Platform oversight, approval workflows, and user management

### 🤖 AI-Powered Features
- **Smart Recommendations**: AI-powered suggestions using Google Generative AI
- **Alternative Options**: Intelligent alternatives when preferred choices are unavailable
- **Personalized Experience**: Tailored recommendations based on user preferences

### 🔐 Security & Performance
- **Role-Based Authentication**: Secure Firebase authentication with custom roles
- **Redis Caching**: High-performance caching with Upstash Redis
- **State Management**: Redux Toolkit for efficient state management
- **Server-Side Rendering**: Optimized performance with Next.js App Router
- **API Security**: Protected routes with Firebase Admin SDK

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router with Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI, Radix UI
- **Icons**: Lucide React
- **Animations**: Framer Motion, Spline 3D
- **State Management**: Redux Toolkit, React Redux
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Date Handling**: date-fns, React Day Picker

### Backend & Services
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Caching**: Upstash Redis
- **AI/ML**: Google Generative AI (Genkit)
- **Flight API**: Amadeus API
- **Railway API**: IRCTC API Integration

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript Compiler
- **Build Tool**: Next.js with Turbopack

## 📂 Project Structure

```
travel-booking-system/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── admin/             # Admin dashboard
│   │   ├── owner/             # Hotel owner dashboard
│   │   ├── hotels/            # Hotel search & details
│   │   ├── flights/           # Flight booking
│   │   ├── bus/               # Bus booking
│   │   ├── railway/           # Railway services
│   │   │   ├── search/
│   │   │   ├── pnr-status/
│   │   │   └── live-tracking/
│   │   └── api/               # API routes
│   │       ├── hotels/
│   │       ├── flights/
│   │       ├── buses/
│   │       └── railway/
│   ├── components/            # Reusable components
│   │   ├── ui/               # Shadcn UI primitives
│   │   ├── layout/           # Layout components
│   │   └── features/         # Feature-specific components
│   ├── ai/                   # AI integration (Genkit)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities & configurations
│   │   ├── firebase.ts       # Firebase client config
│   │   ├── firebase-admin.ts # Firebase Admin SDK
│   │   ├── redis.ts          # Redis client
│   │   ├── railway-api.ts    # Railway API integration
│   │   └── utils.ts          # Helper functions
│   └── store/                # Redux store
│       ├── slices/           # Redux slices
│       └── store.ts          # Store configuration
├── public/                   # Static assets
├── docs/                     # Documentation
└── scripts/                  # Utility scripts
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: v18 or later
- **npm**: v9 or later
- **Firebase Account**: For authentication and database
- **Upstash Account**: For Redis caching (optional but recommended)
- **Google AI API Key**: For AI features
- **Amadeus API Key**: For flight bookings

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahulkalagadda/travel-booking-system.git
   cd travel-booking-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin SDK (for server-side)
   FIREBASE_ADMIN_PROJECT_ID=your_project_id
   FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
   FIREBASE_ADMIN_PRIVATE_KEY=your_private_key

   # Google Generative AI
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key

   # Upstash Redis
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token

   # Amadeus API (for flights)
   AMADEUS_API_KEY=your_amadeus_api_key
   AMADEUS_API_SECRET=your_amadeus_api_secret

   # Railway API
   RAILWAY_API_KEY=your_railway_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Type check
npm run typecheck

# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit with watch mode

## 🎯 Key Functionalities

### For Travelers
1. Search and compare hotels, flights, buses, and trains
2. View detailed information and reviews
3. Book accommodations and travel tickets
4. Track bookings and manage reservations
5. Get AI-powered recommendations

### For Hotel Owners
1. Register and list properties
2. Manage room inventory and pricing
3. View and manage bookings
4. Update property information
5. Track revenue and analytics

### For Administrators
1. Approve/reject hotel submissions
2. Manage users and roles
3. Monitor platform activity
4. Handle disputes and support
5. View platform analytics

## 🔐 Authentication & Authorization

The application uses Firebase Authentication with custom role-based access control:

- **Public Routes**: Landing page, search pages
- **Protected Routes**: Booking pages, user dashboard
- **Owner Routes**: Property management dashboard
- **Admin Routes**: Platform administration panel

## 📊 State Management

Redux Toolkit is used for global state management with the following slices:

- **User Slice**: User authentication and profile
- **Booking Slice**: Booking information and history
- **Hotel Slice**: Hotel search and filters
- **UI Slice**: UI state (modals, notifications, theme)

## 🚀 Performance Optimizations

- **Server-Side Rendering**: Fast initial page loads
- **Redis Caching**: Reduced database queries
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Turbopack**: Fast development builds

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👨‍💻 Author

**Rahul Kalagadda**
- GitHub: [@Rahulkalagadda](https://github.com/Rahulkalagadda)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- Firebase for backend infrastructure
- Amadeus for flight data API
- Google AI for generative AI capabilities

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Next.js 15 and modern web technologies**
