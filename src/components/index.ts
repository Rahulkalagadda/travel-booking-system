/**
 * Barrel exports for feature-based components
 * 
 * This file provides clean imports for all components organized by feature.
 * 
 * Usage:
 * import { HotelCard, LoginForm, SearchBar } from '@/components'
 */

// Layout Components
export { Header } from './header';
export { Footer } from './footer';
export { ThemeToggle } from './theme-toggle';

// Auth Components (to be moved to features/auth)
export { default as LoginForm } from './login-form';
export { default as SignupForm } from './signup-form';

// Hotel Components (to be moved to features/hotels)
export { HotelCard } from './hotel-card';
export { SimilarProperties } from './similar-properties';
export { ImageGrid } from './image-grid';

// Room Components (to be moved to features/rooms)
export { RoomCard } from './room-card';

// Booking Components (to be moved to features/bookings)
export { BookingCard } from './booking-card';
export { default as UserBookings } from './user-bookings';
export { default as PaymentGateway } from './payment-gateway';

// Review Components (to be moved to features/reviews)
export { ReviewCard } from './review-card';
export { ReviewSummary } from './review-summary';
export { ReviewsSection } from './reviews-section';

// Search Components (to be moved to features/search)
export { SearchBar } from './SearchBar';
export { FilterSidebar } from './FilterSidebar';

// Bus Components (to be moved to features/buses)
export { BusCard } from './BusCard';

// Marketing Components (to be moved to features/marketing)
export { HeroSceneWrapper } from './hero-scene-wrapper';
export { default as MarketingSections } from './marketing-sections';
export { default as PlanYourTrip } from './plan-your-trip';
export { default as VerticalsShowcase } from './verticals-showcase';

// Admin Components (to be moved to features/admin)
export { default as AdminDashboard } from './admin-dashboard';

// Owner Components (to be moved to features/owner)
export { default as OwnerDashboard } from './owner-dashboard';

// AI Components (to be moved to features/ai)
export { default as AiSuggestionButton } from './ai-suggestion-button';
export { default as SuggestionModal } from './suggestion-modal';

// Shared Components
export { ThemeProvider } from './theme-provider';

// UI Components (Shadcn)
export { Skeleton, CardSkeleton } from './ui/skeletons';
export { Button } from './ui/button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
export { Input } from './ui/input';
export { Label } from './ui/label';
export { Toaster } from './ui/toaster';
export { useToast } from './ui/use-toast';

/**
 * Note: After migration to feature folders, update these exports to:
 * export * from './features/auth'
 * export * from './features/hotels'
 * etc.
 */
