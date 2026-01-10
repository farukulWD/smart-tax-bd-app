import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export type Mode = 'light' | 'dark';

let mode: Mode = 'light';

export function setMode(next: Mode) {
  mode = next;
}

export function getMode(): Mode {
  return mode;
}
