# CLAUDE.md - Frontend Project Context for AI Assistants

This file provides context about the GODO Frontend project for AI assistants like Claude.

## Project Overview

**GODO Frontend** is a Next.js 16 web application for the GODO event management platform. It provides an organiser-facing form for event creation and management. The backend is a .NET 8 API at `C:\InFiNetCode\Projects\GODO\BACKEND\Backend`.

### Tech Stack
- **Next.js 16.1.4** (App Router with Turbopack)
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Hook Form** + **Zod** for form handling and validation
- **TanStack Query (React Query) 5** for server state management
- **Axios** for HTTP requests (shared instance with JWT interceptor)
- **Sonner** for toast notifications
- **Lucide React** for icons

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/
│   │   ├── login/          # Organiser login
│   │   ├── register/       # Organiser registration
│   │   └── forgot-password/
│   ├── create-event/       # Event creation page (multi-step form)
│   ├── landing/            # Main landing page (role-based)
│   ├── my-events/          # Organiser's events list
│   │   └── [id]/edit/      # Event edit page (same form as create)
│   └── quick-create/       # Admin-only quick event creation
├── components/
│   ├── events/             # Event-related components (EventTicketCard)
│   ├── forms/              # Form components
│   │   ├── EventFormStepper.tsx   # Multi-step form orchestrator
│   │   ├── QuickCreateForm.tsx    # Admin quick-create form
│   │   └── steps/                 # Individual form steps (5 steps)
│   ├── global/             # Global components (Navbar)
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
│   ├── useEvents.ts        # CRUD hooks (useEvents, useEvent, useUpdateEvent, etc.)
│   ├── useCreateEvent.ts   # Legacy create event hook
│   ├── useEventForm.ts     # Form hook with Zod resolver
│   └── useQuickCreateEvent.ts
├── lib/
│   ├── axios.ts            # Axios instance with JWT interceptor
│   ├── utils.ts            # Utility functions (org nr validation, etc.)
│   ├── content/
│   │   └── contentText.tsx # Categories, subcategories, filter tags (hardcoded)
│   └── validation/
│       ├── create-event-schema.ts  # Zod schema + payload creators
│       └── quick-create-schema.ts  # Quick-create schema
└── types/
    └── events.ts           # TypeScript interfaces (EventDto, CreateEventDto, etc.)
```

## Category System (Aligned with Backend)

7 main categories with 21 subcategories (3 per category). Defined in `src/lib/content/contentText.tsx`.

| Code | Name | Subcategories |
|------|------|---------------|
| 1 | Events | 101: Festivals & fun, 102: Leisure & lifestyle, 103: Fairs & markets |
| 2 | Sports & sporting activities | 201: Sports to do, 202: Sports to watch, 203: Sports to try |
| 3 | Entertainment | 301: Cinema & film, 302: Music & concerts, 303: Theater & shows |
| 4 | Culture & sights | 401: Guided tours, 402: Art & galleries, 403: Museums & sights |
| 5 | Adventure & activities | 501: Parks & trails, 502: Food & drink activities, 503: Trips & adventures |
| 6 | Learn & explore | 601: Talks & lectures, 602: Learn to..., 603: Gatherings & meetings |
| 7 | Health & wellbeing | 701: Spas & pools, 702: Support & interaction, 703: Activities of faith |

### Filter Tags (1001-1006)
| Code | Name |
|------|------|
| 1001 | Free |
| 1002 | Family-friendly |
| 1003 | Indoor |
| 1004 | Outdoor |
| 1005 | Senior focus |
| 1006 | Wheelchair accessible |

### Codes vs IDs
- Frontend sends **codes** (int) for categories/subcategories/tags
- Backend resolves codes to GUIDs via CodebookService
- Subcategory code pattern: `categoryCode * 100 + index` (e.g., Sports=2 → 201, 202, 203)

## Key Features

### 1. Event Creation (Multi-Step Form)
- **Step 1: Details** - Title, organiser, org number, categories/subcategories, filters, description, URLs
- **Step 2: Location** - Street, city, postal code, GPS coordinates (optional)
- **Step 3: Date & Time** - Single dates or schedule, always-open toggle
- **Step 4: Spotlight** - Featured event promotion (99 SEK/day + 125 SEK VAT)
- **Step 5: Review** - Summary with spotlight cost breakdown, submit

### 2. My Events (Organiser Dashboard)
- Lists events created by the logged-in organiser
- Filters by `createdById` from JWT
- Only shows active events (`isActive: true`)
- Edit and delete functionality

### 3. Event Editing
- Full edit page at `/my-events/[id]/edit`
- Uses same multi-step form as create
- Converts EventDto to form data via `eventDtoToFormData()`

### 4. Authentication
- JWT-based via organiser endpoints (`/api/organisers/auth/login` and `/register`)
- All auth calls use shared axios instance (respects `NEXT_PUBLIC_API_URL`)
- Token stored in localStorage as `accessToken`
- Axios interceptor adds `Authorization: Bearer {token}` to all requests
- Role-based UI: Admin sees Quick Create button on landing page

### 5. Quick Create (Admin Only)
- Simplified event creation at `/quick-create`
- Admin role check via JWT decode
- Sends to `POST /api/events/quick`

## API Integration

### Base URL Configuration
```typescript
// src/lib/axios.ts
baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5198/api"
```
Set `NEXT_PUBLIC_API_URL` in `.env.local` for different environments.

### Endpoints Used
```
POST   /api/organisers/auth/login      # Organiser login
POST   /api/organisers/auth/register   # Organiser registration
GET    /api/events                      # List events with filters
GET    /api/events/{id}                 # Get single event
POST   /api/events                      # Create event (Organiser/Admin)
PUT    /api/events/{id}                 # Full update event
PATCH  /api/events/{id}                 # Partial update event
DELETE /api/events/{id}                 # Soft delete event
POST   /api/events/quick                # Quick-create (Admin only)
```

### Query Parameters for GET /api/events
- `categoryCodes` - Comma-separated category codes (e.g., "1,3")
- `subcategoryCodes` - Comma-separated subcategory codes
- `tagCodes` - Comma-separated tag codes
- `createdById` - Filter by creator's user ID (for "My Events")
- `isActive` - Filter active/deleted events (default: true)
- `city` - Filter by city name
- `fromDate`, `toDate` - Date range (ISO format)
- `pageNumber`, `pageSize` - Pagination

### Response Format
All API responses use `OperationResult<T>`:
```json
{ "isSuccess": true, "data": { ... }, "errors": [] }
```

## Important Files

### Content & Configuration
- `src/lib/content/contentText.tsx` - **Categories, subcategories, filter tags** (must match backend DataSeeder)
- `src/lib/axios.ts` - Axios instance with JWT interceptor
- `src/types/events.ts` - All TypeScript interfaces matching backend DTOs

### Form System
- `src/lib/validation/create-event-schema.ts` - Zod schema, `createPayload()`, `eventDtoToFormData()`
- `src/lib/validation/quick-create-schema.ts` - Quick-create Zod schema
- `src/hooks/useEventForm.ts` - Form hook with Zod resolver
- `src/components/forms/EventFormStepper.tsx` - Multi-step form orchestrator
- `src/components/forms/steps/` - Individual steps (Details, Location, DateTime, Spotlight, Review)

### Hooks
- `src/hooks/useEvents.ts` - `useEvents`, `useEvent`, `useUpdateEvent`, `usePatchEvent`, `useDeleteEvent`
- `src/hooks/useCreateEvent.ts` - `useCreateEvent` mutation
- `src/hooks/useQuickCreateEvent.ts` - `useQuickCreateEvent` mutation

## Common Tasks

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Type Check
```bash
npx tsc --noEmit
```

## Conventions

### Form Data Flow
1. User fills multi-step form (`CreateEventFormData`)
2. `createPayload()` converts to `CreateEventDto` (dates+times combined, weekday mapped to 0-6)
3. API call via axios sends payload to backend
4. For edits: `eventDtoToFormData()` converts EventDto back to form format

### Authentication Token
```typescript
const token = localStorage.getItem("accessToken");
const decoded = JSON.parse(atob(token.split('.')[1]));
const userId = decoded.nameid || decoded.sub || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
const roles = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
const roleArray = Array.isArray(roles) ? roles : [roles];
const isAdmin = roleArray.includes("Admin");
```

## Notes for AI Assistants

1. **Categories must match backend** - `contentText.tsx` has 7 categories (codes 1-7) with 3 subcategories each (code pattern: catCode*100 + index). These MUST match the backend DataSeeder
2. **All API calls use axios** - Login, register, and all event operations use the shared `api` instance from `src/lib/axios.ts`. Never use raw `fetch()` with hardcoded URLs
3. **Bilingual DTOs** - Backend returns `nameSv` (Swedish) alongside `name` (English) on categories and subcategories
4. **Soft Delete** - Always filter with `isActive: true` to hide deleted events
5. **Ownership** - Use `createdById` filter with user ID from JWT for "My Events"
6. **Edit Form** - Converts EventDto → CreateEventFormData via `eventDtoToFormData()`
7. **Time Handling** - Form uses "HH:mm" format; backend uses TimeSpan
8. **Subcategory Mapping** - Form stores `subcategories: Record<number, number[]>` keyed by category code; sent as `subcategoryCodesByCategory` to backend
9. **Spotlight Pricing** - 99 SEK/day + 125 SEK flat VAT; displayed in StepSpotlight and StepEventReview
10. **GPS Coordinates** - Optional string field "lat,lon"; backend can auto-geocode if missing
11. **Source Provider** - EventDto includes `sourceProvider` field (null for internal events, "helsingborg" for external)
12. **Backend runs on** `http://localhost:5198` (not 7030) — use `NEXT_PUBLIC_API_URL` env var to configure
