# Translations Quick Reference Guide

## All Available Translation Keys

### Navigation
```
navigation.dashboard      → Dashboard
navigation.wallet        → Wallet
navigation.workspace     → Workspace
navigation.guidance      → Guidance
navigation.report        → Reports
navigation.settings      → Settings
```

### General UI
```
general.logout           → Logout
general.language         → Language
general.theme            → Theme
general.light            → Light
general.dark             → Dark
general.save             → Save
general.cancel           → Cancel
general.saving           → Saving...
general.saved            → Saved!
general.delete           → Delete
general.edit             → Edit
general.view             → View
general.close            → Close
general.status           → Status
general.date             → Date
general.action           → Action
general.search           → Search
general.filter           → Filter
general.loading          → Loading...
```

### Dashboard
```
dashboard.welcome        → Welcome back!
dashboard.credits        → Credit Statistics
dashboard.updates        → Latest Updates
dashboard.market         → Market Overview
dashboard.wallet_balance → Wallet Balance
dashboard.total_credits  → Total Credits
dashboard.pending_sales  → Pending Sales
dashboard.active_projects→ Active Projects
```

### Wallet
```
wallet.title             → Wallet
wallet.manage            → Manage your earnings and transactions
wallet.available_balance → Available Balance
wallet.pending           → Pending
wallet.processing        → Processing
wallet.withdraw          → Withdraw
wallet.pending_verification → Pending Verification
wallet.estimated_value   → Estimated Value
wallet.total_sold        → Total Sold
wallet.recent_transactions → Recent Transactions
wallet.latest_activity   → Your latest activity
wallet.view_all          → View All Transactions
wallet.completed         → Completed
wallet.failed            → Failed
```

### Credits
```
credits.title            → Carbon Credits
credits.your_portfolio   → Your credit portfolio
credits.active           → Active
credits.total_balance    → Total Balance
credits.this_week        → +2,450 this week
credits.sell             → Sell Credits
credits.transfer         → Transfer
credits.my_credits       → My Credits
credits.credit_id        → Credit ID
credits.amount           → Amount
credits.available        → Available
credits.sold             → Sold
```

### Market
```
market.title             → Market Overview
market.real_time         → Real-time market data and trends
market.current_price     → Current Price
market.market_demand     → Market Demand
market.available_supply  → Available Supply
market.total_demand      → Total Corporate Demand
market.high              → High
market.low               → Low
market.view_full         → View Full Market
```

### Statistics
```
statistics.comprehensive → Comprehensive overview of your credit distribution and usage patterns
statistics.conservation  → Conservation
statistics.total         → Total
statistics.used          → Used
statistics.total_earned  → Total Credits Earned
statistics.credits_sold  → Credits Sold
statistics.total_earnings→ Total Earnings
statistics.photos_uploaded → Photos Uploaded
```

### Updates
```
updates.latest           → Latest Updates
updates.latest_news      → Latest news from the Carbon Leaf marketplace
updates.price_increased  → Carbon Credit Price Increased
updates.new_request      → New Company Request
updates.demand_update    → Demand Update
updates.alert            → Alert
updates.good_news        → Good News
updates.info             → Info
```

### Settings
```
settings.title           → Settings
settings.manage          → Manage your account preferences
settings.preferences     → Preferences
settings.customize       → Customize your experience
settings.switch_mode     → Switch between light and dark mode
settings.select_language → Select your preferred language
settings.english         → English
settings.french          → Français
settings.kinyarwanda     → Kinyarwanda
settings.notifications   → Notifications
settings.receive_push    → Receive push notifications
settings.sound_effects   → Sound Effects
settings.play_sounds     → Play sounds for actions
settings.system_fees     → System Fees
settings.platform_fee    → Platform Service Fee
settings.withdrawal_fee  → Withdrawal Fee
settings.sale_fee        → Credit Sale Fee
settings.about           → About
settings.app_info        → App information
settings.version         → Version
settings.build           → Build
```

### Profile
```
profile.title            → Profile Information
profile.update_details   → Update your personal details
profile.premium_member   → Premium Member
profile.verified_account → Verified Account
profile.full_name        → Full Name
profile.email            → Email Address
profile.phone            → Phone Number
profile.location         → Location
profile.save_changes     → Save Changes
```

### Security
```
security.title           → Security Settings
security.manage_security → Manage your account security
security.change_password → Change Password
security.current_password → Current Password
security.new_password    → New Password
security.update          → Update Password
security.updating        → Updating...
security.two_factor      → Two-Factor Authentication
security.extra_layer     → Add an extra layer of security to your account
security.enabled         → Enabled
security.disabled        → Disabled
security.active_sessions → Active Sessions
security.current         → Current
security.revoke          → Revoke
```

### Guidance
```
guidance.title           → Guidance
guidance.how_works       → How the System Works
guidance.step1           → Register Your Land
guidance.step2           → Capture & Upload Photos
guidance.step3           → Earn Carbon Credits
guidance.step4           → Sell to Companies
guidance.contribution    → Your contribution matters...
```

### Reports
```
reports.title            → Reports & Analytics
reports.track_performance → Track your carbon credit performance
reports.sales_history    → Sales History
reports.recent_sales     → Recent credit sales
reports.upload_activity  → Upload Activity
reports.recent_uploads   → Recent photo uploads
reports.last_6_months    → Last 6 months
reports.generated        → Credits Generated
reports.earnings         → Earnings (RWF)
reports.view_all_sales   → View All Sales
reports.view_all_uploads → View All Uploads
reports.download_report  → Download Full Report (PDF)
reports.export           → Export
```

### Workspace
```
workspace.title          → Workspace
workspace.registered_upis → Registered UPIs
workspace.uploaded_photos → Uploaded Photos
workspace.compliance_rate → Compliance Rate
```

### Payment
```
payment.title            → Payment Methods
payment.setup            → Setup withdrawal accounts
payment.secure           → Secure
payment.bank_account     → Bank Account
payment.mobile_money     → Mobile Money
payment.bank_name        → Bank Name
payment.account_number   → Account Number
payment.account_holder   → Account Holder Name
payment.account_name     → Account Name
payment.provider         → Provider
payment.mtn_momo         → MTN MoMo
payment.airtel_money     → Airtel Money
payment.bank_saved       → Bank account saved successfully!
payment.mobile_saved     → Mobile money account saved!
payment.save_bank        → Save Bank Account
payment.save_mobile      → Save Mobile Money
```

### Sell
```
sell.title               → Sell Credits
sell.select_credit       → Select Credit
sell.amount              → Amount to Sell
sell.price               → Price per Credit (RWF)
sell.placeholder_credit  → Choose credit ID
sell.placeholder_amount  → Enter amount
sell.placeholder_price   → e.g., 200
sell.sell_button         → Sell Credits
sell.processing          → Processing...
```

---

## Usage Examples

### Basic Usage
```typescript
import { useLanguage } from "@/components/global/language-provider";

export default function MyComponent() {
  const { t } = useLanguage();
  
  return <h1>{t("dashboard.welcome")}</h1>;
}
```

### With Dynamic Content
```typescript
<div>
  <label>{t("payment.bank_name")}</label>
  <input placeholder={t("payment.bank_name")} />
</div>
```

### In Lists
```typescript
const items = [
  { key: "dashboard", label: t("navigation.dashboard") },
  { key: "wallet", label: t("navigation.wallet") },
];
```

### Conditional Translations
```typescript
const status = "active";
const label = status === "active" 
  ? t("credits.active") 
  : t("general.loading");
```

---

## Language Switching

The language can be switched using:
1. The `LanguageSwitcher` component (dropdown in navbar)
2. Programmatically:
   ```typescript
   const { setLanguage } = useLanguage();
   setLanguage("fr"); // Switch to French
   setLanguage("rw"); // Switch to Kinyarwanda
   setLanguage("en"); // Switch to English
   ```

---

## Important Notes

- ✅ All keys use lowercase with underscores
- ✅ All keys are organized hierarchically (e.g., `section.subsection.key`)
- ✅ If a key doesn't exist, the key itself is returned as fallback
- ✅ Language preference is persisted in localStorage
- ✅ Language changes trigger automatic re-render
- ✅ All components must be wrapped in `<LanguageProvider>`
