# Form Guide

> How the multi-step event creation form works — the most complex part of the frontend.

## Overview

The event form is a **5-step wizard** that lets organisers create events. It handles validation per step, data transformation, and both create and edit modes.

```mermaid
stateDiagram-v2
    [*] --> Details: Step 1
    Details --> Location: Next (validated)
    Location --> DateTime: Next (validated)
    DateTime --> Spotlight: Next
    Spotlight --> Review: Next
    Review --> [*]: Submit

    Details: Title, Organiser, Categories
    Details: Subcategories, Tags, Description
    Location: Street, City, Postal Code
    Location: GPS Coordinates (optional)
    DateTime: Single Date / Recurring / Always Open
    Spotlight: Enable promotion + pricing
    Review: Summary + cost breakdown
```

---

## Architecture

```mermaid
graph TB
    subgraph Page["create-event/page.tsx"]
        STEPPER["EventFormStepper"]
    end

    subgraph FormState["React Hook Form"]
        FORM["useForm()<br/>CreateEventFormData"]
        ZOD["Zod Schema<br/>create-event-schema.ts"]
    end

    subgraph Steps["Step Components"]
        S1["StepEventDetails"]
        S2["StepEventLocation"]
        S3["StepEventDateTime"]
        S4["StepSpotlight"]
        S5["StepEventReview"]
    end

    subgraph API["API Layer"]
        PAYLOAD["createPayload()<br/>FormData → CreateEventDto"]
        HOOK["useCreateEvent()<br/>TanStack Query mutation"]
        AXIOS["Axios + JWT"]
    end

    STEPPER --> FORM
    FORM --> ZOD
    STEPPER --> S1
    STEPPER --> S2
    STEPPER --> S3
    STEPPER --> S4
    STEPPER --> S5

    S5 -->|"Submit"| PAYLOAD
    PAYLOAD --> HOOK
    HOOK --> AXIOS
    AXIOS -->|"POST /api/events"| BE["Backend API"]
```

### Key Files

| File | Role |
|------|------|
| `components/forms/EventFormStepper.tsx` | Orchestrator — manages step navigation and form state |
| `lib/validation/create-event-schema.ts` | Zod schema + `createPayload()` + `eventDtoToFormData()` |
| `hooks/useEventForm.ts` | Wraps `useForm()` with Zod resolver |
| `hooks/useCreateEvent.ts` | TanStack Query mutation for POST |
| `hooks/useEvents.ts` | `useUpdateEvent` mutation for PUT (edit mode) |
| `components/forms/steps/Step*.tsx` | Individual step UI components |

---

## The 5 Steps

### Step 1: Event Details (`StepEventDetails.tsx`)

What the user fills in:
- **Title** (required, max 200 chars)
- **Organiser name** and **organisation number** (Swedish Luhn validation)
- **Categories** (select from 8 categories)
- **Subcategories** (3 per selected category)
- **Filter tags** (Free, Family-friendly, Indoor, Outdoor, etc.)
- **Description**, **image URL**, **website URL**

Category selection is the most complex part — subcategories are nested under categories:

```mermaid
graph TB
    CAT["Select Category: Sports (2)"]
    CAT --> SUB1["201: Sports to do"]
    CAT --> SUB2["202: Sports to watch"]
    CAT --> SUB3["203: Sports to try"]
```

The form stores subcategories as `Record<number, number[]>` keyed by category code.

### Step 2: Location (`StepEventLocation.tsx`)

- **Street name** (required)
- **City** (required)
- **Postal code** (optional)
- **GPS coordinates** (optional — backend can auto-geocode)

### Step 3: Date & Time (`StepEventDateTime.tsx`)

Three scheduling modes:

```mermaid
graph LR
    MODE{Schedule Type}
    MODE -->|Single| SINGLE["One date + start/end time"]
    MODE -->|Recurring| RECURRING["Weekday + start/end time<br/>+ date range"]
    MODE -->|Always Open| ALWAYS["No dates needed<br/>(parks, museums, etc.)"]
```

- **Single date**: Pick a date, set start and end times
- **Recurring**: Select weekdays (0-6), set times, define a date range
- **Always open**: Toggle — no dates needed (used for places like parks)

### Step 4: Spotlight (`StepSpotlight.tsx`)

Optional event promotion:
- Enable/disable spotlight
- Select date range for promotion
- Pricing: 99 SEK/day + 125 SEK flat VAT
- Cost breakdown shown in real-time

### Step 5: Review (`StepEventReview.tsx`)

Read-only summary of all previous steps. Shows:
- All event details
- Spotlight cost breakdown (if enabled)
- Submit button that triggers `createPayload()` → API call

---

## Data Transformation

The form state (`CreateEventFormData`) doesn't match the API format (`CreateEventDto`). The `createPayload()` function transforms it:

```mermaid
graph LR
    A["CreateEventFormData<br/>(form state)"]
    B["createPayload()"]
    C["CreateEventDto<br/>(API payload)"]

    A --> B --> C

    subgraph Transforms
        T1["date + startTime → ISO datetime"]
        T2["weekday name → 0-6 index"]
        T3["subcategories map →<br/>subcategoryCodesByCategory"]
        T4["category selections →<br/>categoryCodes array"]
    end
```

### Key transformations:

| Form Field | API Field | Transform |
|-----------|-----------|-----------|
| `date` + `startTime` | `singleDate.startDate` | Combined into ISO string |
| `"Monday"` | `recurringSchedule.dayOfWeek` | Mapped to `1` |
| `subcategories: { 2: [201, 203] }` | `subcategoryCodesByCategory` | Passed directly |
| Selected category toggles | `categoryCodes: [1, 2]` | Extracted from subcategory keys |

### Edit Mode: Reverse Transformation

When editing, `eventDtoToFormData()` converts an `EventDto` back into form state:

```mermaid
graph LR
    A["EventDto<br/>(from API)"] --> B["eventDtoToFormData()"] --> C["CreateEventFormData<br/>(pre-filled form)"]
```

The edit page at `/my-events/[id]/edit` fetches the event, transforms it, and passes it to the same `EventFormStepper` used for creation.

---

## Validation

Validation runs **per step** — you can't proceed to the next step without passing the current step's rules.

```mermaid
sequenceDiagram
    participant User
    participant Step as Step Component
    participant RHF as React Hook Form
    participant Zod as Zod Schema

    User->>Step: Click "Next"
    Step->>RHF: trigger(currentStepFields)
    RHF->>Zod: Validate subset of fields
    alt Valid
        Zod-->>RHF: No errors
        RHF-->>Step: Proceed to next step
    else Invalid
        Zod-->>RHF: Field errors
        RHF-->>Step: Display error messages
    end
```

The Zod schema in `create-event-schema.ts` defines all validation rules:
- Required fields (title, city, etc.)
- String lengths (max 200 for title)
- Swedish organisation number (Luhn algorithm)
- Valid date ranges
- GPS coordinate format

---

## Adding a New Form Field

1. **Add to Zod schema** in `lib/validation/create-event-schema.ts`
2. **Add to the Step component** that should display it
3. **Update `createPayload()`** to include it in the API payload
4. **Update `eventDtoToFormData()`** to populate it in edit mode
5. **Update `types/events.ts`** if the DTO interface changes
6. **Update `contentText.tsx`** if it's a new category/tag

---

## What's Next

- **[Development Workflow](DEVELOPMENT-WORKFLOW.md)** — Branching, linting, and PR process
- **[docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)** — Full architecture with deployment diagrams
