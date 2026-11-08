"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { Files, Folder, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ExpandedSpotlight from "@/components/expanded-spotlight"

const modes = [
  {
    label: "Applications",
    icon: <Image src="/store.png" alt="" width={32} height={32} />,
  },
  {
    label: "Files",
    icon: <Folder className="size-5" />,
  },
  {
    label: "Actions",
    icon: <Image src="/actions.png" alt="" width={30} height={30} />,
  },
  {
    label: "Clipboard",
    icon: <Files className="size-5.5" />,
  },
]

const transition = {
  duration: 0.22,
  ease: [0.16, 1, 0.3, 1] as const,
}

export default function Spotlight({
  isRevealed,
  apps,
  query,
  onQueryChange,
  onOpenApp,
  onLock,
}: {
  isRevealed: boolean
  apps: { id: string; name: string; icon?: string | null }[]
  query: string
  onQueryChange: (value: string) => void
  onOpenApp?: (id: string) => void
  onLock?: () => void
}) {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)
  const [activeMode, setActiveMode] = useState<(typeof modes)[number] | null>(
    null
  )
  const inputRef = useRef<HTMLInputElement>(null)

  const isExpanded = query.length > 0

  useEffect(() => {
    let blurTimer: number | null = null
    let lastFocused = 0

    const resetQuery = () => {
      if (blurTimer) window.clearTimeout(blurTimer)
      const recentlyFocused = Date.now() - lastFocused < 2000
      const delay = recentlyFocused ? 800 : 250
      blurTimer = window.setTimeout(() => {
        if (!document.hasFocus()) {
          onQueryChange("")
          setActiveMode(null)
          setHoveredLabel(null)
        }
        blurTimer = null
      }, delay)
    }

    const markFocused = () => {
      lastFocused = Date.now()
    }

    window.addEventListener("blur", resetQuery)
    window.addEventListener("focus", markFocused)

    return () => {
      window.removeEventListener("blur", resetQuery)
      window.removeEventListener("focus", markFocused)
      if (blurTimer) window.clearTimeout(blurTimer)
    }
  }, [onQueryChange])

  // autoFocus doesn't re-fire when the input remounts after collapse;
  // focus it explicitly so keyboard focus is never lost during expand/collapse.
  useEffect(() => {
    if (!isRevealed) return
    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
    }, isExpanded ? 0 : 260)
    return () => window.clearTimeout(timer)
  }, [isRevealed, isExpanded])

  return (
    <motion.div
      layout
      className="flex w-full max-w-150 flex-col"
      transition={transition}
    >
      <AnimatePresence initial={false} mode="wait">
        {!isExpanded ? (
          <motion.div
            key="controls"
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: isRevealed ? 1 : 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={transition}
            className="flex w-full items-center gap-2"
          >
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-4 z-10 size-4.5 -translate-y-1/2 text-[#6b7073]" />

              <Input
                ref={inputRef}
                placeholder={hoveredLabel ?? activeMode?.label ?? "Spotlight Search"}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                name="spotlight-search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                className="h-12 w-full rounded-full border border-white/45 bg-white/40 pr-4 pl-11 text-[18px]! font-semibold text-black caret-black shadow-[0_10px_32px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-2xl placeholder:font-normal placeholder:text-neutral-600/95 focus-visible:border-white/55 focus-visible:ring-0 dark:border-white/15 dark:bg-black/50 dark:text-white dark:caret-white dark:placeholder:text-white/40 dark:focus-visible:border-white/25"
              />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {modes.map((mode, index) => (
                <motion.div
                  key={mode.label}
                  initial={false}
                  animate={{
                    opacity: isRevealed ? 1 : 0,
                    scale: isRevealed ? 1 : 0.92,
                  }}
                  transition={{
                    ...transition,
                    delay: isRevealed ? index * 0.018 : 0,
                  }}
                  className="shrink-0"
                >
                  <Button
                    type="button"
                    variant="spotlight"
                    size="icon"
                    aria-label={mode.label}
                    onClick={() => {
                      if (activeMode?.label === mode.label) {
                        setActiveMode(null)
                        setHoveredLabel(null)
                      } else {
                        setActiveMode(mode)
                      }
                    }}
                    onMouseEnter={() => {
                      setHoveredLabel(mode.label)
                      setActiveMode(mode)
                    }}
                    onMouseLeave={() => {
                      setHoveredLabel(null)
                    }}
                    className="size-12 shrink-0 rounded-full border border-white/60 bg-white/75 text-neutral-700 shadow-[0_10px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.85)] transition-none hover:bg-white/75 hover:text-neutral-700 focus-visible:ring-0 dark:border-white/15 dark:bg-black/50 dark:text-white/80 dark:hover:bg-black/60 dark:hover:text-white"
                  >
                    {mode.icon}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 10,
            }}
            transition={transition}
            className="w-full"
          >
            <ExpandedSpotlight
              query={query}
              mode={activeMode}
              onQueryChangeAction={onQueryChange}
              apps={apps}
              onOpenApp={(id) => {
                onOpenApp?.(id)
                onQueryChange("")
                setActiveMode(null)
              }}
              onLock={() => {
                onLock?.()
                onQueryChange("")
                setActiveMode(null)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
