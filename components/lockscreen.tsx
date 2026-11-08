"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Avatar from "@/components/avatar"
import type { Account } from "@/lib/account"

const SF_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, "Segoe UI", sans-serif'

function useNow() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(id)
  }, [])
  return now
}

function formatDate(now: Date | null) {
  if (!now) return " "
  return now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

function formatTime(now: Date | null) {
  if (!now) return " "
  return now
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false })
    .replace(/^0/, "")
}

export default function Lockscreen({
  user,
  verify,
  onUnlock,
  noPassword,
}: {
  user: Account
  verify: (password: string) => Promise<boolean>
  onUnlock: () => void
  noPassword?: boolean
}) {
  const now = useNow()
  const [mode, setMode] = useState<"idle" | "password">("idle")
  const [value, setValue] = useState("")
  const [shakeKey, setShakeKey] = useState(0)
  const [failures, setFailures] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const enterPasswordMode = () => {
    setMode("password")
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const cancel = () => {
    setMode("idle")
    setValue("")
  }

  const submit = async () => {
    if (!value) {
      setShakeKey((k) => k + 1)
      return
    }
    if (await verify(value)) {
      onUnlock()
      return
    }
    setFailures((f) => f + 1)
    setShakeKey((k) => k + 1)
    setValue("")
  }

  return (
    <motion.div
      key="lock"
      className="absolute inset-0 z-20 flex flex-col outline-none"
      style={{ fontFamily: SF_FONT }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
      transition={{ duration: 0.45 }}
      onClick={() => {
        if (noPassword) {
          onUnlock()
          return
        }
        if (mode === "idle") enterPasswordMode()
      }}
      onKeyDown={(e) => {
        if (noPassword) {
          if (e.key === "Enter" || e.key === " ") onUnlock()
          return
        }
        if (e.key === "Escape") cancel()
        else if (mode === "idle" && e.key.length === 1) enterPasswordMode()
      }}
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" />

      <div className="absolute top-3 right-5 flex items-center text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">
        <span className="mr-2 text-[11px] leading-none font-medium tracking-[0.01em]">U.S.</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sf/keyboard.svg"
          alt=""
          draggable={false}
          className="h-[13px] w-[19px] object-contain brightness-0 invert"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sf/battery.svg"
          alt=""
          draggable={false}
          className="ml-4 h-[13px] w-[29px] object-contain brightness-0 invert"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sf/wifi.svg"
          alt=""
          draggable={false}
          className="ml-4 h-[14px] w-[17px] object-contain brightness-0 invert"
        />
      </div>

      <div className="relative flex flex-col items-center pt-[9vh] text-center select-none">
        <p className="lockscreen-frost text-[22px] font-semibold tracking-tight" suppressHydrationWarning>
          {formatDate(now)}
        </p>
        <p
          className="lockscreen-frost -mt-1 text-[124px] leading-none font-semibold tracking-[-0.035em] tabular-nums"
          suppressHydrationWarning
        >
          {formatTime(now)}
        </p>
      </div>

      <div className="flex-1" />

      <div className="relative flex flex-col items-center pb-[9vh]" onClick={(e) => e.stopPropagation()}>
        <button
          aria-label={user.fullName}
          onClick={noPassword ? onUnlock : mode === "idle" ? enterPasswordMode : undefined}
        >
          <Avatar
            emoji={user.avatar}
            className="size-[72px] text-[38px] shadow-[0_6px_24px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.35)]"
          />
        </button>
        <p className="lockscreen-frost mt-3 text-[17px] font-semibold tracking-tight">{user.fullName}</p>

        <div className="mt-3 flex h-10 w-60 items-center justify-center">
          {noPassword ? (
            <span className="lockscreen-frost-dim animate-pulse text-[13px] font-normal">
              Press any key or click to enter
            </span>
          ) : (
          <AnimatePresence mode="wait" initial={false}>
            {mode === "idle" ? (
              <motion.button
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={enterPasswordMode}
                className="lockscreen-frost-dim text-[13px] font-normal transition-opacity hover:opacity-100"
              >
                Touch ID or Enter Password
              </motion.button>
            ) : (
              <motion.div
                key="field"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  key={shakeKey}
                  animate={shakeKey ? { x: [0, -10, 10, -6, 6, 0] } : undefined}
                  transition={{ duration: 0.4 }}
                  className="relative flex h-10 w-60 items-center rounded-full bg-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.25),inset_0_0_0_1px_rgba(255,255,255,0.28),inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-2xl backdrop-saturate-150"
                >
                  <div className={`relative flex h-full min-w-0 flex-1 items-center overflow-hidden pr-10 pl-4 ${value.length > 11 ? "justify-end" : "justify-start"}`}>
                    <input
                      ref={inputRef}
                      type="password"
                      value={value}
                      autoFocus
                      autoComplete="off"
                      onChange={(e) => setValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submit()
                        e.stopPropagation()
                      }}
                      aria-label="Password"
                      className="absolute inset-0 size-full opacity-0"
                    />
                    <span className="pointer-events-none flex items-center gap-[6px]">
                      {Array.from({ length: value.length }, (_, i) => (
                        <span key={i} className="size-[9px] shrink-0 rounded-full bg-white" />
                      ))}
                      <motion.span
                        animate={{ opacity: [1, 1, 0, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                        className="h-4 w-[1.5px] shrink-0 bg-white"
                      />
                      {!value && <span className="ml-0.5 text-[14px] text-white/60">Enter Password</span>}
                    </span>
                  </div>
                  {value && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={submit}
                      aria-label="Log in"
                      className="absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white transition-colors hover:bg-white/45"
                    >
                      <ArrowRight className="size-4" strokeWidth={2.4} />
                    </motion.button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>
        {failures >= 3 && user.hint && (
          <p className="lockscreen-frost-dim mt-1 text-[12px]">Hint: {user.hint}</p>
        )}
      </div>
    </motion.div>
  )
}
