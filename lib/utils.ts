import { Server } from "@prisma/client"
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

export const protectServer = (server: Server) =>
  Object.fromEntries(
    Object.entries(server).filter(
      ([key]) => !["host", "port", "username", "password"].includes(key),
    ),
  )
