"use client"

import { memo, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Power } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"

export type PowerKind = "shutdown" | "restart" | "logout"

const COPY: Record<PowerKind, { title: string; body: (s: number) => string; confirm: string }> = {
  shutdown: {
    title: "Are you sure you want to shut down your computer now?",
    body: (s) => `If you do nothing, the computer will shut down automatically in ${s} seconds.`,
    confirm: "Shut Down",
  },
  restart: {
    title: "Are you sure you want to restart your computer now?",
    body: (s) => `If you do nothing, the computer will restart automatically in ${s} seconds.`,
    confirm: "Restart",
  },
  logout: {
    title: "Are you sure you want to quit all applications and log out now?",
    body: (s) => `If you do nothing, you will be logged out automatically in ${s} seconds.`,
    confirm: "Log Out",
  },
}

function PowerDialog({
  kind,
  onCancel,
  onConfirm,
}: {
  kind: PowerKind
  onCancel: () => void
  onConfirm: (reopen: boolean) => void
}) {
  const [seconds, setSeconds] = useState(60)
  const [reopen, setReopen] = useState(true)

  useEffect(() => {
    setSeconds(60)
    setReopen(true)
  }, [kind])

  useEffect(() => {
    if (seconds <= 0) {
      onConfirm(reopen)
      return
    }
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
  }, [seconds, reopen, onConfirm])

  const copy = COPY[kind]

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent
        showCloseButton={false}
        className="top-[10vh] translate-y-0 rounded-2xl sm:max-w-md data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 data-open:zoom-in-100 data-closed:zoom-out-100"
      >
        <motion.div
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
        >
        <div className="flex items-start gap-4 text-left">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-black/15 dark:bg-white/15">
            <Power className="size-7 text-black/60 dark:text-white/70" strokeWidth={2} />
          </span>
          <span>
            <DialogTitle className="text-[14px] font-semibold">{copy.title}</DialogTitle>
            <p className="mt-1.5 text-[13px] leading-snug opacity-80">{copy.body(seconds)}</p>
            <label className="mt-3 flex cursor-default items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={reopen}
                onChange={() => setReopen((v) => !v)}
                className="size-4 shrink-0 accent-[#0a84ff]"
              />
              Reopen windows when logging back in
            </label>
          </span>
        </div>
        <DialogFooter className="mt-2 sm:justify-end">
          <button
            onClick={onCancel}
            className="h-8 min-w-24 flex-1 rounded-md border border-black/15 bg-white px-4 text-[13px] text-black/80 transition-colors hover:bg-black/5 sm:flex-none dark:border-white/20 dark:bg-white/10 dark:text-white/85 dark:hover:bg-white/15"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reopen)}
            autoFocus
            className="h-8 min-w-24 flex-1 rounded-md bg-[#0a84ff] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#0077ed] sm:flex-none"
          >
            {copy.confirm}
          </button>
        </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default memo(PowerDialog)
