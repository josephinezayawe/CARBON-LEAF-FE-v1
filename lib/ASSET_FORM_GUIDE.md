# Asset Form Implementation Guide

## Overview

A clean, reusable asset creation form system using a configuration-based approach. Dynamically shows/hides fields based on sector selection, validates on the frontend, and builds payloads for the backend.

## Architecture

### Core Files

1. **`lib/asset-config.ts`** - Field configuration and mappings
   - Defines all sectors and their fields
   - Provides utility functions for field filtering
   - Single source of truth for form structure

2. **`hooks/useAssetForm.ts`** - Form state management
   - Manages form data, errors, and validation
   - Handles sector changes and field clearing
   - Builds API payloads dynamically

3. **`components/AssetForm/`** - UI Components
   - `AssetForm.tsx` - Main form container
   - `SectorSelector.tsx` - Sector selection dropdown
   - `FormFields.tsx` - Dynamic field rendering

## Key Features

### ✅ Configuration-Based (No If/Else)

Fields are centralized in `asset-config.ts`. To add a new sector:

```typescript
// asset-config.ts
const OPTIONAL_FIELDS: Record<SectorType, Field[]> = {
  // ... existing sectors
  "NEW SECTOR": [
    {
      name: "fieldName",
      label: "Field Label",
      type: "text",
      placeholder: "Helper text",
      required: true,
    },
  ],
};
```

### ✅ Dynamic Field Visibility

- Only visible fields are rendered
- Hidden fields are never sent in the payload
- Switching sectors clears non-visible field values

### ✅ Automatic Payload Building

The `buildPayload()` method:
- Validates only visible fields
- Includes only visible fields in the request
- Returns `null` if validation fails

```typescript
const payload = form.buildPayload();
// payload contains only: common fields + sector-specific fields
// Returns null if validation fails
```

### ✅ Frontend Validation Only

Validation happens client-side before submission:

```typescript
if (!form.validate()) {
  // Show errors for all required fields
  return;
}
```

## Usage Examples

### Basic Implementation

```typescript
"use client";

import { AssetForm } from "@/components/AssetForm";

export default function AssetPage() {
  const handleSubmit = async (payload: Record<string, any>) => {
    const response = await api.post("/api/assets", payload);
    // Handle response
  };

  return (
    <div>
      <AssetForm
        initialSector="FARMER"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

### With Custom Handling

```typescript
import { useAssetForm } from "@/hooks/useAssetForm";
import { SectorType } from "@/lib/asset-config";

export default function CustomAssetForm() {
  const form = useAssetForm("FARMER");

  const handleFieldChange = (field: string, value: string) => {
    form.updateField(field, value);
  };

  const handleSectorSwitch = (sector: SectorType) => {
    form.setSector(sector);
    // Sector change automatically clears non-visible fields
  };

  const handleSubmit = () => {
    const isValid = form.validate();
    if (!isValid) {
      console.log("Validation errors:", form.errors);
      return;
    }

    const payload = form.buildPayload();
    // Send payload to backend
  };

  return (
    <div>
      <select value={form.sector} onChange={(e) => handleSectorSwitch(e.target.value as SectorType)}>
        {/* options */}
      </select>

      {form.getVisibleFields().map((field) => (
        <input
          key={field.name}
          value={form.formData[field.name]}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
        />
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

## Hook API Reference

### `useAssetForm(defaultSector)`

Returns an object with:

```typescript
interface UseAssetFormReturn {
  sector: SectorType;                              // Current sector
  setSector: (sector: SectorType) => void;         // Change sector
  formData: AssetFormState;                        // Form values
  setFormData: (data: AssetFormState) => void;     // Set all form data
  updateField: (fieldName: string, value: any) => void;  // Update single field
  errors: FormErrors;                              // Field errors
  validate: () => boolean;                         // Validate form
  clearErrors: () => void;                         // Clear all errors
  resetForm: () => void;                           // Reset to initial state
  getVisibleFields: () => Field[];                 // Get fields for current sector
  buildPayload: () => AssetFormState | null;       // Build API payload
  isValid: boolean;                                // Is form currently valid?
}
```

## Configuration Reference

### Sectors Supported

1. **FARMER**
   - Common fields + `landUPI`

2. **HYBRID CAR OWNER**
   - Common fields + `carPlate`, `carSerialNumber`

3. **ECO FRIENDLY STOVES**
   - Common fields + `stoveSerialNumber`

4. **COMMERCIAL BUILDING**
   - Common fields + `buildingReg`

### Common Fields (Always Required)

- `assetType` - Text
- `sector` - Text (auto-set)
- `name` - Text
- `description` - Textarea
- `province` - Text
- `district` - Text
- `sectorArea` - Text
- `cell` - Text
- `village` - Text

## Advanced Patterns

### Custom Validation

Extend the hook or add validation before submission:

```typescript
const form = useAssetForm("FARMER");

const validateCustomRules = () => {
  // Add custom validation logic
  if (form.formData.name.length < 3) {
    // Handle error
  }
};
```

### Pre-populate Form

```typescript
const form = useAssetForm("FARMER");

useEffect(() => {
  form.setFormData({
    ...form.formData,
    province: "Kigali",
    district: "Gasabo",
  });
}, []);
```

### Track Field Changes

```typescript
const handleFieldChange = (field: string, value: string) => {
  form.updateField(field, value);
  console.log("Field changed:", field, value);
};
```

## Field Clearing Behavior

When sector changes:

1. All non-visible fields are reset to empty string
2. All errors are cleared
3. Form state remains otherwise unchanged

```typescript
// Before: Farmer with landUPI = "1/23/45/67"
form.setSector("HYBRID CAR OWNER");
// After: landUPI = "" (automatically cleared)
```

## Testing Examples

### Test Sector Switching

```typescript
const form = useAssetForm("FARMER");

// Check initial fields
expect(form.getVisibleFields().some(f => f.name === "landUPI")).toBe(true);

// Switch sector
form.setSector("HYBRID CAR OWNER");

// Check fields updated
expect(form.getVisibleFields().some(f => f.name === "carPlate")).toBe(true);
expect(form.getVisibleFields().some(f => f.name === "landUPI")).toBe(false);

// Check value cleared
expect(form.formData.landUPI).toBe("");
```

### Test Payload Building

```typescript
const form = useAssetForm("FARMER");

// Fill required fields
form.updateField("assetType", "Land");
form.updateField("name", "Farm A");
form.updateField("description", "My farm");
form.updateField("province", "Kigali");
form.updateField("district", "Gasabo");
form.updateField("sectorArea", "2 hectares");
form.updateField("cell", "Cell 1");
form.updateField("village", "Village 1");
form.updateField("landUPI", "1/23/45/67");

const payload = form.buildPayload();

// Payload should include only visible fields
expect(payload).toHaveProperty("landUPI");
expect(payload).not.toHaveProperty("carPlate"); // Not visible for FARMER
```

## Extending the System

### Add a New Sector

1. Update `SectorType` type in `asset-config.ts`:
```typescript
type SectorType = 
  | "FARMER"
  | "HYBRID CAR OWNER"
  | "ECO FRIENDLY STOVES"
  | "COMMERCIAL BUILDING"
  | "YOUR_NEW_SECTOR";
```

2. Add fields to `OPTIONAL_FIELDS`:
```typescript
const OPTIONAL_FIELDS: Record<SectorType, Field[]> = {
  // ... existing
  "YOUR_NEW_SECTOR": [
    { name: "newField", label: "New Field", type: "text", required: true },
  ],
};
```

3. Update `SectorSelector.tsx` with icon/label:
```typescript
const SECTOR_OPTIONS: SectorOption[] = [
  // ... existing
  {
    value: "YOUR_NEW_SECTOR",
    label: "Your New Sector",
    description: "Description",
    icon: YourIcon,
  },
];
```

### Add a New Field Type

1. Update `FieldType` in `asset-config.ts`:
```typescript
type FieldType = "text" | "textarea" | "email" | "number" | "date" | "yourType";
```

2. Handle in `FormFields.tsx`:
```typescript
if (field.type === "yourType") {
  return <YourCustomComponent {...field} />;
}
```

## Best Practices

1. **Use the hook** - Always use `useAssetForm()` for consistent state management
2. **Validate before submit** - Call `validate()` before `buildPayload()`
3. **Clear errors on input** - The hook auto-clears errors when user types
4. **Show field helpers** - Use `helperText` property for user guidance
5. **Sector in payload** - The `sector` field is auto-set and included in payload
6. **No backend assumptions** - Payload structure matches field names exactly

## Component Tree

```
AssetForm (main entry point)
├── SectorSelector
│   └── Select component
└── FormFields
    ├── Common Fields Section
    │   └── FieldInput components
    └── Optional Fields Section
        └── FieldInput components
```

## Error Handling

Errors are attached to specific fields and cleared automatically when the user updates that field:

```typescript
// Field has error after validation
form.errors.name === "Asset name is required"

// User starts typing
form.updateField("name", "My Asset")

// Error automatically cleared
form.errors.name === undefined
```

## Performance Notes

- Hook uses `useCallback` to prevent unnecessary re-renders
- Field validation is only run on visible fields
- Form state is optimized for dynamic rendering
- Payload building filters fields efficiently
