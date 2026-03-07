# Key Files Reference

## Pages (App Router)
| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout (providers, global styles) |
| `src/app/page.tsx` | Home/landing redirect |
| `src/app/(auth)/login/page.tsx` | Organiser login |
| `src/app/(auth)/register/page.tsx` | Organiser registration |
| `src/app/create-event/page.tsx` | Multi-step event creation form |
| `src/app/my-events/page.tsx` | Organiser's event list |
| `src/app/preview/page.tsx` | Mobile app preview mockup |
| `src/app/quick-create/page.tsx` | Admin quick-create form |
| `src/app/landing/page.tsx` | Public landing page |

## Form System
| File | Purpose |
|------|---------|
| `src/components/forms/` | All form step components |
| `src/lib/validation/` | Zod validation schemas |
| `src/types/` | Form and event type definitions |

## Data Layer
| File | Purpose |
|------|---------|
| `src/lib/axios.ts` | Axios instance (base URL, interceptors) |
| `src/hooks/` | Custom hooks (auth, events, etc.) |
| `src/providers/` | React context providers |

## UI Components
| File | Purpose |
|------|---------|
| `src/components/ui/` | shadcn/ui base components |
| `src/components/global/` | Layout, header, footer |
| `src/components/events/` | Event display components |
| `src/components/preview/` | Mobile app preview |

## Configuration
| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `tsconfig.json` | TypeScript configuration |
| `.env.local` | Environment variables (not committed) |
| `.github/workflows/pull-request-check-action.yml` | PR CI pipeline |
