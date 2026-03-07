# Multi-Step Form Architecture

## Overview
The event creation form at `/create-event` is a 5-step wizard built with React Hook Form + Zod.

## Steps
1. **Details** — Title, description, category selection, subcategories, tags
2. **Date & Time** — Start date, end date, time, recurring event options
3. **Location** — Address, city, venue name, GPS coordinates
4. **Media** — Image upload, external links, booking URL, organiser website
5. **Review** — Summary of all steps, edit links, submit button

## Data Flow
```
User fills form steps
  → React Hook Form manages state across steps
  → Zod validates each step on navigation
  → On submit: createPayload() transforms form data → API DTO format
  → POST /api/events with JWT auth header
  → On success: redirect to /my-events
```

## Key Transformations
- `createPayload()` — Converts form data to backend CreateEventDto format
- `eventDtoToFormData()` — Converts backend EventDto back to form format (for editing)
- Category/subcategory codes sent as integers (backend resolves to GUIDs)

## Validation
Each step has its own Zod schema. Validation runs:
- On step navigation (next button)
- On final submit
- Field-level as user types (after first blur)

## Adding a New Form Step
1. Create component in `src/components/forms/Step[N][Name].tsx`
2. Add Zod schema in `src/lib/validation/`
3. Add step to the step array in the form page
4. Update `createPayload()` if new fields go to the API
5. Update `eventDtoToFormData()` for edit mode
