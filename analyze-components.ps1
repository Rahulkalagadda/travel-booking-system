#!/usr/bin/env pwsh
# Component Usage Analysis Script
# This script checks which components are actually being used in the codebase

$componentsDir = "src/components"
$components = @(
    "add-bus-form",
    "add-hotel-documents-form",
    "add-hotel-facilities-form",
    "add-hotel-form",
    "add-hotel-info-form",
    "add-hotel-rooms-form",
    "add-review-form",
    "add-room-form",
    "admin-dashboard",
    "admin-promoter",
    "ai-suggestion-button",
    "booking-card",
    "bus-booking-full",
    "bus-booking-modal",
    "bus-results-client",
    "bus-search-panel",
    "BusCard",
    "FilterSidebar",
    "flight-booking-modal",
    "flight-results-client",
    "footer",
    "header",
    "hero-3d-scene",
    "hero-scene-wrapper",
    "hotel-card",
    "image-grid",
    "login-form",
    "marketing-sections",
    "meet-the-host",
    "owner-dashboard",
    "payment-gateway",
    "plan-your-trip",
    "review-card",
    "review-summary",
    "reviews-section",
    "room-card",
    "search-filters",
    "search-form",
    "search-suggestions",
    "SearchBar",
    "signup-form",
    "similar-properties",
    "suggestion-modal",
    "theme-provider",
    "theme-toggle",
    "user-bookings",
    "verticals-showcase"
)

Write-Host "Analyzing component usage..." -ForegroundColor Cyan
Write-Host "=" * 80

$used = @()
$unused = @()

foreach ($component in $components) {
    $searchPattern = "from '@/components/$component"
    $results = Select-String -Path "src/**/*.tsx", "src/**/*.ts" -Pattern $searchPattern -ErrorAction SilentlyContinue
    
    if ($results) {
        $count = ($results | Measure-Object).Count
        $used += [PSCustomObject]@{
            Component = $component
            UsageCount = $count
            Files = ($results | Select-Object -ExpandProperty Path -Unique)
        }
        Write-Host "✓ $component" -ForegroundColor Green -NoNewline
        Write-Host " ($count usage(s))" -ForegroundColor Gray
    } else {
        $unused += $component
        Write-Host "✗ $component" -ForegroundColor Red -NoNewline
        Write-Host " (UNUSED)" -ForegroundColor DarkRed
    }
}

Write-Host ""
Write-Host "=" * 80
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "Total components: $($components.Count)"
Write-Host "Used: $($used.Count)" -ForegroundColor Green
Write-Host "Unused: $($unused.Count)" -ForegroundColor Red

if ($unused.Count -gt 0) {
    Write-Host ""
    Write-Host "Unused components that can be removed:" -ForegroundColor Red
    $unused | ForEach-Object { Write-Host "  - $_" -ForegroundColor DarkRed }
}

Write-Host ""
Write-Host "Detailed usage report saved to: component-usage-report.txt" -ForegroundColor Cyan

# Save detailed report
$report = @"
Component Usage Analysis Report
Generated: $(Get-Date)
================================

USED COMPONENTS ($($used.Count)):
$(foreach ($item in $used) {
"
Component: $($item.Component)
Usage Count: $($item.UsageCount)
Used in:
$(foreach ($file in $item.Files) { "  - $file" })
"
})

UNUSED COMPONENTS ($($unused.Count)):
$(foreach ($comp in $unused) { "- $comp" })

RECOMMENDATION:
$(if ($unused.Count -gt 0) {
"The following components appear to be unused and can be safely removed:
$(foreach ($comp in $unused) { "  - src/components/$comp.tsx" })

Before removing, verify:
1. Check if they're used in any dynamic imports
2. Check if they're exported but used elsewhere
3. Consider if they're work-in-progress features
"
} else {
"All components are in use!"
})
"@

$report | Out-File -FilePath "component-usage-report.txt" -Encoding UTF8
