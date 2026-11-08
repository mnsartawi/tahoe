"use client"

import { memo, useEffect, useRef, useState } from "react"

export type DesktopAction =
  | "new-folder"
  | "get-info"
  | "wallpaper"
  | "widgets"
  | "toggle-stacks"
  | "stacks-kind"
  | "stacks-date"
  | "view-options"

type Item = {
  label: string
  action?: DesktopAction
  checked?: boolean
  submenu?: { label: string; action: DesktopAction }[]
}

const CHECK = (
  <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6.5 4.8 9 10 3" />
  </svg>
)

function DesktopMenu({
  x,
  y,
  stacks,
  onAction,
  onClose,
}: {
  x: number
  y: number
  stacks: boolean
  onAction: (a: DesktopAction) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [openSub, setOpenSub] = useState<string | null>(null)

  useEffect(() => {
    const outside = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", outside)
    document.addEventListener("touchstart", outside)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("mousedown", outside)
      document.removeEventListener("touchstart", outside)
      document.removeEventListener("keydown", esc)
    }
  }, [onClose])

  const items: (Item | "sep")[] = [
    { label: "New Folder", action: "new-folder" },
    "sep",
    { label: "Get Info", action: "get-info" },
    { label: "Change Wallpaper...", action: "wallpaper" },
    { label: "Edit Widgets...", action: "widgets" },
    "sep",
    { label: "Use Stacks", action: "toggle-stacks", checked: stacks },
    {
      label: "Group Stacks By",
      submenu: [
        { label: "Kind", action: "stacks-kind" },
        { label: "Date", action: "stacks-date" },
      ],
    },
    { label: "Show View Options", action: "view-options" },
    "sep",
    {
      label: "Import from iPhone or iPad",
      submenu: [
        { label: "Take Photo", action: "view-options" },
        { label: "Scan Documents", action: "view-options" },
      ],
    },
  ]

  return (
    <div
      ref={ref}
      className="tahoe-glass-dark fixed z-[9999] w-60 rounded-2xl py-1.5 text-white"
      style={{ left: Math.min(x, window.innerWidth - 250), top: Math.min(y, window.innerHeight - 320) }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, i) =>
        item === "sep" ? (
          <div key={`sep-${i}`} className="mx-3 my-1.5 h-px bg-white/15" />
        ) : (
          <div key={item.label} className="relative" onMouseEnter={() => setOpenSub(item.submenu ? item.label : null)}>
            <button
              onClick={() => {
                if (item.action) {
                  onAction(item.action)
                  onClose()
                }
              }}
              className="flex w-full items-center gap-2 px-3 py-[5px] text-left text-[13px] transition-colors hover:bg-[#0a84ff] hover:text-white"
            >
              <span className="flex w-4 shrink-0 items-center justify-center">
                {item.checked ? CHECK : null}
              </span>
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.submenu && <span className="text-[10px] opacity-70">▶</span>}
            </button>
            {item.submenu && openSub === item.label && (
              <div className="tahoe-glass-dark absolute top-0 left-full ml-1 w-44 rounded-2xl py-1.5">
                {item.submenu.map((sub) => (
                  <button
                    key={sub.label}
                    onClick={() => {
                      onAction(sub.action)
                      onClose()
                    }}
                    className="block w-full px-3 py-[5px] text-left text-[13px] transition-colors hover:bg-[#0a84ff]"
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  )
}

export default memo(DesktopMenu)
