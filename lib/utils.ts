import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateRandomString = (length: number = 10) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

const intl = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "medium",
})

export const formatDate = (date: string | Date) =>
  intl.format(new Date(date)).toString()

export const daysPassedSince = (since: string | Date) =>
  Math.round((Date.now() - new Date(since).getTime()) / (1000 * 3600 * 24))

export const formatBalance = (value: number) => {
  if (value < 0.0001) {
    return String(value)
  }

  return String(Math.round(value * 1000) / 1000)
}

export const abbreviateWithEllipsis = (val: string) => {
  if (val.length <= 10) {
    return val
  }

  return val.slice(0, 5) + "..." + val.slice(-5)
}
