"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import { useTheme } from "next-themes"
import { transitionTheme } from "@/lib/theme-transition"
import { SfSymbol } from "./sf-symbols"

function readToggle(key: string, fallback: boolean) {
  if (typeof window === "undefined") return fallback
  try {
    const value = window.localStorage.getItem(`tahoe-cc-${key}`)
    return value === null ? fallback : value === "1"
  } catch {
    return fallback
  }
}

function useStoredToggle(key: string, fallback = true) {
  const [on, setOn] = useState(() => readToggle(key, fallback))

  const toggle = () =>
    setOn((value) => {
      const next = !value
      try {
        window.localStorage.setItem(`tahoe-cc-${key}`, next ? "1" : "0")
      } catch {}
      return next
    })

  return [on, toggle] as const
}

function WideTile({
  label,
  status,
  active,
  onClick,
  children,
}: {
  label: string
  status: string
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="col-span-2 flex items-center gap-2.5 rounded-[24px] border border-white/10 bg-white/15 px-2.5 text-left transition-colors duration-150 hover:bg-white/20 active:scale-[0.98]"
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
          active ? "bg-[#0a84ff] text-white" : "bg-white/20 text-white/70"
        }`}
      >
        {children}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[12px] leading-tight font-semibold">{label}</span>
        <span className="truncate text-[10px] leading-tight text-white/65">
          {status}
        </span>
      </span>
    </button>
  )
}

function IconTile({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex items-center justify-center rounded-[24px] border border-white/10 transition-all duration-150 active:scale-95 ${
        active
          ? "bg-white/25 hover:bg-white/30"
          : "bg-white/15 hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  )
}

function CircleTile({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="flex items-center justify-center rounded-[24px] border border-white/10 bg-white/15 transition-all duration-150 hover:bg-white/20 active:scale-95"
    >
      <span
        className={`flex size-10 items-center justify-center rounded-full transition-colors ${
          active ? "bg-[#0a84ff] text-white" : "bg-white/20 text-white"
        }`}
      >
        {children}
      </span>
    </button>
  )
}

function SliderCard({
  label,
  value,
  onValueChange,
  iconLeft,
  iconRight,
  trailing,
}: {
  label: string
  value: number
  onValueChange: (value: number) => void
  iconLeft: ReactNode
  iconRight: ReactNode
  trailing?: ReactNode
}) {
  return (
    <div className="col-span-4 flex flex-col justify-center rounded-[22px] border border-white/10 bg-white/15 px-3">
      <p className="text-[11px] font-semibold">{label}</p>
      <div className="mt-1.5 flex items-center gap-2">
        {iconLeft}
        <input
          type="range"
          min={10}
          max={100}
          value={value}
          aria-label={label}
          onChange={(event) => onValueChange(Number(event.target.value))}
          className="cc-slider min-w-0 flex-1"
          style={{ "--cc-value": `${value}%` } as CSSProperties}
        />
        {iconRight}
        {trailing}
      </div>
    </div>
  )
}

function ControlCenter({
  brightness,
  onBrightnessChange,
  onClose,
}: {
  brightness: number
  onBrightnessChange: (value: number) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme, setTheme } = useTheme()
  const [wifi, toggleWifi] = useStoredToggle("wifi")
  const [bluetooth, toggleBluetooth] = useStoredToggle("bluetooth")
  const [airdrop, toggleAirdrop] = useStoredToggle("airdrop")
  const [focus, toggleFocus] = useStoredToggle("focus", false)
  const [mirroring, toggleMirroring] = useStoredToggle("mirroring", false)
  const [stageManager, toggleStageManager] = useStoredToggle(
    "stage-manager",
    false
  )
  const [volume, setVolume] = useState(() => {
    try {
      return Number(window.localStorage.getItem("tahoe-cc-volume") ?? 20)
    } catch {
      return 20
    }
  })
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    const syncVolume = (event: Event) => {
      const value = (event as CustomEvent<number>).detail
      if (Number.isFinite(value)) setVolume(value)
    }
    window.addEventListener("tahoe-volume-change", syncVolume)
    return () => window.removeEventListener("tahoe-volume-change", syncVolume)
  }, [])

  const changeVolume = (value: number) => {
    setVolume(value)
    try {
      window.localStorage.setItem("tahoe-cc-volume", String(value))
      window.dispatchEvent(new CustomEvent("tahoe-volume-change", { detail: value }))
    } catch {}
  }

  useEffect(() => {
    const handleOutside = (event: Event) => {
      const target = event.target as HTMLElement
      if (target.closest?.('[aria-label="Control Center"]')) return
      if (ref.current && !ref.current.contains(target)) onClose()
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", handleOutside)
    document.addEventListener("touchstart", handleOutside)
    window.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleOutside)
      document.removeEventListener("touchstart", handleOutside)
      window.removeEventListener("keydown", handleKey)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Control Center panel"
      className="max-h-[calc(100vh-64px)] w-[332px] max-w-[calc(100vw-16px)] overflow-y-auto rounded-[30px] p-2.5 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.22)]"
      style={{
        background:
          "linear-gradient(155deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.09) 58%, rgba(255,255,255,0.16) 100%)",
        backdropFilter: "blur(42px) saturate(180%)",
        WebkitBackdropFilter: "blur(42px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.32)",
        boxShadow:
          "0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <div className="grid auto-rows-[60px] grid-cols-4 gap-2">
        <WideTile
          label="Wi-Fi"
          status={wifi ? "wifi" : "Off"}
          active={wifi}
          onClick={toggleWifi}
        >
          <SfSymbol name="wifi" className="h-[15px] w-auto" />
        </WideTile>

        <div className="col-span-2 row-span-2 flex flex-col rounded-[24px] border border-white/10 bg-white/15 p-2.5">
          <div className="size-[44px] shrink-0 rounded-[12px] border border-white/10 bg-white/20" />
          <p className="mt-1.5 text-[11px] leading-tight font-semibold text-white/80">
            Not Playing
          </p>
          <div className="mt-auto flex items-center justify-around">
            <button
              type="button"
              aria-label="Previous track"
              className="rounded-full p-1 text-white/45 transition-colors hover:text-white/70"
            >
              <SfSymbol name="rewind" className="h-[14px] w-auto" />
            </button>
            <button
              type="button"
              aria-label="Play"
              className="rounded-full p-1 transition-transform active:scale-90"
            >
              <SfSymbol name="play" className="h-[16px] w-auto" />
            </button>
            <button
              type="button"
              aria-label="Next track"
              className="rounded-full p-1 text-white/45 transition-colors hover:text-white/70"
            >
              <SfSymbol name="forward" className="h-[14px] w-auto" />
            </button>
          </div>
        </div>

        <WideTile
          label="Bluetooth"
          status={bluetooth ? "On" : "Off"}
          active={bluetooth}
          onClick={toggleBluetooth}
        >
          <SfSymbol name="bluetooth" className="size-[18px]" />
        </WideTile>

        <WideTile
          label="AirDrop"
          status={airdrop ? "Everyone" : "Off"}
          active={airdrop}
          onClick={toggleAirdrop}
        >
          <SfSymbol name="airdrop" className="size-[20px]" />
        </WideTile>
        <IconTile
          label={`Stage Manager ${stageManager ? "on" : "off"}`}
          active={stageManager}
          onClick={toggleStageManager}
        >
          <SfSymbol name="stageManager" className="size-[22px]" />
        </IconTile>
        <IconTile
          label={`Screen mirroring ${mirroring ? "on" : "off"}`}
          active={mirroring}
          onClick={toggleMirroring}
        >
          <SfSymbol name="mirror" className="h-[17px] w-auto" />
        </IconTile>

        <CircleTile
          label={`Dark mode ${isDark ? "on" : "off"}`}
          active={isDark}
          onClick={() =>
            transitionTheme(() => setTheme(isDark ? "light" : "dark"))
          }
        >
          <SfSymbol name="contrast" className="size-[18px]" />
        </CircleTile>
        <CircleTile label="Capture" active={false} onClick={() => {}}>
          <SfSymbol name="capture" className="size-[18px]" />
        </CircleTile>
        <button
          type="button"
          aria-label={`Focus ${focus ? "on" : "off"}`}
          aria-pressed={focus}
          onClick={toggleFocus}
          className="col-span-2 flex items-center gap-2.5 rounded-[24px] border border-white/10 bg-white/15 px-2.5 text-left transition-colors duration-150 hover:bg-white/20 active:scale-[0.98]"
        >
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
              focus ? "bg-[#5e5ce6] text-white" : "bg-white/20 text-white"
            }`}
          >
            <SfSymbol name="moon" className="size-[17px]" />
          </span>
          <span className="text-[12px] font-semibold">Focus</span>
        </button>

        <SliderCard
          label="Display"
          value={brightness}
          onValueChange={onBrightnessChange}
          iconLeft={<SfSymbol name="sunMin" className="size-3.5 shrink-0" />}
          iconRight={<SfSymbol name="sunMax" className="size-4 shrink-0" />}
        />

        <SliderCard
          label="Sound"
          value={volume}
          onValueChange={changeVolume}
          iconLeft={
            <SfSymbol name="speaker" className="h-3.5 w-auto shrink-0" />
          }
          iconRight={
            <SfSymbol name="speakerWave" className="h-3.5 w-auto shrink-0" />
          }
          trailing={
            <button
              type="button"
              aria-label="AirPlay audio"
              className="ml-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
            >
              <SfSymbol name="airplayAudio" className="size-3.5" />
            </button>
          }
        />
      </div>

      <button
        type="button"
        className="mx-auto mt-2 flex rounded-full border border-white/10 bg-white/15 px-3.5 py-1 text-[11px] font-medium text-white/90 transition-colors hover:bg-white/25"
      >
        Edit Controls
      </button>
    </div>
  )
}

export default ControlCenter
