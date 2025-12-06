# Admin Components Missing Translations

## Summary
Found **7 files with hardcoded strings** that need multilingual support in the admin dashboard.

---

## 1. **Admin Settings Page** (`app/dashboard/admin/settings/page.tsx`)
**Priority: HIGH** | **Hardcoded Strings: 12**

### Hardcoded Strings:
```
Lines 23 - "Settings saved successfully!" (toast message)
Lines 84 - "Base Credit Pricing"
Lines 87 - "Farmer Credits (RWF per credit)"
Lines 91 - "Eco Stoves (RWF per credit)"
Lines 95 - "Hybrid Vehicle (RWF per credit)"
Lines 99 - "Commercial (RWF per credit)"
Lines 107 - "Transaction Fees"
Lines 110 - "Withdrawal Fee (RWF)"
Lines 112 - "Fixed fee per withdrawal"
Lines 115 - "Transfer Fee (%)"
Lines 117 - "Percentage of transfer amount"
Lines 124 - "Save Fee Settings"
Lines 134 - "General Configuration"
Lines 136 - "Configure system-wide settings"
Lines 142 - "System Status"
Lines 145 - "System Active"
Lines 146 - "Allow new credit applications and transactions"
Lines 154 - "Approval Requirements"
Lines 157 - "Minimum Credits for Approval"
Lines 161 - "Maximum Credits per User"
Lines 165 - "Auto-reject after (days)"
Lines 167 - "Automatically reject applications not reviewed in this time"
Lines 174 - "System Information"
Lines 177 - "System Name"
Lines 178 - "Carbon Leaf"
Lines 181 - "System Description"
Lines 184 - "A platform for carbon credit management and trading"
Lines 193 - "Save General Settings"
Lines 203 - "Notification Settings"
Lines 205 - "Configure system alerts and notifications"
Lines 259 - "Settings saved successfully"
```

### Translation Keys Needed:
```
admin.base_credit_pricing
admin.farmer_price_label
admin.eco_price_label
admin.hybrid_price_label
admin.commercial_price_label
admin.transaction_fees
admin.withdrawal_fee_label
admin.fixed_fee_per_withdrawal
admin.transfer_fee_label
admin.percentage_of_transfer
admin.save_fee_settings
admin.general_configuration
admin.configure_system_wide
admin.system_status_title
admin.system_active_label
admin.allow_new_credit_desc
admin.approval_requirements
admin.min_credits_approval_label
admin.max_credits_user_label
admin.auto_reject_days_label
admin.auto_reject_desc_detailed
admin.system_information
admin.system_name_label
admin.default_system_name
admin.system_description_label
admin.default_system_description
admin.save_general_settings
admin.notification_settings_title
admin.configure_alerts_notifications
admin.settings_saved_success
admin.notification_new_applications
admin.notification_failed_verification
admin.notification_high_volume_sales
admin.notification_system_alerts
admin.notification_suspicious_activity
admin.notification_daily_reports
admin.save_notification_settings
```

---

## 2. **Admin Sidebar Component** (`components/dashboard_components/admin/admin-sidebar.tsx`)
**Priority: HIGH** | **Hardcoded Strings: 5**

### Hardcoded Strings:
```
Lines 49 - "System overview"
Lines 57 - "Manage users"
Lines 65 - "AI scoring system"
Lines 73 - "Sell credits"
Lines 79 - "System finances"
Lines 85 - "System config"
Lines 91 - "Documentation"
Lines 140 - "Admin Panel"
Lines 151 - "Menu"
Lines 280 - "Administrator"
Lines 293 - "© 2025 Carbon Leaf"
```

### Translation Keys Needed:
```
admin.sidebar_dashboard_desc
admin.sidebar_users_desc
admin.sidebar_scoring_desc
admin.sidebar_sales_desc
admin.sidebar_wallet_desc
admin.sidebar_settings_desc
admin.sidebar_help_desc
admin.sidebar_title
admin.sidebar_menu_label
admin.role_administrator
admin.copyright_year
```

---

## 3. **Admin Breadcrumb Component** (`components/dashboard_components/admin/AdminBreadcrumb.tsx`)
**Priority: HIGH** | **Hardcoded Strings: 7**

### Hardcoded Strings:
```
Lines 9 - "Dashboard"
Lines 10 - "System Users"
Lines 11 - "Credit Scoring"
Lines 12 - "Credit Sales"
Lines 13 - "Admin Wallet"
Lines 14 - "Settings"
Lines 15 - "Help"
Lines 27 - "Dashboard"
```

### Translation Keys Needed:
```
admin.breadcrumb_dashboard
admin.breadcrumb_system_users
admin.breadcrumb_credit_scoring
admin.breadcrumb_credit_sales
admin.breadcrumb_admin_wallet
admin.breadcrumb_settings
admin.breadcrumb_help
```

---

## 4. **Admin Quick Actions Component** (`components/dashboard_components/admin/AdminQuickActions.tsx`)
**Priority: HIGH** | **Hardcoded Strings: 12**

### Hardcoded Strings:
```
Lines 20 - "Review Pending Approvals"
Lines 21 - "Check 127 pending credit verifications"
Lines 28 - "Manage System Users"
Lines 29 - "View & manage 12,450 registered users"
Lines 36 - "Create Credit Listing"
Lines 37 - "Sell credits to companies & buyers"
Lines 44 - "View System Wallet"
Lines 45 - "Monitor collected credits & revenue"
Lines 52 - "Export Reports"
Lines 53 - "Generate system analytics & insights"
Lines 60 - "System Configuration"
Lines 61 - "Update fees, percentages & settings"
Lines 72 - "Quick Actions"
Lines 73 - "Fast access to common admin tasks"
```

### Translation Keys Needed:
```
admin.quick_action_approvals
admin.quick_action_approvals_desc
admin.quick_action_users
admin.quick_action_users_desc
admin.quick_action_listing
admin.quick_action_listing_desc
admin.quick_action_wallet
admin.quick_action_wallet_desc
admin.quick_action_reports
admin.quick_action_reports_desc
admin.quick_action_settings
admin.quick_action_settings_desc
admin.quick_actions_title
admin.quick_actions_subtitle
```

---

## 5. **Carbon Emission Stats Component** (`components/dashboard_components/admin/CarbonEmissionStats.tsx`)
**Priority: MEDIUM** | **Hardcoded Strings: 4**

### Hardcoded Strings:
```
Lines 61 - "Total Emissions (tons)"
Lines 62 - "hsl(0, 84%, 60%)"
Lines 65 - "Reduction Achieved (tons)"
Lines 70 - "Target (tons)"
Lines 84 - "Carbon Emission Tracking"
Lines 88 - "System-wide emission reduction progress"
Lines 93 - "-58%"
Lines 94 - "Overall reduction"
```

### Translation Keys Needed:
```
admin.chart_total_emissions
admin.chart_reduction_achieved
admin.chart_target
admin.carbon_emission_title
admin.carbon_emission_subtitle
admin.overall_reduction_label
```

---

## 6. **Pending Approvals Widget** (`components/dashboard_components/admin/PendingApprovalsWidget.tsx`)
**Priority: HIGH** | **Hardcoded Strings: 3**

### Hardcoded Strings:
```
Lines 99 - "Pending Approvals"
Lines 102 - "requests awaiting verification"
Lines 136 - "View all {N} requests"
```

### Translation Keys Needed:
```
admin.pending_approvals_title
admin.awaiting_verification_desc
admin.view_all_requests
```

---

## 7. **Credits on Sale Widget** (`components/dashboard_components/admin/CreditsOnSaleWidget.tsx`)
**Priority: HIGH** | **Hardcoded Strings: 4**

### Hardcoded Strings:
```
Lines 73 - "Credits on Sale"
Lines 74 - "{N} active listings"
Lines 83 - "Total Value on Market"
Lines 115 - "Manage"
Lines 125 - "Create New Listing"
```

### Translation Keys Needed:
```
admin.credits_on_sale_title
admin.active_listings_count_desc
admin.total_value_on_market
admin.manage_button
admin.create_new_listing_btn
```

---

## Translation Implementation Priority

### Phase 1 - CRITICAL (Pages):
1. ✅ Admin Dashboard Page (`page.tsx`) - Already using `t()` keys
2. ✅ System Users Page - Already done
3. ✅ Credit Scoring Page - Already done
4. ✅ Credit Sales Page - Already done
5. ✅ Admin Wallet Page - Already done
6. ✅ Help Page - Already done
7. **Admin Settings Page** - Need to add 36 translation keys

### Phase 2 - HIGH (Components):
1. **Admin Sidebar** - Need to add 11 translation keys
2. **Admin Breadcrumb** - Need to add 7 translation keys
3. **Admin Quick Actions** - Need to add 14 translation keys
4. **Pending Approvals Widget** - Need to add 3 translation keys
5. **Credits on Sale Widget** - Need to add 5 translation keys

### Phase 3 - MEDIUM (Charts):
1. **Carbon Emission Stats** - Need to add 6 translation keys
2. Other widget components (AllUsersOverview, CreditMarketStanding, SystemHealthWidget, NotificationBell)

---

## Total Translation Keys to Add

| Component | Keys Needed |
|-----------|------------|
| Admin Settings | 36 |
| Admin Sidebar | 11 |
| Quick Actions | 14 |
| Breadcrumb | 7 |
| Pending Approvals | 3 |
| Credits on Sale | 5 |
| Carbon Emission | 6 |
| **TOTAL** | **82** |

---

## Implementation Strategy

### Step 1: Update Translation Files
Add keys for all 7 components across 3 language files (en, fr, rw)

### Step 2: Update Components
1. Replace hardcoded strings with `t()` calls
2. Ensure `useLanguage()` hook is imported
3. Use i18n consistently

### Step 3: Testing
- Verify all strings display correctly in each language
- Check responsive design hasn't been affected
- Test with different theme modes

### Step 4: Additional Components
Review and update remaining admin components:
- `AllUsersOverview`
- `CreditMarketStanding`
- `SystemHealthWidget`
- `NotificationBell`
- All credit-scoring sub-components
- All admin-wallet sub-components

---

## Notes

- All main pages (page.tsx files) already have translation support
- Sidebar and breadcrumb are shared components used across admin section
- Settings page is critical for system configuration translations
- Quick actions component is on the main dashboard
- Widget components should be updated together for consistency
