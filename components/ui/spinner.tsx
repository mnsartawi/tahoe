"use client"

import { cn } from "@/lib/utils"

export default function Loader({
  size = "sm",
  color = "black",
  className,
}: {
  size?: "sm" | "md" | "lg"
  color?: string
  className?: string
}) {
  const dims =
    size === "lg" ? "h-8 w-8" : size === "md" ? "h-5 w-5" : "h-4 w-4"
  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        dims,
        className
      )}
      style={{ color }}
      aria-label="loading"
    />
  )
}
