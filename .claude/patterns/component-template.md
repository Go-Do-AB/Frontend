# Component Template

Use this when creating new reusable components.

## File Structure

Create: `src/components/[feature]/[ComponentName].tsx`

## Basic Component

```tsx
interface [ComponentName]Props {
  // Define props
}

export function [ComponentName]({ ...props }: [ComponentName]Props) {
  return (
    <div>
      {/* Content */}
    </div>
  );
}
```

## Client Component (with hooks/events)

```tsx
"use client";

import { useState } from "react";

interface [ComponentName]Props {
  // Define props
}

export function [ComponentName]({ ...props }: [ComponentName]Props) {
  const [state, setState] = useState();

  return (
    <div>
      {/* Content */}
    </div>
  );
}
```

## Key Rules
- Server Component by default — add `"use client"` only when needed
- Props interface defined in the same file (or `src/types/` if shared)
- Use shadcn/ui base components from `src/components/ui/`
- Style with Tailwind CSS classes
- Keep focused and reusable — receive data via props, don't fetch directly
