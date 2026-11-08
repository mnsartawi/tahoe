"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Ban,
  BatteryFull,
  Brain,
  ChevronLeft,
  Clock3,
  Cog,
  Ear,
  Eye,
  Globe,
  Keyboard,
  Lock,
  Mic,
  Wifi,
  Hourglass,
  LayoutGrid,
} from "lucide-react"
import { useTheme } from "next-themes"
import { transitionTheme } from "@/lib/theme-transition"
import { COUNTRIES, detectCountry } from "@/lib/countries"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { IoAccessibility } from "react-icons/io5"
import Image from "next/image"
const SF_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, "Segoe UI", sans-serif'

function useClock() {
  const [time, setTime] = useState(" ")
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      )
    tick()
    const id = setInterval(tick, 10_000)
    return () => clearInterval(id)
  }, [])
  return time
}

function StatusBar() {
  const time = useClock()

  return (
    <div className="absolute top-0 right-0 z-10 flex h-9 items-center gap-4 px-6 text-[15px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] select-none">
      <span>U.S.</span>
      <Keyboard className="size-5" strokeWidth={1.8} />
      <BatteryFull className="size-[26px]" strokeWidth={1.8} />
      <Wifi className="size-[18px] opacity-50" strokeWidth={2.2} />
      <span suppressHydrationWarning>{time}</span>
    </div>
  )
}

type StepId =
  | "country"
  | "transfer"
  | "languages"
  | "accessibility"
  | "wifi"
  | "privacy"
  | "account"
  | "terms"
  | "location"
  | "timezone"
  | "analytics"
  | "screentime"
  | "siri"
  | "touchid"
  | "look"
  | "update"

const STEPS: StepId[] = [
  "country",
  "transfer",
  "languages",
  "accessibility",
  "wifi",
  "privacy",
  "account",
  "terms",
  "location",
  "timezone",
  "analytics",
  "screentime",
  "siri",
  "touchid",
  "look",
  "update",
]

export type SetupResult = {
  country: string
  transfer: string
  wifi: string
  username: string
  accountName: string
  avatar: string | null
  password: string
  hint: string
  location: boolean
  timezone: string
  siri: boolean
}

const guessTimezoneCity = () => {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const match = TIMEZONE_CITIES.find((c) => c.zone === zone)
    if (match) return match.city
  } catch {}
  return TIMEZONE_CITIES[0].city
}

const TRANSFER_OPTIONS = [
  { id: "mac", label: "From a Mac, Time Machine, or startup disk" },
  { id: "windows", label: "From a Windows PC" },
  { id: "device", label: "Set up with iPhone or iPad" },
  { id: "new", label: "Set up as new" },
]

function CountryStep({
  countries,
  value,
  onChange,
  onSubmit,
}: {
  countries: string[]
  value: string
  onChange: (country: string) => void
  onSubmit: () => void
}) {
  const selectedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" })
  }, [value])

  const select = (index: number) => {
    onChange(countries[Math.min(countries.length - 1, Math.max(0, index))])
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const index = countries.indexOf(value)
    if (e.key === "ArrowDown") select(index + 1)
    else if (e.key === "ArrowUp") select(index - 1)
    else if (e.key === "Home") select(0)
    else if (e.key === "End") select(countries.length - 1)
    else if (e.key === "Enter") onSubmit()
    else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      const letter = e.key.toLowerCase()
      const ordered = [
        ...countries.slice(index + 1),
        ...countries.slice(0, index + 1),
      ]
      const match = ordered.find((c) => c.toLowerCase().startsWith(letter))
      if (match) onChange(match)
    } else return
    e.preventDefault()
  }

  return (
    <>
      <Globe
        className="size-[clamp(64px,11vh,92px)] text-[#0a5fe0] dark:text-[#4c9bff]"
        strokeWidth={1.5}
      />
      <div className="mt-[clamp(20px,4.5vh,44px)] w-[min(560px,84%)]">
        <h1 className="text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
          Select Your Country or Region
        </h1>
        <div
          role="listbox"
          tabIndex={0}
          aria-label="Country or Region"
          onKeyDown={onKeyDown}
          className="mt-4 h-[clamp(150px,36vh,300px)] overflow-y-auto border border-[#2f6fd8]/70 bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]/40 dark:bg-black"
        >
          {countries.map((name) => {
            const selected = name === value
            return (
              <div
                key={name}
                ref={selected ? selectedRef : undefined}
                role="option"
                aria-selected={selected}
                onClick={() => onChange(name)}
                onDoubleClick={onSubmit}
                className={`flex h-[25px] items-center px-2 text-[15px] leading-none select-none ${
                  selected
                    ? "bg-[#1e50d6] text-white"
                    : "text-black dark:text-white/90"
                }`}
              >
                {name}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

function TransferIcon() {
  return (
    <svg
      viewBox="0 0 104 104"
      aria-hidden
      className="size-[clamp(72px,12vh,104px)]"
    >
      <rect
        x="30"
        y="30"
        width="72"
        height="72"
        rx="17"
        fill="#1b57c4"
        stroke="#ebebed"
        strokeWidth="3"
        className="dark:stroke-[#2a2a2d]"
      />
      <rect
        x="15"
        y="15"
        width="72"
        height="72"
        rx="17"
        fill="#0a5fe0"
        stroke="#ebebed"
        strokeWidth="3"
        className="dark:stroke-[#2a2a2d]"
      />
      <rect
        x="1.5"
        y="1.5"
        width="72"
        height="72"
        rx="17"
        fill="#0a6cf0"
        stroke="#ebebed"
        strokeWidth="3"
        className="dark:stroke-[#2a2a2d]"
      />
      <g
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M37.5 16V44" />
        <path d="M24 33L37.5 46.5L51 33" />
        <path d="M23 58H52" />
      </g>
    </svg>
  )
}

function RadioOption({
  label,
  checked,
  onSelect,
}: {
  label: string
  checked: boolean
  onSelect: () => void
}) {
  return (
    <label className="flex cursor-default items-center gap-3 py-[7px]">
      <input
        type="radio"
        name="transfer"
        checked={checked}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-[#0a5fe0]/70 ${
          checked
            ? "bg-[#0a5fe0]"
            : "bg-black/[0.05] ring-1 ring-black/10 dark:bg-white/10 dark:ring-white/15"
        }`}
      >
        {checked && <span className="size-[7px] rounded-full bg-white" />}
      </span>
      <span className="text-[16px] text-black/85 dark:text-white/90">
        {label}
      </span>
    </label>
  )
}

function TransferStep({
  value,
  onChange,
}: {
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div className="w-[min(560px,84%)]">
      <TransferIcon />
      <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Transfer Your Data to This Mac
      </h1>
      <p className="mt-1 text-[18px] leading-snug text-black/65 dark:text-white/65">
        You can transfer your data from another Mac or Windows PC. If you
        don&apos;t want to transfer from a computer, you can use a backup or
        startup disk, or set up this Mac without transferring any data.
      </p>
      <p className="mt-[clamp(20px,5vh,52px)] text-[15px] select-none text-black/85 dark:text-white/90">
        How do you want to transfer your information?
      </p>
      <div className="mt-2" role="radiogroup">
        {TRANSFER_OPTIONS.map((o) => (
          <RadioOption
            key={o.id}
            label={o.label}
            checked={value === o.id}
            onSelect={() => onChange(o.id)}
          />
        ))}
      </div>
    </div>
  )
}

function LanguageRow({
  icon,
  title,
  value,
}: {
  icon: ReactNode
  title: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex w-9 justify-center text-[#1f4f9e] dark:text-[#6aa6ff]">
        {icon}
      </span>
      <span className="leading-tight">
        <span className="block text-[14px] font-semibold text-black/85 dark:text-white/90">
          {title}
        </span>
        <span className="block text-[14px] text-black/55 dark:text-white/55">
          {value}
        </span>
      </span>
    </div>
  )
}

function LanguagesStep() {
  return (
    <div className="w-[min(560px,84%)]">
      <Globe
        className="size-[clamp(72px,12vh,104px)] text-[#0a5fe0] dark:text-[#4c9bff]"
        strokeWidth={2}
      />
      <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Written and Spoken Languages
      </h1>
      <p className="mt-1 text-[18px] leading-snug text-black/65 dark:text-white/65">
        The following languages are commonly used in your region. You can set up
        your Mac to use these settings, or customize them individually.
      </p>
      <div className="mt-6 space-y-5 select-none">
        <LanguageRow
          icon={<Globe className="size-8" strokeWidth={1.3} />}
          title="Preferred Languages"
          value="English (US)"
        />
        <LanguageRow
          icon={<Keyboard className="size-8" strokeWidth={1.3} />}
          title="Input Sources"
          value="U.S."
        />
        <LanguageRow
          icon={<Mic className="size-8" strokeWidth={1.3} />}
          title="Dictation"
          value="English (United States)"
        />
      </div>
    </div>
  )
}

const ACCESSIBILITY_CATEGORIES = [
  { id: "vision", label: "Vision", icon: Eye },
  {
    id: "motor",
    label: "Motor",
    icon: (_props: { className?: string }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/hand.png"
        alt=""
        draggable={false}
        className="size-10 rotate-[-30deg] object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
      />
    ),
  },
  { id: "hearing", label: "Hearing", icon: Ear },
  { id: "cognitive", label: "Cognitive", icon: Brain },
]

function AccessibilityStep() {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )

  return (
    <div className="w-[min(900px,94%)]">
      <div className="max-w-190 translate-x-15">
        <span className="flex size-[clamp(60px,9vh,80px)] items-center justify-center rounded-full border-[5px] border-[#0a5fe0] dark:border-[#4c9bff]">
          <IoAccessibility className="size-[clamp(44px,7.5vh,60px)] text-[#0a5fe0] [--erosion:#ebebed] dark:text-[#4c9bff] dark:[--erosion:#2a2a2d] [&_.erosion]:stroke-[var(--erosion)] [&_circle]:stroke-[var(--erosion)] [&_circle]:[stroke-width:2] [&_circle]:[paint-order:stroke] [&_path]:stroke-[var(--erosion)] [&_path]:[stroke-width:2] [&_path]:[paint-order:stroke]" />
        </span>
        <h1 className="mt-6 text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
          Accessibility
        </h1>
        <p className="mt-1 text-[18px] leading-snug text-black/65 dark:text-white/65">
          Accessibility features adapt your Mac to your individual needs. You
          can turn them on now to help you finish setting up, and further
          customize them later in System Settings. See what&apos;s available in
          each of the categories below.
        </p>
      </div>
      <div className="mt-[clamp(20px,4vh,48px)] flex -translate-y-5 flex-wrap justify-center gap-4 select-none">
        {ACCESSIBILITY_CATEGORIES.map(({ id, label, icon: Icon }) => {
          const active = selected.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              aria-pressed={active}
              className={`flex h-38 w-45 flex-col items-center gap-3 rounded-lg border px-2 py-7 transition-colors ${
                active
                  ? "border-[#0a5fe0]/70 bg-[#0a5fe0]/10"
                  : "border-black/[0.07] bg-[#f7f7f8] hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              }`}
            >
              <Icon
                className="size-12 text-black/75 dark:text-white/85"
                strokeWidth={1.2}
              />
              <span className="font-sans text-[14px] font-bold text-black/75 dark:text-white/80">
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function WifiStep({
  value,
  onChange,
}: {
  value: string | null
  onChange: (ssid: string) => void
}) {
  const networks = ["wifi"]

  return (
    <div className="flex w-[min(560px,84%)] flex-col items-center">
      <Wifi
        className="size-[clamp(64px,11vh,92px)] text-[#0a5fe0] dark:text-[#4c9bff]"
        strokeWidth={2}
      />
      <h1 className="mt-[clamp(20px,4.5vh,44px)] self-start text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Select Your Wi-Fi Network
      </h1>
      <div
        role="listbox"
        aria-label="Wi-Fi Networks"
        className="mt-4 h-[clamp(150px,30vh,260px)] w-full overflow-y-auto border border-[#2f6fd8]/70 bg-white outline-none dark:bg-black"
      >
        {networks.map((ssid) => {
          const selected = ssid === value
          return (
            <div
              key={ssid}
              role="option"
              aria-selected={selected}
              onClick={() => onChange(ssid)}
              onDoubleClick={() => onChange(ssid)}
              className={`flex h-[25px] items-center px-2 text-[15px] leading-none select-none ${
                selected
                  ? "bg-[#1e50d6] text-white"
                  : "text-black dark:text-white/90"
              }`}
            >
              <span className="flex-1 truncate">{ssid}</span>
              <Lock className="size-3.5 shrink-0" strokeWidth={2} />
              <Wifi className="ml-1.5 size-3.5 shrink-0" strokeWidth={2.4} />
            </div>
          )
        })}
        <div className="flex h-[25px] items-center px-2 text-[15px] leading-none text-black/55 select-none dark:text-white/55">
          Wi-Fi: Looking for Networks...
        </div>
      </div>
    </div>
  )
}

function PrivacyStep() {
  return (
    <div className="w-[min(560px,84%)]">
      <Image
        src="/privacy.png"
        alt="privacy"
        width={140}
        height={140}
        className="translate-x-40"
        draggable={false}
      />
      <h1 className="mt-5 text-[24px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Data &amp; Privacy
      </h1>
      <div className="mt-4 gap-8 space-y-3.5 text-[17px] leading-snug text-black/65 dark:text-white/65">
        <p>
          This icon appears when an Apple feature asks to use your personal
          information.
        </p>
        <p>
          You won&apos;t see this with every feature since Apple collects this
          information only when needed to enable features, secure our services,
          or personalize your experience.
        </p>
        <p>
          Apple believes privacy is a fundamental human right, so every Apple
          product is designed to minimize the collection and use of your data,
          use on-device processing whenever possible, and provide transparency
          and control over your information.
        </p>
      </div>
      <button className="mt-3 flex items-center gap-1 text-[14px] text-[#0a5fe0] dark:text-[#4c9bff]">
        <span className="flex size-3 items-center justify-center rounded-full bg-[#0a5fe0] text-[8px] text-white dark:bg-[#4c9bff]">
          i
        </span>
        Learn More...
      </button>
    </div>
  )
}

const AVATAR_PRESETS = [
  { file: "cat.webp", bg: "bg-[#d6e9f8]", imgClass: "h-9 w-9 object-cover" },
  { file: "panda.png", bg: "bg-[#dff0d8]", imgClass: "h-14 w-14 object-cover" },
]

const PRESET_FALLBACK_BGS = [
  "bg-[#dff0d8]",
  "bg-[#fde8d0]",
  "bg-[#e8d9c8]",
  "bg-[#e3dbf5]",
  "bg-[#d6e9f8]",
]

const presetBg = (index: number, file: string) =>
  AVATAR_PRESETS.find((p) => p.file === file)?.bg ??
  PRESET_FALLBACK_BGS[index % PRESET_FALLBACK_BGS.length]

function AccountStep({
  username,
  onUsername,
  accountName,
  onAccountName,
  avatar,
  onAvatar,
  password,
  onPassword,
  verify,
  onVerify,
  hint,
  onHint,
}: {
  username: string
  onUsername: (name: string) => void
  accountName: string
  onAccountName: (name: string) => void
  avatar: string | null
  onAvatar: (src: string) => void
  password: string
  onPassword: (v: string) => void
  verify: string
  onVerify: (v: string) => void
  hint: string
  onHint: (v: string) => void
}) {
  const [allowReset, setAllowReset] = useState(true)
  const [customized, setCustomized] = useState(() => {
    try {
      return window.localStorage.getItem("tahoe-accountname-custom") === "1"
    } catch {
      return false
    }
  })
  const fileRef = useRef<HTMLInputElement>(null)

  const pickFile = (file: File | undefined) => {
    if (!file) return
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const size = 128
      const canvas = document.createElement("canvas")
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const side = Math.min(img.width, img.height)
      ctx.drawImage(
        img,
        (img.width - side) / 2,
        (img.height - side) / 2,
        side,
        side,
        0,
        0,
        size,
        size
      )
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85)
      URL.revokeObjectURL(url)
      onAvatar(dataUrl)
    }
    img.src = url
  }

  const pickPreset = (file: string) => {
    onAvatar(`/memoji/${file}`)
  }

  const field =
    "h-9 w-full rounded-md border border-black/15 bg-white px-2.5 text-[14px] text-black/85 outline-none focus:border-[#0a84ff] dark:border-white/15 dark:bg-white/10 dark:text-white/90"

  return (
    <div className="w-[min(560px,84%)]">
      <h1 className="text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Create a Mac Account
      </h1>
      <p className="mt-1 text-[15px] leading-snug text-black/65 dark:text-white/65">
        The password you create here will be used to log in to this Mac.
      </p>

      <div className="mt-4 flex items-center gap-2.5">
        <button
          onClick={() => fileRef.current?.click()}
          aria-label="Upload profile picture"
          className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/[0.07] text-[20px] text-black/60 transition-colors hover:bg-black/[0.12] dark:bg-white/10 dark:text-white/60"
        >
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            "+"
          )}
        </button>
        {AVATAR_PRESETS.map(({ file, imgClass }, i) => {
          const src = `/memoji/${file}`
          return (
            <button
              key={file}
              onClick={() => pickPreset(file)}
              aria-label={file}
              className={`flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full transition-transform hover:scale-105 ${presetBg(i, file)} ${
                avatar === src
                  ? "ring-2 ring-[#0a84ff] ring-offset-2 ring-offset-transparent"
                  : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className={imgClass} draggable={false} />
            </button>
          )
        })}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </div>

      <div className="mt-4 space-y-2.5">
        <input
          value={username}
          onChange={(e) => {
            onUsername(e.target.value)
            if (!customized) {
              onAccountName(e.target.value.toLowerCase().replace(/\s+/g, ""))
            }
          }}
          placeholder="Full name"
          aria-label="Full name"
          className={field}
        />
        <div>
          <input
            value={
              customized
                ? accountName
                : username.toLowerCase().replace(/\s+/g, "")
            }
            onChange={(e) => {
              onAccountName(
                e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
              )
              setCustomized(true)
            }}
            aria-label="Account name"
            className={field}
          />
          <p className="mt-1 text-[12px] text-black/45 dark:text-white/45">
            This will be the name of your home folder.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <input
            type="password"
            value={password}
            onChange={(e) => onPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password"
            className={`${field} text-[20px] tracking-[0.08em] placeholder:text-[14px] placeholder:tracking-normal`}
          />
          <input
            type="password"
            value={verify}
            onChange={(e) => onVerify(e.target.value)}
            placeholder="Verify"
            aria-label="Verify password"
            className={`${field} text-[20px] tracking-[0.08em] placeholder:text-[14px] placeholder:tracking-normal`}
          />
        </div>
        {password && verify && password !== verify && (
          <p className="text-[12px] text-red-500">Passwords do not match.</p>
        )}
        <input
          value={hint}
          onChange={(e) => onHint(e.target.value)}
          placeholder="Hint (Optional)"
          aria-label="Password hint"
          className={field}
        />
      </div>

      <label className="mt-3 flex cursor-default items-start gap-2">
        <input
          type="checkbox"
          checked={allowReset}
          onChange={() => setAllowReset((v) => !v)}
          className="mt-0.5 size-4 shrink-0 accent-[#0a84ff]"
        />
        <span className="text-[12px] leading-snug text-black/65 dark:text-white/65">
          Allow computer account password to be reset with your Apple Account.
          You must sign in with your Apple Account in the next step to use this
          feature.
        </span>
      </label>
    </div>
  )
}

function TermsStep({ onAccept }: { onAccept: () => void }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="w-[min(560px,84%)]">
      <h1 className="text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Terms and Conditions
      </h1>
      <p className="mt-1 text-[15px] leading-snug text-black/65 dark:text-white/65">
        Important: Use of your Mac computer, the macOS software and related
        services is subject to these Terms and Conditions. Please read them
        carefully.
      </p>
      <div className="mt-4 h-[clamp(180px,34vh,300px)] overflow-y-auto rounded-md border border-black/10 bg-white p-4 text-[12px] leading-relaxed text-black/60 dark:border-white/10 dark:bg-black/20 dark:text-white/60">
        <p className="font-semibold">A. macOS Software License Agreement</p>
        <p className="mt-2">
          PLEASE READ THIS SOFTWARE LICENSE AGREEMENT CAREFULLY BEFORE USING
          YOUR MAC COMPUTER. BY USING YOUR MAC COMPUTER, YOU ARE AGREEING TO BE
          BOUND BY THE TERMS OF THIS LICENSE. IF YOU DO NOT AGREE TO THE TERMS
          OF THIS LICENSE, DO NOT USE THE MAC COMPUTER.
        </p>
        <p className="mt-2">
          THIS IS PRE-RELEASE, TIME-LIMITED SOFTWARE MEANT FOR EVALUATION AND
          DEVELOPMENT PURPOSES ONLY. THIS SOFTWARE SHOULD NOT BE USED IN A
          COMMERCIAL OPERATING ENVIRONMENT OR WITH IMPORTANT DATA. BEFORE
          INSTALLING THIS APPLE SOFTWARE, YOU SHOULD BACK UP YOUR DATA. License,
          Warranty, and other important product information are saved on your
          system, and can be found in About This Mac.
        </p>
        <p className="mt-2">
          B. Your use of iCloud, the App Store, and other Apple services is
          subject to their respective terms. Apple collects only the information
          needed to provide, secure, and improve these services, and processes
          as much as possible on-device.
        </p>
      </div>

      <div className="mt-4 flex justify-end gap-2.5">
        <button className="h-9 min-w-28 rounded-full bg-black/[0.07] px-6 text-[14px] text-black/60 transition-colors hover:bg-black/[0.12] dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15">
          Disagree
        </button>
        <button
          onClick={() => setConfirmOpen(true)}
          className="h-9 min-w-28 rounded-full bg-[#0a84ff] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#0077ed]"
        >
          Agree
        </button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <div className="flex flex-col items-center">
            <span className="flex size-15 items-center justify-center  font-semibold text-black/70 dark:border-white/20 dark:text-white/80">
              <Image
                src="/tahoe26.png"
                alt="tahoe"
                width={80}
                height={80}
                draggable={false}
              />
            </span>
            <DialogTitle className="mt-3 text-[13px] font-semibold">
              I have read and agree to the macOS Software License Agreement.
            </DialogTitle>
            <DialogFooter className="mt-4 w-full">
              <button
                onClick={() => setConfirmOpen(false)}
                className="h-8 min-w-24 flex-1 rounded-full bg-black/[0.07] text-[13px] text-black/65 transition-colors hover:bg-black/[0.12] dark:bg-white/10 dark:text-white/65"
              >
                Disagree
              </button>
              <button
                onClick={() => {
                  setConfirmOpen(false)
                  onAccept()
                }}
                className="h-8 min-w-24 flex-1 rounded-full bg-[#0a84ff] text-[13px] font-medium text-white transition-colors hover:bg-[#0077ed]"
              >
                Agree
              </button>
            </DialogFooter>
          </div>
          <DialogDescription className="sr-only">
            Confirm the macOS Software License Agreement
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LocationStep({
  enabled,
  onChange,
}: {
  enabled: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="w-[min(560px,84%)]">
      <svg
        viewBox="0 0 48 48"
        aria-hidden
        className="h-[clamp(56px,9vh,19px)] w-auto"
      >
        <path
          d="M8 26 40 6l-8 32-8-12-8-2-8-2 8-2Z"
          fill="none"
          stroke="#0a5fe0"
          strokeWidth="3"
          strokeLinejoin="round"
          className="dark:stroke-[#4c9bff]"
        />
      </svg>
      <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Enable Location Services
      </h1>
      <p className="mt-1 max-w-[480px] text-[15px] leading-snug text-black/65 dark:text-white/65">
        Location Services allows apps like Maps and services like Spotlight
        Suggestions to gather and use data including your approximate location.
      </p>
      <label className="mt-5 flex cursor-default items-center gap-2.5">
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => onChange(!enabled)}
          className="size-4 shrink-0 accent-[#0a84ff]"
        />
        <span className="text-[14px] text-black/75 dark:text-white/75">
          Enable Location Services on this Mac
        </span>
      </label>
      <div className="mt-[clamp(60px,14vh,140px)] flex justify-center">
        <button className="flex items-center gap-1 text-[13px] text-[#0a5fe0] dark:text-[#4c9bff]">
          <span className="flex size-3 items-center justify-center rounded-full bg-[#0a5fe0] text-[8px] text-white dark:bg-[#4c9bff]">
            i
          </span>
          About Location Services &amp; Privacy...
        </button>
      </div>
    </div>
  )
}

const TIMEZONE_CITIES = [
  {
    city: "New Delhi - India",
    tz: "India Standard Time",
    lat: 28.6,
    lng: 77.2,
    zone: "Asia/Kolkata",
  },
  {
    city: "London - Britain",
    tz: "Greenwich Mean Time",
    lat: 51.5,
    lng: -0.1,
    zone: "Europe/London",
  },
  {
    city: "Paris - France",
    tz: "Central European Time",
    lat: 48.9,
    lng: 2.4,
    zone: "Europe/Paris",
  },
  {
    city: "Dubai - UAE",
    tz: "Gulf Standard Time",
    lat: 25.2,
    lng: 55.3,
    zone: "Asia/Dubai",
  },
  {
    city: "Singapore - Singapore",
    tz: "Singapore Time",
    lat: 1.35,
    lng: 103.8,
    zone: "Asia/Singapore",
  },
  {
    city: "Tokyo - Japan",
    tz: "Japan Standard Time",
    lat: 35.7,
    lng: 139.7,
    zone: "Asia/Tokyo",
  },
  {
    city: "Sydney - Australia",
    tz: "Australian Eastern Time",
    lat: -33.9,
    lng: 151.2,
    zone: "Australia/Sydney",
  },
  {
    city: "New York - USA",
    tz: "Eastern Standard Time",
    lat: 40.7,
    lng: -74,
    zone: "America/New_York",
  },
  {
    city: "Los Angeles - USA",
    tz: "Pacific Standard Time",
    lat: 34,
    lng: -118.2,
    zone: "America/Los_Angeles",
  },
  {
    city: "São Paulo - Brazil",
    tz: "Brasilia Time",
    lat: -23.5,
    lng: -46.6,
    zone: "America/Sao_Paulo",
  },
]

function TimezoneStep({
  city,
  onChange,
}: {
  city: string
  onChange: (city: string) => void
}) {
  const [automatic, setAutomatic] = useState(true)
  const selected =
    TIMEZONE_CITIES.find((c) => c.city === city) ?? TIMEZONE_CITIES[0]
  const x = Math.min(96, Math.max(4, ((selected.lng + 180) / 360) * 100))
  const y = Math.min(92, Math.max(8, ((90 - selected.lat) / 180) * 100))

  return (
    <div className="w-[min(640px,90%)]">
      <h1 className="text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Select Your Time Zone
      </h1>
      <p className="mx-auto mt-1 max-w-[480px] text-center text-[13px] leading-snug text-black/55 dark:text-white/55">
        To select a time zone, click the map near your location and choose a
        city from the Closest City menu. You can also have the time zone change
        automatically, if possible, based on your current location.
      </p>
      <label className="mt-2 flex cursor-default items-center justify-center gap-2">
        <input
          type="checkbox"
          checked={automatic}
          onChange={() => setAutomatic((v) => !v)}
          className="size-4 shrink-0 accent-[#0a84ff]"
        />
        <span className="text-[14px] text-black/75 dark:text-white/75">
          Set time zone automatically using current location
        </span>
      </label>

      <div className="relative mx-auto mt-2 w-[min(420px,80%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/world.svg"
          alt="World map"
          draggable={false}
          className="h-auto w-full opacity-25 brightness-0 dark:opacity-40 dark:invert"
        />
        <span
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a84ff] ring-4 ring-[#0a84ff]/25"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      </div>

      <div className="mx-auto mt-2 w-fit space-y-1 text-[14px]">
        <p className="text-black/75 dark:text-white/75">
          Time Zone: <span className="font-medium">{selected.tz}</span>
        </p>
        <p className="flex items-center gap-2 text-black/75 dark:text-white/75">
          Closest City:
          <select
            value={selected.city}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Closest City"
            className="h-7 rounded-md border border-black/15 bg-white px-1.5 text-[13px] text-black/85 outline-none dark:border-white/15 dark:bg-white/10 dark:text-white/90"
          >
            {TIMEZONE_CITIES.map((c) => (
              <option key={c.city} value={c.city}>
                {c.city}
              </option>
            ))}
          </select>
        </p>
      </div>
    </div>
  )
}

function AnalyticsStep() {
  return (
    <div className="w-[min(560px,84%)]">
      <svg
        viewBox="0 0 56 44"
        aria-hidden
        className="h-[clamp(52px,8vh,68px)] w-auto"
      >
        <g fill="#0a5fe0" className="dark:fill-[#4c9bff]">
          <rect x="10" y="18" width="7" height="20" rx="1.5" />
          <rect x="21" y="10" width="7" height="28" rx="1.5" />
          <rect x="32" y="4" width="7" height="34" rx="1.5" />
          <rect x="43" y="14" width="7" height="24" rx="1.5" />
        </g>
        <rect
          x="6"
          y="40"
          width="48"
          height="2.5"
          rx="1.25"
          fill="#0a5fe0"
          className="dark:fill-[#4c9bff]"
        />
      </svg>
      <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Analytics
      </h1>
      <p className="mt-1 text-[15px] leading-snug text-black/65 dark:text-white/65">
        Help Apple and app developers improve their products and services
        automatically.
      </p>
      <p className="mt-3 text-[15px] leading-snug text-black/65 dark:text-white/65">
        To help Apple improve its products and services, pre-release beta
        versions of macOS automatically send diagnostics and usage data. This
        can be changed in the Privacy &amp; Security pane of System Settings.
        Diagnostic data may include location information.
      </p>
      <div className="mt-[clamp(48px,12vh,120px)] flex justify-center">
        <button className="flex items-center gap-1 text-[13px] text-[#0a5fe0] dark:text-[#4c9bff]">
          <span className="flex size-3 items-center justify-center rounded-full bg-[#0a5fe0] text-[8px] text-white dark:bg-[#4c9bff]">
            i
          </span>
          About Device Analytics &amp; Privacy...
        </button>
      </div>
    </div>
  )
}

const SCREENTIME_ROWS = [
  {
    label: "Weekly Reports",
    desc: "View daily and weekly charts and get insights about your screen time.",
    icon: Hourglass,
  },
  {
    label: "Downtime and App Limits",
    desc: "Schedule time away from the screen and set daily time limits for apps or app categories.",
    icon: Clock3,
  },
  {
    label: "Content & Privacy Restrictions",
    desc: "Restrict settings for contacts, explicit content, purchases and downloads, and privacy.",
    icon: Ban,
  },
  {
    label: "Screen Time Passcode",
    desc: "Manage screen time for children from your Mac or iOS device, or use a screen time passcode on your child's device.",
    icon: LayoutGrid,
  },
]

function ScreenTimeStep() {
  return (
    <div className="w-[min(560px,84%)]">
      <h1 className="text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Screen Time
      </h1>
      <p className="mt-1 text-[15px] leading-snug text-black/65 dark:text-white/65">
        Get a weekly report with insights about your screen time, and set time
        limits for apps and websites you want to manage. Adults can also set
        parental controls for a child&apos;s device.
      </p>
      <div className="mt-5 space-y-4">
        {SCREENTIME_ROWS.map(({ label, desc, icon: Icon }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon
              className="mt-0.5 size-6 shrink-0 text-[#0a5fe0] dark:text-[#4c9bff]"
              strokeWidth={1.8}
            />
            <span>
              <span className="block text-[14px] font-semibold text-black/85 dark:text-white/90">
                {label}
              </span>
              <span className="block text-[13px] leading-snug text-black/60 dark:text-white/60">
                {desc}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SiriOrb() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/siri.png"
      alt="Siri"
      draggable={false}
      className="size-[clamp(56px,9vh,76px)] h-40 w-40 object-contain"
    />
  )
}

function SiriStep({
  enabled,
  onChange,
}: {
  enabled: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="w-[min(560px,84%)]">
      <div className="flex justify-center">
        <SiriOrb />
      </div>
      <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Siri
      </h1>
      <p className="mt-1 text-[15px] leading-snug text-black/65 dark:text-white/65">
        Siri helps you get things done just by asking. Siri can also make
        suggestions before you ask in apps, search, and keyboards.
      </p>
      <label className="mt-4 flex cursor-default items-center justify-center gap-2">
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => onChange(!enabled)}
          className="size-4 shrink-0 accent-[#0a84ff]"
        />
        <span className="text-[14px] text-black/75 dark:text-white/75">
          Enable Ask Siri
        </span>
      </label>
      <p className="mx-auto mt-[clamp(48px,12vh,120px)] max-w-[480px] text-center text-[11px] leading-snug text-black/40 dark:text-white/40">
        Apple stores transcripts of your interactions with Siri and may review a
        subset of these transcripts. Siri may also send information like your
        audio, Siri settings, contacts, and location to Apple to process your
        request. Data is not associated with your Apple Account. About Siri,
        Dictation &amp; Privacy...
      </p>
    </div>
  )
}

function TouchIdStep() {
  return (
    <div className="w-[min(640px,90%)]">
      <div>
          <div className="flex -translate-x-24 -translate-y-20 flex-col gap-0">
            <div className="h-9 w-[600px] max-w-none shrink-0 bg-[#232326] dark:bg-black" />
            <div className="h-44 w-[600px] max-w-none shrink-0 overflow-hidden">
              <Image
                src="/touchid.png"
                alt="touchid"
                width={800}
                height={800}
                draggable={false}
                className="w-[600px] max-w-none"
              />
            </div>
            <div className="h-px w-[600px] max-w-none shrink-0 bg-black/15 dark:bg-white/15" />
          </div>
      </div>
      <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Touch ID
      </h1>
      <p className="mt-1 max-w-[440px] text-[15px] leading-snug text-black/65 dark:text-white/65">
        Use your fingerprint to unlock your Mac and make purchases with Apple
        Pay. Start by placing your finger or thumb on Touch ID.
      </p>
    </div>
  )
}

function LookStep() {
  const { theme, setTheme } = useTheme()

  const thumb = (id: string, label: string, left: string, right: string) => (
    <button
      key={id}
      onClick={() => transitionTheme(() => setTheme(id))}
      className="flex flex-col items-center gap-1.5"
    >
      <span
        className={`flex h-32 w-44 overflow-hidden rounded-lg border-2 ${
          theme === id
            ? "border-[#0a84ff]"
            : "border-black/10 dark:border-white/15"
        }`}
      >
        <span className={`flex h-full w-1/2 flex-col ${left}`}>
          <span className="flex gap-1 p-1.5">
            <span className="size-1.5 rounded-full bg-black/20 dark:bg-white/30" />
            <span className="size-1.5 rounded-full bg-black/20 dark:bg-white/30" />
            <span className="size-1.5 rounded-full bg-black/20 dark:bg-white/30" />
          </span>
          <span className="mx-1.5 mb-1 flex-1 rounded-sm bg-black/[0.06] dark:bg-white/10" />
          <span className="flex justify-center gap-1 pb-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="size-2 rounded-[3px] bg-black/15 dark:bg-white/20"
              />
            ))}
          </span>
        </span>
        <span className={`h-full w-1/2 ${right}`} />
      </span>
      <span className="text-[12px] text-black/70 dark:text-white/70">
        {label}
      </span>
    </button>
  )

  return (
    <div className="w-[min(700px,92%)]">
      <h1 className="text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Choose Your Look
      </h1>
      <p className="mt-1 max-w-[560px] text-[15px] leading-snug text-black/65 dark:text-white/65">
        Select an appearance and see how the Dock, menus, buttons, and windows
        adjust depending on which one you choose.
      </p>
      <p className="mt-3 text-[15px] text-black/65 dark:text-white/65">
        You can change this later in System Settings.
      </p>
      <div className="mt-12 flex items-start justify-between px-4">
        {thumb("light", "Light", "bg-white", "bg-white")}
        {thumb("system", "Auto", "bg-white", "bg-[#1c1c1e]")}
        {thumb("dark", "Dark", "bg-[#1c1c1e]", "bg-black")}
      </div>
    </div>
  )
}

function UpdateStep() {
  return (
    <div className="w-[min(560px,84%)]">
      <Cog
        className="size-[clamp(115px,10vh,210px)] text-[#0a84ff] dark:text-[#8fd8ff] dark:drop-shadow-[0_0_5px_rgba(143,216,255,0.9)]"
        strokeWidth={1.4}
      />
      <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-black/85 dark:text-white/90">
        Update Mac Automatically
      </h1>
      <p className="mt-1 max-w-[440px] text-[15px] leading-snug text-black/65 dark:text-white/65">
        Future software updates will be automatically downloaded and installed
        for you as they&apos;re released. You can manage this in Software Update
        settings.
      </p>
    </div>
  )
}

export default function Setup({
  onComplete,
}: {
  onComplete: (result: SetupResult) => void
}) {
  const [index, setIndex] = useState(0)
  const [defaultCountry] = useState(detectCountry)
  const [country, setCountry] = useState(defaultCountry)
  const [transfer, setTransfer] = useState("new")
  const [wifi, setWifi] = useState<string | null>(null)
  const [username, setUsername] = useState(() => {
    try {
      return window.localStorage.getItem("tahoe-username") ?? ""
    } catch {
      return ""
    }
  })
  const [avatar, setAvatar] = useState<string | null>(null)
  const [accountName, setAccountName] = useState("")
  const [password, setPassword] = useState("")
  const [verify, setVerify] = useState("")
  const [hint, setHint] = useState("")
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [siriEnabled, setSiriEnabled] = useState(true)
  const [timezoneCity, setTimezoneCity] = useState(guessTimezoneCity)

  const countries = useMemo(
    () => [defaultCountry, ...COUNTRIES.filter((c) => c !== defaultCountry)],
    [defaultCountry]
  )

  const step = STEPS[index]
  const isLast = index === STEPS.length - 1

  const passwordsMatch = !password || password === verify

  const next = () => {
    if (isLast)
      onComplete({
        country,
        transfer,
        wifi: wifi ?? "",
        username,
        accountName:
          accountName || username.toLowerCase().replace(/\s+/g, "") || "tahoe",
        avatar,
        password,
        hint,
        location: locationEnabled,
        timezone: timezoneCity,
        siri: siriEnabled,
      })
    else setIndex((i) => i + 1)
  }

  const back = () => setIndex((i) => Math.max(0, i - 1))

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
      style={{ fontFamily: SF_FONT }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
      transition={{ duration: 0.45 }}
    >
      <StatusBar />
      <div className="relative h-[min(680px,80vh)] w-[min(920px,94vw)] overflow-hidden rounded-[34px] bg-[#ebebed] shadow-[0_36px_100px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.7)] dark:bg-black dark:shadow-[0_36px_100px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)]">
        {index > 0 && (
          <button
            onClick={back}
            aria-label="Back"
            className="absolute top-6 left-7 z-10 text-[#0a5fe0] dark:text-[#4c9bff]"
          >
            <ChevronLeft className="size-6" strokeWidth={2.2} />
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className={`flex h-full flex-col items-center overflow-y-auto pt-[clamp(32px,7vh,72px)] pb-24 ${
              step === "touchid" ? "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : ""
            }`}
          >
            {step === "country" && (
              <CountryStep
                countries={countries}
                value={country}
                onChange={setCountry}
                onSubmit={next}
              />
            )}
            {step === "transfer" && (
              <TransferStep value={transfer} onChange={setTransfer} />
            )}
            {step === "languages" && <LanguagesStep />}
            {step === "accessibility" && <AccessibilityStep />}
            {step === "wifi" && <WifiStep value={wifi} onChange={setWifi} />}
            {step === "privacy" && <PrivacyStep />}
            {step === "account" && (
              <AccountStep
                username={username}
                onUsername={setUsername}
                accountName={accountName}
                onAccountName={setAccountName}
                avatar={avatar}
                onAvatar={setAvatar}
                password={password}
                onPassword={setPassword}
                verify={verify}
                onVerify={setVerify}
                hint={hint}
                onHint={setHint}
              />
            )}
            {step === "terms" && <TermsStep onAccept={next} />}
            {step === "location" && (
              <LocationStep
                enabled={locationEnabled}
                onChange={setLocationEnabled}
              />
            )}
            {step === "timezone" && (
              <TimezoneStep city={timezoneCity} onChange={setTimezoneCity} />
            )}
            {step === "analytics" && <AnalyticsStep />}
            {step === "screentime" && <ScreenTimeStep />}
            {step === "siri" && (
              <SiriStep enabled={siriEnabled} onChange={setSiriEnabled} />
            )}
            {step === "touchid" && <TouchIdStep />}
            {step === "look" && <LookStep />}
            {step === "update" && <UpdateStep />}
          </motion.div>
        </AnimatePresence>

        {step === "languages" && (
          <button className="absolute bottom-8 left-9 h-10 rounded-full bg-black/[0.07] px-6 text-[14px] font-medium text-black/60 transition-colors hover:bg-black/[0.12] dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15">
            Customize Settings
          </button>
        )}

        {step === "touchid" && (
          <>
            <button
              onClick={next}
              className="absolute bottom-8 left-9 h-10 rounded-full bg-black/[0.07] px-6 text-[14px] font-medium text-black/60 transition-colors hover:bg-black/[0.12] dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15"
            >
              Set Up Touch ID Later
            </button>
            <button className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-1 text-[13px] text-[#0a84ff] dark:text-[#4c9bff]">
              <span className="flex size-3 items-center justify-center rounded-full bg-[#0a84ff] text-[8px] text-white dark:bg-[#4c9bff]">
                i
              </span>
              About Touch ID &amp; Privacy...
            </button>
          </>
        )}
        {step === "wifi" && (
          <button className="absolute bottom-8 left-9 h-10 rounded-full bg-black/[0.07] px-6 text-[14px] font-medium text-black/60 transition-colors hover:bg-black/[0.12] dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15">
            Other Network Options
          </button>
        )}

        {step === "update" && (
          <button
            onClick={next}
            className="absolute bottom-8 left-9 h-10 rounded-full bg-black/[0.07] px-6 text-[14px] font-medium text-black/60 transition-colors hover:bg-black/[0.12] dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15"
          >
            Only Download Automatically
          </button>
        )}
        {step === "screentime" && (
          <button
            onClick={next}
            className="absolute right-48 bottom-8 h-11 min-w-32 rounded-full bg-white px-8 text-[15px] font-medium text-black/65 shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-all hover:bg-white/85 dark:bg-white/10 dark:text-white/70 dark:shadow-[0_12px_32px_rgba(0,0,0,0.55)] dark:hover:bg-white/15"
          >
            Set Up Later
          </button>
        )}
        {step !== "terms" && (
          <button
            onClick={next}
            disabled={
              (step === "wifi" && !wifi) ||
              (step === "account" && (!username.trim() || !passwordsMatch))
            }
            className="absolute right-9 bottom-8 h-11 min-w-37.5 select-none rounded-full bg-white px-10 text-[15px] font-medium text-black/65 shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-all enabled:hover:bg-white/85 disabled:opacity-60 dark:bg-white/10 dark:text-white/70 dark:shadow-[0_12px_32px_rgba(0,0,0,0.55)] dark:enabled:hover:bg-white/15"
          >
            {step === "accessibility" ? "Not Now" : "Continue"}
          </button>
        )}
      </div>

      <p className="mt-7 max-w-xl text-center text-[15px] leading-snug font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <span className="block">
          Press the escape key to hear how to set up your Mac with VoiceOver.
        </span>
        <span className="block">
          Triple-click Touch ID to view accessibility options.
        </span>
      </p>
    </motion.div>
  )
}
