# Page Template

Use this when creating new Next.js App Router pages.

## File Structure

Create: `src/app/[route]/page.tsx`

## Server Component (default)

```tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "[Page Title] | GODO",
};

export default function [PageName]Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">[Page Title]</h1>
      {/* Content */}
    </main>
  );
}
```

## Client Component (when hooks/events needed)

```tsx
"use client";

import { useState } from "react";

export default function [PageName]Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">[Page Title]</h1>
      {/* Content */}
    </main>
  );
}
```

## With Data Fetching (TanStack Query)

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function [PageName]Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["[resource]"],
    queryFn: () => api.get("/[endpoint]").then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Render data */}
    </main>
  );
}
```

## Key Rules
- Default to Server Components — add `"use client"` only when needed
- Use shadcn/ui components from `src/components/ui/`
- API calls via shared Axios instance (`src/lib/axios.ts`)
- Types in `src/types/events.ts`
