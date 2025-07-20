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
