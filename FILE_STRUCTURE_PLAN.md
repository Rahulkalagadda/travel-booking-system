# Improved File Structure Plan

## 📁 Current Issues
- 48 loose files in `src/components` root
- Mixed concerns (forms, cards, modals, dashboards)
- Inconsistent naming (some in folders, some loose)
- Hard to navigate and find related components

## 🎯 Proposed Structure

```
src/
├── app/                          # Next.js App Router pages
├── components/
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── theme-toggle.tsx
│   │
│   ├── features/                 # Feature-based organization
│   │   ├── auth/                 # Authentication
│   │   │   ├── login-form.tsx
│   │   │   └── signup-form.tsx
│   │   │
│   │   ├── hotels/               # Hotel management
│   │   │   ├── hotel-card.tsx
│   │   │   ├── hotel-onboarding/ (existing)
│   │   │   ├── add-hotel-form.tsx
│   │   │   ├── add-hotel-info-form.tsx
│   │   │   ├── add-hotel-facilities-form.tsx
│   │   │   ├── add-hotel-documents-form.tsx
│   │   │   ├── add-hotel-rooms-form.tsx
│   │   │   ├── similar-properties.tsx
│   │   │   └── image-grid.tsx
│   │   │
│   │   ├── rooms/                # Room management
│   │   │   ├── room-card.tsx
│   │   │   └── add-room-form.tsx
│   │   │
│   │   ├── bookings/             # Booking management
│   │   │   ├── booking-card.tsx
│   │   │   ├── user-bookings.tsx
│   │   │   └── payment-gateway.tsx
│   │   │
│   │   ├── reviews/              # Reviews
│   │   │   ├── review-card.tsx
│   │   │   ├── review-summary.tsx
│   │   │   ├── reviews-section.tsx
│   │   │   └── add-review-form.tsx
│   │   │
│   │   ├── flights/              # Flight booking
│   │   │   ├── flight-booking-modal.tsx
│   │   │   └── flight-results-client.tsx
│   │   │
│   │   ├── buses/                # Bus booking
│   │   │   ├── BusCard.tsx
│   │   │   ├── bus-booking-modal.tsx
│   │   │   ├── bus-booking-full.tsx
│   │   │   ├── bus-results-client.tsx
│   │   │   ├── bus-search-panel.tsx
│   │   │   └── add-bus-form.tsx
│   │   │
│   │   ├── search/               # Search functionality
│   │   │   ├── search-form.tsx
│   │   │   ├── search-filters.tsx
│   │   │   ├── search-suggestions.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── FilterSidebar.tsx
│   │   │
│   │   ├── admin/                # Admin features
│   │   │   ├── admin-dashboard.tsx
│   │   │   └── admin-promoter.tsx
│   │   │
│   │   ├── owner/                # Owner features
│   │   │   └── owner-dashboard.tsx
│   │   │
│   │   ├── ai/                   # AI features
│   │   │   ├── ai-suggestion-button.tsx
│   │   │   └── suggestion-modal.tsx
│   │   │
│   │   └── marketing/            # Marketing/Landing
│   │       ├── hero-3d-scene.tsx
│   │       ├── hero-scene-wrapper.tsx
│   │       ├── marketing-sections.tsx
│   │       ├── plan-your-trip.tsx
│   │       ├── verticals-showcase.tsx
│   │       └── meet-the-host.tsx
│   │
│   ├── shared/                   # Shared components (used across features)
│   │   └── theme-provider.tsx
│   │
│   ├── ui/                       # Shadcn UI primitives (existing)
│   │   └── ... (38 components)
│   │
│   └── index.ts                  # Barrel exports
│
├── lib/                          # Utilities & business logic
│   ├── data.ts
│   ├── firebase.ts
│   ├── types.ts
│   ├── utils.ts
│   ├── constants.ts
│   ├── validators.ts
│   ├── cache.ts
│   ├── server-utils.ts
│   └── index.ts
│
└── hooks/                        # Custom React hooks
    └── use-auth.tsx

```

## 📊 Benefits

### 1. **Feature-Based Organization**
- Related components grouped together
- Easier to find and maintain
- Clear separation of concerns

### 2. **Scalability**
- Easy to add new features
- Clear where new components should go
- Reduces cognitive load

### 3. **Better Imports**
```typescript
// Before
import { HotelCard } from '@/components/hotel-card'
import { RoomCard } from '@/components/room-card'
import { AddHotelForm } from '@/components/add-hotel-form'

// After
import { HotelCard, AddHotelForm } from '@/components/features/hotels'
import { RoomCard } from '@/components/features/rooms'
```

### 4. **Clearer Responsibilities**
- `layout/` - App-wide layout components
- `features/` - Domain-specific features
- `shared/` - Truly shared utilities
- `ui/` - Pure UI primitives

## 🚀 Migration Strategy

### Phase 1: Create Structure (Non-Breaking)
1. Create new folder structure
2. Keep existing files in place
3. Add new barrel exports

### Phase 2: Move Files (Breaking - Requires Import Updates)
1. Move files to new locations
2. Update imports across the app
3. Update barrel exports

### Phase 3: Cleanup
1. Remove old files
2. Update documentation
3. Verify all imports

## 📝 Implementation Notes

- **Existing folders** (`admin/`, `bookings/`, `bus/`, `dashboard/`, `hotels/`) will be consolidated
- **Naming convention**: kebab-case for files, PascalCase for components
- **Index files**: Each feature folder gets an index.ts for barrel exports
- **Backward compatibility**: Keep old imports working during migration

## 🎯 Next Steps

1. ✅ Create folder structure
2. ✅ Add README files to each feature folder
3. ⏳ Move files (requires careful import updates)
4. ⏳ Update all imports across the application
5. ⏳ Test thoroughly
6. ⏳ Remove old structure
