# Form Step Template

Use this when adding a new step to the multi-step event creation form.

## 1. Create Step Component

Create: `src/components/forms/steps/Step[Name].tsx`

```tsx
"use client";

import { useFormContext } from "react-hook-form";
import { CreateEventFormData } from "@/lib/validation/create-event-schema";

interface Step[Name]Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step[Name]({ onNext, onBack }: Step[Name]Props) {
  const { register, formState: { errors } } = useFormContext<CreateEventFormData>();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">[Step Title]</h2>

      {/* Form fields */}
      <div>
        <label className="block text-sm font-medium">[Field Label]</label>
        <input
          {...register("[fieldName]")}
          className="mt-1 block w-full rounded-md border"
        />
        {errors.[fieldName] && (
          <p className="text-sm text-red-500">{errors.[fieldName]?.message}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button type="button" onClick={onBack}>Back</button>
        <button type="button" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
```

## 2. Add Zod Schema

Update `src/lib/validation/create-event-schema.ts`:

```typescript
// Add fields to the schema
const createEventSchema = z.object({
  // ... existing fields
  [newField]: z.string().min(1, "[Field] is required"),
});
```

## 3. Register Step

Add the step to `EventFormStepper.tsx` step array.

## 4. Update Payload

If the new fields go to the API, update:
- `createPayload()` — form data → CreateEventDto
- `eventDtoToFormData()` — EventDto → form data (for edit mode)

## Key Rules
- Use `useFormContext` to access form state (not `useForm`)
- Validation via Zod schema, not manual checks
- shadcn/ui components for inputs
- Keep under 200 lines — extract sub-components if needed
