# CLAUDE.md - Frontend Project Context for AI Assistants

This file provides context about the GODO Frontend project for AI assistants like Claude.

## Project Overview

**GODO Frontend** is a Next.js 14 web application for the GODO event management platform. It provides event browsing, creation, and management features for both regular users and event organisers.

### Tech Stack
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Hook Form** + **Zod** for form handling and validation
- **TanStack Query (React Query)** for server state management
- **Sonner** for toast notifications
- **Lucide React** for icons

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── create-event/       # Event creation page (multi-step form)
│   ├── landing/            # Main landing page
│   ├── login/              # Auth pages
│   ├── my-events/          # Organiser's events list
│   │   └── [id]/edit/      # Event edit page (same form as create)
│   └── register/           # Registration pages
├── components/
│   ├── events/             # Event-related components
│   ├── forms/              # Form components (EventFormStepper, etc.)
│   ├── global/             # Global components (Navbar, etc.)
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and validation schemas
│   └── validation/         # Zod schemas
└── types/                  # TypeScript type definitions
```

## Key Features

### 1. Event Browsing
- Landing page with event grid
- Filtering by category, subcategory, tags
- Pagination support

### 2. Event Creation (Multi-Step Form)
- **Step 1: Details** - Title, description, organiser, categories/subcategories
- **Step 2: Location** - Address, city, postal code
- **Step 3: Date & Time** - Start/end dates, schedule options
- **Step 4: Spotlight** - Featured event settings
- **Step 5: Confirm** - Review and submit

### 3. My Events (Organiser Dashboard)
- Lists events created by the logged-in organiser
- Filters by `createdById` from JWT
- Only shows active events (`isActive: true`)
- Edit and delete functionality

### 4. Event Editing
- Full edit page at `/my-events/[id]/edit`
- Uses same multi-step form as create
- Converts EventDto to form data format
- Back navigation to My Events

### 5. Authentication
- JWT-based authentication
- Token stored in localStorage (`authToken`)
- Role-based UI (Admin sees Quick Add button)
- Organiser-specific features

## Important Files

### Pages
- `src/app/create-event/page.tsx` - Event creation with multi-step form
- `src/app/my-events/page.tsx` - Organiser's event dashboard
- `src/app/my-events/[id]/edit/page.tsx` - Event edit page
- `src/app/landing/page.tsx` - Main landing page

### Hooks
- `src/hooks/useEvents.ts` - Event CRUD operations (useEvents, useEvent, useCreateEvent, useUpdateEvent, useDeleteEvent)
- `src/hooks/useCreateEvent.ts` - Legacy create event hook

### Types
- `src/types/events.ts` - EventDto, CreateEventDto, UpdateEventDto, EventFilterDto

### Validation
- `src/lib/validation/create-event-schema.ts` - Zod schema, form types, payload creator, DTO-to-form converter

### Components
- `src/components/forms/EventFormStepper.tsx` - Multi-step form component
- `src/components/events/EventTicketCard.tsx` - Success card after creation

## API Integration

### Base URL
- Development: `http://localhost:5198`

### Key Endpoints Used
```
GET    /api/events                    # List events with filters
GET    /api/events/{id}               # Get single event
POST   /api/events                    # Create event
PUT    /api/events/{id}               # Update event
DELETE /api/events/{id}               # Soft delete event
```

### Query Parameters
- `categoryCodes` - Filter by categories
- `subcategoryCodes` - Filter by subcategories
- `createdById` - Filter by creator (for My Events)
- `isActive` - Filter active/deleted events
- `pageNumber`, `pageSize` - Pagination

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
npm run type-check
```

## Conventions

### Form Data Flow
1. User fills multi-step form (`CreateEventFormData`)
2. `createPayload()` converts form data to `CreateEventDto`/`UpdateEventDto`
3. API call sends payload to backend
4. For edits: `eventDtoToFormData()` converts API response back to form format

### Authentication Token
```typescript
// Get token from localStorage
const token = localStorage.getItem("authToken");

// Decode JWT to get user info
const decoded = JSON.parse(atob(token.split('.')[1]));
const userId = decoded.nameid;  // User ID (for createdById filter)
const roles = decoded.role;     // Roles array (check for "Admin")
```

### API Calls
All API calls use TanStack Query:
```typescript
// Fetch events
const { data, isLoading, error } = useEvents({ createdById: userId, isActive: true });

// Mutations
const { mutate: deleteEvent } = useDeleteEvent();
deleteEvent(eventId, { onSuccess: () => refetch() });
```

### Toast Notifications
```typescript
import { toast } from "sonner";

toast(<div className="flex items-start gap-3 text-black">
  <CheckCircle className="text-green-500 mt-1" />
  <div>
    <p className="font-semibold">Success!</p>
    <p className="text-sm">Event created successfully.</p>
  </div>
</div>);
```

## Notes for AI Assistants

1. **Form Validation** - Uses Zod schemas; validation errors show inline
2. **Soft Delete** - Always filter with `isActive: true` to hide deleted events
3. **Ownership** - Use `createdById` filter with user ID from JWT for "My Events"
4. **Edit Form** - Converts EventDto → CreateEventFormData via `eventDtoToFormData()`
5. **Retry Disabled** - Delete mutations have `retry: false` to prevent double-delete
6. **Role Checks** - Admin features check `roles.includes("Admin")` from JWT
7. **Back Navigation** - Create page links to `/landing`, Edit page links to `/my-events`
8. **Client Components** - Pages with state/effects need `"use client"` directive
9. **Time Handling** - Form uses "HH:mm" format; backend uses TimeSpan
10. **Subcategory Mapping** - Form stores `subcategoryCodes: Record<number, number[]>` keyed by category code
