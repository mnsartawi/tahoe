"use client"

import * as React from "react"
import { cn } from "@/lib/utils"


export function DropdownMenu({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  React.useEffect(() => {
    if (!open) return
    const close = () => onOpenChange?.(false)
    window.addEventListener("click", close)
    window.addEventListener("touchstart", close)
    return () => {
      window.removeEventListener("click", close)
      window.removeEventListener("touchstart", close)
    }
  }, [open, onOpenChange])
  if (open === false) return null
  return <>{children}</>
}

export function DropdownMenuTrigger({
  asChild,
  children,
}: {
  asChild?: boolean
  children: React.ReactNode
}) {
  return <>{children}</>
}

export function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function DropdownMenuContent({
  children,
  className,
  style,
  sideOffset: _sideOffset,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  sideOffset?: number
  align?: string
}) {
  return (
    <div
      className={cn("fixed z-9999", className)}
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      className={cn(
        "w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/10",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1.5 h-px bg-white/10", className)} />
}

export function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  return <div className="group/sub relative">{children}</div>
}

export function DropdownMenuSubTrigger({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/10",
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuSubContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "absolute top-0 left-full ml-1 hidden py-1.5 group-hover/sub:block",
        className
      )}
    >
      {children}
    </div>
  )
}
