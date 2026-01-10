# Component Organization Script

This script helps visualize the current component organization and what needs to be moved.

## Current Component Count by Location

### Root Level (needs organization): 48 files
- Forms: 9 files
- Cards: 5 files
- Modals: 3 files
- Dashboards: 2 files
- Search: 5 files
- Marketing: 6 files
- Other: 18 files

### Existing Folders: 10 directories
- `admin/` - 17 files
- `bookings/` - 4 files
- `bus/` - 6 files
- `dashboard/` - 15 files
- `dora/` - 5 files
- `features/` - 1 file (README)
- `hotel-onboarding/` - 8 files
- `hotels/` - 6 files
- `profile/` - 1 file
- `ui/` - 38 files (Shadcn primitives)

## Recommended Actions

### 1. High Priority (Most Impact)
Move these loose files to feature folders:
- All `add-*-form.tsx` files → respective feature folders
- `login-form.tsx`, `signup-form.tsx` → `features/auth/`
- `*-card.tsx` files → respective feature folders
- `*-dashboard.tsx` files → `features/admin/` or `features/owner/`

### 2. Medium Priority
Consolidate existing folders:
- Merge `admin/` contents into `features/admin/`
- Merge `bookings/` contents into `features/bookings/`
- Merge `bus/` contents into `features/buses/`
- Merge `hotels/` contents into `features/hotels/`

### 3. Low Priority (Nice to Have)
- Move `header.tsx`, `footer.tsx` → `layout/`
- Move `theme-provider.tsx` → `shared/`
- Create feature-specific index files

## File Movement Checklist

Use this checklist when moving files:

- [ ] Create target folder if it doesn't exist
- [ ] Move the file to new location
- [ ] Update imports in the moved file
- [ ] Find all files importing this component
- [ ] Update all import statements
- [ ] Update barrel exports (index.ts)
- [ ] Test the affected pages
- [ ] Commit changes

## PowerShell Commands for Moving Files

```powershell
# Example: Move auth forms
Move-Item src/components/login-form.tsx src/components/features/auth/
Move-Item src/components/signup-form.tsx src/components/features/auth/

# Example: Move hotel components
Move-Item src/components/hotel-card.tsx src/components/features/hotels/
Move-Item src/components/add-hotel-*.tsx src/components/features/hotels/

# Example: Move layout components
Move-Item src/components/header.tsx src/components/layout/
Move-Item src/components/footer.tsx src/components/layout/
```

## Find and Replace Patterns

After moving files, use these patterns to update imports:

### Auth Components
```
Find: from '@/components/login-form'
Replace: from '@/components/features/auth/login-form'

Find: from '@/components/signup-form'
Replace: from '@/components/features/auth/signup-form'
```

### Hotel Components
```
Find: from '@/components/hotel-card'
Replace: from '@/components/features/hotels/hotel-card'

Find: from '@/components/add-hotel-form'
Replace: from '@/components/features/hotels/add-hotel-form'
```

### Layout Components
```
Find: from '@/components/header'
Replace: from '@/components/layout/header'

Find: from '@/components/footer'
Replace: from '@/components/layout/footer'
```

## Verification Steps

After migration:

1. **Type Check**
   ```powershell
   npm run typecheck
   ```

2. **Build Test**
   ```powershell
   npm run build
   ```

3. **Dev Server**
   ```powershell
   npm run dev
   ```

4. **Manual Testing**
   - Test all major features
   - Check all pages load
   - Verify forms work
   - Test navigation

## Rollback Plan

If issues occur:

1. Keep a backup branch before starting
2. Use git to revert specific file moves
3. Restore old import paths
4. Test again

```powershell
# Create backup branch
git checkout -b backup-before-restructure

# If needed, revert
git checkout backup-before-restructure
```
