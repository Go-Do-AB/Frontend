# GODO Frontend (Website) — Architecture Documentation

> Last updated: 2026-02-26

## Overview

The GODO website is a **Next.js 16** application for event organisers to create, manage, and promote events. It connects to the .NET 10 backend API and is part of the broader GODO platform.

```mermaid
graph LR
    subgraph Frontend["Next.js 16 (this project)"]
        PAGES["App Router Pages"]
        HOOKS["TanStack Query Hooks"]
        FORMS["React Hook Form + Zod"]
        UI["shadcn/ui Components"]
    end

    subgraph Backend["Backend API"]
        API[".NET 10 API<br/>api.godo-dev.nu"]
        DB[("SQL Server")]
    end

    PAGES --> HOOKS
    PAGES --> FORMS
    PAGES --> UI
    HOOKS -->|"Axios + JWT"| API
    FORMS -->|"POST/PUT"| API
    API --> DB
```

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.4 | App Router, SSR, Turbopack |
| React | 19.1.0 | UI framework |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| shadcn/ui | - | Radix + Tailwind components |
| TanStack Query | 5.83.0 | Server state management |
| React Hook Form | 7.60.0 | Form state management |
| Zod | 4.0.5 | Schema validation |
| Axios | 1.10.0 | HTTP client with JWT interceptor |
| date-fns | 4.1.0 | Date formatting |
| Lucide React | 0.525.0 | Icons |
| Sonner | 2.0.6 | Toast notifications |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (providers, navbar)
│   ├── page.tsx                  # Redirect → /login
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx        # Organiser login
│   │   ├── register/page.tsx     # Organiser registration
│   │   └── forgot-password/page.tsx
│   ├── landing/page.tsx          # Main landing (role-based UI)
│   ├── create-event/page.tsx     # Multi-step event form
│   ├── my-events/
│   │   ├── page.tsx              # Organiser's events dashboard
│   │   └── [id]/edit/page.tsx    # Event edit page
│   ├── quick-create/page.tsx     # Admin-only quick create
│   └── preview/page.tsx          # Mobile app preview
│
├── components/
│   ├── global/Navbar.tsx         # Header with logo, search, logout
│   ├── forms/
│   │   ├── EventFormStepper.tsx  # Multi-step form orchestrator
│   │   ├── QuickCreateForm.tsx   # Admin quick-create form
│   │   ├── TimePicker.tsx        # Time selector component
│   │   └── steps/
│   │       ├── StepEventDetails.tsx     # Step 1: Title, org, categories
│   │       ├── StepEventLocation.tsx    # Step 2: Address, GPS
│   │       ├── StepEventDateTime.tsx    # Step 3: Date/time/schedule
│   │       ├── StepSpotlight.tsx        # Step 4: Spotlight promotion
│   │       └── StepEventReview.tsx      # Step 5: Review & submit
│   ├── events/EventTicketCard.tsx       # Success card
│   ├── preview/                         # Mobile app mockup
│   └── ui/                              # shadcn/ui components
│
├── hooks/
│   ├── useEvents.ts             # CRUD hooks (list, get, update, delete)
│   ├── useCreateEvent.ts        # Create mutation
│   ├── useQuickCreateEvent.ts   # Quick-create mutation
│   └── useEventForm.ts          # Form + Zod resolver
│
├── lib/
│   ├── axios.ts                 # Axios instance + JWT interceptor
│   ├── utils.ts                 # Helpers (date, org nr validation, cn)
│   ├── content/contentText.tsx  # Category/subcategory/tag definitions
│   └── validation/
│       ├── create-event-schema.ts   # Zod schema + payload creator
│       └── quick-create-schema.ts   # Quick-create schema
│
├── providers/
│   └── react-query-provider.tsx # TanStack Query setup
│
└── types/
    └── events.ts                # TypeScript interfaces (matches backend)
```

---

## User Flow

```mermaid
flowchart TD
    START(["User visits site"]) --> LOGIN{Authenticated?}

    LOGIN -->|No| LOGIN_PAGE["Login Page<br/>/login"]
    LOGIN -->|Yes| LANDING["Landing Page<br/>/landing"]

    LOGIN_PAGE -->|"Submit credentials"| AUTH["POST /api/organisers/auth/login<br/>Store JWT in localStorage"]
    AUTH --> LANDING

    LOGIN_PAGE -->|"New user"| REGISTER["Register Page<br/>/register"]
    REGISTER -->|"Create account"| AUTH

    LANDING --> CREATE["Create Event<br/>/create-event"]
    LANDING --> MY_EVENTS["My Events<br/>/my-events"]
    LANDING -->|"Admin only"| QUICK["Quick Create<br/>/quick-create"]
    LANDING --> PREVIEW["App Preview<br/>/preview"]

    CREATE --> STEP1["Step 1: Details<br/>Title, Org, Categories"]
    STEP1 --> STEP2["Step 2: Location<br/>Address, GPS"]
    STEP2 --> STEP3["Step 3: Date/Time<br/>Single, Recurring, Always Open"]
    STEP3 --> STEP4["Step 4: Spotlight<br/>Promotion pricing"]
    STEP4 --> STEP5["Step 5: Review<br/>Confirm & Submit"]
    STEP5 -->|"POST /api/events"| SUCCESS["Success Card"]
    SUCCESS -->|"Create Another"| CREATE
    SUCCESS -->|"Back"| LANDING

    MY_EVENTS --> EDIT["Edit Event<br/>/my-events/[id]/edit"]
    MY_EVENTS -->|"Delete"| CONFIRM["Confirm Dialog"]
    CONFIRM -->|"Yes"| SOFT_DELETE["DELETE /api/events/{id}<br/>(soft delete)"]
    EDIT -->|"PUT /api/events/{id}"| MY_EVENTS
```

---

## Data Flow

```mermaid
flowchart LR
    subgraph UI["React Components"]
        FORM["EventFormStepper<br/>(React Hook Form)"]
        LIST["My Events Page<br/>(event list)"]
    end

    subgraph Hooks["TanStack Query Hooks"]
        CREATE_M["useCreateEvent()<br/>useMutation"]
        EVENTS_Q["useEvents(filter)<br/>useQuery"]
        UPDATE_M["useUpdateEvent()<br/>useMutation"]
        DELETE_M["useDeleteEvent()<br/>useMutation"]
    end

    subgraph Transport["Axios"]
        AXIOS["axios instance<br/>+ JWT interceptor"]
    end

    subgraph API["Backend API"]
        EP_CREATE["POST /api/events"]
        EP_LIST["GET /api/events"]
        EP_UPDATE["PUT /api/events/{id}"]
        EP_DELETE["DELETE /api/events/{id}"]
    end

    FORM -->|"createPayload()"| CREATE_M
    FORM -->|"createPayload()"| UPDATE_M
    LIST --> EVENTS_Q
    LIST --> DELETE_M

    CREATE_M --> AXIOS
    EVENTS_Q --> AXIOS
    UPDATE_M --> AXIOS
    DELETE_M --> AXIOS

    AXIOS --> EP_CREATE
    AXIOS --> EP_LIST
    AXIOS --> EP_UPDATE
    AXIOS --> EP_DELETE
```

### JWT Authentication Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Axios as Axios Interceptor
    participant API as Backend API

    Browser->>API: POST /api/organisers/auth/login
    API-->>Browser: { accessToken: "eyJ..." }
    Browser->>Browser: localStorage.setItem("accessToken", token)

    Note over Browser,API: Subsequent requests
    Browser->>Axios: GET /api/events
    Axios->>Axios: Read token from localStorage
    Axios->>API: GET /api/events<br/>Authorization: Bearer eyJ...
    API-->>Browser: { isSuccess: true, data: [...] }

    Note over Browser,API: Logout
    Browser->>Browser: localStorage.removeItem("accessToken")
    Browser->>Browser: Redirect to /login
```

---

## Multi-Step Event Form

```mermaid
stateDiagram-v2
    [*] --> Details: Step 0
    Details --> Location: Next (validated)
    Location --> DateTime: Next (validated)
    DateTime --> Spotlight: Next (validated)
    Spotlight --> Review: Next
    Review --> [*]: Submit (POST /api/events)

    Details: Organiser, Title, Categories
    Details: Subcategories, Tags, Description
    Location: Street, City, Postal Code
    Location: GPS Coordinates (optional)
    DateTime: Single Date/Time
    DateTime: Recurring Schedule
    DateTime: Always Open
    Spotlight: Enable/Disable
    Spotlight: Date Range + Pricing
    Review: Full Summary + Cost
```

### Form Data Transformation

```mermaid
graph LR
    A["CreateEventFormData<br/>(form state)"] -->|"createPayload()"| B["CreateEventDto<br/>(API payload)"]

    subgraph Transforms
        T1["date + time → ISO string"]
        T2["weekday name → 0-6 index"]
        T3["category selections →<br/>subcategoryCodesByCategory"]
    end

    A --> Transforms --> B
```

---

## API Response Format

All API responses use `OperationResult<T>`:

```typescript
// Success
{
  "isSuccess": true,
  "data": { ... },
  "errors": []
}

// Paginated
{
  "isSuccess": true,
  "data": {
    "items": [...],
    "totalCount": 150,
    "pageNumber": 1,
    "pageSize": 30
  },
  "errors": []
}

// Error
{
  "isSuccess": false,
  "data": null,
  "errors": ["Title is required", "City is required"]
}
```

---

## Category System

The frontend has hardcoded category/subcategory/tag definitions that match the backend exactly:

| Code | Category (EN) | Subcategories |
|------|--------------|---------------|
| 1 | Events | 101, 102, 103 |
| 2 | Sports | 201, 202, 203 |
| 3 | Entertainment | 301, 302, 303 |
| 4 | Culture & Sights | 401, 402, 403 |
| 5 | Adventure | 501, 502, 503 |
| 6 | Learn & Explore | 601, 602, 603 |
| 7 | Health & Wellbeing | 701, 702, 703 |

**Tags:** 1001 Free, 1002 Family-friendly, 1003 Indoor, 1004 Outdoor, 1005 Senior, 1006 Wheelchair

---

## Deployment

### Docker (Production)

```mermaid
graph LR
    subgraph Build["Multi-Stage Docker Build"]
        DEPS["Stage 1: deps<br/>npm ci"]
        BUILD["Stage 2: build<br/>npm run build"]
        RUN["Stage 3: runtime<br/>Node 20 Alpine"]
    end
    DEPS --> BUILD --> RUN
```

**Key config:**
- `next.config.ts`: `output: "standalone"` for self-contained builds
- Build arg: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5198/api`)
- Runtime port: 3000

### GleSYS Deployment

The frontend runs as a Docker container on the same GleSYS VPS as the backend:

```
Internet → Caddy (auto-TLS) → godo-frontend:3000
         → Caddy (auto-TLS) → godo-api:8080
```

- **Domain:** `godo-dev.nu` → frontend
- **API Domain:** `api.godo-dev.nu` → backend
- **Environment:** `NEXT_PUBLIC_API_URL=https://api.godo-dev.nu/api`

---

## Validation

Swedish organisation number validation uses the **Luhn algorithm**:

```
Input: 556439-3498
1. Strip dash → 5564393498
2. Luhn checksum on 10 digits
3. Valid if checksum mod 10 === 0
```

Form validation runs per-step (you can't proceed without passing the current step's rules).
