# File Structure Migration Guide

## 🎯 Overview
This guide helps you migrate to the new improved file structure.

## 📁 New Structure

### Feature-Based Organization
Components are now organized by **feature/domain** rather than by type:

```
components/
├── layout/          # App-wide layout
├── features/        # Feature-specific components
│   ├── auth/
│   ├── hotels/
│   ├── rooms/
│   ├── bookings/
│   ├── reviews/
│   ├── flights/
│   ├── buses/
│   ├── search/
│   ├── admin/
│   ├── owner/
│   ├── ai/
│   └── marketing/
├── shared/          # Truly shared utilities
└── ui/              # UI primitives (Shadcn)
```

## 🔄 Migration Status

### ✅ Phase 1: Structure Created
- [x] Created all feature folders
- [x] Added README documentation
- [x] Created migration plan

### ⏳ Phase 2: File Movement (To Do)
Files need to be moved from root to feature folders:

#### Auth (`features/auth/`)
- [ ] `login-form.tsx`
- [ ] `signup-form.tsx`

#### Hotels (`features/hotels/`)
- [ ] `hotel-card.tsx`
- [ ] `add-hotel-form.tsx`
- [ ] `add-hotel-info-form.tsx`
- [ ] `add-hotel-facilities-form.tsx`
- [ ] `add-hotel-documents-form.tsx`
- [ ] `add-hotel-rooms-form.tsx`
- [ ] `similar-properties.tsx`
- [ ] `image-grid.tsx`

#### Rooms (`features/rooms/`)
- [ ] `room-card.tsx`
- [ ] `add-room-form.tsx`

#### Bookings (`features/bookings/`)
- [ ] `booking-card.tsx`
- [ ] `user-bookings.tsx`
- [ ] `payment-gateway.tsx`

#### Reviews (`features/reviews/`)
- [ ] `review-card.tsx`
- [ ] `review-summary.tsx`
- [ ] `reviews-section.tsx`
- [ ] `add-review-form.tsx`

#### Flights (`features/flights/`)
- [ ] `flight-booking-modal.tsx`
- [ ] `flight-results-client.tsx`

#### Buses (`features/buses/`)
- [ ] `BusCard.tsx`
- [ ] `bus-booking-modal.tsx`
- [ ] `bus-booking-full.tsx`
- [ ] `bus-results-client.tsx`
- [ ] `bus-search-panel.tsx`
- [ ] `add-bus-form.tsx`

#### Search (`features/search/`)
- [ ] `search-form.tsx`
- [ ] `search-filters.tsx`
- [ ] `search-suggestions.tsx`
- [ ] `SearchBar.tsx`
- [ ] `FilterSidebar.tsx`

#### Admin (`features/admin/`)
- [ ] `admin-dashboard.tsx`
- [ ] `admin-promoter.tsx`

#### Owner (`features/owner/`)
- [ ] `owner-dashboard.tsx`

#### AI (`features/ai/`)
- [ ] `ai-suggestion-button.tsx`
- [ ] `suggestion-modal.tsx`

#### Marketing (`features/marketing/`)
- [ ] `hero-3d-scene.tsx`
- [ ] `hero-scene-wrapper.tsx`
- [ ] `marketing-sections.tsx`
- [ ] `plan-your-trip.tsx`
- [ ] `verticals-showcase.tsx`
- [ ] `meet-the-host.tsx`

#### Layout (`layout/`)
- [ ] `header.tsx`
- [ ] `footer.tsx`
- [ ] `theme-toggle.tsx`

#### Shared (`shared/`)
- [ ] `theme-provider.tsx`

### ⏳ Phase 3: Import Updates (To Do)
After moving files, update imports in:
- [ ] All page files (`src/app/**/*.tsx`)
- [ ] All component files
- [ ] Barrel exports (`index.ts` files)

## 🚀 How to Migrate

### Option 1: Manual Migration (Safer)
1. Move one feature folder at a time
2. Update imports for that feature
3. Test thoroughly
4. Repeat for next feature

### Option 2: Automated Migration (Faster, Riskier)
1. Use a script to move all files
2. Use find-and-replace for imports
3. Test everything thoroughly

## 📝 Import Update Examples

### Before:
```typescript
import { HotelCard } from '@/components/hotel-card'
import { LoginForm } from '@/components/login-form'
import { SearchForm } from '@/components/search-form'
```

### After:
```typescript
import { HotelCard } from '@/components/features/hotels'
import { LoginForm } from '@/components/features/auth'
import { SearchForm } from '@/components/features/search'
```

### Or using barrel exports:
```typescript
import { 
  HotelCard,
  LoginForm,
  SearchForm 
} from '@/components'
```

## ⚠️ Important Notes

1. **Don't rush** - This is a significant refactor
2. **Test after each move** - Ensure nothing breaks
3. **Update barrel exports** - Keep `index.ts` files updated
4. **Check for circular dependencies** - Watch for import cycles
5. **Update documentation** - Keep README files current

## 🎯 Benefits After Migration

- ✅ Easier to find related components
- ✅ Better code organization
- ✅ Clearer feature boundaries
- ✅ Easier onboarding for new developers
- ✅ Reduced cognitive load
- ✅ Scalable structure for growth

## 📞 Need Help?

If you encounter issues during migration:
1. Check the README in each feature folder
2. Review the FILE_STRUCTURE_PLAN.md
3. Ensure all imports are updated
4. Run TypeScript type checking: `npm run typecheck`
5. Test the application: `npm run dev`
