# Admin Dashboard Translation Checklist

## Status Summary

```
✅ = Completed & Fully Translated
🟨 = Partially Translated
❌ = Hardcoded Strings (Not Translated)
```

---

## Pages (Main Routes)

| # | Page | File | Status | Notes |
|---|------|------|--------|-------|
| 1 | Dashboard | `app/dashboard/admin/page.tsx` | ✅ | Fully using `t()` keys |
| 2 | System Users | `app/dashboard/admin/system-users/page.tsx` | ✅ | Completed |
| 3 | Credit Scoring | `app/dashboard/admin/credit-scoring/page.tsx` | ✅ | Completed |
| 4 | Credit Sales | `app/dashboard/admin/credit-sales/page.tsx` | ✅ | Completed |
| 5 | Admin Wallet | `app/dashboard/admin/admin-wallet/page.tsx` | ✅ | Completed |
| 6 | Settings | `app/dashboard/admin/settings/page.tsx` | ❌ | **36 keys needed** |
| 7 | Help | `app/dashboard/admin/help/page.tsx` | ✅ | Completed |

---

## Shared Components

| # | Component | File | Status | Keys Needed |
|---|-----------|------|--------|------------|
| 1 | Admin Sidebar | `admin-sidebar.tsx` | ❌ | 11 |
| 2 | Admin Breadcrumb | `AdminBreadcrumb.tsx` | ❌ | 7 |
| 3 | Quick Actions | `AdminQuickActions.tsx` | ❌ | 14 |
| 4 | Pending Approvals Widget | `PendingApprovalsWidget.tsx` | ❌ | 3 |
| 5 | Credits on Sale Widget | `CreditsOnSaleWidget.tsx` | ❌ | 5 |
| 6 | Carbon Emission Stats | `CarbonEmissionStats.tsx` | ❌ | 6 |

---

## Feature-Specific Components

### System Users Feature
| Component | Status | Notes |
|-----------|--------|-------|
| `SystemUsersChart.tsx` | 🟨 | Uses existing keys |
| `SystemUsersFilters.tsx` | 🟨 | Uses existing keys |

### Credit Scoring Feature
| Component | Status | Notes |
|-----------|--------|-------|
| `CreditScoringAIAssistant.tsx` | 🟨 | Uses existing keys |
| `PendingApplicationsList.tsx` | 🟨 | Uses existing keys |
| `UserDetailsPanel.tsx` | 🟨 | Uses existing keys |

### Credit Sales Feature
| Component | Status | Notes |
|-----------|--------|-------|
| `SalesPerformance.tsx` | 🟨 | Uses existing keys |

### Admin Wallet Feature
| Component | Status | Notes |
|-----------|--------|-------|
| `WalletOverview.tsx` | 🟨 | Uses existing keys |
| `WalletTransactionsList.tsx` | 🟨 | Uses existing keys |
| `CreditDistribution.tsx` | 🟨 | Uses existing keys |

### Other Components
| Component | File | Status | Notes |
|-----------|------|--------|-------|
| Admin Layout | `admin/layout.tsx` | ✅ | No hardcoded strings |
| Notification Bell | `NotificationBell.tsx` | ❌ | Review needed |
| All Users Overview | `AllUsersOverview.tsx` | ❌ | Review needed |
| Credit Market Standing | `CreditMarketStanding.tsx` | ❌ | Review needed |
| System Health Widget | `SystemHealthWidget.tsx` | ❌ | Review needed |

---

## Translation Files Status

| File | Status | Notes |
|------|--------|-------|
| `locales/en.json` | ✅ | 41 new keys added for help page |
| `locales/fr.json` | ✅ | 41 French translations added |
| `locales/rw.json` | ✅ | 41 Kinyarwanda translations added |

---

## Quick Statistics

```
Total Admin Pages:                  7
✅ Fully Translated Pages:          6 (86%)
❌ Partially Translated Pages:      1 (14%)

Total Shared Components:            6
❌ Components Needing Translation:  6 (100%)

Total Feature Components:           7
🟨 Components Partially Done:       7 (100%)

Translation Keys Added:             41 (help page)
Translation Keys Needed:            82 (remaining)

Total Languages Supported:          3 (EN, FR, RW)
```

---

## Priority Implementation Plan

### 🔴 CRITICAL - Do First (1-2 hours)
```
1. Admin Settings Page (36 keys)
   - Base pricing labels
   - Fee configuration
   - General settings
   - Notification settings
   
2. Admin Sidebar (11 keys)
   - Menu descriptions
   - Breadcrumb labels
   
3. Quick Actions (14 keys)
   - Action titles
   - Action descriptions
```

### 🟠 HIGH - Do Next (2-3 hours)
```
1. Pending Approvals Widget (3 keys)
2. Credits on Sale Widget (5 keys)
3. Breadcrumb Component (7 keys)
4. Carbon Emission Stats (6 keys)
```

### 🟡 MEDIUM - Nice to Have (1-2 hours)
```
1. AllUsersOverview
2. CreditMarketStanding
3. SystemHealthWidget
4. NotificationBell
5. Other widgets
```

---

## File Organization

### English Locale (`locales/en.json`)
```
admin.* - All admin-related keys (650+ keys total)
├── Navigation items
├── Page titles & descriptions
├── Form labels
├── Messages & notifications
├── Settings configuration
└── Help & documentation
```

### French Locale (`locales/fr.json`)
```
Same structure as en.json with French translations
```

### Kinyarwanda Locale (`locales/rw.json`)
```
Same structure as en.json with Kinyarwanda translations
```

---

## Next Steps

### Step 1: Translation Keys
- [ ] Add 82 translation keys to `locales/en.json`
- [ ] Add 82 French translations to `locales/fr.json`
- [ ] Add 82 Kinyarwanda translations to `locales/rw.json`

### Step 2: Component Updates
- [ ] Update `admin/settings/page.tsx` (36 keys)
- [ ] Update `admin-sidebar.tsx` (11 keys)
- [ ] Update `AdminBreadcrumb.tsx` (7 keys)
- [ ] Update `AdminQuickActions.tsx` (14 keys)
- [ ] Update `PendingApprovalsWidget.tsx` (3 keys)
- [ ] Update `CreditsOnSaleWidget.tsx` (5 keys)
- [ ] Update `CarbonEmissionStats.tsx` (6 keys)

### Step 3: Testing
- [ ] Test all components with English
- [ ] Test all components with French
- [ ] Test all components with Kinyarwanda
- [ ] Verify responsive design
- [ ] Check theme toggle (light/dark mode)

### Step 4: Additional Components
- [ ] Review remaining components for hardcoded strings
- [ ] Update as needed

---

## Estimation

| Phase | Components | Keys | Time |
|-------|-----------|------|------|
| 1 | Settings, Sidebar, Quick Actions | 61 | 2-3h |
| 2 | Remaining widgets | 21 | 1-2h |
| 3 | Additional components | TBD | 1-2h |
| **TOTAL** | **~13 components** | **~82** | **4-7h** |

---

## Notes

- All components already have `useLanguage()` imported
- Translation keys follow consistent naming convention
- Settings page is critical as it controls system-wide parameters
- Sidebar is used across entire admin dashboard
- Quick Actions is on main dashboard page
- All widget components need updating for consistency
