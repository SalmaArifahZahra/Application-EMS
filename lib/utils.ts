import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | number | undefined): string {
  if (!dateString) return "-";
  
  let ts = dateString;
  if (typeof ts === 'string' && /^\d{10}$/.test(ts)) {
    ts = parseInt(ts) * 1000;
  } else if (typeof ts === 'number' && ts < 9999999999) {
    ts = ts * 1000;
  }
  
  const d = new Date(ts);
  if (isNaN(d.getTime())) return String(dateString);
  
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
