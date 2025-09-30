import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { setHours, setMinutes } from "date-fns";

export function combineDateTime(date: Date, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  return setMinutes(setHours(date, h), m);
}

export function toLocalISOString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:00.000`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Validate org. nr.
export const ORGNR_REGEX = /^\d{6}-?\d{4}$/;

export function isValidSwedishOrgNr(input: string): boolean {
  const digits = input.replace(/-/g, "");
  if (!/^\d{10}$/.test(digits)) return false;

  // Luhn mod-10 across all 10 digits
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    let n = Number(digits[i]);
    if (i % 2 === 0) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}
