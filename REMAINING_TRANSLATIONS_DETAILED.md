# Detailed Remaining Translations for Admin Dashboard

## Overview
This document lists every hardcoded string in admin components that needs translation, organized by file.

---

## 1. Admin Settings Page (`app/dashboard/admin/settings/page.tsx`)

### File Location
```
d:/PROJECT/CARBON/carborn-leaf-fe/app/dashboard/admin/settings/page.tsx
```

### Hardcoded String Details

#### Toast Messages
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 23 | `"Settings saved successfully!"` | `admin.toast_settings_saved` | On save success |
| 259 | `"Settings saved successfully"` | `admin.toast_settings_saved` | Notification display |

#### Base Pricing Section (Lines 82-103)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 84 | `"Base Credit Pricing"` | `admin.base_credit_pricing` | Section title |
| 87 | `"Farmer Credits (RWF per credit)"` | `admin.farmer_price_label` | Input label |
| 91 | `"Eco Stoves (RWF per credit)"` | `admin.eco_price_label` | Input label |
| 95 | `"Hybrid Vehicle (RWF per credit)"` | `admin.hybrid_price_label` | Input label |
| 99 | `"Commercial (RWF per credit)"` | `admin.commercial_price_label` | Input label |

#### Transaction Fees Section (Lines 105-120)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 107 | `"Transaction Fees"` | `admin.transaction_fees_title` | Section title |
| 110 | `"Withdrawal Fee (RWF)"` | `admin.withdrawal_fee_label` | Input label |
| 112 | `"Fixed fee per withdrawal"` | `admin.fixed_fee_per_withdrawal_desc` | Helper text |
| 115 | `"Transfer Fee (%)"` | `admin.transfer_fee_label` | Input label |
| 117 | `"Percentage of transfer amount"` | `admin.percentage_transfer_desc` | Helper text |
| 124 | `"Save Fee Settings"` | `admin.save_fee_settings` | Button text |

#### General Configuration Tab (Lines 130-196)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 134 | `"General Configuration"` | `admin.general_configuration` | Card title |
| 136 | `"Configure system-wide settings"` | `admin.configure_system_wide` | Card description |
| 142 | `"System Status"` | `admin.system_status_section` | Section title |
| 145 | `"System Active"` | `admin.system_active_label` | Toggle label |
| 146 | `"Allow new credit applications and transactions"` | `admin.system_active_desc` | Helper text |
| 154 | `"Approval Requirements"` | `admin.approval_requirements_section` | Section title |
| 157 | `"Minimum Credits for Approval"` | `admin.min_credits_approval_label` | Input label |
| 161 | `"Maximum Credits per User"` | `admin.max_credits_user_label` | Input label |
| 165 | `"Auto-reject after (days)"` | `admin.auto_reject_days_label` | Input label |
| 167 | `"Automatically reject applications not reviewed in this time"` | `admin.auto_reject_days_desc` | Helper text |
| 174 | `"System Information"` | `admin.system_information_section` | Section title |
| 177 | `"System Name"` | `admin.system_name_label` | Input label |
| 178 | `"Carbon Leaf"` | `admin.default_system_name` | Default value |
| 181 | `"System Description"` | `admin.system_description_label` | Input label |
| 184 | `"A platform for carbon credit management and trading"` | `admin.default_system_description` | Default value |
| 193 | `"Save General Settings"` | `admin.save_general_settings` | Button text |

#### Notification Settings Tab (Lines 199-252)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 203 | `"Notification Settings"` | `admin.notification_settings_title` | Card title |
| 205 | `"Configure system alerts and notifications"` | `admin.configure_alerts_desc` | Card description |
| 211 | `"New Credit Applications"` | `admin.notification_new_applications` | Notification option |
| 212 | `"Alert when new credit applications are submitted"` | `admin.notification_new_applications_desc` | Description |
| 215 | `"Failed Verification"` | `admin.notification_failed_verification` | Notification option |
| 216 | `"Alert when applications fail AI verification"` | `admin.notification_failed_verification_desc` | Description |
| 219 | `"High Volume Sales"` | `admin.notification_high_volume_sales` | Notification option |
| 220 | `"Alert when daily sales exceed threshold"` | `admin.notification_high_volume_sales_desc` | Description |
| 223 | `"System Alerts"` | `admin.notification_system_alerts` | Notification option |
| 224 | `"Critical system and performance alerts"` | `admin.notification_system_alerts_desc` | Description |
| 227 | `"Suspicious Activity"` | `admin.notification_suspicious_activity` | Notification option |
| 228 | `"Alert on suspicious user behavior detection"` | `admin.notification_suspicious_activity_desc` | Description |
| 231 | `"Daily Reports"` | `admin.notification_daily_reports` | Notification option |
| 232 | `"Receive daily summary reports"` | `admin.notification_daily_reports_desc` | Description |
| 249 | `"Save Notification Settings"` | `admin.save_notification_settings` | Button text |

### Implementation Notes
- Most of these are already in the translation files for other contexts
- Need to consolidate and create consistent keys
- Toast messages can share the same key
- Default system name/description should be translatable

---

## 2. Admin Sidebar (`components/dashboard_components/admin/admin-sidebar.tsx`)

### File Location
```
d:/PROJECT/CARBON/carborn-leaf-fe/components/dashboard_components/admin/admin-sidebar.tsx
```

### Hardcoded String Details

#### Menu Item Descriptions (Lines 44-93)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 49 | `"System overview"` | `admin.sidebar_menu_dashboard_desc` | Menu description |
| 57 | `"Manage users"` | `admin.sidebar_menu_users_desc` | Menu description |
| 65 | `"AI scoring system"` | `admin.sidebar_menu_scoring_desc` | Menu description |
| 73 | `"Sell credits"` | `admin.sidebar_menu_sales_desc` | Menu description |
| 79 | `"System finances"` | `admin.sidebar_menu_wallet_desc` | Menu description |
| 85 | `"System config"` | `admin.sidebar_menu_settings_desc` | Menu description |
| 91 | `"Documentation"` | `admin.sidebar_menu_help_desc` | Menu description |

#### Sidebar Header & Footer (Lines 140-293)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 140 | `"Admin Panel"` | `admin.sidebar_badge_label` | Badge text |
| 151 | `"Menu"` | `admin.sidebar_menu_label` | Section label |
| 250 | `"Admin Profile"` | `admin.sidebar_admin_profile_tooltip` | Tooltip text |
| 280 | `"Administrator"` | `admin.sidebar_role_administrator` | Role label |
| 293 | `"© 2025 Carbon Leaf"` | `admin.footer_copyright` | Copyright text |

### Implementation Notes
- These are visible in the sidebar on every admin page
- Should be updated together for consistency
- Sidebar descriptions are contextual help
- Copyright year should be dynamic or configurable

---

## 3. Admin Breadcrumb (`components/dashboard_components/admin/AdminBreadcrumb.tsx`)

### File Location
```
d:/PROJECT/CARBON/carborn-leaf-fe/components/dashboard_components/admin/AdminBreadcrumb.tsx
```

### Hardcoded String Details

#### Breadcrumb Labels (Lines 8-15)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 9 | `"Dashboard"` | `admin.breadcrumb_dashboard` | Breadcrumb segment |
| 10 | `"System Users"` | `admin.breadcrumb_system_users` | Breadcrumb segment |
| 11 | `"Credit Scoring"` | `admin.breadcrumb_credit_scoring` | Breadcrumb segment |
| 12 | `"Credit Sales"` | `admin.breadcrumb_credit_sales` | Breadcrumb segment |
| 13 | `"Admin Wallet"` | `admin.breadcrumb_admin_wallet` | Breadcrumb segment |
| 14 | `"Settings"` | `admin.breadcrumb_settings` | Breadcrumb segment |
| 15 | `"Help"` | `admin.breadcrumb_help` | Breadcrumb segment |
| 27 | `"Dashboard"` | `admin.breadcrumb_dashboard` | First breadcrumb link |

### Implementation Notes
- These should match navigation titles
- Used in the top breadcrumb navigation
- Should be synchronized with sidebar navigation

---

## 4. Admin Quick Actions (`components/dashboard_components/admin/AdminQuickActions.tsx`)

### File Location
```
d:/PROJECT/CARBON/carborn-leaf-fe/components/dashboard_components/admin/AdminQuickActions.tsx
```

### Hardcoded String Details

#### Quick Action Items (Lines 17-66)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 20 | `"Review Pending Approvals"` | `admin.quick_action_approvals_label` | Action label |
| 21 | `"Check 127 pending credit verifications"` | `admin.quick_action_approvals_desc` | Action description |
| 28 | `"Manage System Users"` | `admin.quick_action_users_label` | Action label |
| 29 | `"View & manage 12,450 registered users"` | `admin.quick_action_users_desc` | Action description |
| 36 | `"Create Credit Listing"` | `admin.quick_action_listing_label` | Action label |
| 37 | `"Sell credits to companies & buyers"` | `admin.quick_action_listing_desc` | Action description |
| 44 | `"View System Wallet"` | `admin.quick_action_wallet_label` | Action label |
| 45 | `"Monitor collected credits & revenue"` | `admin.quick_action_wallet_desc` | Action description |
| 52 | `"Export Reports"` | `admin.quick_action_reports_label` | Action label |
| 53 | `"Generate system analytics & insights"` | `admin.quick_action_reports_desc` | Action description |
| 60 | `"System Configuration"` | `admin.quick_action_config_label` | Action label |
| 61 | `"Update fees, percentages & settings"` | `admin.quick_action_config_desc` | Action description |

#### Card Header (Lines 71-73)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 72 | `"Quick Actions"` | `admin.quick_actions_section_title` | Section title |
| 73 | `"Fast access to common admin tasks"` | `admin.quick_actions_section_desc` | Section description |

### Implementation Notes
- Descriptions contain hardcoded numbers (127, 12,450)
- Should be dynamic based on actual data
- Label and description pairs should be consistent
- Displayed prominently on dashboard

---

## 5. Pending Approvals Widget (`components/dashboard_components/admin/PendingApprovalsWidget.tsx`)

### File Location
```
d:/PROJECT/CARBON/carborn-leaf-fe/components/dashboard_components/admin/PendingApprovalsWidget.tsx
```

### Hardcoded String Details

#### Widget Title & Description (Lines 99-103)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 99 | `"Pending Approvals"` | `admin.pending_approvals_widget_title` | Widget title |
| 102 | `"requests awaiting verification"` | `admin.pending_approvals_widget_desc` | Widget description |

#### Action Button (Lines 135-137)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 136 | `"View all {N} requests"` | `admin.view_all_requests_button` | Button text with count |

### Implementation Notes
- Description is dynamic with request count
- Button text should be translatable
- Simple component, minimal strings

---

## 6. Credits on Sale Widget (`components/dashboard_components/admin/CreditsOnSaleWidget.tsx`)

### File Location
```
d:/PROJECT/CARBON/carborn-leaf-fe/components/dashboard_components/admin/CreditsOnSaleWidget.tsx
```

### Hardcoded String Details

#### Widget Title & Description (Lines 72-74)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 73 | `"Credits on Sale"` | `admin.credits_on_sale_widget_title` | Widget title |
| 74 | `"{N} active listings"` | `admin.active_listings_count_desc` | Dynamic count description |

#### Market Value Section (Lines 83)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 83 | `"Total Value on Market"` | `admin.total_value_on_market` | Label |

#### Action Buttons (Lines 115, 125)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 115 | `"Manage"` | `admin.manage_button` | Action button |
| 125 | `"Create New Listing"` | `admin.create_new_listing_button` | Action button |

### Implementation Notes
- Active listings count is dynamic
- Total value on market is dynamic
- Two action buttons need translation

---

## 7. Carbon Emission Stats (`components/dashboard_components/admin/CarbonEmissionStats.tsx`)

### File Location
```
d:/PROJECT/CARBON/carborn-leaf-fe/components/dashboard_components/admin/CarbonEmissionStats.tsx
```

### Hardcoded String Details

#### Chart Configuration (Lines 61-71)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 61 | `"Total Emissions (tons)"` | `admin.chart_label_total_emissions` | Chart legend |
| 65 | `"Reduction Achieved (tons)"` | `admin.chart_label_reduction_achieved` | Chart legend |
| 70 | `"Target (tons)"` | `admin.chart_label_target` | Chart legend |

#### Widget Title & Description (Lines 83-94)
| Line | String | Suggested Key | Context |
|------|--------|----------------|---------|
| 84 | `"Carbon Emission Tracking"` | `admin.carbon_emission_tracking_title` | Widget title |
| 88 | `"System-wide emission reduction progress"` | `admin.carbon_emission_tracking_desc` | Widget description |
| 93 | `"-58%"` | `admin.emission_reduction_percentage` | Percentage display |
| 94 | `"Overall reduction"` | `admin.overall_reduction_label` | Percentage label |

### Implementation Notes
- Chart labels are used in legends and tooltips
- Percentage and label are static in this mock
- Should be dynamic based on actual data
- Widget is on main dashboard

---

## Summary Table

| Component | File | Total Strings | Keys Needed |
|-----------|------|--------------|------------|
| Settings | `admin/settings/page.tsx` | 21 | 21 |
| Sidebar | `admin-sidebar.tsx` | 9 | 9 |
| Breadcrumb | `AdminBreadcrumb.tsx` | 8 | 7 |
| Quick Actions | `AdminQuickActions.tsx` | 12 | 12 |
| Pending Approvals | `PendingApprovalsWidget.tsx` | 3 | 3 |
| Credits on Sale | `CreditsOnSaleWidget.tsx` | 5 | 5 |
| Carbon Emission | `CarbonEmissionStats.tsx` | 8 | 8 |
| **TOTAL** | **7 files** | **66** | **65** |

---

## Translation Keys Reference

### Naming Convention
```
admin.{feature}_{element}_{type}
admin.{page}_{component}_{element}_{type}

Types:
- _title: Page/Component title
- _desc: Description or helper text
- _label: Form label
- _button: Button text
- _section: Section title
- _placeholder: Placeholder text
- _message: Message/notification text
```

### Examples
```
admin.base_credit_pricing (section title)
admin.farmer_price_label (input label)
admin.save_fee_settings (button)
admin.notification_new_applications (option label)
admin.quick_action_approvals_label (action label)
admin.quick_action_approvals_desc (action description)
admin.pending_approvals_widget_title (widget title)
admin.toast_settings_saved (notification message)
```

---

## Implementation Checklist

### For Developers
- [ ] Extract all strings to Excel/CSV
- [ ] Create translation keys following naming convention
- [ ] Add keys to all three language files
- [ ] Update components with `t()` calls
- [ ] Test in all three languages
- [ ] Verify no strings are missed
- [ ] Commit translations to git

### For Translators
- [ ] Translate all English keys to French
- [ ] Translate all English keys to Kinyarwanda
- [ ] Review for cultural appropriateness
- [ ] Verify context is understood
- [ ] Check for consistency with existing translations

### For QA
- [ ] Test each page in English
- [ ] Test each page in French
- [ ] Test each page in Kinyarwanda
- [ ] Check responsive design
- [ ] Verify theme toggle works
- [ ] Test dynamic text (counts, percentages)
- [ ] Check for text overflow/truncation

