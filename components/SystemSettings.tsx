"use client"

import { memo, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { useTheme } from "next-themes"
import { transitionTheme } from "@/lib/theme-transition"
import { downscaleImage, type WallpaperChoice } from "@/components/wallpaper"
import Avatar from "@/components/avatar"
import { SfSymbol } from "@/components/sf-symbols"
import { loadAccount, verifyPassword, type Account } from "@/lib/account"
import {
  AudioLines,
  Battery,
  BedDouble,
  BellOff,
  Bluetooth,
  Briefcase,
  Calendar,
  CarFront,
  Captions,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CircleAlert,
  Clock,
  Clock3,
  Command,
  Contrast,
  Download,
  Eye,
  FileText,
  HardDrive,
  Headphones,
  Image,
  Info,
  Keyboard,
  KeyRound,
  Languages,
  LayoutGrid,
  Mail,
  Mic,
  Minus,
  Monitor,
  Moon,
  Mouse,
  Move,
  Music,
  Network,
  Play,
  Plus,
  RefreshCw,
  Router,
  Search,
  Server,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Speaker,
  Sun,
  Trash2,
  Tv,
  User,
  Users,
  Volume2,
  VolumeX,
  Wifi,
  Workflow,
  ZoomIn,
} from "lucide-react"
import { COUNTRIES, detectCountry } from "@/lib/countries"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { SYSTEM_INFO } from "@/lib/system"
import {
  VPN_CONNECTED_CONFIG_STORAGE_KEY,
  VPN_ENABLED_STORAGE_KEY,
  VPN_MENU_BAR_STORAGE_KEY,
  VPN_STATUS_EVENT,
} from "@/lib/vpn-status"

type SidebarItem = {
  id: string
  label: string
  icon: ReactNode
  bg: string
}

const SfIcon = ({ name }: { name: string }) => (
  <span className="flex h-4 w-5 items-center justify-center">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={`/sf/${name}.svg`}
      alt=""
      draggable={false}
      className="max-h-4 max-w-5 object-contain brightness-0 invert"
    />
  </span>
)

const BLUE = "bg-gradient-to-b from-sky-400 to-blue-600"
const GRAY = "bg-gradient-to-b from-neutral-400 to-neutral-500"

const item = (
  id: string,
  label: string,
  bg: string,
  icon?: ReactNode
): SidebarItem => ({
  id,
  label,
  bg,
  icon: icon ?? <SfIcon name={id} />,
})

const SIDEBAR_GROUPS: SidebarItem[][] = [
  [
    item("wifi", "Wi-Fi", BLUE),
    item(
      "bluetooth",
      "Bluetooth",
      BLUE,
      <Bluetooth className="size-4 text-white" />
    ),
    item("network", "Network", BLUE),
    item("vpn", "VPN", BLUE),
    item("battery", "Battery", "bg-gradient-to-b from-green-400 to-green-600"),
  ],
  [
    item("general", "General", GRAY),
    item("accessibility", "Accessibility", BLUE),
    item(
      "controlcenter",
      "Control Center",
      GRAY,
      <SlidersHorizontal className="size-4 text-white" />
    ),
    item(
      "privacy",
      "Privacy & Security",
      "bg-gradient-to-b from-blue-400 to-blue-600",
      <Shield className="size-4 text-white" />
    ),
    item(
      "users",
      "Users & Groups",
      BLUE,
      <Users className="size-4 text-white" />
    ),
    item(
      "passwords",
      "Passwords",
      "bg-gradient-to-b from-orange-400 to-red-500",
      <KeyRound className="size-4 text-white" />
    ),
    item(
      "accounts",
      "Internet Accounts",
      BLUE,
      <Network className="size-4 text-white" />
    ),
    item(
      "appearance",
      "Appearance",
      "bg-gradient-to-b from-neutral-700 to-black"
    ),
    item("menubar", "Menu Bar", GRAY),
    item(
      "siri",
      "Apple Intelligence & Siri",
      "bg-gradient-to-b from-pink-400 via-purple-400 to-blue-500"
    ),
    item(
      "desktop",
      "Desktop & Dock",
      "bg-gradient-to-b from-neutral-800 to-black"
    ),
    item("displays", "Displays", BLUE),
    item("spotlight", "Spotlight", BLUE),
    item(
      "wallpaper",
      "Wallpaper",
      "bg-gradient-to-b from-teal-300 via-sky-400 to-blue-500"
    ),
  ],
  [
    item(
      "notifications",
      "Notifications",
      "bg-gradient-to-b from-red-400 to-red-600"
    ),
    item("sound", "Sound", "bg-gradient-to-b from-pink-400 to-rose-500"),
    item("focus", "Focus", "bg-gradient-to-b from-purple-400 to-indigo-600"),
    item(
      "screentime",
      "Screen Time",
      "bg-gradient-to-b from-purple-400 to-indigo-600"
    ),
  ],
]

const ALL_ITEMS = SIDEBAR_GROUPS.flat()

const ACCENTS: { id: string; label: string; background: string }[] = [
  {
    id: "multicolor",
    label: "Multicolour",
    background:
      "conic-gradient(from 0deg, #ff453a, #ff9f0a, #ffd60a, #30d158, #0a84ff, #bf5af2, #ff453a)",
  },
  { id: "blue", label: "Blue", background: "#0a84ff" },
  { id: "purple", label: "Purple", background: "#a550a7" },
  { id: "pink", label: "Pink", background: "#f74f9e" },
  { id: "red", label: "Red", background: "#e0383e" },
  { id: "orange", label: "Orange", background: "#f7821b" },
  { id: "yellow", label: "Yellow", background: "#fcb827" },
  { id: "green", label: "Green", background: "#62ba46" },
  { id: "graphite", label: "Graphite", background: "#8e8e93" },
]

const ICON_STYLES: { id: string; label: string; className: string }[] = [
  { id: "default", label: "Default", className: "" },
  { id: "dark", label: "Dark", className: "brightness-[0.45] saturate-50" },
  { id: "clear", label: "Clear", className: "opacity-60 saturate-0" },
  {
    id: "tinted",
    label: "Tinted",
    className: "sepia hue-rotate-[190deg] saturate-[3]",
  },
]

const WALLPAPERS: { id: WallpaperChoice; label: string; preview: string }[] = [
  { id: "light", label: "Light", preview: "/light.jpg" },
  { id: "dark", label: "Dark", preview: "/dark.jpg" },
  { id: "aerial", label: "Lake Tahoe", preview: "/aerial/lake.jpg" },
  { id: "wallpaper1", label: "Blue Valley", preview: "/wallpaper1.jpg" },
  { id: "bmw1", label: "BMW", preview: "/bmw1.jpg" },
  { id: "bmw", label: "BMW Night", preview: "/bmw.jpg" },
]

const SCROLL_BAR_OPTIONS = [
  { id: "auto", label: "Automatically based on mouse or trackpad" },
  { id: "scroll", label: "When scrolling" },
  { id: "always", label: "Always" },
]

const SCROLL_CLICK_OPTIONS = [
  { id: "page", label: "Jump to the next page" },
  { id: "spot", label: "Jump to the spot that's clicked" },
]

const ACCENT_STORAGE_KEY = "tahoe-accent"
const SELECTED_RING =
  "ring-2 ring-[#0a84ff] ring-offset-1 ring-offset-transparent"

const WIFI_STORAGE_KEY = "tahoe-cc-wifi"
const DEFAULT_NETWORK = "tahoe"
const NEARBY_NETWORKS = [
  "0810-D",
  "2WIRE865",
  "a86e9ac9c93d6a9d85b69f653f43c7f3",
  "ARLO_VMB_1741386415",
  "ATT89LUX4L",
  "ATTlNEV4s2",
  "ATTYCSPgNa",
]

const Heading = ({ children }: { children: ReactNode }) => (
  <p className="mt-5 mb-1.5 px-1 text-[13px] font-bold text-black/85 dark:text-white/90">
    {children}
  </p>
)

const Card = ({ children }: { children: ReactNode }) => (
  <div className="mb-2.5 divide-y divide-black/[0.07] rounded-xl bg-white/70 px-3.5 shadow-[0_0_0_0.5px_rgba(0,0,0,0.05)] dark:divide-white/[0.08] dark:bg-white/[0.07]">
    {children}
  </div>
)

const Row = ({
  label,
  children,
  align = "center",
}: {
  label: string
  children: ReactNode
  align?: "center" | "start"
}) => (
  <div
    className={`flex justify-between gap-4 py-2.5 ${align === "start" ? "items-start" : "items-center"}`}
  >
    <span className="text-[13px] text-black/85 dark:text-white/90">
      {label}
    </span>
    <div className="flex items-center gap-2">{children}</div>
  </div>
)

const Popup = ({
  children,
  leading,
}: {
  children: ReactNode
  leading?: ReactNode
}) => (
  <span className="flex items-center gap-1.5 text-[13px] text-black/80 dark:text-white/85">
    {leading}
    {children}
    <ChevronsUpDown className="size-3.5 rounded-full bg-black/[0.06] p-[3px] text-black/55 dark:bg-white/10 dark:text-white/60" />
  </span>
)

const Switch = ({
  on,
  onToggle,
  label,
}: {
  on: boolean
  onToggle: () => void
  label?: string
}) => (
  <button
    onClick={onToggle}
    role="switch"
    aria-checked={on}
    aria-label={label}
    className={`relative h-[22px] w-[38px] rounded-full transition-colors ${on ? "bg-[#0a84ff]" : "bg-black/20 dark:bg-white/20"}`}
  >
    <span
      className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-[2px]"}`}
    />
  </button>
)

const Radio = ({
  on,
  label,
  onSelect,
}: {
  on: boolean
  label: string
  onSelect: () => void
}) => (
  <button
    onClick={onSelect}
    className="flex items-center gap-2 py-[3px] text-left"
  >
    <span
      className={`flex size-4 shrink-0 items-center justify-center rounded-full ${on ? "bg-[#0a84ff]" : "bg-black/10 dark:bg-white/15"}`}
    >
      {on && <span className="size-1.5 rounded-full bg-white" />}
    </span>
    <span className="text-[13px] text-black/85 dark:text-white/90">
      {label}
    </span>
  </button>
)

const RadioGroup = ({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: { id: string; label: string }[]
  value: string
  onChange: (id: string) => void
}) => (
  <div className="py-2.5">
    <p className="mb-1 text-[13px] text-black/85 dark:text-white/90">{title}</p>
    {options.map((o) => (
      <Radio
        key={o.id}
        on={value === o.id}
        label={o.label}
        onSelect={() => onChange(o.id)}
      />
    ))}
  </div>
)

const MiniWindow = () => (
  <span className="absolute right-1.5 bottom-1 left-1.5 flex h-[22px] flex-col justify-end rounded-[4px] bg-white/85 p-[3px] shadow-sm dark:bg-black/60">
    <span className="flex gap-[2px]">
      <span className="size-[3px] rounded-full bg-red-400" />
      <span className="size-[3px] rounded-full bg-yellow-400" />
      <span className="size-[3px] rounded-full bg-green-400" />
    </span>
  </span>
)

const ThemeOption = ({
  label,
  selected,
  onSelect,
  children,
}: {
  label: string
  selected: boolean
  onSelect: () => void
  children: ReactNode
}) => (
  <button onClick={onSelect} className="flex flex-col items-center gap-1.5">
    <span
      className={`relative block h-[46px] w-[72px] overflow-hidden rounded-lg ${
        selected
          ? "ring-2 ring-[#0a84ff] ring-offset-2 ring-offset-white/70 dark:ring-offset-transparent"
          : "ring-1 ring-black/10 dark:ring-white/15"
      }`}
    >
      {children}
    </span>
    <span
      className={`text-[11px] ${selected ? "font-semibold text-black/85 dark:text-white/90" : "text-black/50 dark:text-white/50"}`}
    >
      {label}
    </span>
  </button>
)

const Wallpaper = ({ src }: { src: string }) => (
  <span
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url('${src}')` }}
  />
)

const SettingsCard = ({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) => (
  <div
    className={`mb-2.5 rounded-xl bg-black/[0.035] shadow-[0_0_0_0.5px_rgba(0,0,0,0.04)] dark:bg-white/[0.06] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.05)] ${className}`}
  >
    {children}
  </div>
)

const SettingsHeading = ({
  children,
  action,
}: {
  children: ReactNode
  action?: ReactNode
}) => (
  <div className="mt-4 mb-1.5 flex items-center justify-between px-1">
    <p className="text-[12px] font-semibold text-black/80 dark:text-white/85">
      {children}
    </p>
    {action}
  </div>
)

const LockGlyph = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 12 16" aria-hidden="true" className={className}>
    <path
      d="M3.5 6V4.5a2.5 2.5 0 0 1 5 0V6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <rect
      x=".8"
      y="5.7"
      width="10.4"
      height="9.5"
      rx="1.7"
      fill="currentColor"
    />
  </svg>
)

const EllipsisGlyph = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.1" />
    <circle cx="5" cy="8" r=".85" fill="currentColor" />
    <circle cx="8" cy="8" r=".85" fill="currentColor" />
    <circle cx="11" cy="8" r=".85" fill="currentColor" />
  </svg>
)

const Spinner8 = ({
  className = "",
  spinning = true,
}: {
  className?: string
  spinning?: boolean
}) => (
  <svg
    viewBox="0 0 16 16"
    aria-hidden="true"
    className={`${spinning ? "animate-spin [animation-duration:0.85s]" : ""} ${className}`}
  >
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
      <line
        key={deg}
        x1="8"
        y1="1.5"
        x2="8"
        y2="3.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        transform={`rotate(${deg} 8 8)`}
        opacity={0.18 + i * 0.1}
      />
    ))}
  </svg>
)

type ActionMenuAction = {
  label: string
  destructive?: boolean
  onSelect: () => void
}

function ActionMenu({
  actions,
  onClose,
}: {
  actions: ActionMenuAction[]
  onClose: () => void
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-20"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute top-full right-0 z-30 mt-1 w-44 rounded-[10px] bg-[#f7f7f7]/95 p-1 shadow-[0_12px_32px_rgba(0,0,0,0.28)] ring-1 ring-black/10 backdrop-blur-xl dark:bg-[#2c2c2e]/95 dark:ring-white/15">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => {
              onClose()
              action.onSelect()
            }}
            className={`block w-full rounded-[6px] px-2 py-[5px] text-left text-[12px] transition-colors hover:bg-[#0a84ff] hover:text-white ${
              action.destructive
                ? "text-[#e0383e]"
                : "text-black/85 dark:text-white/90"
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </>
  )
}

function useStoredBool(key: string, fallback = true) {
  const [on, setOn] = useState(fallback)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key)
      if (saved !== null) setOn(saved === "1")
    } catch {}
  }, [key])

  const update = (next: boolean) => {
    setOn(next)
    try {
      window.localStorage.setItem(key, next ? "1" : "0")
    } catch {}
  }

  return [on, update] as const
}

const IconTile = ({
  children,
  bg,
  size = "size-[26px]",
}: {
  children: ReactNode
  bg: string
  size?: string
}) => (
  <span
    className={`${size} flex shrink-0 items-center justify-center rounded-[7px] text-white shadow-sm ring-1 ring-black/5 ${bg}`}
  >
    {children}
  </span>
)

function PaneRow({
  label,
  description,
  icon,
  trailing,
  onClick,
  className = "",
}: {
  label: string
  description?: ReactNode
  icon?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
  className?: string
}) {
  const inner = (
    <>
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] leading-4 text-black/85 dark:text-white/90">
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-[11px] leading-[14px] text-black/50 dark:text-white/50">
            {description}
          </span>
        )}
      </span>
      {trailing && (
        <span className="flex shrink-0 items-center gap-2">{trailing}</span>
      )}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center gap-3 px-3.5 py-2 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04] ${className}`}
      >
        {inner}
      </button>
    )
  }

  return (
    <div className={`flex items-center gap-3 px-3.5 py-2 ${className}`}>
      {inner}
    </div>
  )
}

const rowChevron = (
  <ChevronRight className="size-3.5 shrink-0 text-black/30 dark:text-white/30" />
)

function SettingsDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className = "",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  className?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`text-left ${className}`}>
        <div className="space-y-1 text-center">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </div>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

const dialogButton =
  "rounded-lg bg-black/[0.06] px-3 py-1.5 text-[12px] font-medium text-[#0a84ff] transition-colors hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"

function Select({
  value,
  options,
  onChange,
  ariaLabel,
  align = "right",
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  ariaLabel: string
  align?: "left" | "right"
}) {
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const anchorRef = useRef<HTMLSpanElement>(null)
  const current =
    options.find((option) => option.value === value)?.label ?? value

  const toggle = () => {
    if (!open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      const menuHeight = Math.min(options.length * 27 + 10, 240)
      setDropUp(rect.bottom + menuHeight > window.innerHeight - 8)
    }
    setOpen((value) => !value)
  }

  return (
    <span ref={anchorRef} className="relative inline-flex">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className="flex h-6 items-center gap-1.5 rounded-[6px] bg-black/[0.06] px-2 text-[12px] text-black/80 transition-colors hover:bg-black/[0.09] dark:bg-white/10 dark:text-white/85 dark:hover:bg-white/15"
      >
        {current}
        <ChevronsUpDown className="size-3 text-black/45 dark:text-white/45" />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            className={`absolute z-50 min-w-40 rounded-[9px] bg-[#f7f7f7]/95 p-1 shadow-[0_12px_32px_rgba(0,0,0,0.28)] ring-1 ring-black/10 backdrop-blur-xl dark:bg-[#2c2c2e]/95 dark:ring-white/15 ${
              dropUp ? "bottom-full mb-1" : "top-full mt-1"
            } ${align === "left" ? "left-0" : "right-0"}`}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between gap-4 rounded-[5px] px-2 py-[5px] text-left text-[12px] text-black/85 transition-colors hover:bg-[#0a84ff] hover:text-white dark:text-white/90 ${
                  option.value === value ? "font-semibold" : ""
                }`}
              >
                {option.label}
                {option.value === value && (
                  <Check className="size-3 shrink-0" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </span>
  )
}

function SettingsSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  ariaLabel,
  className = "",
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  ariaLabel: string
  className?: string
}) {
  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100

  return (
    <span className={`relative flex h-4 items-center ${className}`}>
      <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-black/15 dark:bg-white/20" />
      <span
        className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-[#0a84ff]"
        style={{ width: `${percent}%` }}
      />
      <span
        className="absolute top-1/2 size-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
        style={{ left: `${percent}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={ariaLabel}
        onChange={(event) => onChange(Number(event.target.value))}
        className="relative z-10 h-4 w-full cursor-pointer opacity-0"
      />
    </span>
  )
}

const Checkbox = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`flex size-[15px] shrink-0 items-center justify-center rounded-[4px] transition-colors ${
      checked
        ? "bg-[#0a84ff] text-white"
        : "bg-white ring-1 ring-black/25 dark:bg-white/10 dark:ring-white/25"
    }`}
  >
    {checked && <Check className="size-2.5" strokeWidth={3} />}
  </button>
)

function SubPage({
  title,
  onBack,
  children,
}: {
  title: string
  onBack: () => void
  children: ReactNode
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 px-1">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex size-6 items-center justify-center rounded-full bg-black/[0.06] text-black/70 transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-white/75 dark:hover:bg-white/15"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-[13px] font-bold text-black/85 dark:text-white/90">
          {title}
        </p>
      </div>
      {children}
    </div>
  )
}

const StatusDot = ({ color = "bg-[#34c759]" }: { color?: string }) => (
  <span className={`size-[7px] shrink-0 rounded-full ${color}`} />
)

function WifiPage() {
  const [wifiOn, setWifiOn] = useState(true)
  const [known, setKnown] = useState<string[]>([DEFAULT_NETWORK])
  const [connected, setConnected] = useState<string | null>(DEFAULT_NETWORK)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [scanning, setScanning] = useState(true)
  const [scanTick, setScanTick] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [menu, setMenu] = useState<string | null>(null)
  const [passwordFor, setPasswordFor] = useState<string | null>(null)
  const [password, setPassword] = useState("")

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(WIFI_STORAGE_KEY)
      if (saved !== null) setWifiOn(saved === "1")
    } catch {}
  }, [])

  useEffect(() => {
    if (!wifiOn) {
      setScanning(false)
      return
    }
    setScanning(true)
    const timer = window.setTimeout(() => setScanning(false), 2200)
    return () => window.clearTimeout(timer)
  }, [wifiOn, scanTick])

  useEffect(() => {
    if (!connecting || !wifiOn) return
    const timer = window.setTimeout(() => {
      setKnown((prev) =>
        prev.includes(connecting) ? prev : [...prev, connecting]
      )
      setConnected(connecting)
      setConnecting(null)
    }, 850)
    return () => window.clearTimeout(timer)
  }, [connecting, wifiOn])

  useEffect(() => {
    if (!wifiOn || !connected) setDetailsOpen(false)
  }, [wifiOn, connected])

  const otherNetworks = [DEFAULT_NETWORK, ...NEARBY_NETWORKS].filter(
    (name) => !known.includes(name)
  )

  const toggleWifi = () => {
    const next = !wifiOn
    setWifiOn(next)
    setScanTick((value) => value + 1)
    setMenu(null)
    setPasswordFor(null)
    setPassword("")
    setConnecting(null)
    try {
      window.localStorage.setItem(WIFI_STORAGE_KEY, next ? "1" : "0")
    } catch {}
    setConnected(next ? (known[0] ?? null) : null)
  }

  const requestConnect = (name: string) => {
    if (!wifiOn || connecting || name === connected) return
    setMenu(null)
    if (known.includes(name)) {
      setConnecting(name)
      return
    }
    setPasswordFor(name)
    setPassword("")
  }

  const cancelPassword = () => {
    setPasswordFor(null)
    setPassword("")
  }

  const joinNetwork = () => {
    if (!passwordFor || !password.length) return
    const target = passwordFor
    setPasswordFor(null)
    setPassword("")
    setConnecting(target)
  }

  const forgetNetwork = (name: string) => {
    setKnown((prev) => prev.filter((network) => network !== name))
    if (connected === name) setConnected(null)
    setDetailsOpen(false)
    setMenu(null)
  }

  return (
    <div>
      <SettingsCard>
        <div className="flex gap-3 px-3.5 py-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-gradient-to-b from-[#5ac8fa] to-[#0a7cff] text-white shadow-sm ring-1 ring-black/5">
            <SfSymbol name="wifi" className="h-[13px] w-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] leading-4 font-semibold text-black/85 dark:text-white/90">
                Wi-Fi
              </p>
              <Switch on={wifiOn} onToggle={toggleWifi} label="Wi-Fi" />
            </div>
            <p className="mt-0.5 text-[11px] leading-[14px] text-black/55 dark:text-white/55">
              {wifiOn
                ? "Set up Wi-Fi to wirelessly connect your Mac to the internet. Turn on Wi-Fi, then choose a network to join. "
                : "Wi-Fi is off. Turn on Wi-Fi to see available networks. "}
              <a
                href="https://support.apple.com/guide/mac-help/wi-fi-settings-on-mac-mh11935/mac"
                target="_blank"
                rel="noreferrer"
                className="text-[#0a84ff] hover:underline"
              >
                Learn More...
              </a>
            </p>
          </div>
        </div>

        {wifiOn && connected && (
          <div className="border-t border-black/[0.06] px-3.5 py-2 dark:border-white/[0.08]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] leading-4 text-black/85 dark:text-white/90">
                  {connected}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] leading-4 text-black/55 dark:text-white/55">
                  <span className="size-[7px] shrink-0 rounded-full bg-[#34c759]" />
                  Connected
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2.5 pt-0.5 text-black/75 dark:text-white/70">
                <LockGlyph className="h-[13px] w-[10px]" />
                <SfSymbol name="wifi" className="h-[11px] w-[15px]" />
                <button
                  type="button"
                  onClick={() => setDetailsOpen((open) => !open)}
                  className="rounded-[6px] bg-black/[0.07] px-2 py-[3px] text-[12px] font-medium text-black/80 transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15"
                >
                  Details...
                </button>
              </div>
            </div>
          </div>
        )}
      </SettingsCard>

      {detailsOpen && connected && (
        <>
          <SettingsHeading
            action={
              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                className="text-[11px] font-medium text-[#0a84ff] hover:underline"
              >
                Done
              </button>
            }
          >
            Network Details
          </SettingsHeading>
          <SettingsCard>
            <div className="px-3.5 py-2.5">
              <div className="space-y-[3px]">
                {[
                  ["Network Name", connected],
                  ["Security", "WPA2/WPA3 Personal"],
                  ["Wi-Fi Address", "A4:83:E7:1B:2C:3D"],
                  ["IP Address", "192.168.1.42"],
                  ["Router", "192.168.1.1"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-[11.5px] text-black/50 dark:text-white/45">
                      {label}
                    </span>
                    <span className="truncate text-[12px] text-black/80 select-text dark:text-white/80">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 border-t border-black/[0.06] pt-2 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => forgetNetwork(connected)}
                  className="text-[12px] text-[#e0383e] hover:underline"
                >
                  Forget This Network
                </button>
              </div>
            </div>
          </SettingsCard>
        </>
      )}

      {wifiOn && known.length > 0 && (
        <>
          <SettingsHeading>Known Network</SettingsHeading>
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            {known.map((name) => {
              const isConnected = connected === name
              return (
                <div
                  key={name}
                  onClick={() => {
                    if (!isConnected) requestConnect(name)
                  }}
                  className={`relative flex min-h-[42px] items-center gap-2 px-3.5 ${isConnected ? "" : "cursor-pointer"}`}
                >
                  <span className="flex w-4 shrink-0 justify-center text-black/80 dark:text-white/80">
                    {isConnected && (
                      <Check className="size-3.5" strokeWidth={2.4} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-black/85 dark:text-white/90">
                    {name}
                  </span>
                  {connecting === name && (
                    <Spinner8 className="size-3.5 shrink-0 text-black/40 dark:text-white/40" />
                  )}
                  <span className="flex shrink-0 items-center gap-2.5 text-black/75 dark:text-white/70">
                    <LockGlyph className="h-[13px] w-[10px]" />
                    <SfSymbol name="wifi" className="h-[11px] w-[15px]" />
                    <button
                      type="button"
                      aria-label={`More options for ${name}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        setMenu(menu === name ? null : name)
                      }}
                      className="-mr-1 flex size-6 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/[0.07] hover:text-black/75 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white/80"
                    >
                      <EllipsisGlyph className="size-4" />
                    </button>
                  </span>
                  {menu === name && (
                    <ActionMenu
                      actions={[
                        {
                          label: isConnected ? "Disconnect" : "Connect",
                          onSelect: () => {
                            if (isConnected) {
                              setConnected(null)
                              setDetailsOpen(false)
                            } else {
                              requestConnect(name)
                            }
                          },
                        },
                        {
                          label: "Forget This Network",
                          destructive: true,
                          onSelect: () => forgetNetwork(name),
                        },
                      ]}
                      onClose={() => setMenu(null)}
                    />
                  )}
                </div>
              )
            })}
          </SettingsCard>
        </>
      )}

      {wifiOn && otherNetworks.length > 0 && (
        <>
          <SettingsHeading
            action={
              <button
                type="button"
                onClick={() => setScanTick((value) => value + 1)}
                aria-label="Scan for networks"
                className="-mr-1 flex size-5 items-center justify-center rounded-full text-black/35 transition-colors hover:bg-black/[0.06] hover:text-black/55 dark:text-white/35 dark:hover:bg-white/10 dark:hover:text-white/60"
              >
                <Spinner8 spinning={scanning} className="size-4" />
              </button>
            }
          >
            Other Networks
          </SettingsHeading>
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            {otherNetworks.map((name) => (
              <div
                key={name}
                onClick={() => requestConnect(name)}
                className="relative flex min-h-[42px] cursor-pointer items-center gap-2 py-1 pr-3.5 pl-7"
              >
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-black/85 dark:text-white/90">
                  {name}
                </span>
                {connecting === name && (
                  <Spinner8 className="size-3.5 shrink-0 text-black/40 dark:text-white/40" />
                )}
                <span className="flex shrink-0 items-center gap-2.5 text-black/75 dark:text-white/70">
                  <LockGlyph className="h-[13px] w-[10px]" />
                  <SfSymbol name="wifi" className="h-[11px] w-[15px]" />
                  <button
                    type="button"
                    aria-label={`More options for ${name}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      setMenu(menu === name ? null : name)
                    }}
                    className="-mr-1 flex size-6 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/[0.07] hover:text-black/75 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white/80"
                  >
                    <EllipsisGlyph className="size-4" />
                  </button>
                </span>
                {menu === name && (
                  <ActionMenu
                    actions={[
                      {
                        label: "Connect",
                        onSelect: () => requestConnect(name),
                      },
                    ]}
                    onClose={() => setMenu(null)}
                  />
                )}
              </div>
            ))}
          </SettingsCard>
        </>
      )}

      {passwordFor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-8 backdrop-blur-[1px]"
          onClick={cancelPassword}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Enter the password for ${passwordFor}`}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[300px] rounded-2xl bg-[#f2f2f4]/95 p-4 text-left shadow-[0_24px_70px_rgba(0,0,0,0.35)] ring-1 ring-black/10 backdrop-blur-2xl dark:bg-[#2c2c2e]/95 dark:ring-white/15"
          >
            <p className="text-[13px] font-semibold text-black/85 dark:text-white/90">
              Enter the password for “{passwordFor}”
            </p>
            <p className="mt-1 text-[11px] leading-4 text-black/50 dark:text-white/50">
              This network is password protected.
            </p>
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") joinNetwork()
                if (event.key === "Escape") cancelPassword()
              }}
              placeholder="Password"
              className="mt-3 h-7 w-full rounded-md bg-black/[0.06] px-2.5 text-[12px] text-black/85 outline-none placeholder:text-black/35 focus:ring-2 focus:ring-[#0a84ff]/60 dark:bg-white/10 dark:text-white/90 dark:placeholder:text-white/35"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelPassword}
                className="rounded-md bg-black/[0.06] px-3 py-[5px] text-[12px] text-black/75 transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!password.length}
                onClick={joinNetwork}
                className="rounded-md bg-[#0a84ff] px-3 py-[5px] text-[12px] font-medium text-white disabled:opacity-40"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type BluetoothDevice = {
  id: string
  name: string
  image: string
  battery: number
  connected: boolean
}

const BLUETOOTH_DEVICES: BluetoothDevice[] = [
  {
    id: "keyboard",
    name: "Magic Keyboard",
    image: "/devices/magic-keyboard.png",
    battery: 86,
    connected: true,
  },
  {
    id: "mouse",
    name: "Magic Mouse",
    image: "/devices/magic-mouse-cutout.png",
    battery: 64,
    connected: true,
  },
  {
    id: "airpods",
    name: "AirPods Pro",
    image: "/devices/airpods-pro-cropped.png",
    battery: 92,
    connected: false,
  },
]

const NEARBY_BLUETOOTH_DEVICES: BluetoothDevice[] = [
  {
    id: "beats",
    name: "Beats Studio Pro",
    image: "/devices/beats-headphones.png",
    battery: 0,
    connected: false,
  },
  {
    id: "xbox",
    name: "Xbox Wireless Controller",
    image: "/devices/xbox-controller-cutout.png",
    battery: 0,
    connected: false,
  },
]

function BluetoothProductImage({ device }: { device: BluetoothDevice }) {
  return (
    <span
      className="flex h-11 w-[58px] shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      <img
        src={device.image}
        alt=""
        draggable={false}
        className={`${device.id === "airpods" ? "h-[52px] w-[52px] -translate-x-2 translate-y-1" : "h-full w-full"} ${device.id === "beats" ? "-translate-x-0.5 rounded object-contain" : "object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.16)]"}`}
      />
    </span>
  )
}

function BluetoothPage() {
  const [on, setOn] = useStoredBool("tahoe-cc-bluetooth")
  const [devices, setDevices] = useState(BLUETOOTH_DEVICES)
  const [nearby, setNearby] = useState(NEARBY_BLUETOOTH_DEVICES)
  const [menu, setMenu] = useState<string | null>(null)

  const connect = (id: string, fromNearby: boolean) => {
    if (fromNearby) {
      const device = nearby.find((item) => item.id === id)
      if (!device) return
      setNearby((items) => items.filter((item) => item.id !== id))
      setDevices((items) => [
        ...items,
        { ...device, connected: true, battery: 100 },
      ])
    } else {
      setDevices((items) =>
        items.map((item) =>
          item.id === id ? { ...item, connected: true } : item
        )
      )
    }
    setMenu(null)
  }

  const disconnect = (id: string) => {
    setDevices((items) =>
      items.map((item) =>
        item.id === id ? { ...item, connected: false } : item
      )
    )
    setMenu(null)
  }

  const remove = (id: string) => {
    setDevices((items) => items.filter((item) => item.id !== id))
    setMenu(null)
  }

  return (
    <div>
      <SettingsCard>
        <div className="flex gap-3 px-3.5 py-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-gradient-to-b from-[#5ac8fa] to-[#0a7cff] text-white shadow-sm ring-1 ring-black/5">
            <Bluetooth className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] leading-4 font-semibold text-black/85 dark:text-white/90">
                Bluetooth
              </p>
              <Switch on={on} onToggle={() => setOn(!on)} label="Bluetooth" />
            </div>
            <p className="mt-0.5 text-[11px] leading-[14px] text-black/55 dark:text-white/55">
              {on
                ? "This Mac is discoverable as “tahoe”."
                : "Bluetooth is off."}
            </p>
          </div>
        </div>
      </SettingsCard>

      {on ? (
        <>
          <SettingsHeading>My Devices</SettingsHeading>
          <SettingsCard className="divide-y divide-black/[0.06] select-none dark:divide-white/[0.07]">
            {devices.map((device) => (
              <div key={device.id} className="relative">
                <PaneRow
                  icon={<BluetoothProductImage device={device} />}
                  label={device.name}
                  description={device.connected ? "Connected" : "Not Connected"}
                  trailing={
                    <>
                      {device.connected && device.battery > 0 && (
                        <span className="text-[11px] text-black/45 dark:text-white/45">
                          {device.battery}%
                        </span>
                      )}
                      <button
                        type="button"
                        aria-label={`More options for ${device.name}`}
                        onClick={() =>
                          setMenu(menu === device.id ? null : device.id)
                        }
                        className="-mr-1 flex size-6 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/[0.07] hover:text-black/75 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white/80"
                      >
                        <EllipsisGlyph className="size-4" />
                      </button>
                    </>
                  }
                />
                {menu === device.id && (
                  <ActionMenu
                    actions={[
                      {
                        label: device.connected ? "Disconnect" : "Connect",
                        onSelect: () =>
                          device.connected
                            ? disconnect(device.id)
                            : connect(device.id, false),
                      },
                      {
                        label: "Remove Device",
                        destructive: true,
                        onSelect: () => remove(device.id),
                      },
                    ]}
                    onClose={() => setMenu(null)}
                  />
                )}
              </div>
            ))}
          </SettingsCard>

          {nearby.length > 0 && (
            <>
              <SettingsHeading>Nearby Devices</SettingsHeading>
              <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
                {nearby.map((device) => (
                  <PaneRow
                    key={device.id}
                    icon={<BluetoothProductImage device={device} />}
                    label={device.name}
                    description="Not Connected"
                    trailing={
                      <button
                        type="button"
                        onClick={() => connect(device.id, true)}
                        className="rounded-[6px] bg-black/[0.06] px-2 py-[3px] text-[12px] font-medium text-[#0a84ff] transition-colors hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
                      >
                        Connect
                      </button>
                    }
                  />
                ))}
              </SettingsCard>
            </>
          )}
        </>
      ) : (
        <div className="mt-8 flex flex-col items-center text-center">
          <Bluetooth className="size-8 text-black/20 dark:text-white/20" />
          <p className="mt-2 text-[12px] text-black/45 dark:text-white/45">
            Turn on Bluetooth to connect your devices.
          </p>
        </div>
      )}
    </div>
  )
}

const CableIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3.5">
    <path
      d="M3 4.5h4.5a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2H13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <rect x="1.2" y="3" width="2.6" height="3" rx=".7" fill="currentColor" />
    <rect x="12.2" y="10" width="2.6" height="3" rx=".7" fill="currentColor" />
  </svg>
)

const NETWORK_SERVICES = [
  {
    id: "wifi",
    label: "Wi-Fi",
    status: "Connected",
    ip: "192.168.1.42",
    router: "192.168.1.1",
  },
  {
    id: "bridge",
    label: "Thunderbolt Bridge",
    status: "Not Connected",
    ip: "—",
    router: "—",
  },
  {
    id: "pan",
    label: "Bluetooth PAN",
    status: "Not Connected",
    ip: "—",
    router: "—",
  },
]

function NetworkPage() {
  const [firewall, setFirewall] = useStoredBool("tahoe-firewall", true)
  const [details, setDetails] = useState<string | null>(null)
  const selected = NETWORK_SERVICES.find((service) => service.id === details)

  return (
    <div>
      <SettingsCard>
        <div className="flex items-center gap-3 px-3.5 py-3">
          <IconTile
            bg="bg-gradient-to-b from-[#5ac8fa] to-[#0a7cff]"
            size="size-8"
          >
            <Wifi className="size-4" />
          </IconTile>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-4 font-semibold text-black/85 dark:text-white/90">
              Wi-Fi
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] leading-4 text-black/55 dark:text-white/55">
              <StatusDot />
              Connected
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDetails(details === "wifi" ? null : "wifi")}
            className="rounded-[6px] bg-black/[0.07] px-2 py-[3px] text-[12px] font-medium text-black/80 transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15"
          >
            Details...
          </button>
        </div>
      </SettingsCard>

      <SettingsHeading>Firewall</SettingsHeading>
      <SettingsCard>
        <PaneRow
          icon={
            <IconTile bg="bg-gradient-to-b from-orange-400 to-red-500">
              <Shield className="size-3.5" />
            </IconTile>
          }
          label="Firewall"
          description={
            firewall
              ? "Firewall is on. Your Mac is protected."
              : "Firewall is off."
          }
          trailing={
            <Switch
              on={firewall}
              onToggle={() => setFirewall(!firewall)}
              label="Firewall"
            />
          }
        />
      </SettingsCard>

      <SettingsHeading>Services</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {NETWORK_SERVICES.map((service) => (
          <PaneRow
            key={service.id}
            icon={
              <IconTile
                bg={
                  service.id === "wifi"
                    ? "bg-gradient-to-b from-[#5ac8fa] to-[#0a7cff]"
                    : "bg-neutral-400 dark:bg-neutral-600"
                }
              >
                {service.id === "wifi" ? (
                  <Wifi className="size-3.5" />
                ) : service.id === "bridge" ? (
                  <CableIcon />
                ) : (
                  <Bluetooth className="size-3.5" />
                )}
              </IconTile>
            }
            label={service.label}
            description={
              <span className="flex items-center gap-1.5">
                <StatusDot
                  color={
                    service.status === "Connected"
                      ? "bg-[#34c759]"
                      : "bg-black/20 dark:bg-white/25"
                  }
                />
                {service.status}
              </span>
            }
            onClick={() =>
              setDetails(details === service.id ? null : service.id)
            }
            trailing={rowChevron}
          />
        ))}
      </SettingsCard>

      {selected && (
        <>
          <SettingsHeading
            action={
              <button
                type="button"
                onClick={() => setDetails(null)}
                className="text-[11px] font-medium text-[#0a84ff] hover:underline"
              >
                Done
              </button>
            }
          >
            {selected.label} Details
          </SettingsHeading>
          <SettingsCard>
            <div className="px-3.5 py-2.5">
              <div className="space-y-[3px]">
                {[
                  ["Status", selected.status],
                  ["IP Address", selected.ip],
                  ["Router", selected.router],
                  ["DNS Server", selected.ip === "—" ? "—" : "192.168.1.1"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-[11.5px] text-black/50 dark:text-white/45">
                      {label}
                    </span>
                    <span className="truncate text-[12px] text-black/80 select-text dark:text-white/80">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SettingsCard>
        </>
      )}
    </div>
  )
}

function VpnPage() {
  const [on, setOn] = useStoredBool(VPN_ENABLED_STORAGE_KEY, false)
  const [connectedConfig, setConnectedConfig] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem(VPN_CONNECTED_CONFIG_STORAGE_KEY)
    } catch {
      return null
    }
  })
  const [inMenuBar, setInMenuBar] = useState(() => {
    try {
      return window.localStorage.getItem(VPN_MENU_BAR_STORAGE_KEY) !== "0"
    } catch {
      return true
    }
  })
  const [configurations, setConfigurations] = useState<
    { id: string; name: string; type: string }[]
  >([])
  const [addConfigOpen, setAddConfigOpen] = useState(false)
  const [configName, setConfigName] = useState("")
  const [configType, setConfigType] = useState("ikev2")

  useEffect(() => {
    try {
      if (connectedConfig)
        window.localStorage.setItem(
          VPN_CONNECTED_CONFIG_STORAGE_KEY,
          connectedConfig
        )
      else window.localStorage.removeItem(VPN_CONNECTED_CONFIG_STORAGE_KEY)
      window.localStorage.setItem(
        VPN_MENU_BAR_STORAGE_KEY,
        inMenuBar ? "1" : "0"
      )
    } catch {}
    window.dispatchEvent(
      new CustomEvent(VPN_STATUS_EVENT, {
        detail: { show: inMenuBar, connected: on && connectedConfig !== null },
      })
    )
  }, [connectedConfig, inMenuBar, on])

  return (
    <div>
      <SettingsCard>
        <div className="flex gap-3 px-3.5 py-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-gradient-to-b from-[#5ac8fa] to-[#0a7cff] text-white shadow-sm ring-1 ring-black/5">
            <Shield className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] leading-4 font-semibold text-black/85 dark:text-white/90">
                VPN
              </p>
              <Switch
                on={on}
                onToggle={() => {
                  setOn(!on)
                  if (on) setConnectedConfig(null)
                }}
                label="VPN"
              />
            </div>
            <p className="mt-0.5 text-[11px] leading-[14px] text-black/55 dark:text-white/55">
              {on
                ? connectedConfig
                  ? "Connected. Your network traffic is protected."
                  : "VPN is on. Connect to a configuration to protect your privacy."
                : "VPN is off."}
            </p>
          </div>
        </div>
      </SettingsCard>

      {on && (
        <>
          <SettingsHeading>Configurations</SettingsHeading>
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            <PaneRow
              icon={
                <IconTile bg="bg-gradient-to-b from-[#5ac8fa] to-[#0a7cff]">
                  <ShieldCheck className="size-3.5" />
                </IconTile>
              }
              label="Personal VPN"
              description={
                <span className="flex items-center gap-1.5">
                  <StatusDot
                    color={
                      connectedConfig === "personal"
                        ? "bg-[#34c759]"
                        : "bg-black/20 dark:bg-white/25"
                    }
                  />
                  {connectedConfig === "personal"
                    ? "Connected · IKEv2"
                    : "Not Connected · IKEv2"}
                </span>
              }
              trailing={
                <button
                  type="button"
                  onClick={() =>
                    setConnectedConfig(
                      connectedConfig === "personal" ? null : "personal"
                    )
                  }
                  className="rounded-[6px] bg-black/[0.06] px-2 py-[3px] text-[12px] font-medium text-[#0a84ff] transition-colors hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
                >
                  {connectedConfig === "personal" ? "Disconnect" : "Connect"}
                </button>
              }
            />
            {configurations.map((configuration) => (
              <PaneRow
                key={configuration.id}
                label={configuration.name}
                description={
                  <span className="flex items-center gap-1.5">
                    <StatusDot
                      color={
                        connectedConfig === configuration.id
                          ? "bg-[#34c759]"
                          : "bg-black/20 dark:bg-white/25"
                      }
                    />
                    {connectedConfig === configuration.id
                      ? `Connected · ${configuration.type}`
                      : `Not Connected · ${configuration.type}`}
                  </span>
                }
                trailing={
                  <button
                    type="button"
                    onClick={() =>
                      setConnectedConfig(
                        connectedConfig === configuration.id
                          ? null
                          : configuration.id
                      )
                    }
                    className={dialogButton}
                  >
                    {connectedConfig === configuration.id
                      ? "Disconnect"
                      : "Connect"}
                  </button>
                }
              />
            ))}
          </SettingsCard>

          <div className="mt-2 mb-2.5">
            <button
              type="button"
              onClick={() => setAddConfigOpen(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-black/[0.035] py-2 text-[12px] font-medium text-[#0a84ff] shadow-[0_0_0_0.5px_rgba(0,0,0,0.04)] transition-colors hover:bg-black/[0.06] dark:bg-white/[0.06] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.05)] dark:hover:bg-white/[0.09]"
            >
              <Plus className="size-3.5" />
              Add VPN Configuration...
            </button>
          </div>

          <SettingsCard>
            <PaneRow
              label="Show VPN status in menu bar"
              trailing={
                <Switch
                  on={inMenuBar}
                  onToggle={() => setInMenuBar((value) => !value)}
                  label="Show VPN status in menu bar"
                />
              }
            />
          </SettingsCard>
        </>
      )}
      <SettingsDialog
        open={addConfigOpen}
        onOpenChange={setAddConfigOpen}
        title="Add VPN Configuration"
        description="Create a VPN configuration for this Mac."
        footer={
          <>
            <button
              type="button"
              className={dialogButton}
              onClick={() => setAddConfigOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={dialogButton}
              disabled={!configName.trim()}
              onClick={() => {
                const id = `vpn-${Date.now()}`
                setConfigurations((items) => [
                  ...items,
                  {
                    id,
                    name: configName.trim(),
                    type:
                      configType === "ikev2"
                        ? "IKEv2"
                        : configType.toUpperCase(),
                  },
                ])
                setConfigName("")
                setAddConfigOpen(false)
              }}
            >
              Create
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <label className="block text-[11px] text-black/55 dark:text-white/55">
            Description
            <input
              value={configName}
              onChange={(event) => setConfigName(event.target.value)}
              aria-label="VPN description"
              className="mt-1 w-full rounded-lg bg-black/[0.06] px-3 py-2 text-[12px] text-black/80 outline-none dark:bg-white/10 dark:text-white/85"
            />
          </label>
          <label className="block text-[11px] text-black/55 dark:text-white/55">
            VPN Type
            <span className="mt-1 block">
              <Select
                ariaLabel="VPN type"
                value={configType}
                onChange={setConfigType}
                options={[
                  { value: "ikev2", label: "IKEv2" },
                  { value: "l2tp", label: "L2TP over IPSec" },
                  { value: "cisco", label: "Cisco IPSec" },
                ]}
              />
            </span>
          </label>
        </div>
      </SettingsDialog>
    </div>
  )
}

const BATTERY_BARS = [
  92, 90, 88, 86, 84, 82, 80, 78, 76, 75, 74, 76, 80, 84, 88, 92, 96, 100, 100,
  100, 100, 100, 100, 100,
]

function BatteryPage() {
  const [lowPower, setLowPower] = useState("never")
  const [energyMode, setEnergyMode] = useState("automatic")
  const [optimized, setOptimized] = useState(true)
  const [healthDetails, setHealthDetails] = useState(false)

  return (
    <div>
      <SettingsCard>
        <div className="flex items-center gap-3 px-3.5 py-3">
          <span className="relative flex h-[24px] w-[48px] items-center rounded-[5px] border border-black/40 p-[2px] dark:border-white/50">
            <span className="h-full w-full rounded-[2px] bg-[#34c759]" />
            <span className="absolute top-1/2 -right-[4px] h-[9px] w-[3px] -translate-y-1/2 rounded-r-[2px] bg-black/40 dark:bg-white/50" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-4 font-semibold text-black/85 dark:text-white/90">
              Battery
            </p>
            <p className="mt-0.5 text-[11px] leading-[14px] text-black/55 dark:text-white/55">
              100% · Battery is fully charged
            </p>
          </div>
          <span className="rounded-full bg-[#34c759]/15 px-2 py-[3px] text-[10px] font-semibold text-[#1a8f3c] dark:text-[#4cd964]">
            Normal
          </span>
        </div>
      </SettingsCard>

      <SettingsHeading>Energy</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Low Power Mode"
          description="Reduce energy usage to extend battery life."
          trailing={
            <Select
              ariaLabel="Low Power Mode"
              value={lowPower}
              onChange={setLowPower}
              options={[
                { value: "never", label: "Never" },
                { value: "always", label: "Always" },
                { value: "battery", label: "Only on Battery" },
                { value: "adapter", label: "Only on Power Adapter" },
              ]}
            />
          }
        />
        <PaneRow
          label="Energy Mode"
          description="High Power increases energy usage for demanding tasks."
          trailing={
            <Select
              ariaLabel="Energy Mode"
              value={energyMode}
              onChange={setEnergyMode}
              options={[
                { value: "automatic", label: "Automatic" },
                { value: "low", label: "Low Power" },
                { value: "high", label: "High Power" },
              ]}
            />
          }
        />
      </SettingsCard>

      <SettingsHeading
        action={
          <button
            type="button"
            onClick={() => setHealthDetails((open) => !open)}
            className="text-[11px] font-medium text-[#0a84ff] hover:underline"
          >
            {healthDetails ? "Hide" : "Show Details"}
          </button>
        }
      >
        Battery Health
      </SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Battery Health"
          description="Your battery is functioning normally."
          trailing={
            <span className="text-[12px] font-medium text-[#34c759]">
              Normal
            </span>
          }
        />
        <PaneRow
          label="Maximum Capacity"
          trailing={
            <span className="text-[12px] text-black/60 dark:text-white/60">
              100%
            </span>
          }
        />
        {healthDetails && (
          <>
            <PaneRow
              label="Cycle Count"
              trailing={
                <span className="text-[12px] text-black/60 dark:text-white/60">
                  42
                </span>
              }
            />
            <PaneRow
              label="Condition"
              trailing={
                <span className="text-[12px] text-black/60 dark:text-white/60">
                  Normal
                </span>
              }
            />
            <PaneRow
              label="Manufacture Date"
              trailing={
                <span className="text-[12px] text-black/60 dark:text-white/60">
                  August 2025
                </span>
              }
            />
          </>
        )}
      </SettingsCard>

      <SettingsHeading>Charging</SettingsHeading>
      <SettingsCard>
        <PaneRow
          label="Optimized Battery Charging"
          description="Reduce battery ageing by learning your charging routine."
          trailing={
            <Switch
              on={optimized}
              onToggle={() => setOptimized(!optimized)}
              label="Optimized Battery Charging"
            />
          }
        />
      </SettingsCard>

      <SettingsHeading>Last 24 Hours</SettingsHeading>
      <SettingsCard>
        <div className="px-3.5 pt-3 pb-2">
          <div className="flex h-16 items-end gap-[3px]">
            {BATTERY_BARS.map((value, index) => (
              <span
                key={index}
                className="flex-1 rounded-t-[2px] bg-gradient-to-t from-[#34c759]/50 to-[#34c759]"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-black/40 dark:text-white/40">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>Now</span>
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}

const GENERAL_GROUPS = [
  [
    {
      id: "about",
      label: "About",
      value: "MacBook Pro (14-inch, M5, 2025)",
      icon: Info,
      bg: "bg-gradient-to-b from-neutral-500 to-neutral-700",
    },
    {
      id: "update",
      label: "Software Update",
      value: "Automatic updates are on",
      icon: Download,
      bg: BLUE,
    },
    {
      id: "storage",
      label: "Storage",
      value: "142.5 GB available of 512 GB",
      icon: HardDrive,
      bg: "bg-gradient-to-b from-neutral-400 to-neutral-600",
    },
  ],
  [
    {
      id: "airdrop",
      label: "AirDrop & Handoff",
      value: "AirDrop: Contacts Only",
      icon: Users,
      bg: BLUE,
    },
    {
      id: "login",
      label: "Login Items & Extensions",
      value: "3 items",
      icon: LayoutGrid,
      bg: GRAY,
    },
    {
      id: "language",
      label: "Language & Region",
      value: "English (US)",
      icon: Languages,
      bg: BLUE,
    },
  ],
  [
    {
      id: "datetime",
      label: "Date & Time",
      value: "Set automatically",
      icon: Clock,
      bg: GRAY,
    },
    {
      id: "sharing",
      label: "Sharing",
      value: "2 services",
      icon: Users,
      bg: BLUE,
    },
    {
      id: "timemachine",
      label: "Time Machine",
      value: "Backing up automatically",
      icon: Clock3,
      bg: "bg-gradient-to-b from-green-400 to-green-600",
    },
  ],
  [
    {
      id: "transfer",
      label: "Transfer or Reset",
      value: "Erase all content and settings",
      icon: RefreshCw,
      bg: GRAY,
    },
    {
      id: "startup",
      label: "Startup Disk",
      value: "Macintosh HD",
      icon: HardDrive,
      bg: GRAY,
    },
  ],
]

const GENERAL_ITEMS = GENERAL_GROUPS.flat()

const STORAGE_ITEMS = [
  { label: "Applications", size: 64, color: "bg-[#0a84ff]" },
  { label: "Photos", size: 48, color: "bg-[#34c759]" },
  { label: "Documents", size: 22, color: "bg-[#ff9f0a]" },
  { label: "System Data", size: 221, color: "bg-[#8e8e93]" },
  { label: "Other", size: 14.5, color: "bg-[#5e5ce6]" },
]

const LOGIN_ITEMS = [
  { name: "Music", icon: "/icons/Music.png", initial: true },
  { name: "Safari", icon: "/icons/Safari.png", initial: false },
  { name: "Terminal", icon: "/icons/Terminal.png", initial: true },
]

const SHARING_SERVICES = [
  { id: "screen", label: "Screen Sharing", initial: false },
  { id: "file", label: "File Sharing", initial: true },
  { id: "media", label: "Media Sharing", initial: true },
  { id: "bluetooth", label: "Bluetooth Sharing", initial: false },
]

function GeneralPage({ onErase }: { onErase: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [autoUpdates, setAutoUpdates] = useState(true)
  const [airdrop, setAirdrop] = useState("contacts")
  const [handoff, setHandoff] = useState(true)
  const [loginItems, setLoginItems] = useState(() =>
    Object.fromEntries(LOGIN_ITEMS.map((item) => [item.name, item.initial]))
  )
  const [loginItemNames, setLoginItemNames] = useState(
    LOGIN_ITEMS.map((item) => item.name)
  )
  const [addLoginItem, setAddLoginItem] = useState("Safari")
  const [backgroundItems, setBackgroundItems] = useState<
    Record<string, boolean>
  >({ "Adobe Creative Cloud": true, "Google Drive": false })
  const [setTime, setSetTime] = useState(true)
  const [setZone, setSetZone] = useState(true)
  const [sharing, setSharing] = useState(() =>
    Object.fromEntries(SHARING_SERVICES.map((item) => [item.id, item.initial]))
  )
  const [backupAuto, setBackupAuto] = useState(true)
  const [backupNow, setBackupNow] = useState(false)
  const [backupDisk, setBackupDisk] = useState("Macintosh HD")
  const [timeMachineOptionsOpen, setTimeMachineOptionsOpen] = useState(false)
  const [excludeRemovable, setExcludeRemovable] = useState(true)
  const [notifyOldBackups, setNotifyOldBackups] = useState(true)
  const [country, setCountry] = useState("United States")
  const [preferredLanguages, setPreferredLanguages] = useState(["English (US)"])
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false)
  const [languageDraft, setLanguageDraft] = useState("French")
  const [aboutInfoOpen, setAboutInfoOpen] = useState(false)
  const [eraseStep, setEraseStep] = useState<
    "intro" | "authenticate" | "confirm" | null
  >(null)
  const [erasePassword, setErasePassword] = useState("")
  const [eraseError, setEraseError] = useState("")
  const [startupDisk, setStartupDisk] = useState("Macintosh HD")

  const current = GENERAL_ITEMS.find((item) => item.id === selected)
  const used = STORAGE_ITEMS.reduce((total, item) => total + item.size, 0)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("tahoe-region")
      setCountry(saved && COUNTRIES.includes(saved) ? saved : detectCountry())
    } catch {
      setCountry(detectCountry())
    }
  }, [])

  const changeCountry = (nextCountry: string) => {
    setCountry(nextCountry)
    try {
      window.localStorage.setItem("tahoe-region", nextCountry)
    } catch {}
  }

  const authenticateErase = async () => {
    const account = loadAccount()
    if (
      account?.passwordHash &&
      !(await verifyPassword(account, erasePassword))
    ) {
      setEraseError("The password you entered is incorrect.")
      return
    }
    setEraseError("")
    setErasePassword("")
    setEraseStep("confirm")
  }

  const checkForUpdates = () => {
    if (checking) return
    setChecking(true)
    window.setTimeout(() => setChecking(false), 1600)
  }

  const detail = () => {
    if (!selected) return null

    if (selected === "about") {
      return (
        <>
          <SettingsCard>
            <div className="flex flex-col items-center px-3.5 py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/macbook.png"
                alt=""
                draggable={false}
                className="h-24 w-auto"
              />
              <p className="mt-2 text-[13px] font-semibold text-black/85 dark:text-white/90">
                {SYSTEM_INFO.host}
              </p>
              <p className="text-[11px] text-black/50 dark:text-white/50">
                {SYSTEM_INFO.osName} {SYSTEM_INFO.osVersion}
              </p>
            </div>
          </SettingsCard>
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            {[
              ["Chip", SYSTEM_INFO.chip],
              ["Memory", SYSTEM_INFO.memory],
              ["Serial Number", SYSTEM_INFO.serial],
              ["macOS", `${SYSTEM_INFO.osName} ${SYSTEM_INFO.osVersion}`],
              ["Model", SYSTEM_INFO.host],
            ].map(([label, value]) => (
              <PaneRow
                key={label}
                label={label}
                trailing={
                  <span className="max-w-[220px] truncate text-[12px] text-black/60 dark:text-white/60">
                    {value}
                  </span>
                }
              />
            ))}
          </SettingsCard>
          <SettingsCard>
            <PaneRow
              label="More Info..."
              description="View system configuration and hardware details."
              onClick={() => setAboutInfoOpen(true)}
              trailing={rowChevron}
            />
          </SettingsCard>
          <SettingsDialog
            open={aboutInfoOpen}
            onOpenChange={setAboutInfoOpen}
            title="System Report"
            description="Hardware overview for this Mac."
            footer={
              <button
                type="button"
                className={dialogButton}
                onClick={() => setAboutInfoOpen(false)}
              >
                Done
              </button>
            }
          >
            <div className="rounded-lg bg-black/[0.04] p-3 text-[12px] dark:bg-white/[0.07]">
              <p>
                <strong>Model:</strong> {SYSTEM_INFO.host}
              </p>
              <p>
                <strong>Chip:</strong> {SYSTEM_INFO.chip}
              </p>
              <p>
                <strong>Memory:</strong> {SYSTEM_INFO.memory}
              </p>
              <p>
                <strong>Serial Number:</strong> {SYSTEM_INFO.serial}
              </p>
              <p>
                <strong>System:</strong> {SYSTEM_INFO.osName}{" "}
                {SYSTEM_INFO.osVersion} ({SYSTEM_INFO.kernel})
              </p>
            </div>
          </SettingsDialog>
        </>
      )
    }

    if (selected === "update") {
      return (
        <>
          <SettingsCard>
            <div className="flex items-center gap-3 px-3.5 py-3">
              <IconTile bg={BLUE} size="size-8">
                <Download className="size-4" />
              </IconTile>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-black/85 dark:text-white/90">
                  macOS Tahoe 26.0
                </p>
                <p className="mt-0.5 text-[11px] text-black/50 dark:text-white/50">
                  {checking
                    ? "Checking for updates..."
                    : "Your Mac is up to date."}
                </p>
              </div>
              <button
                type="button"
                onClick={checkForUpdates}
                className="rounded-[6px] bg-black/[0.06] px-2 py-[4px] text-[12px] font-medium text-[#0a84ff] transition-colors hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
              >
                {checking ? "Checking..." : "Check for Updates"}
              </button>
            </div>
          </SettingsCard>
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            <PaneRow
              label="Automatic Updates"
              description="Download and install macOS updates automatically."
              trailing={
                <Switch
                  on={autoUpdates}
                  onToggle={() => setAutoUpdates(!autoUpdates)}
                  label="Automatic Updates"
                />
              }
            />
            <PaneRow
              label="Beta Updates"
              trailing={
                <Select
                  ariaLabel="Beta Updates"
                  value="off"
                  onChange={() => {}}
                  options={[
                    { value: "off", label: "Off" },
                    { value: "public", label: "macOS Public Beta" },
                  ]}
                />
              }
            />
          </SettingsCard>
        </>
      )
    }

    if (selected === "storage") {
      return (
        <>
          <SettingsCard>
            <div className="px-3.5 py-3">
              <div className="flex items-baseline justify-between">
                <p className="text-[13px] font-semibold text-black/85 dark:text-white/90">
                  Macintosh HD
                </p>
                <p className="text-[11px] text-black/50 dark:text-white/50">
                  {(512 - used).toFixed(1)} GB available of 512 GB
                </p>
              </div>
              <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                {STORAGE_ITEMS.map((item) => (
                  <span
                    key={item.label}
                    className={item.color}
                    style={{ width: `${(item.size / 512) * 100}%` }}
                  />
                ))}
              </div>
              <div className="mt-3 space-y-1.5">
                {STORAGE_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-[11px]"
                  >
                    <span className={`size-2 rounded-[2px] ${item.color}`} />
                    <span className="flex-1 text-black/65 dark:text-white/65">
                      {item.label}
                    </span>
                    <span className="text-black/40 dark:text-white/40">
                      {item.size.toFixed(1)} GB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SettingsCard>
          <SettingsCard>
            <PaneRow
              label="Free Space"
              description="Available for new files and apps."
              trailing={
                <span className="text-[12px] text-black/60 dark:text-white/60">
                  {(512 - used).toFixed(1)} GB
                </span>
              }
            />
          </SettingsCard>
        </>
      )
    }

    if (selected === "airdrop") {
      return (
        <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
          <PaneRow
            label="AirDrop"
            description="Allow others to send items to your Mac."
            trailing={
              <Select
                ariaLabel="AirDrop"
                value={airdrop}
                onChange={setAirdrop}
                options={[
                  { value: "noone", label: "No One" },
                  { value: "contacts", label: "Contacts Only" },
                  { value: "everyone", label: "Everyone for 10 Minutes" },
                ]}
              />
            }
          />
          <PaneRow
            label="Handoff"
            description="Continue tasks on another device."
            trailing={
              <Switch
                on={handoff}
                onToggle={() => setHandoff(!handoff)}
                label="Handoff"
              />
            }
          />
        </SettingsCard>
      )
    }

    if (selected === "login") {
      const availableLoginItems = [
        "Safari",
        "Finder",
        "Music",
        "Messages",
        "Calendar",
        "Notes",
        "Terminal",
      ].filter((name) => !loginItemNames.includes(name))
      return (
        <>
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            {loginItemNames.map((name) => {
              const app = LOGIN_ITEMS.find((item) => item.name === name)
              return (
                <PaneRow
                  key={name}
                  icon={
                    app ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={app.icon}
                        alt=""
                        draggable={false}
                        className="size-[26px] rounded-[6px]"
                      />
                    ) : (
                      <IconTile bg={GRAY}>
                        <LayoutGrid className="size-3.5" />
                      </IconTile>
                    )
                  }
                  label={name}
                  description="Open at login"
                  trailing={
                    <>
                      <Switch
                        on={Boolean(loginItems[name])}
                        onToggle={() =>
                          setLoginItems((current) => ({
                            ...current,
                            [name]: !current[name],
                          }))
                        }
                        label={name}
                      />
                      <button
                        type="button"
                        aria-label={`Remove ${name} from login items`}
                        onClick={() =>
                          setLoginItemNames((items) =>
                            items.filter((item) => item !== name)
                          )
                        }
                        className="text-black/40 hover:text-red-500 dark:text-white/40"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </>
                  }
                />
              )
            })}
            <PaneRow
              label="Add Login Item..."
              trailing={
                <span className="flex items-center gap-2">
                  <Select
                    ariaLabel="Login item"
                    value={addLoginItem}
                    onChange={setAddLoginItem}
                    options={availableLoginItems.map((name) => ({
                      value: name,
                      label: name,
                    }))}
                  />
                  <button
                    type="button"
                    aria-label="Add login item"
                    disabled={availableLoginItems.length === 0}
                    onClick={() => {
                      if (availableLoginItems.length === 0) return
                      setLoginItemNames((items) => [...items, addLoginItem])
                      setLoginItems((items) => ({
                        ...items,
                        [addLoginItem]: true,
                      }))
                      setAddLoginItem(
                        availableLoginItems.find(
                          (name) => name !== addLoginItem
                        ) ?? addLoginItem
                      )
                    }}
                    className="text-[#0a84ff] disabled:opacity-40"
                  >
                    <Plus className="size-4" />
                  </button>
                </span>
              }
            />
          </SettingsCard>
          <SettingsHeading>Allow in the Background</SettingsHeading>
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            {Object.entries(backgroundItems).map(([name, enabled]) => (
              <PaneRow
                key={name}
                label={name}
                trailing={
                  <Switch
                    on={enabled}
                    onToggle={() =>
                      setBackgroundItems((items) => ({
                        ...items,
                        [name]: !items[name],
                      }))
                    }
                    label={name}
                  />
                }
              />
            ))}
            <PaneRow
              label="Add Background Item"
              trailing={
                <button
                  type="button"
                  className={dialogButton}
                  onClick={() =>
                    setBackgroundItems((items) => ({ ...items, Dropbox: true }))
                  }
                >
                  Add
                </button>
              }
            />
          </SettingsCard>
        </>
      )
    }

    if (selected === "language") {
      return (
        <div>
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            <PaneRow
              label="Preferred Languages"
              description={preferredLanguages.join(", ")}
              trailing={
                <button
                  type="button"
                  onClick={() => setLanguageDialogOpen(true)}
                  className="text-[12px] text-[#0a84ff] hover:underline"
                >
                  Edit...
                </button>
              }
            />
            <PaneRow
              label="Region"
              trailing={
                <Select
                  ariaLabel="Region"
                  value={country}
                  onChange={changeCountry}
                  options={COUNTRIES.map((name) => ({
                    value: name,
                    label: name,
                  }))}
                />
              }
            />
          </SettingsCard>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setLanguageDialogOpen(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-black/[0.035] py-2 text-[12px] font-medium text-[#0a84ff] shadow-[0_0_0_0.5px_rgba(0,0,0,0.04)] transition-colors hover:bg-black/[0.06] dark:bg-white/[0.06] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.05)] dark:hover:bg-white/[0.09]"
            >
              <Plus className="size-3.5" />
              Add Language...
            </button>
          </div>
          <SettingsDialog
            open={languageDialogOpen}
            onOpenChange={setLanguageDialogOpen}
            title="Preferred Languages"
            description="Choose the languages used for apps and websites."
            footer={
              <>
                <button
                  type="button"
                  className={dialogButton}
                  onClick={() => setLanguageDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={dialogButton}
                  onClick={() => {
                    if (!preferredLanguages.includes(languageDraft))
                      setPreferredLanguages((languages) => [
                        ...languages,
                        languageDraft,
                      ])
                    setLanguageDialogOpen(false)
                  }}
                >
                  Add
                </button>
              </>
            }
          >
            <div className="space-y-2">
              <Select
                ariaLabel="Add preferred language"
                value={languageDraft}
                onChange={setLanguageDraft}
                options={[
                  "English (US)",
                  "English (UK)",
                  "French",
                  "German",
                  "Japanese",
                  "Spanish",
                  "Chinese (Simplified)",
                ].map((language) => ({ value: language, label: language }))}
              />
              <div className="max-h-28 space-y-1 overflow-y-auto rounded-lg bg-black/[0.04] p-2 text-[12px] dark:bg-white/[0.07]">
                {preferredLanguages.map((language) => (
                  <div
                    key={language}
                    className="flex items-center justify-between"
                  >
                    <span>{language}</span>
                    {preferredLanguages.length > 1 && (
                      <button
                        type="button"
                        aria-label={`Remove ${language}`}
                        onClick={() =>
                          setPreferredLanguages((items) =>
                            items.filter((item) => item !== language)
                          )
                        }
                        className="text-black/45 hover:text-red-500 dark:text-white/45"
                      >
                        <Minus className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SettingsDialog>
        </div>
      )
    }

    if (selected === "datetime") {
      return (
        <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
          <PaneRow
            label="Set time and date automatically"
            trailing={
              <Switch
                on={setTime}
                onToggle={() => setSetTime(!setTime)}
                label="Set time and date automatically"
              />
            }
          />
          <PaneRow
            label="Set time zone automatically"
            trailing={
              <Switch
                on={setZone}
                onToggle={() => setSetZone(!setZone)}
                label="Set time zone automatically"
              />
            }
          />
          <PaneRow
            label="Time Zone"
            trailing={
              <span className="text-[12px] text-black/60 dark:text-white/60">
                America/Los_Angeles
              </span>
            }
          />
          <PaneRow
            label="Date & Time"
            trailing={
              <span className="text-[12px] text-black/60 dark:text-white/60">
                8 Nov 2026 at 11:42 AM
              </span>
            }
          />
        </SettingsCard>
      )
    }

    if (selected === "sharing") {
      return (
        <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
          {SHARING_SERVICES.map((service) => (
            <PaneRow
              key={service.id}
              label={service.label}
              description={sharing[service.id] ? "On" : "Off"}
              trailing={
                <Switch
                  on={Boolean(sharing[service.id])}
                  onToggle={() =>
                    setSharing((current) => ({
                      ...current,
                      [service.id]: !current[service.id],
                    }))
                  }
                  label={service.label}
                />
              }
            />
          ))}
        </SettingsCard>
      )
    }

    if (selected === "timemachine") {
      return (
        <>
          <SettingsCard>
            <PaneRow
              icon={
                <IconTile bg="bg-gradient-to-b from-green-400 to-green-600">
                  <Clock3 className="size-3.5" />
                </IconTile>
              }
              label="Time Machine"
              description={
                backupAuto
                  ? "Backing up automatically"
                  : "Automatic backups are off"
              }
              trailing={
                <Switch
                  on={backupAuto}
                  onToggle={() => setBackupAuto(!backupAuto)}
                  label="Time Machine"
                />
              }
            />
          </SettingsCard>
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            <PaneRow
              label="Latest Backup"
              trailing={
                <span className="text-[12px] text-black/60 dark:text-white/60">
                  {backupNow ? "Backing up..." : "Today at 10:42 AM"}
                </span>
              }
            />
            <PaneRow
              label="Backup Disk"
              trailing={
                <Select
                  ariaLabel="Backup disk"
                  value={backupDisk}
                  onChange={setBackupDisk}
                  options={[
                    { value: "Macintosh HD", label: "Macintosh HD" },
                    { value: "Backup Drive", label: "Backup Drive" },
                    { value: "Network Disk", label: "Network Disk" },
                  ]}
                />
              }
            />
            <PaneRow
              label="Options..."
              onClick={() => setTimeMachineOptionsOpen(true)}
              trailing={rowChevron}
            />
          </SettingsCard>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => {
                setBackupNow(true)
                window.setTimeout(() => setBackupNow(false), 1800)
              }}
              className="w-full rounded-xl bg-black/[0.035] py-2 text-[12px] font-medium text-[#0a84ff] shadow-[0_0_0_0.5px_rgba(0,0,0,0.04)] transition-colors hover:bg-black/[0.06] dark:bg-white/[0.06] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.05)] dark:hover:bg-white/[0.09]"
            >
              Back Up Now
            </button>
          </div>
          <SettingsDialog
            open={timeMachineOptionsOpen}
            onOpenChange={setTimeMachineOptionsOpen}
            title="Time Machine Options"
            description="Configure backup frequency and exclusions."
            footer={
              <button
                type="button"
                className={dialogButton}
                onClick={() => setTimeMachineOptionsOpen(false)}
              >
                Done
              </button>
            }
          >
            <div className="space-y-2 rounded-lg bg-black/[0.04] p-2 dark:bg-white/[0.07]">
              <PaneRow
                label="Back up while on battery power"
                trailing={
                  <Switch
                    on={!excludeRemovable}
                    onToggle={() => setExcludeRemovable((value) => !value)}
                    label="Back up while on battery power"
                  />
                }
              />
              <PaneRow
                label="Notify after old backups are deleted"
                trailing={
                  <Switch
                    on={notifyOldBackups}
                    onToggle={() => setNotifyOldBackups((value) => !value)}
                    label="Notify after old backups are deleted"
                  />
                }
              />
            </div>
          </SettingsDialog>
        </>
      )
    }

    if (selected === "transfer") {
      return (
        <>
          <SettingsCard>
            <PaneRow
              label="Erase All Content and Settings..."
              description="Remove all data and settings from this Mac."
              onClick={() => setEraseStep("intro")}
              trailing={rowChevron}
            />
          </SettingsCard>
          <SettingsDialog
            open={eraseStep === "intro"}
            onOpenChange={(open) => setEraseStep(open ? "intro" : null)}
            title="Erase All Content and Settings"
            description="This will remove all user accounts, personal data, and settings from this Mac and return it to Setup Assistant. This action cannot be undone."
            footer={
              <>
                <button
                  type="button"
                  className={dialogButton}
                  onClick={() => setEraseStep(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-[#ff3b30] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#e6352b]"
                  onClick={() => setEraseStep("authenticate")}
                >
                  Continue
                </button>
              </>
            }
          />
          <SettingsDialog
            open={eraseStep === "authenticate"}
            onOpenChange={(open) => setEraseStep(open ? "authenticate" : null)}
            title="Authenticate"
            description="Enter your Mac login password to continue."
            footer={
              <>
                <button
                  type="button"
                  className={dialogButton}
                  onClick={() => setEraseStep("intro")}
                >
                  Back
                </button>
                <button
                  type="button"
                  className={dialogButton}
                  onClick={() => void authenticateErase()}
                >
                  Unlock
                </button>
              </>
            }
          >
            <div>
              <input
                autoFocus
                type="password"
                value={erasePassword}
                onChange={(event) => setErasePassword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void authenticateErase()
                }}
                aria-label="Mac login password"
                placeholder="Password"
                className="w-full rounded-lg bg-black/[0.06] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#0a84ff] dark:bg-white/10"
              />
              {eraseError && (
                <p role="alert" className="mt-2 text-[11px] text-red-500">
                  {eraseError}
                </p>
              )}
            </div>
          </SettingsDialog>
          <SettingsDialog
            open={eraseStep === "confirm"}
            onOpenChange={(open) => setEraseStep(open ? "confirm" : null)}
            title="Are you sure you want to erase this Mac?"
            description="All local simulation data will be removed. The Mac will restart into Setup Assistant."
            footer={
              <>
                <button
                  type="button"
                  className={dialogButton}
                  onClick={() => setEraseStep(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-[#ff3b30] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#e6352b]"
                  onClick={() => {
                    setEraseStep(null)
                    onErase()
                  }}
                >
                  Erase All Content & Settings
                </button>
              </>
            }
          />
        </>
      )
    }

    if (selected === "startup") {
      return (
        <SettingsCard>
          {["Macintosh HD", "Macintosh HD - Data", "Recovery"].map((disk) => (
            <PaneRow
              key={disk}
              label={disk}
              description={
                disk === startupDisk
                  ? "Selected startup disk"
                  : "Available startup volume"
              }
              onClick={() => setStartupDisk(disk)}
              trailing={
                disk === startupDisk ? (
                  <Check className="size-4 text-[#0a84ff]" strokeWidth={2.5} />
                ) : null
              }
            />
          ))}
          <div className="px-3.5 pb-3 text-right">
            <button
              type="button"
              className={dialogButton}
              onClick={() =>
                window.alert(
                  `Startup disk set to ${startupDisk}. Restart to use this disk.`
                )
              }
            >
              Restart...
            </button>
          </div>
        </SettingsCard>
      )
    }

    return null
  }

  if (selected && current) {
    return (
      <SubPage title={current.label} onBack={() => setSelected(null)}>
        {detail()}
      </SubPage>
    )
  }

  return (
    <div>
      {GENERAL_GROUPS.map((group, groupIndex) => (
        <div key={groupIndex} className={groupIndex > 0 ? "mt-3" : ""}>
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            {group.map((item) => (
              <PaneRow
                key={item.id}
                icon={
                  <IconTile bg={item.bg}>
                    <item.icon className="size-3.5" />
                  </IconTile>
                }
                label={item.label}
                description={item.value}
                onClick={() => setSelected(item.id)}
                trailing={rowChevron}
              />
            ))}
          </SettingsCard>
        </div>
      ))}
    </div>
  )
}

const ACCESSIBILITY_GROUPS = [
  {
    title: "Vision",
    items: [
      {
        id: "voiceover",
        label: "VoiceOver",
        icon: Eye,
        bg: "bg-gradient-to-b from-sky-400 to-blue-600",
        description: "VoiceOver describes aloud what appears on your screen.",
      },
      {
        id: "zoom",
        label: "Zoom",
        icon: ZoomIn,
        bg: BLUE,
        description: "Magnify the screen to see details more clearly.",
      },
      {
        id: "display",
        label: "Display",
        icon: Monitor,
        bg: "bg-gradient-to-b from-indigo-400 to-blue-600",
        description: "Adjust contrast, motion and transparency.",
      },
      {
        id: "spoken",
        label: "Spoken Content",
        icon: Volume2,
        bg: "bg-gradient-to-b from-pink-400 to-rose-500",
        description: "Hear selected text read aloud.",
      },
      {
        id: "descriptions",
        label: "Descriptions",
        icon: FileText,
        bg: GRAY,
        description: "Play audio descriptions for video content.",
      },
    ],
  },
  {
    title: "Hearing",
    items: [
      {
        id: "audio",
        label: "Audio",
        icon: AudioLines,
        bg: "bg-gradient-to-b from-orange-400 to-red-500",
        description: "Adjust audio balance and mono audio.",
      },
      {
        id: "captions",
        label: "Captions",
        icon: Captions,
        bg: BLUE,
        description: "Prefer closed captions and subtitles.",
      },
      {
        id: "rtt",
        label: "RTT",
        icon: Smartphone,
        bg: "bg-gradient-to-b from-green-400 to-green-600",
        description: "Use real-time text during calls.",
      },
    ],
  },
  {
    title: "Motor",
    items: [
      {
        id: "voicecontrol",
        label: "Voice Control",
        icon: Mic,
        bg: "bg-gradient-to-b from-purple-400 to-indigo-600",
        description: "Control your Mac with your voice.",
      },
      {
        id: "keyboard",
        label: "Keyboard",
        icon: Keyboard,
        bg: GRAY,
        description: "Make it easier to press keys.",
      },
      {
        id: "pointer",
        label: "Pointer Control",
        icon: Mouse,
        bg: BLUE,
        description: "Make the pointer larger and easier to use.",
      },
      {
        id: "switch",
        label: "Switch Control",
        icon: Workflow,
        bg: "bg-gradient-to-b from-teal-400 to-emerald-600",
        description: "Control your Mac with switches.",
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        id: "siri",
        label: "Siri",
        icon: Sparkles,
        bg: "bg-gradient-to-b from-pink-400 via-purple-400 to-blue-500",
        description: "Use Siri with accessibility features.",
      },
      {
        id: "shortcuts",
        label: "Shortcuts",
        icon: Command,
        bg: GRAY,
        description: "Run accessibility shortcuts.",
      },
    ],
  },
]

const ACCESSIBILITY_ITEMS = ACCESSIBILITY_GROUPS.flatMap((group) => group.items)

const ACCESSIBILITY_EXTRAS: Record<
  string,
  { label: string; description?: string }[]
> = {
  display: [
    {
      label: "Reduce Motion",
      description: "Minimise the motion of the user interface.",
    },
    {
      label: "Increase Contrast",
      description: "Make text and interface elements easier to see.",
    },
    {
      label: "Reduce Transparency",
      description: "Replace translucent areas with solid colours.",
    },
  ],
  zoom: [
    { label: "Use Scroll Gesture With Modifier Keys to Zoom" },
    {
      label: "Hover Text",
      description: "Show a larger version of text under the pointer.",
    },
  ],
  voiceover: [
    { label: "Speak Announcements" },
    {
      label: "Verbosity",
      description: "Change how much detail VoiceOver speaks.",
    },
  ],
  keyboard: [
    {
      label: "Sticky Keys",
      description: "Press one key at a time for key combinations.",
    },
    { label: "Slow Keys", description: "Require keys to be held down longer." },
  ],
  pointer: [{ label: "Increase Pointer Size" }],
}

function AccessibilityPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    voiceover: false,
    zoom: false,
    display: true,
    voicecontrol: false,
  })
  const [extras, setExtras] = useState<Record<string, boolean>>({
    "Reduce Motion": false,
    "Increase Contrast": false,
  })
  const [pointerSize, setPointerSize] = useState(1.2)
  const current = ACCESSIBILITY_ITEMS.find((item) => item.id === selected)
  const currentEnabled = selected ? Boolean(enabled[selected]) : false
  const extraItems = selected ? (ACCESSIBILITY_EXTRAS[selected] ?? []) : []

  if (selected && current) {
    return (
      <SubPage title={current.label} onBack={() => setSelected(null)}>
        <SettingsCard>
          <PaneRow
            icon={
              <IconTile bg={current.bg}>
                <current.icon className="size-3.5" />
              </IconTile>
            }
            label={current.label}
            description={current.description}
            trailing={
              <Switch
                on={currentEnabled}
                onToggle={() =>
                  setEnabled((value) => ({
                    ...value,
                    [selected]: !currentEnabled,
                  }))
                }
                label={current.label}
              />
            }
          />
        </SettingsCard>
        {extraItems.length > 0 && (
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            {extraItems.map((extra) => (
              <PaneRow
                key={extra.label}
                label={extra.label}
                description={extra.description}
                trailing={
                  extra.label === "Increase Pointer Size" ? (
                    <SettingsSlider
                      ariaLabel="Pointer Size"
                      value={pointerSize}
                      min={1}
                      max={3}
                      step={0.1}
                      onChange={setPointerSize}
                      className="w-32"
                    />
                  ) : (
                    <Switch
                      on={Boolean(extras[extra.label])}
                      onToggle={() =>
                        setExtras((value) => ({
                          ...value,
                          [extra.label]: !value[extra.label],
                        }))
                      }
                      label={extra.label}
                    />
                  )
                }
              />
            ))}
          </SettingsCard>
        )}
      </SubPage>
    )
  }

  return (
    <div>
      {ACCESSIBILITY_GROUPS.map((group, groupIndex) => (
        <div key={group.title}>
          <SettingsHeading>{group.title}</SettingsHeading>
          <SettingsCard
            className={`divide-y divide-black/[0.06] dark:divide-white/[0.07] ${groupIndex === ACCESSIBILITY_GROUPS.length - 1 ? "" : ""}`}
          >
            {group.items.map((item) => (
              <PaneRow
                key={item.id}
                icon={
                  <IconTile bg={item.bg}>
                    <item.icon className="size-3.5" />
                  </IconTile>
                }
                label={item.label}
                onClick={() => setSelected(item.id)}
                trailing={rowChevron}
              />
            ))}
          </SettingsCard>
        </div>
      ))}
    </div>
  )
}

const MENU_BAR_ITEMS = [
  { id: "battery", label: "Battery", icon: Battery },
  { id: "clock", label: "Clock", icon: Clock },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "bluetooth", label: "Bluetooth", icon: Bluetooth },
  { id: "controlcenter", label: "Control Center", icon: SlidersHorizontal },
  { id: "spotlight", label: "Spotlight", icon: Search },
  { id: "siri", label: "Siri", icon: Sparkles },
  { id: "sound", label: "Sound", icon: Volume2 },
  { id: "focus", label: "Focus", icon: Moon },
]

function MenuBarPage() {
  const [autoHide, setAutoHide] = useState("fullscreen")
  const [showBackground, setShowBackground] = useState(false)
  const [recentItems, setRecentItems] = useState(true)
  const [items, setItems] = useState(() =>
    Object.fromEntries(MENU_BAR_ITEMS.map((item) => [item.id, true]))
  )
  const visible = MENU_BAR_ITEMS.filter((item) => items[item.id])

  return (
    <div>
      <SettingsCard>
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between rounded-[7px] bg-gradient-to-b from-[#3a3a3c] to-[#242426] px-2.5 py-1 text-white shadow-inner">
            <div className="flex items-center gap-3 text-[10px] font-medium">
              <span className="font-semibold">Finder</span>
              <span className="text-white/80">File</span>
              <span className="text-white/80">Edit</span>
              <span className="text-white/80">View</span>
              <span className="text-white/80">Go</span>
              <span className="text-white/80">Window</span>
              <span className="text-white/80">Help</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              {visible.map((item) => (
                <item.icon key={item.id} className="size-3" />
              ))}
            </div>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-black/40 dark:text-white/40">
            Menu bar preview
          </p>
        </div>
      </SettingsCard>

      <SettingsHeading>Menu Bar</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Automatically hide and show the menu bar"
          trailing={
            <Select
              ariaLabel="Automatically hide and show the menu bar"
              value={autoHide}
              onChange={setAutoHide}
              options={[
                { value: "never", label: "Never" },
                { value: "desktop", label: "On Desktop Only" },
                { value: "fullscreen", label: "In Full Screen Only" },
                { value: "always", label: "Always" },
              ]}
            />
          }
        />
        <PaneRow
          label="Show menu bar background"
          description="Use a solid background behind menu bar items."
          trailing={
            <Switch
              on={showBackground}
              onToggle={() => setShowBackground(!showBackground)}
              label="Show menu bar background"
            />
          }
        />
        <PaneRow
          label="Recent documents, applications, and servers"
          description="Show recent items in the Apple menu."
          trailing={
            <Switch
              on={recentItems}
              onToggle={() => setRecentItems(!recentItems)}
              label="Recent documents, applications, and servers"
            />
          }
        />
      </SettingsCard>

      <SettingsHeading>Menu Bar Items</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {MENU_BAR_ITEMS.map((item) => (
          <PaneRow
            key={item.id}
            icon={
              <IconTile
                bg={
                  items[item.id]
                    ? "bg-gradient-to-b from-neutral-400 to-neutral-600"
                    : "bg-neutral-300 dark:bg-neutral-700"
                }
              >
                <item.icon className="size-3.5" />
              </IconTile>
            }
            label={item.label}
            trailing={
              <Checkbox
                checked={Boolean(items[item.id])}
                onChange={(next) =>
                  setItems((current) => ({ ...current, [item.id]: next }))
                }
                label={item.label}
              />
            }
          />
        ))}
      </SettingsCard>
    </div>
  )
}

function SiriPage() {
  const [siriOn, setSiriOn] = useStoredBool("tahoe-siri")
  const [intelligence, setIntelligence] = useStoredBool(
    "tahoe-apple-intelligence"
  )
  const [listen, setListen] = useState(true)
  const [language, setLanguage] = useState("en-us")
  const [voice, setVoice] = useState("voice1")
  const [responses, setResponses] = useState("automatic")
  const [keyboardShortcut, setKeyboardShortcut] = useState("command-space")
  const [chatgpt, setChatgpt] = useState(false)
  const [imagePlayground, setImagePlayground] = useState(true)
  const [deleteHistoryOpen, setDeleteHistoryOpen] = useState(false)
  const [historyDeleted, setHistoryDeleted] = useState(false)

  return (
    <div>
      <SettingsCard>
        <PaneRow
          icon={
            <IconTile
              bg="bg-gradient-to-b from-pink-400 via-purple-400 to-blue-500"
              size="size-8"
            >
              <Sparkles className="size-4" />
            </IconTile>
          }
          label="Apple Intelligence"
          description="Helpful features for writing, images and everyday tasks."
          trailing={
            <Switch
              on={intelligence}
              onToggle={() => setIntelligence(!intelligence)}
              label="Apple Intelligence"
            />
          }
        />
      </SettingsCard>

      <SettingsCard>
        <PaneRow
          icon={
            <IconTile
              bg="bg-gradient-to-b from-[#5ac8fa] via-[#5e5ce6] to-[#bf5af2]"
              size="size-8"
            >
              <Mic className="size-4" />
            </IconTile>
          }
          label="Siri"
          description="Ask Siri to find information and get things done."
          trailing={
            <Switch
              on={siriOn}
              onToggle={() => setSiriOn(!siriOn)}
              label="Siri"
            />
          }
        />
      </SettingsCard>

      {intelligence && (
        <>
          <SettingsHeading>Apple Intelligence</SettingsHeading>
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            <PaneRow
              label="ChatGPT"
              description="Use ChatGPT for more complex requests."
              trailing={
                <Switch
                  on={chatgpt}
                  onToggle={() => setChatgpt(!chatgpt)}
                  label="ChatGPT"
                />
              }
            />
            <PaneRow
              label="Image Playground"
              description="Create images in supported apps."
              trailing={
                <Switch
                  on={imagePlayground}
                  onToggle={() => setImagePlayground(!imagePlayground)}
                  label="Image Playground"
                />
              }
            />
          </SettingsCard>
        </>
      )}

      {siriOn && (
        <>
          <SettingsHeading>Ask Siri</SettingsHeading>
          <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            <PaneRow
              label="Listen for “Siri”"
              description="Say “Siri” to start a request."
              trailing={
                <Switch
                  on={listen}
                  onToggle={() => setListen(!listen)}
                  label="Listen for Siri"
                />
              }
            />
            <PaneRow
              label="Keyboard Shortcut"
              trailing={
                <Select
                  ariaLabel="Keyboard Shortcut"
                  value={keyboardShortcut}
                  onChange={setKeyboardShortcut}
                  options={[
                    { value: "command-space", label: "Press ⌘ Space" },
                    { value: "option-space", label: "Press ⌥ Space" },
                    { value: "off", label: "Off" },
                  ]}
                />
              }
            />
            <PaneRow
              label="Language"
              trailing={
                <Select
                  ariaLabel="Language"
                  value={language}
                  onChange={setLanguage}
                  options={[
                    { value: "en-us", label: "English (United States)" },
                    { value: "en-gb", label: "English (United Kingdom)" },
                    { value: "fr", label: "Français" },
                  ]}
                />
              }
            />
            <PaneRow
              label="Siri Voice"
              trailing={
                <Select
                  ariaLabel="Siri Voice"
                  value={voice}
                  onChange={setVoice}
                  options={[
                    { value: "voice1", label: "Voice 1" },
                    { value: "voice2", label: "Voice 2" },
                    { value: "voice3", label: "Voice 3" },
                    { value: "voice4", label: "Voice 4" },
                    { value: "voice5", label: "Voice 5" },
                  ]}
                />
              }
            />
            <PaneRow
              label="Siri Responses"
              trailing={
                <Select
                  ariaLabel="Siri Responses"
                  value={responses}
                  onChange={setResponses}
                  options={[
                    { value: "automatic", label: "Automatic" },
                    { value: "spoken", label: "Prefer Spoken Responses" },
                    { value: "subtitles", label: "Prefer Subtitles" },
                  ]}
                />
              }
            />
          </SettingsCard>

          <SettingsHeading>Siri History</SettingsHeading>
          <SettingsCard>
            <PaneRow
              label="Delete Siri & Dictation History..."
              description={
                historyDeleted
                  ? "History deletion requested."
                  : "Remove interactions stored on Apple servers."
              }
              onClick={() => setDeleteHistoryOpen(true)}
              trailing={rowChevron}
            />
          </SettingsCard>
          <SettingsDialog
            open={deleteHistoryOpen}
            onOpenChange={setDeleteHistoryOpen}
            title="Delete Siri & Dictation History"
            description="This removes Siri and dictation requests associated with this Mac from Apple servers."
            footer={
              <>
                <button
                  type="button"
                  className={dialogButton}
                  onClick={() => setDeleteHistoryOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-[#ff3b30] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#e6352b]"
                  onClick={() => {
                    setHistoryDeleted(true)
                    setDeleteHistoryOpen(false)
                  }}
                >
                  Delete History
                </button>
              </>
            }
          />

          <div className="mt-2">
            <a
              href="https://support.apple.com/guide/mac-help/use-siri-mchl4c1a4b4f/mac"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center rounded-xl bg-black/[0.035] py-2 text-[12px] font-medium text-[#0a84ff] shadow-[0_0_0_0.5px_rgba(0,0,0,0.04)] transition-colors hover:bg-black/[0.06] dark:bg-white/[0.06] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.05)] dark:hover:bg-white/[0.09]"
            >
              About Siri & Privacy...
            </a>
          </div>
        </>
      )}
    </div>
  )
}

function DesktopDockPage() {
  const [dockSize, setDockSize] = useState(52)
  const [magnification, setMagnification] = useState(true)
  const [magnificationSize, setMagnificationSize] = useState(72)
  const [position, setPosition] = useState("bottom")
  const [minimizeEffect, setMinimizeEffect] = useState("genie")
  const [minimizeIntoApp, setMinimizeIntoApp] = useState(false)
  const [autoHideDock, setAutoHideDock] = useState(false)
  const [recentApps, setRecentApps] = useState(true)
  const [indicators, setIndicators] = useState(true)
  const [showDesktop, setShowDesktop] = useState("always")
  const [clickWallpaper, setClickWallpaper] = useState("always")
  const [stageManager, setStageManager] = useState(false)
  const [widgets, setWidgets] = useState(true)
  const [widgetStyle, setWidgetStyle] = useState("automatic")
  const [iphoneWidgets, setIphoneWidgets] = useState(true)
  const [tabs, setTabs] = useState("always")
  const [askKeep, setAskKeep] = useState(true)
  const [closeQuit, setCloseQuit] = useState(false)
  const [tileEdges, setTileEdges] = useState(true)
  const [tileMenuBar, setTileMenuBar] = useState(true)
  const [rearrangeSpaces, setRearrangeSpaces] = useState(true)
  const [switchSpace, setSwitchSpace] = useState(false)
  const [groupWindows, setGroupWindows] = useState(false)
  const [separateSpaces, setSeparateSpaces] = useState(true)
  const [hotCornersOpen, setHotCornersOpen] = useState(false)
  const [hotCorners, setHotCorners] = useState([
    "mission-control",
    "desktop",
    "none",
    "quick-note",
  ])

  return (
    <div>
      <SettingsHeading>Dock</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Size"
          trailing={
            <SettingsSlider
              ariaLabel="Dock size"
              value={dockSize}
              onChange={setDockSize}
              min={20}
              max={80}
              className="w-40"
            />
          }
        />
        <PaneRow
          label="Magnification"
          trailing={
            <Switch
              on={magnification}
              onToggle={() => setMagnification(!magnification)}
              label="Magnification"
            />
          }
        />
        {magnification && (
          <PaneRow
            label="Magnified Size"
            trailing={
              <SettingsSlider
                ariaLabel="Magnified dock size"
                value={magnificationSize}
                onChange={setMagnificationSize}
                min={40}
                max={100}
                className="w-40"
              />
            }
          />
        )}
        <PaneRow
          label="Position on Screen"
          trailing={
            <Select
              ariaLabel="Position on screen"
              value={position}
              onChange={setPosition}
              options={[
                { value: "bottom", label: "Bottom" },
                { value: "left", label: "Left" },
                { value: "right", label: "Right" },
              ]}
            />
          }
        />
        <PaneRow
          label="Minimise Windows Using"
          trailing={
            <Select
              ariaLabel="Minimise windows using"
              value={minimizeEffect}
              onChange={setMinimizeEffect}
              options={[
                { value: "genie", label: "Genie Effect" },
                { value: "scale", label: "Scale Effect" },
              ]}
            />
          }
        />
        <PaneRow
          label="Minimise Windows into Application Icon"
          trailing={
            <Switch
              on={minimizeIntoApp}
              onToggle={() => setMinimizeIntoApp(!minimizeIntoApp)}
              label="Minimise windows into application icon"
            />
          }
        />
        <PaneRow
          label="Automatically Hide and Show the Dock"
          trailing={
            <Switch
              on={autoHideDock}
              onToggle={() => setAutoHideDock(!autoHideDock)}
              label="Automatically hide and show the Dock"
            />
          }
        />
        <PaneRow
          label="Show Recent Applications in Dock"
          trailing={
            <Switch
              on={recentApps}
              onToggle={() => setRecentApps(!recentApps)}
              label="Show recent applications in Dock"
            />
          }
        />
        <PaneRow
          label="Show Indicators for Open Applications"
          trailing={
            <Switch
              on={indicators}
              onToggle={() => setIndicators(!indicators)}
              label="Show indicators for open applications"
            />
          }
        />
      </SettingsCard>

      <SettingsHeading>Desktop & Stage Manager</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Show Items on Desktop"
          trailing={
            <Select
              ariaLabel="Show items on desktop"
              value={showDesktop}
              onChange={setShowDesktop}
              options={[
                { value: "always", label: "Always" },
                { value: "stage", label: "In Stage Manager" },
                { value: "finder", label: "Only in Finder" },
              ]}
            />
          }
        />
        <PaneRow
          label="Click Wallpaper to Reveal Desktop"
          trailing={
            <Select
              ariaLabel="Click wallpaper to reveal desktop"
              value={clickWallpaper}
              onChange={setClickWallpaper}
              options={[
                { value: "always", label: "Always" },
                { value: "stage", label: "Only in Stage Manager" },
              ]}
            />
          }
        />
        <PaneRow
          label="Stage Manager"
          description="Keep the current window in the centre and recent windows at the side."
          trailing={
            <Switch
              on={stageManager}
              onToggle={() => setStageManager(!stageManager)}
              label="Stage Manager"
            />
          }
        />
      </SettingsCard>

      <SettingsHeading>Widgets</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Show Widgets on Desktop"
          trailing={
            <Switch
              on={widgets}
              onToggle={() => setWidgets(!widgets)}
              label="Show widgets on desktop"
            />
          }
        />
        <PaneRow
          label="Widget Style"
          trailing={
            <Select
              ariaLabel="Widget style"
              value={widgetStyle}
              onChange={setWidgetStyle}
              options={[
                { value: "automatic", label: "Automatic" },
                { value: "monochrome", label: "Monochrome" },
                { value: "colour", label: "Colour" },
              ]}
            />
          }
        />
        <PaneRow
          label="Show iPhone Widgets"
          trailing={
            <Switch
              on={iphoneWidgets}
              onToggle={() => setIphoneWidgets(!iphoneWidgets)}
              label="Show iPhone widgets"
            />
          }
        />
      </SettingsCard>

      <SettingsHeading>Windows</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Prefer Tabs When Opening Documents"
          trailing={
            <Select
              ariaLabel="Prefer tabs when opening documents"
              value={tabs}
              onChange={setTabs}
              options={[
                { value: "always", label: "Always" },
                { value: "never", label: "Never" },
                { value: "fullscreen", label: "In Full Screen" },
              ]}
            />
          }
        />
        <PaneRow
          label="Ask to Keep Changes When Closing Documents"
          trailing={
            <Switch
              on={askKeep}
              onToggle={() => setAskKeep(!askKeep)}
              label="Ask to keep changes when closing documents"
            />
          }
        />
        <PaneRow
          label="Close Windows When Quitting an Application"
          trailing={
            <Switch
              on={closeQuit}
              onToggle={() => setCloseQuit(!closeQuit)}
              label="Close windows when quitting an application"
            />
          }
        />
        <PaneRow
          label="Drag Windows to Screen Edges to Tile"
          trailing={
            <Switch
              on={tileEdges}
              onToggle={() => setTileEdges(!tileEdges)}
              label="Drag windows to screen edges to tile"
            />
          }
        />
        <PaneRow
          label="Drag Windows to Menu Bar to Fill Screen"
          trailing={
            <Switch
              on={tileMenuBar}
              onToggle={() => setTileMenuBar(!tileMenuBar)}
              label="Drag windows to menu bar to fill screen"
            />
          }
        />
      </SettingsCard>

      <SettingsHeading>Mission Control</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Automatically Rearrange Spaces Based on Most Recent Use"
          trailing={
            <Switch
              on={rearrangeSpaces}
              onToggle={() => setRearrangeSpaces(!rearrangeSpaces)}
              label="Automatically rearrange Spaces"
            />
          }
        />
        <PaneRow
          label="When Switching to an Application, Switch to a Space with Open Windows"
          trailing={
            <Switch
              on={switchSpace}
              onToggle={() => setSwitchSpace(!switchSpace)}
              label="Switch to a Space with open windows"
            />
          }
        />
        <PaneRow
          label="Group Windows by Application"
          trailing={
            <Switch
              on={groupWindows}
              onToggle={() => setGroupWindows(!groupWindows)}
              label="Group windows by application"
            />
          }
        />
        <PaneRow
          label="Displays Have Separate Spaces"
          trailing={
            <Switch
              on={separateSpaces}
              onToggle={() => setSeparateSpaces(!separateSpaces)}
              label="Displays have separate Spaces"
            />
          }
        />
      </SettingsCard>

      <div className="mt-2">
        <button
          type="button"
          onClick={() => setHotCornersOpen(true)}
          className="w-full rounded-xl bg-black/[0.035] py-2 text-[12px] font-medium text-[#0a84ff] shadow-[0_0_0_0.5px_rgba(0,0,0,0.04)] transition-colors hover:bg-black/[0.06] dark:bg-white/[0.06] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.05)] dark:hover:bg-white/[0.09]"
        >
          Hot Corners...
        </button>
      </div>
      <SettingsDialog
        open={hotCornersOpen}
        onOpenChange={setHotCornersOpen}
        title="Hot Corners"
        description="Choose an action for each corner of the screen."
        footer={
          <button
            type="button"
            className={dialogButton}
            onClick={() => setHotCornersOpen(false)}
          >
            Done
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {["Top Left", "Top Right", "Bottom Left", "Bottom Right"].map(
            (corner, index) => (
              <label
                key={corner}
                className="space-y-1 text-[11px] text-black/60 dark:text-white/60"
              >
                {corner}
                <Select
                  ariaLabel={`${corner} hot corner`}
                  value={hotCorners[index]}
                  onChange={(value) =>
                    setHotCorners((current) =>
                      current.map((item, i) => (i === index ? value : item))
                    )
                  }
                  options={[
                    { value: "none", label: "—" },
                    { value: "mission-control", label: "Mission Control" },
                    { value: "desktop", label: "Desktop" },
                    {
                      value: "notification-center",
                      label: "Notification Centre",
                    },
                    { value: "quick-note", label: "Quick Note" },
                    { value: "screen-saver", label: "Start Screen Saver" },
                  ]}
                />
              </label>
            )
          )}
        </div>
      </SettingsDialog>
    </div>
  )
}

function DisplaysPage() {
  const [brightness, setBrightnessState] = useState(82)
  const [autoBrightness, setAutoBrightness] = useState(true)
  const [trueTone, setTrueTone] = useState(true)
  const [resolution, setResolution] = useState("default")
  const [refresh, setRefresh] = useState("promotion")
  const [colour, setColour] = useState("colourlcd")
  const [nightShiftOpen, setNightShiftOpen] = useState(false)
  const [nightShift, setNightShift] = useState(false)
  const [nightSchedule, setNightSchedule] = useState("sunset")
  const [nightWarmth, setNightWarmth] = useState(45)
  const [arrangeOpen, setArrangeOpen] = useState(false)
  const [displayPosition, setDisplayPosition] = useState("center")

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("tahoe-brightness")
      if (saved !== null) setBrightnessState(Number(saved))
    } catch {}
    const syncBrightness = (event: Event) => {
      const value = (event as CustomEvent<number>).detail
      if (Number.isFinite(value)) setBrightnessState(value)
    }
    window.addEventListener("tahoe-brightness-change", syncBrightness)
    return () =>
      window.removeEventListener("tahoe-brightness-change", syncBrightness)
  }, [])

  const setBrightness = (value: number) => {
    setBrightnessState(value)
    try {
      window.localStorage.setItem("tahoe-brightness", String(value))
      window.dispatchEvent(
        new CustomEvent("tahoe-brightness-change", { detail: value })
      )
    } catch {}
  }

  return (
    <div>
      <SettingsCard>
        <div className="flex items-center gap-3 px-3.5 py-3">
          <div className="relative shrink-0 pb-[6px]">
            <div
              className="h-[58px] w-[96px] rounded-[5px] border-[2px] border-black/70 bg-cover bg-center shadow-sm dark:border-white/60"
              style={{ backgroundImage: "url('/aerial/lake.jpg')" }}
            />
            <span className="absolute bottom-0 left-1/2 h-[6px] w-10 -translate-x-1/2 rounded-b-[3px] bg-black/60 dark:bg-white/60" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-black/85 dark:text-white/90">
              Built-in Retina Display
            </p>
            <p className="mt-0.5 text-[11px] text-black/50 dark:text-white/50">
              14-inch (3024 × 1964)
            </p>
            <p className="mt-0.5 text-[11px] text-black/50 dark:text-white/50">
              Main display
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsHeading>Display</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Brightness"
          trailing={
            <span className="flex items-center gap-2">
              <Sun className="size-3.5 text-black/45 dark:text-white/45" />
              <SettingsSlider
                ariaLabel="Brightness"
                value={brightness}
                onChange={setBrightness}
                className="w-36"
              />
            </span>
          }
        />
        <PaneRow
          label="Automatically Adjust Brightness"
          trailing={
            <Switch
              on={autoBrightness}
              onToggle={() => setAutoBrightness(!autoBrightness)}
              label="Automatically adjust brightness"
            />
          }
        />
        <PaneRow
          label="True Tone"
          description="Automatically adapt the display to ambient light."
          trailing={
            <Switch
              on={trueTone}
              onToggle={() => setTrueTone(!trueTone)}
              label="True Tone"
            />
          }
        />
        <PaneRow
          label="Night Shift..."
          description="Warm the colours of your display at night."
          onClick={() => setNightShiftOpen(true)}
          trailing={rowChevron}
        />
      </SettingsCard>

      <SettingsHeading>Resolution</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Resolution"
          trailing={
            <Select
              ariaLabel="Resolution"
              value={resolution}
              onChange={setResolution}
              options={[
                { value: "default", label: "Default for Display" },
                { value: "scaled", label: "Scaled" },
                { value: "more", label: "More Space" },
              ]}
            />
          }
        />
        <PaneRow
          label="Refresh Rate"
          trailing={
            <Select
              ariaLabel="Refresh rate"
              value={refresh}
              onChange={setRefresh}
              options={[
                { value: "promotion", label: "ProMotion" },
                { value: "60", label: "60 Hz" },
                { value: "48", label: "48 Hz" },
              ]}
            />
          }
        />
        <PaneRow
          label="Colour Profile"
          trailing={
            <Select
              ariaLabel="Colour profile"
              value={colour}
              onChange={setColour}
              options={[
                { value: "colourlcd", label: "Colour LCD" },
                { value: "srgb", label: "sRGB IEC61966-2.1" },
                { value: "p3", label: "Display P3" },
              ]}
            />
          }
        />
      </SettingsCard>

      <div className="mt-2">
        <button
          type="button"
          onClick={() => setArrangeOpen(true)}
          className="w-full rounded-xl bg-black/[0.035] py-2 text-[12px] font-medium text-[#0a84ff] shadow-[0_0_0_0.5px_rgba(0,0,0,0.04)] transition-colors hover:bg-black/[0.06] dark:bg-white/[0.06] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.05)] dark:hover:bg-white/[0.09]"
        >
          Arrange Displays...
        </button>
      </div>
      <SettingsDialog
        open={nightShiftOpen}
        onOpenChange={setNightShiftOpen}
        title="Night Shift"
        description="Shift your display to the warmer end of the colour spectrum after dark."
        footer={
          <button
            type="button"
            className={dialogButton}
            onClick={() => setNightShiftOpen(false)}
          >
            Done
          </button>
        }
      >
        <div className="space-y-3">
          <PaneRow
            label="Night Shift"
            trailing={
              <Switch
                on={nightShift}
                onToggle={() => setNightShift((value) => !value)}
                label="Night Shift"
              />
            }
          />
          <PaneRow
            label="Schedule"
            trailing={
              <Select
                ariaLabel="Night Shift schedule"
                value={nightSchedule}
                onChange={setNightSchedule}
                options={[
                  { value: "sunset", label: "Sunset to Sunrise" },
                  { value: "custom", label: "Custom" },
                  { value: "off", label: "Off" },
                ]}
              />
            }
          />
          {nightSchedule === "custom" && (
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <label>
                From{" "}
                <input
                  type="time"
                  defaultValue="22:00"
                  className="rounded bg-black/[0.06] p-1 dark:bg-white/10"
                />
              </label>
              <label>
                To{" "}
                <input
                  type="time"
                  defaultValue="07:00"
                  className="rounded bg-black/[0.06] p-1 dark:bg-white/10"
                />
              </label>
            </div>
          )}
          <div className="space-y-1 px-3.5">
            <div className="flex justify-between text-[11px]">
              <span>Colour Temperature</span>
              <span>{nightWarmth}%</span>
            </div>
            <SettingsSlider
              ariaLabel="Night Shift colour temperature"
              value={nightWarmth}
              onChange={setNightWarmth}
              min={0}
              max={100}
            />
          </div>
        </div>
      </SettingsDialog>
      <SettingsDialog
        open={arrangeOpen}
        onOpenChange={setArrangeOpen}
        title="Arrange Displays"
        description="Drag the displays to match their position on your desk, then choose the main display."
        footer={
          <button
            type="button"
            className={dialogButton}
            onClick={() => setArrangeOpen(false)}
          >
            Done
          </button>
        }
      >
        <div className="flex h-36 items-center justify-center gap-2 rounded-xl bg-black/[0.04] p-3 dark:bg-white/[0.06]">
          <button
            type="button"
            onClick={() => setDisplayPosition("left")}
            className={`flex h-20 w-24 items-center justify-center rounded-lg border-2 text-[11px] ${displayPosition === "left" ? "border-[#0a84ff] bg-[#0a84ff]/10" : "border-black/15 dark:border-white/20"}`}
          >
            External
          </button>
          <button
            type="button"
            onClick={() => setDisplayPosition("center")}
            className={`flex h-24 w-32 items-center justify-center rounded-lg border-2 text-[11px] ${displayPosition === "center" ? "border-[#0a84ff] bg-[#0a84ff]/10" : "border-black/15 dark:border-white/20"}`}
          >
            Built-in Retina
            <br />
            Main Display
          </button>
        </div>
      </SettingsDialog>
    </div>
  )
}

const SPOTLIGHT_RESULTS = [
  "Applications",
  "Calculator",
  "Contacts",
  "Conversion",
  "Definition",
  "Documents",
  "Events",
  "Files",
  "Folders",
  "Mail & Messages",
  "Music",
  "News",
  "Siri Suggestions",
  "System Settings",
  "Tips",
  "Web",
]

function SpotlightPage() {
  const [enabled, setEnabled] = useState(() =>
    Object.fromEntries(SPOTLIGHT_RESULTS.map((item) => [item, true]))
  )
  const [shortcut, setShortcut] = useState("command-space")
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [excludedLocations, setExcludedLocations] = useState(["~/Library"])
  const [locationDraft, setLocationDraft] = useState("")

  return (
    <div>
      <SettingsCard>
        <div className="flex items-center gap-3 px-3.5 py-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-gradient-to-b from-[#5ac8fa] to-[#0a7cff] text-white shadow-sm ring-1 ring-black/5">
            <Search className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] leading-4 font-semibold text-black/85 dark:text-white/90">
                Spotlight
              </p>
              <Select
                ariaLabel="Spotlight keyboard shortcut"
                value={shortcut}
                onChange={setShortcut}
                options={[
                  { value: "command-space", label: "⌘ Space" },
                  { value: "option-space", label: "⌥ Space" },
                  { value: "off", label: "Off" },
                ]}
              />
            </div>
            <p className="mt-0.5 text-[11px] leading-[14px] text-black/55 dark:text-white/55">
              Spotlight helps you quickly find things on your Mac.
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsHeading>Search Results</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {SPOTLIGHT_RESULTS.map((item) => (
          <PaneRow
            key={item}
            label={item}
            trailing={
              <Checkbox
                checked={Boolean(enabled[item])}
                onChange={(next) =>
                  setEnabled((current) => ({ ...current, [item]: next }))
                }
                label={item}
              />
            }
          />
        ))}
      </SettingsCard>

      <SettingsHeading>Search Privacy</SettingsHeading>
      <SettingsCard>
        <PaneRow
          label="Search Privacy..."
          description="Prevent Spotlight from searching specific folders."
          onClick={() => setPrivacyOpen(true)}
          trailing={rowChevron}
        />
      </SettingsCard>
      <SettingsDialog
        open={privacyOpen}
        onOpenChange={setPrivacyOpen}
        title="Search Privacy"
        description="Spotlight will not search the locations listed below."
        footer={
          <>
            <button
              type="button"
              className={dialogButton}
              onClick={() => setPrivacyOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={dialogButton}
              onClick={() => setPrivacyOpen(false)}
            >
              Done
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <div className="max-h-28 space-y-1 overflow-y-auto rounded-lg bg-black/[0.04] p-2 dark:bg-white/[0.07]">
            {excludedLocations.length === 0 && (
              <p className="text-[11px] text-black/45 dark:text-white/45">
                No locations excluded.
              </p>
            )}
            {excludedLocations.map((location) => (
              <div
                key={location}
                className="flex items-center justify-between text-[12px]"
              >
                <span>{location}</span>
                <button
                  type="button"
                  aria-label={`Remove ${location}`}
                  onClick={() =>
                    setExcludedLocations((items) =>
                      items.filter((item) => item !== location)
                    )
                  }
                  className="text-red-500"
                >
                  <Minus className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={locationDraft}
              onChange={(event) => setLocationDraft(event.target.value)}
              aria-label="Folder location"
              placeholder="Folder path"
              className="min-w-0 flex-1 rounded-lg bg-black/[0.06] px-3 py-1.5 text-[12px] outline-none dark:bg-white/10"
            />
            <button
              type="button"
              className={dialogButton}
              disabled={!locationDraft.trim()}
              onClick={() => {
                const path = locationDraft.trim()
                if (!excludedLocations.includes(path))
                  setExcludedLocations((items) => [...items, path])
                setLocationDraft("")
              }}
            >
              Add
            </button>
          </div>
        </div>
      </SettingsDialog>
    </div>
  )
}

const NOTIFICATION_APPS = [
  {
    name: "Messages",
    icon: "/icons/Messages.png",
    detail: "Banners, Sounds, Badges",
    initial: true,
  },
  {
    name: "Mail",
    icon: "/icons/Mail.png",
    detail: "Banners, Sounds, Badges",
    initial: true,
  },
  {
    name: "Calendar",
    icon: "/icons/Calendar.png",
    detail: "Banners, Sounds",
    initial: true,
  },
  {
    name: "Reminders",
    icon: "/icons/Reminders.png",
    detail: "Banners, Sounds",
    initial: true,
  },
  { name: "Music", icon: "/icons/Music.png", detail: "Banners", initial: true },
  {
    name: "Photos",
    icon: "/icons/Photos.png",
    detail: "Banners",
    initial: false,
  },
  {
    name: "FaceTime",
    icon: "/icons/FaceTime.png",
    detail: "Banners, Sounds",
    initial: true,
  },
]

function NotificationsPage() {
  const [previews, setPreviews] = useState("always")
  const [sleeping, setSleeping] = useState(true)
  const [locked, setLocked] = useState(true)
  const [mirroring, setMirroring] = useState(false)
  const [apps, setApps] = useState(() =>
    Object.fromEntries(NOTIFICATION_APPS.map((app) => [app.name, app.initial]))
  )
  const [siriSuggestions, setSiriSuggestions] = useState(true)
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [appDialogOpen, setAppDialogOpen] = useState(false)
  const [appSettings, setAppSettings] = useState<
    Record<
      string,
      { style: string; sounds: boolean; badges: boolean; previews: string }
    >
  >(() =>
    Object.fromEntries(
      NOTIFICATION_APPS.map((app) => [
        app.name,
        {
          style: "banners",
          sounds: app.detail.includes("Sounds"),
          badges: app.detail.includes("Badges"),
          previews: "default",
        },
      ])
    )
  )

  return (
    <div>
      <SettingsHeading>Notification Center</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Show Previews"
          description="Choose when notification previews are shown."
          trailing={
            <Select
              ariaLabel="Show previews"
              value={previews}
              onChange={setPreviews}
              options={[
                { value: "always", label: "Always" },
                { value: "unlocked", label: "When Unlocked" },
                { value: "never", label: "Never" },
              ]}
            />
          }
        />
        <PaneRow
          label="Allow Notifications When the Display Is Sleeping"
          trailing={
            <Switch
              on={sleeping}
              onToggle={() => setSleeping(!sleeping)}
              label="Allow notifications when the display is sleeping"
            />
          }
        />
        <PaneRow
          label="Allow Notifications When the Screen Is Locked"
          trailing={
            <Switch
              on={locked}
              onToggle={() => setLocked(!locked)}
              label="Allow notifications when the screen is locked"
            />
          }
        />
        <PaneRow
          label="Allow Notifications When Mirroring or Sharing the Display"
          trailing={
            <Switch
              on={mirroring}
              onToggle={() => setMirroring(!mirroring)}
              label="Allow notifications when mirroring or sharing the display"
            />
          }
        />
      </SettingsCard>

      <SettingsHeading>Application Notifications</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {NOTIFICATION_APPS.map((app) => (
          <PaneRow
            key={app.name}
            icon={
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={app.icon}
                alt=""
                draggable={false}
                className="size-[26px] rounded-[6px]"
              />
            }
            label={app.name}
            description={
              apps[app.name]
                ? `${appSettings[app.name].style === "none" ? "No Alerts" : appSettings[app.name].style === "alerts" ? "Alerts" : "Banners"}${appSettings[app.name].sounds ? ", Sounds" : ""}${appSettings[app.name].badges ? ", Badges" : ""}`
                : "Off"
            }
            trailing={
              <>
                <button
                  type="button"
                  className="text-[11px] text-[#0a84ff] hover:underline"
                  onClick={() => {
                    setSelectedApp(app.name)
                    setAppDialogOpen(true)
                  }}
                >
                  Options...
                </button>
                <Switch
                  on={Boolean(apps[app.name])}
                  onToggle={() =>
                    setApps((current) => ({
                      ...current,
                      [app.name]: !current[app.name],
                    }))
                  }
                  label={app.name}
                />
              </>
            }
          />
        ))}
      </SettingsCard>

      <SettingsHeading>Siri Suggestions</SettingsHeading>
      <SettingsCard>
        <PaneRow
          label="Show Siri Suggestions"
          description="Allow Siri to suggest shortcuts and actions in notifications."
          trailing={
            <Switch
              on={siriSuggestions}
              onToggle={() => setSiriSuggestions(!siriSuggestions)}
              label="Show Siri Suggestions"
            />
          }
        />
      </SettingsCard>
      <SettingsDialog
        open={appDialogOpen}
        onOpenChange={setAppDialogOpen}
        title={`${selectedApp ?? ""} Notifications`}
        description="Customize how notifications appear for this app."
        footer={
          <button
            type="button"
            className={dialogButton}
            onClick={() => setAppDialogOpen(false)}
          >
            Done
          </button>
        }
      >
        {selectedApp && (
          <div className="space-y-2">
            <PaneRow
              label="Allow Notifications"
              trailing={
                <Switch
                  on={Boolean(apps[selectedApp])}
                  onToggle={() =>
                    setApps((current) => ({
                      ...current,
                      [selectedApp]: !current[selectedApp],
                    }))
                  }
                  label={`Allow ${selectedApp} notifications`}
                />
              }
            />
            <PaneRow
              label="Alert Style"
              trailing={
                <Select
                  ariaLabel={`${selectedApp} alert style`}
                  value={appSettings[selectedApp].style}
                  onChange={(style) =>
                    setAppSettings((current) => ({
                      ...current,
                      [selectedApp]: { ...current[selectedApp], style },
                    }))
                  }
                  options={[
                    { value: "none", label: "None" },
                    { value: "banners", label: "Banners" },
                    { value: "alerts", label: "Alerts" },
                  ]}
                />
              }
            />
            <PaneRow
              label="Play sound for notification"
              trailing={
                <Switch
                  on={appSettings[selectedApp].sounds}
                  onToggle={() =>
                    setAppSettings((current) => ({
                      ...current,
                      [selectedApp]: {
                        ...current[selectedApp],
                        sounds: !current[selectedApp].sounds,
                      },
                    }))
                  }
                  label="Play sound for notification"
                />
              }
            />
            <PaneRow
              label="Badge app icon"
              trailing={
                <Switch
                  on={appSettings[selectedApp].badges}
                  onToggle={() =>
                    setAppSettings((current) => ({
                      ...current,
                      [selectedApp]: {
                        ...current[selectedApp],
                        badges: !current[selectedApp].badges,
                      },
                    }))
                  }
                  label="Badge app icon"
                />
              }
            />
            <PaneRow
              label="Show previews"
              trailing={
                <Select
                  ariaLabel={`${selectedApp} previews`}
                  value={appSettings[selectedApp].previews}
                  onChange={(previews) =>
                    setAppSettings((current) => ({
                      ...current,
                      [selectedApp]: { ...current[selectedApp], previews },
                    }))
                  }
                  options={[
                    { value: "default", label: "System Default" },
                    { value: "always", label: "Always" },
                    { value: "unlocked", label: "When Unlocked" },
                    { value: "never", label: "Never" },
                  ]}
                />
              }
            />
          </div>
        )}
      </SettingsDialog>
    </div>
  )
}

const OUTPUT_DEVICES = [
  {
    id: "speakers",
    name: "MacBook Pro Speakers",
    detail: "Built-in",
    icon: Speaker,
  },
  { id: "airpods", name: "AirPods Pro", detail: "Bluetooth", icon: Headphones },
  { id: "tv", name: "Living Room TV", detail: "AirPlay", icon: Tv },
]

const INPUT_DEVICES = [
  { id: "mic", name: "MacBook Pro Microphone", detail: "Built-in", icon: Mic },
  {
    id: "airpodsmic",
    name: "AirPods Pro",
    detail: "Bluetooth",
    icon: Headphones,
  },
]

function SoundPage() {
  const [output, setOutput] = useState("speakers")
  const [outputVolume, setOutputVolumeState] = useState(62)
  const [balance, setBalance] = useState(50)
  const [alertVolume, setAlertVolume] = useState(70)
  const [uiSounds, setUiSounds] = useState(true)
  const [volumeFeedback, setVolumeFeedback] = useState(true)
  const [soundEffectsDevice, setSoundEffectsDevice] = useState("selected")
  const [alertSound, setAlertSound] = useState("boop")
  const [previewing, setPreviewing] = useState(false)
  const [input, setInput] = useState("mic")
  const [inputVolume, setInputVolume] = useState(50)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("tahoe-cc-volume")
      if (saved !== null) setOutputVolumeState(Number(saved))
    } catch {}
    const syncVolume = (event: Event) => {
      const value = (event as CustomEvent<number>).detail
      if (Number.isFinite(value)) setOutputVolumeState(value)
    }
    window.addEventListener("tahoe-volume-change", syncVolume)
    return () => window.removeEventListener("tahoe-volume-change", syncVolume)
  }, [])

  const setOutputVolume = (value: number) => {
    setOutputVolumeState(value)
    try {
      window.localStorage.setItem("tahoe-cc-volume", String(value))
      window.dispatchEvent(
        new CustomEvent("tahoe-volume-change", { detail: value })
      )
    } catch {}
  }

  const playAlert = () => {
    const context = new window.AudioContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const frequencies: Record<string, number> = {
      boop: 520,
      breeze: 680,
      bubble: 740,
      crystal: 880,
      funk: 390,
      jump: 620,
      ping: 990,
    }
    oscillator.type = alertSound === "funk" ? "triangle" : "sine"
    oscillator.frequency.value = frequencies[alertSound] ?? 520
    gain.gain.value = Math.max(0.01, alertVolume / 100) * 0.12
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.onended = () => {
      void context.close()
      setPreviewing(false)
    }
    setPreviewing(true)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.22)
  }

  return (
    <div>
      <SettingsHeading>Output</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {OUTPUT_DEVICES.map((device) => (
          <PaneRow
            key={device.id}
            icon={
              <IconTile bg="bg-gradient-to-b from-neutral-400 to-neutral-600">
                <device.icon className="size-3.5" />
              </IconTile>
            }
            label={device.name}
            description={device.detail}
            onClick={() => setOutput(device.id)}
            trailing={
              output === device.id ? (
                <Check className="size-4 text-[#0a84ff]" strokeWidth={2.5} />
              ) : null
            }
          />
        ))}
      </SettingsCard>

      <SettingsCard>
        <div className="px-3.5 py-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-black/85 dark:text-white/90">
              Output Volume
            </p>
            <span className="text-[11px] text-black/45 dark:text-white/45">
              {outputVolume}%
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <VolumeX className="size-3.5 shrink-0 text-black/45 dark:text-white/45" />
            <SettingsSlider
              ariaLabel="Output volume"
              value={outputVolume}
              onChange={setOutputVolume}
              className="flex-1"
            />
            <Volume2 className="size-3.5 shrink-0 text-black/45 dark:text-white/45" />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard>
        <div className="px-3.5 py-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-black/85 dark:text-white/90">
              Balance
            </p>
            <span className="text-[11px] text-black/45 dark:text-white/45">
              {balance === 50 ? "Centre" : balance < 50 ? "Left" : "Right"}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] font-medium text-black/45 dark:text-white/45">
              L
            </span>
            <SettingsSlider
              ariaLabel="Balance"
              value={balance}
              onChange={setBalance}
              className="flex-1"
            />
            <span className="text-[10px] font-medium text-black/45 dark:text-white/45">
              R
            </span>
          </div>
        </div>
      </SettingsCard>

      <SettingsHeading>Sound Effects</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Play Sound Effects Through"
          trailing={
            <Select
              ariaLabel="Play sound effects through"
              value={soundEffectsDevice}
              onChange={setSoundEffectsDevice}
              options={[
                { value: "selected", label: "Selected Sound Output Device" },
                { value: "speakers", label: "MacBook Pro Speakers" },
                { value: "airpods", label: "AirPods Pro" },
              ]}
            />
          }
        />
        <PaneRow
          label="Alert Sound"
          trailing={
            <span className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Play alert sound"
                disabled={previewing}
                onClick={playAlert}
                className="flex size-6 items-center justify-center rounded-full bg-black/[0.06] text-black/60 transition-colors hover:bg-black/10 disabled:opacity-40 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15"
              >
                <Play className="size-3" />
              </button>
              <Select
                ariaLabel="Alert sound"
                value={alertSound}
                onChange={setAlertSound}
                options={[
                  { value: "boop", label: "Boop" },
                  { value: "breeze", label: "Breeze" },
                  { value: "bubble", label: "Bubble" },
                  { value: "crystal", label: "Crystal" },
                  { value: "funk", label: "Funk" },
                  { value: "jump", label: "Jump" },
                  { value: "ping", label: "Ping" },
                ]}
              />
            </span>
          }
        />
        <PaneRow
          label="Alert Volume"
          trailing={
            <SettingsSlider
              ariaLabel="Alert volume"
              value={alertVolume}
              onChange={setAlertVolume}
              className="w-40"
            />
          }
        />
        <PaneRow
          label="Play User Interface Sound Effects"
          trailing={
            <Switch
              on={uiSounds}
              onToggle={() => setUiSounds(!uiSounds)}
              label="Play user interface sound effects"
            />
          }
        />
        <PaneRow
          label="Play Feedback When Volume Is Changed"
          trailing={
            <Switch
              on={volumeFeedback}
              onToggle={() => setVolumeFeedback(!volumeFeedback)}
              label="Play feedback when volume is changed"
            />
          }
        />
      </SettingsCard>

      <SettingsHeading>Input</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {INPUT_DEVICES.map((device) => (
          <PaneRow
            key={device.id}
            icon={
              <IconTile bg="bg-gradient-to-b from-neutral-400 to-neutral-600">
                <device.icon className="size-3.5" />
              </IconTile>
            }
            label={device.name}
            description={device.detail}
            onClick={() => setInput(device.id)}
            trailing={
              input === device.id ? (
                <Check className="size-4 text-[#0a84ff]" strokeWidth={2.5} />
              ) : null
            }
          />
        ))}
      </SettingsCard>

      <SettingsCard>
        <div className="px-3.5 py-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-black/85 dark:text-white/90">
              Input Volume
            </p>
            <span className="text-[11px] text-black/45 dark:text-white/45">
              {inputVolume}%
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <Mic className="size-3.5 shrink-0 text-black/45 dark:text-white/45" />
            <SettingsSlider
              ariaLabel="Input volume"
              value={inputVolume}
              onChange={setInputVolume}
              className="flex-1"
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}

const FOCUS_MODES = [
  {
    id: "dnd",
    name: "Do Not Disturb",
    description: "Silence notifications and calls.",
    icon: Moon,
    bg: "bg-gradient-to-b from-indigo-400 to-indigo-600",
  },
  {
    id: "personal",
    name: "Personal",
    description: "Silence notifications from people you choose.",
    icon: User,
    bg: "bg-gradient-to-b from-purple-400 to-purple-600",
  },
  {
    id: "sleep",
    name: "Sleep",
    description: "Reduce interruptions while you sleep.",
    icon: BedDouble,
    bg: "bg-gradient-to-b from-blue-400 to-indigo-600",
  },
  {
    id: "work",
    name: "Work",
    description: "Focus on work and silence interruptions.",
    icon: Briefcase,
    bg: "bg-gradient-to-b from-teal-400 to-emerald-600",
  },
  {
    id: "driving",
    name: "Driving",
    description: "Silence notifications while driving.",
    icon: CarFront,
    bg: "bg-gradient-to-b from-sky-400 to-blue-600",
  },
  {
    id: "reduce",
    name: "Reduce Interruptions",
    description: "Only allow important notifications.",
    icon: BellOff,
    bg: "bg-gradient-to-b from-violet-400 to-purple-600",
  },
]

function FocusPage() {
  const [active, setActive] = useState<string | null>(null)
  const [share, setShare] = useState(true)
  const [focusStatus, setFocusStatus] = useState(true)
  const [autoMac, setAutoMac] = useState(false)
  const [autoLocation, setAutoLocation] = useState(false)
  const [autoDriving, setAutoDriving] = useState(true)
  const [filters, setFilters] = useState<string[]>([])
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState("calendar")
  const activeMode = FOCUS_MODES.find((mode) => mode.id === active)

  useEffect(() => {
    try {
      if (window.localStorage.getItem("tahoe-cc-focus") === "1")
        setActive("dnd")
    } catch {}
  }, [])

  const applyActive = (next: string | null) => {
    setActive(next)
    try {
      window.localStorage.setItem("tahoe-cc-focus", next ? "1" : "0")
    } catch {}
  }

  return (
    <div>
      <SettingsCard>
        <div className="flex items-center gap-3 px-3.5 py-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-gradient-to-b from-indigo-400 to-purple-600 text-white shadow-sm ring-1 ring-black/5">
            <Moon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-4 font-semibold text-black/85 dark:text-white/90">
              Focus
            </p>
            <p className="mt-0.5 text-[11px] leading-[14px] text-black/55 dark:text-white/55">
              {activeMode
                ? `${activeMode.name} is on until turned off.`
                : "Focus silences notifications while you concentrate."}
            </p>
          </div>
          {activeMode && (
            <button
              type="button"
              onClick={() => applyActive(null)}
              className="rounded-[6px] bg-black/[0.06] px-2 py-[3px] text-[12px] font-medium text-[#0a84ff] transition-colors hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
            >
              Turn Off
            </button>
          )}
        </div>
      </SettingsCard>

      <SettingsHeading>Focus Modes</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {FOCUS_MODES.map((mode) => (
          <PaneRow
            key={mode.id}
            icon={
              <IconTile bg={mode.bg}>
                <mode.icon className="size-3.5" />
              </IconTile>
            }
            label={mode.name}
            description={mode.description}
            trailing={
              <Switch
                on={active === mode.id}
                onToggle={() =>
                  applyActive(active === mode.id ? null : mode.id)
                }
                label={mode.name}
              />
            }
          />
        ))}
      </SettingsCard>

      <SettingsHeading>Share Across Devices</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Share Across Devices"
          description="Use this Focus on all your Apple devices."
          trailing={
            <Switch
              on={share}
              onToggle={() => setShare(!share)}
              label="Share across devices"
            />
          }
        />
        <PaneRow
          label="Focus Status"
          description="Let apps show that you have notifications silenced."
          trailing={
            <Switch
              on={focusStatus}
              onToggle={() => setFocusStatus(!focusStatus)}
              label="Focus status"
            />
          }
        />
      </SettingsCard>

      <SettingsHeading>Turn On Automatically</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="While Using This Mac"
          description="Turn on Focus when you start using this Mac."
          trailing={
            <Switch
              on={autoMac}
              onToggle={() => setAutoMac(!autoMac)}
              label="While using this Mac"
            />
          }
        />
        <PaneRow
          label="While at a Location"
          description="Turn on Focus when you arrive at a location."
          trailing={
            <Switch
              on={autoLocation}
              onToggle={() => setAutoLocation(!autoLocation)}
              label="While at a location"
            />
          }
        />
        <PaneRow
          label="While Driving"
          description="Turn on Focus when you connect to CarPlay."
          trailing={
            <Switch
              on={autoDriving}
              onToggle={() => setAutoDriving(!autoDriving)}
              label="While driving"
            />
          }
        />
      </SettingsCard>

      <SettingsHeading>Focus Filters</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {filters.map((filter) => (
          <PaneRow
            key={filter}
            label={filter}
            description="Enabled for the selected Focus."
            trailing={
              <button
                type="button"
                aria-label={`Remove ${filter}`}
                onClick={() =>
                  setFilters((items) => items.filter((item) => item !== filter))
                }
                className="text-black/40 hover:text-red-500 dark:text-white/40"
              >
                <Minus className="size-3.5" />
              </button>
            }
          />
        ))}
        <PaneRow
          label="Add Filter..."
          description="Filter app content and system settings while this Focus is on."
          onClick={() => setFilterDialogOpen(true)}
          trailing={
            <Plus className="size-3.5 text-black/35 dark:text-white/35" />
          }
        />
      </SettingsCard>
      <SettingsDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        title="Add Focus Filter"
        description="Choose an app or system setting to customize while Focus is active."
        footer={
          <>
            <button
              type="button"
              className={dialogButton}
              onClick={() => setFilterDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={dialogButton}
              onClick={() => {
                const name =
                  filterType === "calendar"
                    ? "Calendar"
                    : filterType === "mail"
                      ? "Mail"
                      : filterType === "messages"
                        ? "Messages"
                        : "Appearance"
                if (!filters.includes(name))
                  setFilters((items) => [...items, name])
                setFilterDialogOpen(false)
              }}
            >
              Add Filter
            </button>
          </>
        }
      >
        <Select
          ariaLabel="Focus filter"
          value={filterType}
          onChange={setFilterType}
          options={[
            { value: "calendar", label: "Calendar" },
            { value: "mail", label: "Mail" },
            { value: "messages", label: "Messages" },
            { value: "appearance", label: "Appearance" },
          ]}
        />
      </SettingsDialog>
    </div>
  )
}

const WEEK_USAGE = [
  { day: "Mon", minutes: 238 },
  { day: "Tue", minutes: 304 },
  { day: "Wed", minutes: 266 },
  { day: "Thu", minutes: 322 },
  { day: "Fri", minutes: 288 },
  { day: "Sat", minutes: 252 },
  { day: "Sun", minutes: 222 },
]

const APP_USAGE = [
  {
    name: "Safari",
    icon: "/icons/Safari.png",
    minutes: 72,
    colour: "bg-[#0a84ff]",
  },
  {
    name: "Music",
    icon: "/icons/Music.png",
    minutes: 48,
    colour: "bg-[#fc3c44]",
  },
  {
    name: "Messages",
    icon: "/icons/Messages.png",
    minutes: 32,
    colour: "bg-[#34c759]",
  },
  {
    name: "Finder",
    icon: "/icons/Finder.png",
    minutes: 28,
    colour: "bg-[#5e9bff]",
  },
  {
    name: "System Settings",
    icon: "/icons/System Settings.png",
    minutes: 15,
    colour: "bg-[#8e8e93]",
  },
]

function ScreenTimePage() {
  const [downtime, setDowntime] = useState(false)
  const [screenDistance, setScreenDistance] = useState(false)
  const [activity, setActivity] = useState(true)
  const [limit, setLimit] = useState("off")
  const [detailPage, setDetailPage] = useState<string | null>(null)
  const [communication, setCommunication] = useState("contacts")
  const [allowedApps, setAllowedApps] = useState<Record<string, boolean>>({
    Phone: true,
    Messages: true,
    FaceTime: false,
    Maps: false,
  })
  const [webContent, setWebContent] = useState("limit")
  const [storeRestrictions, setStoreRestrictions] = useState(false)
  const [allowInstalls, setAllowInstalls] = useState(true)
  const [blockAtLimit, setBlockAtLimit] = useState(true)
  const [passcodeOpen, setPasscodeOpen] = useState(false)
  const [newPasscode, setNewPasscode] = useState("")
  const [passcodeSet, setPasscodeSet] = useState(false)
  const maxUsage = Math.max(...WEEK_USAGE.map((entry) => entry.minutes))
  const maxApp = Math.max(...APP_USAGE.map((entry) => entry.minutes))

  return (
    <div>
      <SettingsCard>
        <div className="px-3.5 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-black/45 dark:text-white/45">
                Screen Time
              </p>
              <p className="mt-0.5 text-[28px] leading-8 font-bold tracking-tight text-black/85 dark:text-white/90">
                3h 42m
              </p>
              <p className="text-[11px] text-black/45 dark:text-white/45">
                Today
              </p>
            </div>
            <span className="rounded-full bg-[#0a84ff]/10 px-2 py-1 text-[10px] font-semibold text-[#0a84ff]">
              -12% from last week
            </span>
          </div>
          <div className="mt-3 flex h-20 items-end gap-1.5">
            {WEEK_USAGE.map((entry, index) => (
              <div
                key={entry.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
              >
                <span
                  className={`w-full rounded-t-[3px] ${index === WEEK_USAGE.length - 1 ? "bg-[#0a84ff]" : "bg-[#0a84ff]/25 dark:bg-[#0a84ff]/35"}`}
                  style={{ height: `${(entry.minutes / maxUsage) * 100}%` }}
                />
                <span className="text-[9px] text-black/40 dark:text-white/40">
                  {entry.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SettingsCard>

      <SettingsHeading>App & Website Activity</SettingsHeading>
      <SettingsCard>
        <PaneRow
          label="App & Website Activity"
          description="Track how you spend time on your Mac."
          trailing={
            <Switch
              on={activity}
              onToggle={() => setActivity(!activity)}
              label="App & Website Activity"
            />
          }
        />
        {activity && (
          <div className="px-3.5 pb-3">
            <div className="space-y-2">
              {APP_USAGE.map((app) => (
                <div key={app.name} className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={app.icon}
                    alt=""
                    draggable={false}
                    className="size-5 rounded-[5px]"
                  />
                  <span className="w-24 shrink-0 truncate text-[11px] text-black/70 dark:text-white/70">
                    {app.name}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10">
                    <span
                      className={`block h-full rounded-full ${app.colour}`}
                      style={{ width: `${(app.minutes / maxApp) * 100}%` }}
                    />
                  </span>
                  <span className="w-9 shrink-0 text-right text-[10px] text-black/40 dark:text-white/40">
                    {app.minutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </SettingsCard>

      <SettingsHeading>Limits</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Downtime"
          description={
            downtime
              ? "Every day · 10:00 PM – 7:00 AM"
              : "Schedule time away from the screen."
          }
          trailing={
            <Switch
              on={downtime}
              onToggle={() => setDowntime(!downtime)}
              label="Downtime"
            />
          }
        />
        <PaneRow
          label="App Limits"
          description={limit === "off" ? "No limits set." : "1 limit set."}
          onClick={() => setDetailPage("limits")}
          trailing={rowChevron}
        />
        <PaneRow
          label="Screen Distance"
          description="Encourage viewing the screen from a healthy distance."
          trailing={
            <Switch
              on={screenDistance}
              onToggle={() => setScreenDistance(!screenDistance)}
              label="Screen Distance"
            />
          }
        />
      </SettingsCard>

      <SettingsHeading>Content & Privacy</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Communication Limits"
          description={
            communication === "contacts"
              ? "Contacts Only"
              : communication === "known"
                ? "Contacts & Groups"
                : "Everyone"
          }
          onClick={() => setDetailPage("communication")}
          trailing={rowChevron}
        />
        <PaneRow
          label="Always Allowed"
          description={Object.entries(allowedApps)
            .filter(([, allowed]) => allowed)
            .map(([name]) => name)
            .join(", ")}
          onClick={() => setDetailPage("allowed")}
          trailing={rowChevron}
        />
        <PaneRow
          label="Content & Privacy"
          description={
            webContent === "limit" ? "Limited Adult Websites" : "Unrestricted"
          }
          onClick={() => setDetailPage("privacy")}
          trailing={rowChevron}
        />
      </SettingsCard>

      <div className="mt-2">
        <button
          type="button"
          onClick={() => setPasscodeOpen(true)}
          className="w-full rounded-xl bg-black/[0.035] py-2 text-[12px] font-medium text-[#0a84ff] shadow-[0_0_0_0.5px_rgba(0,0,0,0.04)] transition-colors hover:bg-black/[0.06] dark:bg-white/[0.06] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.05)] dark:hover:bg-white/[0.09]"
        >
          {passcodeSet
            ? "Change Screen Time Passcode..."
            : "Set Up Screen Time Passcode..."}
        </button>
      </div>
      <SettingsDialog
        open={detailPage !== null}
        onOpenChange={(open) => {
          if (!open) setDetailPage(null)
        }}
        title={
          detailPage === "limits"
            ? "App Limits"
            : detailPage === "communication"
              ? "Communication Limits"
              : detailPage === "allowed"
                ? "Always Allowed"
                : "Content & Privacy"
        }
        description={
          detailPage === "limits"
            ? "Set a daily time limit for apps or categories."
            : "Choose the restrictions used by Screen Time."
        }
        footer={
          <button
            type="button"
            className={dialogButton}
            onClick={() => setDetailPage(null)}
          >
            Done
          </button>
        }
      >
        {detailPage === "limits" && (
          <div className="space-y-2">
            <PaneRow
              label="Limit"
              trailing={
                <Select
                  ariaLabel="App limit"
                  value={limit}
                  onChange={setLimit}
                  options={[
                    { value: "off", label: "Off" },
                    { value: "social", label: "Social · 30 min" },
                    { value: "games", label: "Games · 1 hour" },
                  ]}
                />
              }
            />
            {limit !== "off" && (
              <PaneRow
                label="Block at end of limit"
                trailing={
                  <Switch
                    on={blockAtLimit}
                    onToggle={() => setBlockAtLimit((value) => !value)}
                    label="Block at end of limit"
                  />
                }
              />
            )}
          </div>
        )}
        {detailPage === "communication" && (
          <PaneRow
            label="During Screen Time"
            trailing={
              <Select
                ariaLabel="Communication limit"
                value={communication}
                onChange={setCommunication}
                options={[
                  { value: "everyone", label: "Everyone" },
                  { value: "contacts", label: "Contacts Only" },
                  { value: "known", label: "Contacts & Groups" },
                ]}
              />
            }
          />
        )}
        {detailPage === "allowed" &&
          Object.entries(allowedApps).map(([name, allowed]) => (
            <PaneRow
              key={name}
              label={name}
              trailing={
                <Switch
                  on={allowed}
                  onToggle={() =>
                    setAllowedApps((apps) => ({ ...apps, [name]: !apps[name] }))
                  }
                  label={name}
                />
              }
            />
          ))}
        {detailPage === "privacy" && (
          <div className="space-y-2">
            <PaneRow
              label="Content & Privacy Restrictions"
              trailing={
                <Switch
                  on={storeRestrictions}
                  onToggle={() => setStoreRestrictions((value) => !value)}
                  label="Content & Privacy Restrictions"
                />
              }
            />
            <PaneRow
              label="Web Content"
              trailing={
                <Select
                  ariaLabel="Web content restrictions"
                  value={webContent}
                  onChange={setWebContent}
                  options={[
                    { value: "unrestricted", label: "Unrestricted" },
                    { value: "limit", label: "Limit Adult Websites" },
                    { value: "allowed", label: "Allowed Websites Only" },
                  ]}
                />
              }
            />
            <PaneRow
              label="Allow app installs and purchases"
              trailing={
                <Switch
                  on={allowInstalls}
                  onToggle={() => setAllowInstalls((value) => !value)}
                  label="Allow app installs and purchases"
                />
              }
            />
          </div>
        )}
      </SettingsDialog>
      <SettingsDialog
        open={passcodeOpen}
        onOpenChange={setPasscodeOpen}
        title={
          passcodeSet
            ? "Change Screen Time Passcode"
            : "Set Screen Time Passcode"
        }
        description="Enter a four-digit passcode to protect Screen Time settings."
        footer={
          <>
            <button
              type="button"
              className={dialogButton}
              onClick={() => setPasscodeOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!/^\d{4}$/.test(newPasscode)}
              className={dialogButton}
              onClick={() => {
                setPasscodeSet(true)
                setNewPasscode("")
                setPasscodeOpen(false)
              }}
            >
              Set Passcode
            </button>
          </>
        }
      >
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={newPasscode}
          onChange={(event) =>
            setNewPasscode(event.target.value.replace(/\D/g, "").slice(0, 4))
          }
          aria-label="Four digit Screen Time passcode"
          placeholder="4-digit passcode"
          className="w-full rounded-lg bg-black/[0.06] px-3 py-2 text-center tracking-[0.5em] outline-none dark:bg-white/10"
        />
      </SettingsDialog>
    </div>
  )
}

const PRIVACY_PERMISSIONS = [
  "Location Services",
  "Contacts",
  "Calendars",
  "Photos",
  "Microphone",
  "Camera",
  "Accessibility",
]

function ControlCenterSettingsPage() {
  const [shown, setShown] = useState<Record<string, boolean>>({
    "Wi-Fi": true,
    Bluetooth: true,
    AirDrop: true,
    Focus: true,
    Sound: true,
    Display: true,
    "Screen Mirroring": true,
    "Stage Manager": false,
  })
  const [menuBar, setMenuBar] = useState<Record<string, boolean>>({
    "Wi-Fi": true,
    Bluetooth: true,
    Sound: true,
    Focus: true,
    Battery: true,
  })
  const [showControlCenter, setShowControlCenter] = useState(true)

  return (
    <div>
      <SettingsCard>
        <PaneRow
          label="Show Control Center in the menu bar"
          description="Access your controls from the menu bar."
          trailing={
            <Switch
              on={showControlCenter}
              onToggle={() => setShowControlCenter((value) => !value)}
              label="Show Control Center in the menu bar"
            />
          }
        />
      </SettingsCard>
      <SettingsHeading>Included Controls</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {Object.entries(shown).map(([name, value]) => (
          <PaneRow
            key={name}
            label={name}
            trailing={
              <Checkbox
                checked={value}
                onChange={(next) =>
                  setShown((items) => ({ ...items, [name]: next }))
                }
                label={`Show ${name} in Control Center`}
              />
            }
          />
        ))}
      </SettingsCard>
      <SettingsHeading>Menu Bar Only</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {Object.entries(menuBar).map(([name, value]) => (
          <PaneRow
            key={name}
            label={name}
            trailing={
              <Select
                ariaLabel={`${name} menu bar setting`}
                value={value ? "show" : "hide"}
                onChange={(next) =>
                  setMenuBar((items) => ({ ...items, [name]: next === "show" }))
                }
                options={[
                  { value: "show", label: "Show in Menu Bar" },
                  { value: "hide", label: "Don't Show" },
                ]}
              />
            }
          />
        ))}
      </SettingsCard>
    </div>
  )
}

function PrivacySecurityPage() {
  const [permissions, setPermissions] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      PRIVACY_PERMISSIONS.map((permission) => [
        permission,
        permission === "Location Services",
      ])
    )
  )
  const [fileVault, setFileVault] = useState(true)
  const [firewall, setFirewall] = useStoredBool("tahoe-firewall", true)
  const [analytics, setAnalytics] = useState(false)
  const [appDownloads, setAppDownloads] = useState("appstore")

  return (
    <div>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="FileVault"
          description={
            fileVault
              ? "Encryption is turned on for this Mac."
              : "Encryption is turned off."
          }
          trailing={
            <Switch
              on={fileVault}
              onToggle={() => setFileVault((value) => !value)}
              label="FileVault"
            />
          }
        />
        <PaneRow
          label="Firewall"
          description={firewall ? "Firewall is on." : "Firewall is off."}
          trailing={
            <Switch
              on={firewall}
              onToggle={() => setFirewall(!firewall)}
              label="Firewall"
            />
          }
        />
        <PaneRow
          label="Allow applications downloaded from"
          trailing={
            <Select
              ariaLabel="Allowed app downloads"
              value={appDownloads}
              onChange={setAppDownloads}
              options={[
                { value: "appstore", label: "App Store" },
                {
                  value: "identified",
                  label: "App Store and identified developers",
                },
              ]}
            />
          }
        />
        <PaneRow
          label="Share Mac Analytics"
          description="Help Apple improve its products and services."
          trailing={
            <Switch
              on={analytics}
              onToggle={() => setAnalytics((value) => !value)}
              label="Share Mac Analytics"
            />
          }
        />
      </SettingsCard>
      <SettingsHeading>Privacy</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {PRIVACY_PERMISSIONS.map((permission) => (
          <PaneRow
            key={permission}
            label={permission}
            description="Manage which apps can access this data."
            trailing={
              <Switch
                on={Boolean(permissions[permission])}
                onToggle={() =>
                  setPermissions((items) => ({
                    ...items,
                    [permission]: !items[permission],
                  }))
                }
                label={permission}
              />
            }
          />
        ))}
      </SettingsCard>
    </div>
  )
}

type LocalUser = { id: string; name: string; role: string }

function UsersGroupsPage() {
  const [users, setUsers] = useState<LocalUser[]>([
    { id: "owner", name: "tahoe", role: "Administrator" },
    { id: "guest", name: "Guest User", role: "Guest" },
  ])
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState("")
  const [role, setRole] = useState("standard")
  const [automaticLogin, setAutomaticLogin] = useState(false)
  const [guestLogin, setGuestLogin] = useState(true)

  return (
    <div>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {users.map((user) => (
          <PaneRow
            key={user.id}
            icon={
              <IconTile bg={user.id === "owner" ? BLUE : GRAY}>
                <User className="size-3.5" />
              </IconTile>
            }
            label={user.name}
            description={user.role}
            trailing={
              user.id !== "owner" && user.id !== "guest" ? (
                <button
                  type="button"
                  aria-label={`Remove ${user.name}`}
                  onClick={() =>
                    setUsers((items) =>
                      items.filter((item) => item.id !== user.id)
                    )
                  }
                  className="text-red-500"
                >
                  <Trash2 className="size-3.5" />
                </button>
              ) : null
            }
          />
        ))}
        <PaneRow
          label="Add User..."
          onClick={() => setAddOpen(true)}
          trailing={<Plus className="size-3.5 text-[#0a84ff]" />}
        />
      </SettingsCard>
      <SettingsHeading>Login Options</SettingsHeading>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        <PaneRow
          label="Automatic login"
          description="Off"
          trailing={
            <Switch
              on={automaticLogin}
              onToggle={() => setAutomaticLogin((value) => !value)}
              label="Automatic login"
            />
          }
        />
        <PaneRow
          label="Allow guest users to log in to this computer"
          trailing={
            <Switch
              on={guestLogin}
              onToggle={() => setGuestLogin((value) => !value)}
              label="Allow guest users"
            />
          }
        />
      </SettingsCard>
      <SettingsDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add User"
        description="Create a local user account for this Mac."
        footer={
          <>
            <button
              type="button"
              className={dialogButton}
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!name.trim()}
              className={dialogButton}
              onClick={() => {
                setUsers((items) => [
                  ...items,
                  {
                    id: `user-${Date.now()}`,
                    name: name.trim(),
                    role: role === "admin" ? "Administrator" : "Standard",
                  },
                ])
                setName("")
                setAddOpen(false)
              }}
            >
              Create User
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <input
            aria-label="User name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
            className="w-full rounded-lg bg-black/[0.06] px-3 py-2 text-[12px] outline-none dark:bg-white/10"
          />
          <Select
            ariaLabel="User account type"
            value={role}
            onChange={setRole}
            options={[
              { value: "standard", label: "Standard" },
              { value: "admin", label: "Administrator" },
            ]}
          />
        </div>
      </SettingsDialog>
    </div>
  )
}

type SavedPassword = {
  id: string
  site: string
  username: string
  password: string
}

function PasswordsPage() {
  const [passwords, setPasswords] = useState<SavedPassword[]>([
    {
      id: "apple",
      site: "apple.com",
      username: "tahoe",
      password: "example-password",
    },
    {
      id: "icloud",
      site: "icloud.com",
      username: "user@icloud.com",
      password: "sample-passcode",
    },
  ])
  const [query, setQuery] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [site, setSite] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const matches = passwords.filter((entry) =>
    `${entry.site} ${entry.username}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  return (
    <div>
      <SettingsCard>
        <div className="p-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search passwords"
            placeholder="Search passwords"
            className="w-full rounded-lg bg-black/[0.06] px-3 py-2 text-[12px] outline-none dark:bg-white/10"
          />
        </div>
      </SettingsCard>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {matches.map((entry) => (
          <PaneRow
            key={entry.id}
            icon={
              <IconTile bg={BLUE}>
                <KeyRound className="size-3.5" />
              </IconTile>
            }
            label={entry.site}
            description={`${entry.username} · ${revealed[entry.id] ? entry.password : "••••••••"}`}
            trailing={
              <>
                <button
                  type="button"
                  onClick={() =>
                    setRevealed((items) => ({
                      ...items,
                      [entry.id]: !items[entry.id],
                    }))
                  }
                  className="text-[11px] text-[#0a84ff]"
                >
                  {revealed[entry.id] ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${entry.site}`}
                  onClick={() =>
                    setPasswords((items) =>
                      items.filter((item) => item.id !== entry.id)
                    )
                  }
                  className="text-red-500"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </>
            }
          />
        ))}
        {matches.length === 0 && (
          <p className="px-3.5 py-4 text-[12px] text-black/45 dark:text-white/45">
            No passwords found.
          </p>
        )}
      </SettingsCard>
      <button
        type="button"
        onClick={() => setAddOpen(true)}
        className={`mt-1 w-full ${dialogButton}`}
      >
        <Plus className="mr-1 inline size-3.5" />
        Add Password
      </button>
      <SettingsDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="New Password"
        description="Save a sign-in for an app or website."
        footer={
          <>
            <button
              type="button"
              className={dialogButton}
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!site.trim() || !username.trim() || !password}
              className={dialogButton}
              onClick={() => {
                setPasswords((items) => [
                  ...items,
                  {
                    id: `password-${Date.now()}`,
                    site: site.trim(),
                    username: username.trim(),
                    password,
                  },
                ])
                setSite("")
                setUsername("")
                setPassword("")
                setAddOpen(false)
              }}
            >
              Save
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <input
            value={site}
            onChange={(event) => setSite(event.target.value)}
            aria-label="Website or app"
            placeholder="Website or app"
            className="w-full rounded-lg bg-black/[0.06] px-3 py-2 text-[12px] outline-none dark:bg-white/10"
          />
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            aria-label="Username"
            placeholder="Username"
            className="w-full rounded-lg bg-black/[0.06] px-3 py-2 text-[12px] outline-none dark:bg-white/10"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-label="Password"
            placeholder="Password"
            className="w-full rounded-lg bg-black/[0.06] px-3 py-2 text-[12px] outline-none dark:bg-white/10"
          />
        </div>
      </SettingsDialog>
    </div>
  )
}

function InternetAccountsPage() {
  const [accounts, setAccounts] = useState<
    { id: string; provider: string; email: string; enabled: boolean }[]
  >([
    {
      id: "icloud",
      provider: "iCloud",
      email: "tahoe@icloud.com",
      enabled: true,
    },
  ])
  const [addOpen, setAddOpen] = useState(false)
  const [provider, setProvider] = useState("Google")
  const [email, setEmail] = useState("")

  return (
    <div>
      <SettingsCard className="divide-y divide-black/[0.06] dark:divide-white/[0.07]">
        {accounts.map((account) => (
          <PaneRow
            key={account.id}
            icon={
              <IconTile bg={account.provider === "iCloud" ? BLUE : GRAY}>
                <Network className="size-3.5" />
              </IconTile>
            }
            label={account.provider}
            description={account.email}
            trailing={
              <>
                <Switch
                  on={account.enabled}
                  onToggle={() =>
                    setAccounts((items) =>
                      items.map((item) =>
                        item.id === account.id
                          ? { ...item, enabled: !item.enabled }
                          : item
                      )
                    )
                  }
                  label={`${account.provider} account`}
                />
                <button
                  type="button"
                  aria-label={`Remove ${account.provider} account`}
                  onClick={() =>
                    setAccounts((items) =>
                      items.filter((item) => item.id !== account.id)
                    )
                  }
                  className="text-red-500"
                >
                  <Minus className="size-3.5" />
                </button>
              </>
            }
          />
        ))}
        <PaneRow
          label="Add Account..."
          onClick={() => setAddOpen(true)}
          trailing={<Plus className="size-3.5 text-[#0a84ff]" />}
        />
      </SettingsCard>
      <SettingsDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Account"
        description="Choose an account provider to add to this Mac."
        footer={
          <>
            <button
              type="button"
              className={dialogButton}
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!email.trim()}
              className={dialogButton}
              onClick={() => {
                setAccounts((items) => [
                  ...items,
                  {
                    id: `account-${Date.now()}`,
                    provider,
                    email: email.trim(),
                    enabled: true,
                  },
                ])
                setEmail("")
                setAddOpen(false)
              }}
            >
              Sign In
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <Select
            ariaLabel="Account provider"
            value={provider}
            onChange={setProvider}
            options={[
              "iCloud",
              "Google",
              "Microsoft Exchange",
              "Yahoo",
              "Other",
            ].map((item) => ({ value: item, label: item }))}
          />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-label="Account email"
            placeholder="Email address"
            className="w-full rounded-lg bg-black/[0.06] px-3 py-2 text-[12px] outline-none dark:bg-white/10"
          />
        </div>
      </SettingsDialog>
    </div>
  )
}

function AppearancePage() {
  const { theme, setTheme } = useTheme()
  const [accent, setAccent] = useState("multicolor")
  const [iconStyle, setIconStyle] = useState("default")
  const [tintBg, setTintBg] = useState(true)
  const [scrollBars, setScrollBars] = useState("auto")
  const [scrollClick, setScrollClick] = useState("page")

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(ACCENT_STORAGE_KEY)
      if (saved) setAccent(saved)
    } catch {}
  }, [])

  const pickAccent = (id: string) => {
    setAccent(id)
    try {
      window.localStorage.setItem(ACCENT_STORAGE_KEY, id)
    } catch {}
  }

  const selectTheme = (id: string) => transitionTheme(() => setTheme(id))
  const currentTheme = theme ?? "system"

  return (
    <div>
      <Card>
        <Row label="Appearance" align="start">
          <span className="flex gap-3 py-0.5">
            <ThemeOption
              label="Auto"
              selected={currentTheme === "system"}
              onSelect={() => selectTheme("system")}
            >
              <span className="absolute inset-y-0 left-0 w-1/2">
                <Wallpaper src="/light.jpg" />
              </span>
              <span className="absolute inset-y-0 right-0 w-1/2">
                <Wallpaper src="/dark.jpg" />
              </span>
              <MiniWindow />
            </ThemeOption>
            <ThemeOption
              label="Light"
              selected={currentTheme === "light"}
              onSelect={() => selectTheme("light")}
            >
              <Wallpaper src="/light.jpg" />
              <MiniWindow />
            </ThemeOption>
            <ThemeOption
              label="Dark"
              selected={currentTheme === "dark"}
              onSelect={() => selectTheme("dark")}
            >
              <Wallpaper src="/dark.jpg" />
              <MiniWindow />
            </ThemeOption>
          </span>
        </Row>
      </Card>

      <Heading>Theme</Heading>
      <Card>
        <Row label="Colour" align="start">
          <span className="flex items-start gap-2">
            {ACCENTS.map((c) => (
              <button
                key={c.id}
                onClick={() => pickAccent(c.id)}
                aria-label={c.label}
                className="flex w-5 flex-col items-center"
              >
                <span
                  className={`size-5 rounded-full ${accent === c.id ? SELECTED_RING : ""}`}
                  style={{ background: c.background }}
                />
                {accent === c.id && c.id === "multicolor" && (
                  <span className="mt-1 text-[10px] whitespace-nowrap text-black/45 dark:text-white/45">
                    {c.label}
                  </span>
                )}
              </button>
            ))}
          </span>
        </Row>
        <Row label="Text highlight colour">
          <Popup
            leading={
              <span className="size-3.5 rounded-full bg-gradient-to-br from-blue-400 via-pink-300 to-orange-300" />
            }
          >
            Automatic
          </Popup>
        </Row>
      </Card>

      <Card>
        <Row label="Icon & widget style" align="start">
          <span className="flex items-start gap-3">
            {ICON_STYLES.map((s) => {
              const selected = iconStyle === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setIconStyle(s.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <span
                    className={`rounded-[11px] p-[2px] ${selected ? "ring-2 ring-[#0a84ff]" : ""}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/icons/Safari.png"
                      alt=""
                      draggable={false}
                      className={`size-9 rounded-[9px] ${s.className}`}
                    />
                  </span>
                  <span
                    className={`text-[10px] ${selected ? "font-semibold text-black/85 dark:text-white/90" : "text-black/45 dark:text-white/45"}`}
                  >
                    {s.label}
                  </span>
                </button>
              )
            })}
          </span>
        </Row>
        <Row label="Folder colour">
          <Popup
            leading={<span className="size-3.5 rounded-full bg-[#0a84ff]" />}
          >
            Automatic
          </Popup>
        </Row>
      </Card>

      <Heading>Windows</Heading>
      <Card>
        <Row label="Sidebar icon size">
          <Popup>Medium</Popup>
        </Row>
        <Row label="Tint window background with wallpaper colour">
          <Switch on={tintBg} onToggle={() => setTintBg((v) => !v)} />
        </Row>
      </Card>

      <Card>
        <RadioGroup
          title="Show scroll bars"
          options={SCROLL_BAR_OPTIONS}
          value={scrollBars}
          onChange={setScrollBars}
        />
        <RadioGroup
          title="Click in the scroll bar to"
          options={SCROLL_CLICK_OPTIONS}
          value={scrollClick}
          onChange={setScrollClick}
        />
      </Card>
    </div>
  )
}

function WallpaperPage({
  wallpaper,
  onWallpaper,
  customSrc,
  onCustom,
}: {
  wallpaper: WallpaperChoice
  onWallpaper: (w: WallpaperChoice) => void
  customSrc: string | null
  onCustom: (src: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  const pickFile = async (file: File | undefined) => {
    if (!file) return
    try {
      onCustom(await downscaleImage(file))
    } catch {}
  }

  return (
    <Card>
      <div className="grid grid-cols-3 gap-3 py-3">
        {WALLPAPERS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onWallpaper(opt.id)}
            className="group flex flex-col items-center gap-1.5"
          >
            <span
              className={`h-20 w-full rounded-xl bg-cover bg-center transition-transform group-active:scale-95 ${
                wallpaper === opt.id
                  ? "ring-2 ring-[#0a84ff] ring-offset-2 ring-offset-white/70 dark:ring-offset-transparent"
                  : "ring-1 ring-black/10 dark:ring-white/15"
              }`}
              style={{ backgroundImage: `url('${opt.preview}')` }}
            />
            <span className="text-[11px] text-black/70 dark:text-white/70">
              {opt.label}
            </span>
          </button>
        ))}
        <button
          onClick={() => fileRef.current?.click()}
          className="group flex flex-col items-center gap-1.5"
        >
          <span
            className={`flex h-20 w-full items-center justify-center overflow-hidden rounded-xl bg-cover bg-center transition-transform group-active:scale-95 ${
              wallpaper === "custom"
                ? "ring-2 ring-[#0a84ff] ring-offset-2 ring-offset-white/70 dark:ring-offset-transparent"
                : "ring-1 ring-black/10 dark:ring-white/15"
            }`}
            style={
              customSrc ? { backgroundImage: `url('${customSrc}')` } : undefined
            }
          >
            {!customSrc && <Plus className="size-6 opacity-40" />}
          </span>
          <span className="text-[11px] text-black/70 dark:text-white/70">
            Custom
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </div>
    </Card>
  )
}

function PlaceholderPage({ label }: { label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
      <LayoutGrid className="size-8 text-black/25 dark:text-white/25" />
      <p className="text-[13px] font-semibold text-black/70 dark:text-white/70">
        {label}
      </p>
      <p className="text-[12px] text-black/45 dark:text-white/45">
        Coming soon
      </p>
    </div>
  )
}

function SidebarButton({
  entry,
  active,
  onSelect,
}: {
  entry: SidebarItem
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-2.5 rounded-lg px-2 py-[5px] text-left ${
        active
          ? "bg-[#0a84ff] text-white"
          : "text-black/85 hover:bg-black/[0.05] dark:text-white/90 dark:hover:bg-white/10"
      }`}
    >
      <span
        className={`flex size-[22px] shrink-0 items-center justify-center rounded-[6px] text-white shadow-sm ${entry.bg}`}
      >
        {entry.icon}
      </span>
      <span className="min-w-0 truncate text-[13px] leading-tight">
        {entry.label}
      </span>
    </button>
  )
}

function Profile() {
  const [account, setAccount] = useState<Account | null>(null)

  useEffect(() => {
    setAccount(loadAccount())
  }, [])

  return (
    <div className="mb-1 flex flex-col gap-1">
      <div className="flex items-center gap-2.5 px-2 py-1.5">
        <Avatar
          emoji={account?.avatar ?? "🐱"}
          className="size-10 text-[22px]"
        />
        <span className="min-w-0">
          <span className="block truncate text-[13px] leading-tight font-semibold text-black/85 dark:text-white/90">
            {account?.fullName ?? "tahoe"}
          </span>
          <span className="block text-[11px] leading-tight text-black/45 dark:text-white/45">
            Apple Account
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2.5 px-2 py-1">
        <span className="flex w-[26px] shrink-0 items-center justify-center -space-x-1.5">
          <span className="size-[18px] rounded-full bg-amber-200 ring-1 ring-white dark:ring-neutral-800" />
          <span className="flex size-[18px] items-center justify-center rounded-full bg-neutral-400 text-[7px] font-semibold text-white ring-1 ring-white dark:ring-neutral-800">
            {(account?.fullName ?? "T").charAt(0).toUpperCase()}
          </span>
        </span>
        <span className="text-[13px] text-black/85 dark:text-white/90">
          Family
        </span>
      </div>
    </div>
  )
}

function SystemSettings({
  wallpaper,
  onWallpaper,
  customSrc,
  onCustom,
  onErase,
}: {
  wallpaper: WallpaperChoice
  onWallpaper: (w: WallpaperChoice) => void
  customSrc: string | null
  onCustom: (src: string) => void
  onErase: () => void
}) {
  const [page, setPage] = useState("appearance")
  const [filter, setFilter] = useState("")
  const [history, setHistory] = useState(["appearance"])
  const [historyIndex, setHistoryIndex] = useState(0)
  const active = ALL_ITEMS.find((s) => s.id === page)
  const query = filter.trim().toLowerCase()

  const navigate = (nextPage: string) => {
    if (nextPage === page) return
    setPage(nextPage)
    setHistory((items) => [...items.slice(0, historyIndex + 1), nextPage])
    setHistoryIndex((index) => index + 1)
  }

  const goBack = () => {
    if (historyIndex === 0) return
    const nextIndex = historyIndex - 1
    setHistoryIndex(nextIndex)
    setPage(history[nextIndex])
  }

  const goForward = () => {
    if (historyIndex >= history.length - 1) return
    const nextIndex = historyIndex + 1
    setHistoryIndex(nextIndex)
    setPage(history[nextIndex])
  }

  const groups = SIDEBAR_GROUPS.map((group) =>
    group.filter((s) => s.label.toLowerCase().includes(query))
  ).filter((group) => group.length > 0)

  const renderPage = () => {
    switch (page) {
      case "wifi":
        return <WifiPage />
      case "bluetooth":
        return <BluetoothPage />
      case "network":
        return <NetworkPage />
      case "vpn":
        return <VpnPage />
      case "battery":
        return <BatteryPage />
      case "general":
        return <GeneralPage onErase={onErase} />
      case "accessibility":
        return <AccessibilityPage />
      case "controlcenter":
        return <ControlCenterSettingsPage />
      case "privacy":
        return <PrivacySecurityPage />
      case "users":
        return <UsersGroupsPage />
      case "passwords":
        return <PasswordsPage />
      case "accounts":
        return <InternetAccountsPage />
      case "appearance":
        return <AppearancePage />
      case "menubar":
        return <MenuBarPage />
      case "siri":
        return <SiriPage />
      case "desktop":
        return <DesktopDockPage />
      case "displays":
        return <DisplaysPage />
      case "spotlight":
        return <SpotlightPage />
      case "wallpaper":
        return (
          <WallpaperPage
            wallpaper={wallpaper}
            onWallpaper={onWallpaper}
            customSrc={customSrc}
            onCustom={onCustom}
          />
        )
      case "notifications":
        return <NotificationsPage />
      case "sound":
        return <SoundPage />
      case "focus":
        return <FocusPage />
      case "screentime":
        return <ScreenTimePage />
      default:
        return <PlaceholderPage label={active?.label ?? ""} />
    }
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex w-56 shrink-0 flex-col overflow-y-auto bg-black/[0.03] px-2.5 pt-2.5 pb-2.5 dark:bg-white/[0.04]">
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-black/40 dark:text-white/40" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search"
            aria-label="Search settings"
            className="h-7 w-full rounded-full bg-black/[0.07] pr-3 pl-8 text-[13px] text-black/80 outline-none placeholder:text-black/40 dark:bg-white/10 dark:text-white/85 dark:placeholder:text-white/40"
          />
        </div>
        {!query && <Profile />}
        {groups.map((group, i) => (
          <div
            key={group[0].id}
            className={`flex flex-col gap-px ${!query && i === 0 ? "mt-3" : i > 0 ? "mt-3" : ""}`}
          >
            {group.map((s) => (
              <SidebarButton
                key={s.id}
                entry={s}
                active={page === s.id}
                onSelect={() => navigate(s.id)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[52px] shrink-0 items-center gap-3 px-4">
          <span className="flex items-center rounded-full bg-white/80 px-1 py-1 shadow-sm dark:bg-white/10">
            <button
              type="button"
              aria-label="Back"
              disabled={historyIndex === 0}
              onClick={goBack}
              className="rounded-full p-0.5 text-black/70 enabled:hover:bg-black/10 disabled:opacity-30 dark:text-white/70 dark:enabled:hover:bg-white/10"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Forward"
              disabled={historyIndex >= history.length - 1}
              onClick={goForward}
              className="rounded-full p-0.5 text-black/70 enabled:hover:bg-black/10 disabled:opacity-30 dark:text-white/70 dark:enabled:hover:bg-white/10"
            >
              <ChevronRight className="size-4" />
            </button>
          </span>
          <span className="text-[14px] font-bold text-black/85 dark:text-white/90">
            {active?.label ?? ""}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">{renderPage()}</div>
      </div>
    </div>
  )
}

export default memo(SystemSettings)
