# API Integration Reference

## Axios Instance
`src/lib/axios.ts` configures the base Axios instance:
- Base URL from `NEXT_PUBLIC_API_URL` env var
- JWT token attached via interceptor
- Refresh token rotation on 401 responses

## Authentication Flow
1. Organiser logs in → receives JWT + refresh token
2. JWT stored in memory/cookie, refresh token in httpOnly cookie
3. On 401: interceptor uses refresh token to get new JWT
4. On refresh failure: redirect to login

## API Response Format
All backend responses use `OperationResult<T>`:
```json
{
  "isSuccess": true,
  "data": { ... },
  "errors": []
}
```

## Key Endpoints Used
| Action | Method | Endpoint | Auth |
|--------|--------|----------|------|
| Login | POST | `/api/organisers/login` | No |
| Register | POST | `/api/organisers/register` | No |
| Refresh | POST | `/api/organisers/refresh` | Token |
| Create event | POST | `/api/events` | Organiser |
| Update event | PUT | `/api/events/{id}` | Organiser |
| Patch event | PATCH | `/api/events/{id}` | Organiser |
| Delete event | DELETE | `/api/events/{id}` | Organiser |
| Get events | GET | `/api/events` | No |
| Get event | GET | `/api/events/{id}` | No |
| Quick create | POST | `/api/events/quick` | Admin |

## TanStack Query Patterns
- Use `useQuery` for GET requests with caching
- Use `useMutation` for POST/PUT/DELETE with optimistic updates
- Query keys follow: `['events']`, `['events', id]`, `['events', filters]`
