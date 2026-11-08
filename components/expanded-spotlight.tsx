"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import {
  Accessibility,
  Bluetooth,
  Calendar,
  Calculator,
  Clock,
  Copy,
  Folder,
  Gamepad2,
  Globe,
  HelpCircle,
  LayoutGrid,
  Lock,
  Mail,
  MessageSquare,
  Monitor,
  Moon,
  Palette,
  Power,
  RefreshCw,
  RotateCcw,
  Settings,
  Search,
  ShieldCheck,
  Trash2,
  User,
  Volume1,
  Volume2,
  VolumeX,
  WandSparkles,
  Wifi,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { transitionTheme } from "@/lib/theme-transition"
import {
  SiHtml5,
  SiJavascript,
  SiMarkdown,
  SiTypescript,
  SiJson,
  SiPython,
  SiRust,
  SiGo,
  SiCplusplus,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiDocker,
  SiGit,
  SiYaml,
  SiReact,
  SiSass,
  SiGithub,
  SiYoutube,
  SiReddit,
  SiGoogle,
  SiSpotify,
  SiTwitch,
  SiDiscord,
} from "react-icons/si"
import {
  VscFile,
  VscFileCode,
  VscFileMedia,
  VscFilePdf,
  VscFileZip,
  VscFileBinary,
} from "react-icons/vsc"

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {}
}

function openUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer")
}

const categories = [
  { label: "Calendar", icon: <Calendar className="size-4.5" /> },
  {
    label: "Applications",
    icon: (
      <Image
        src="/store.png"
        draggable={false}
        width={24}
        height={24}
        alt="Applications"
        className="size-4.5"
      />
    ),
  },
  { label: "Actions", icon: <Image src="/actions.png" alt="" width={24} height={24} className="size-4.5" /> },
  { label: "Messages", icon: <MessageSquare className="size-4.5" /> },
  { label: "Help", icon: <HelpCircle className="size-4.5" /> },
  { label: "Mail", icon: <Mail className="size-4.5" /> },
  { label: "Settings", icon: <Settings className="size-4.5" /> },
]

const settingsPages = [
  { label: "Display", page: "display", icon: <Monitor className="size-5" /> },
  {
    label: "Bluetooth & Devices",
    page: "bluetoothdevices",
    icon: <Bluetooth className="size-5" />,
  },
  {
    label: "Network & Internet",
    page: "network",
    icon: <Wifi className="size-5" />,
  },
  {
    label: "Personalization",
    page: "personalization",
    icon: <Palette className="size-5" />,
  },
  {
    label: "Apps",
    page: "appsfeatures",
    icon: <LayoutGrid className="size-5" />,
  },
  { label: "Accounts", page: "accounts", icon: <User className="size-5" /> },
  {
    label: "Time & Language",
    page: "datetime",
    icon: <Clock className="size-5" />,
  },
  { label: "Gaming", page: "gaming", icon: <Gamepad2 className="size-5" /> },
  {
    label: "Accessibility",
    page: "easeofaccess",
    icon: <Accessibility className="size-5" />,
  },
  {
    label: "Privacy & Security",
    page: "privacy",
    icon: <ShieldCheck className="size-5" />,
  },
  {
    label: "Windows Update",
    page: "windowsupdate",
    icon: <RefreshCw className="size-5" />,
  },
  { label: "System", page: "system", icon: <Monitor className="size-5" /> },
]

const systemActions = [
  {
    id: "toggle-theme",
    label: "Toggle Dark Mode",
    keywords: "dark light mode theme appearance",
    icon: <Moon className="size-4" />,
  },
  {
    id: "lock",
    label: "Lock Screen",
    keywords: "lock screen",
    icon: <Lock className="size-4" />,
  },
]

const quickLinks = [
  { label: "GitHub", url: "https://github.com", icon: <SiGithub className="size-4" /> },
  { label: "YouTube", url: "https://youtube.com", icon: <SiYoutube className="size-4 text-[#ff0000]" /> },
  { label: "Reddit", url: "https://reddit.com", icon: <SiReddit className="size-4 text-[#ff4500]" /> },
  { label: "Google", url: "https://google.com", icon: <SiGoogle className="size-4" /> },
  { label: "Spotify", url: "https://open.spotify.com", icon: <SiSpotify className="size-4 text-[#1db954]" /> },
  { label: "X", url: "https://x.com", icon: <X className="size-4" /> },
  { label: "Twitch", url: "https://twitch.tv", icon: <SiTwitch className="size-4 text-[#9146ff]" /> },
  { label: "Discord", url: "https://discord.com", icon: <SiDiscord className="size-4 text-[#5865f2]" /> },
]

function evaluateMath(input: string): number | null {
  const expr = input.trim().toLowerCase()
  if (!/^[\d\s+\-*/().%^]+$/.test(expr)) return null
  if (!/\d/.test(expr)) return null
  try {
    const tokens = expr.replace(/\s+/g, "")
    let pos = 0
    const peek = () => tokens[pos]
    const next = () => tokens[pos++]

    function parseExpr(): number {
      let left = parseTerm()
      while (peek() === "+" || peek() === "-") {
        const op = next()
        const right = parseTerm()
        left = op === "+" ? left + right : left - right
      }
      return left
    }
    function parseTerm(): number {
      let left = parsePower()
      while (peek() === "*" || peek() === "/" || peek() === "%") {
        const op = next()
        const right = parsePower()
        left =
          op === "*"
            ? left * right
            : op === "/"
              ? left / right
              : left % right
      }
      return left
    }
    function parsePower(): number {
      const base = parseFactor()
      if (peek() === "^") {
        next()
        return Math.pow(base, parsePower())
      }
      return base
    }
    function parseFactor(): number {
      if (peek() === "-") {
        next()
        return -parseFactor()
      }
      if (peek() === "+") {
        next()
        return parseFactor()
      }
      if (peek() === "(") {
        next()
        const val = parseExpr()
        if (peek() === ")") next()
        return val
      }
      let num = ""
      while (peek() !== undefined && /[\d.]/.test(peek())) num += next()
      const val = Number(num)
      if (Number.isNaN(val)) throw new Error("bad number")
      return val
    }

    const result = parseExpr()
    if (pos !== tokens.length) return null
    if (!Number.isFinite(result)) return null
    return result
  } catch {
    return null
  }
}

const panelTransition = {
  duration: 0.24,
  ease: [0.16, 1, 0.3, 1] as const,
}

type AppEntry = {
  id: string
  name: string
  icon?: string | null
}

type FileEntry = {
  name: string
  path: string
  is_dir: boolean
}

const SHOW_COUNT = 5

function AppTile({
  app,
  onOpen,
}: {
  app: AppEntry
  onOpen?: (id: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(app.id)}
      className="flex h-12 w-full items-center gap-3 rounded-2xl border border-transparent px-3 text-left transition-colors hover:border-white/40 hover:bg-white/40"
    >
      {app.icon ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={app.icon}
          alt=""
          className="size-7 shrink-0 object-contain"
          draggable={false}
        />
      ) : (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/70 text-xs font-bold text-neutral-700 dark:bg-white/15 dark:text-white/80">
          {app.name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="truncate text-[13px] font-medium text-neutral-800 dark:text-white/90">
        {app.name}
      </span>
    </button>
  )
}

const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "svg"]

function isImage(path: string) {
  const ext = path.split(".").pop()?.toLowerCase()
  return ext ? imageExtensions.includes(ext) : false
}

function fileExtension(path: string) {
  return path.split(".").pop()?.toLowerCase() ?? ""
}

function FileTypeIcon({ path }: { path: string }) {
  const ext = fileExtension(path)
  const icons: Record<string, React.ReactNode> = {
    html: <SiHtml5 className="size-4 text-[#e34f26]" />,
    htm: <SiHtml5 className="size-4 text-[#e34f26]" />,
    js: <SiJavascript className="size-4 text-[#f7df1e]" />,
    mjs: <SiJavascript className="size-4 text-[#f7df1e]" />,
    cjs: <SiJavascript className="size-4 text-[#f7df1e]" />,
    jsx: <SiReact className="size-4 text-[#61dafb]" />,
    ts: <SiTypescript className="size-4 text-[#3178c6]" />,
    mts: <SiTypescript className="size-4 text-[#3178c6]" />,
    cts: <SiTypescript className="size-4 text-[#3178c6]" />,
    tsx: <SiReact className="size-4 text-[#61dafb]" />,
    css: <VscFileCode className="size-4 text-[#1572b6]" />,
    scss: <SiSass className="size-4 text-[#cc6699]" />,
    json: <SiJson className="size-4 text-[#f4d35e]" />,
    md: <SiMarkdown className="size-4 text-neutral-700" />,
    markdown: <SiMarkdown className="size-4 text-neutral-700" />,
    py: <SiPython className="size-4 text-[#3776ab]" />,
    rs: <SiRust className="size-4 text-[#dea584]" />,
    go: <SiGo className="size-4 text-[#00add8]" />,
    c: <SiCplusplus className="size-4 text-[#a8b9cc]" />,
    h: <SiCplusplus className="size-4 text-[#a8b9cc]" />,
    cpp: <SiCplusplus className="size-4 text-[#00599c]" />,
    hpp: <SiCplusplus className="size-4 text-[#00599c]" />,
    cs: <VscFileCode className="size-4 text-[#239120]" />,
    java: <VscFileCode className="size-4 text-[#f89820]" />,
    php: <SiPhp className="size-4 text-[#777bb4]" />,
    rb: <SiRuby className="size-4 text-[#cc342d]" />,
    swift: <SiSwift className="size-4 text-[#f05138]" />,
    kt: <SiKotlin className="size-4 text-[#7f52ff]" />,
    yml: <SiYaml className="size-4 text-[#cb171e]" />,
    yaml: <SiYaml className="size-4 text-[#cb171e]" />,
    dockerfile: <SiDocker className="size-4 text-[#2496ed]" />,
    gitignore: <SiGit className="size-4 text-[#f05033]" />,
    sh: <VscFileCode className="size-4 text-neutral-700" />,
    bat: <VscFileCode className="size-4 text-neutral-700" />,
    ps1: <VscFileCode className="size-4 text-neutral-700" />,
    pdf: <VscFilePdf className="size-4 text-[#e74025]" />,
    zip: <VscFileZip className="size-4 text-[#f9b234]" />,
    rar: <VscFileZip className="size-4 text-[#f9b234]" />,
    "7z": <VscFileZip className="size-4 text-[#f9b234]" />,
    tar: <VscFileZip className="size-4 text-[#f9b234]" />,
    gz: <VscFileZip className="size-4 text-[#f9b234]" />,
    mp3: <VscFileMedia className="size-4 text-[#1db954]" />,
    wav: <VscFileMedia className="size-4 text-[#1db954]" />,
    flac: <VscFileMedia className="size-4 text-[#1db954]" />,
    m4a: <VscFileMedia className="size-4 text-[#1db954]" />,
    mp4: <VscFileMedia className="size-4 text-[#ff6b6b]" />,
    mkv: <VscFileMedia className="size-4 text-[#ff6b6b]" />,
    avi: <VscFileMedia className="size-4 text-[#ff6b6b]" />,
    mov: <VscFileMedia className="size-4 text-[#ff6b6b]" />,
    webm: <VscFileMedia className="size-4 text-[#ff6b6b]" />,
    txt: <VscFileBinary className="size-4 text-neutral-700" />,
    doc: <VscFileCode className="size-4 text-[#2b579a]" />,
    docx: <VscFileCode className="size-4 text-[#2b579a]" />,
    xls: <VscFileBinary className="size-4 text-[#217346]" />,
    xlsx: <VscFileBinary className="size-4 text-[#217346]" />,
    ppt: <VscFileCode className="size-4 text-[#d24726]" />,
    pptx: <VscFileCode className="size-4 text-[#d24726]" />,
  }
  if (!ext) return <VscFile className="size-4 text-neutral-700" />
  return (
    <span className="flex size-4 items-center justify-center">
      {icons[ext] ?? <VscFile className="size-4 text-neutral-700" />}
    </span>
  )
}

function FileTile({ file }: { file: FileEntry }) {
  return (
    <div className="flex h-12 w-full items-center gap-3 rounded-2xl border border-transparent px-3 text-left">
      {file.is_dir ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/70 text-neutral-600 dark:bg-white/15 dark:text-white/80">
          <Folder className="size-4" />
        </span>
      ) : (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/70 text-neutral-600 dark:bg-white/15 dark:text-white/80">
          <FileTypeIcon path={file.path} />
        </span>
      )}
      <span className="truncate text-[13px] font-medium text-neutral-800 dark:text-white/90">
        {file.name}
      </span>
    </div>
  )
}

function SettingsTile({
  page,
  onOpen,
}: {
  page: (typeof settingsPages)[number]
  onOpen?: (id: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.("settings")}
      className="flex h-12 w-full items-center gap-3 rounded-2xl border border-transparent px-3 text-left transition-colors hover:border-white/40 hover:bg-white/40"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/70 text-neutral-600 dark:bg-white/15 dark:text-white/80">
        {page.icon}
      </span>
      <span className="truncate text-[13px] font-medium text-neutral-800 dark:text-white/90">
        {page.label}
      </span>
    </button>
  )
}

function ClipboardTile({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => copyText(text)}
      className="flex h-12 w-full items-center gap-3 rounded-2xl border border-transparent px-3 text-left transition-colors hover:border-white/40 hover:bg-white/40"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/70 text-neutral-600 dark:bg-white/15 dark:text-white/80">
        <Copy className="size-4" />
      </span>
      <span className="truncate text-[13px] font-medium text-neutral-800 dark:text-white/90">
        {text}
      </span>
    </button>
  )
}

function ActionTile({
  label,
  icon,
  onActivate,
}: {
  label: string
  icon: React.ReactNode
  onActivate: () => void
}) {
  return (
    <button
      type="button"
      onClick={onActivate}
      className="flex h-12 w-full items-center gap-3 rounded-2xl border border-transparent px-3 text-left transition-colors hover:border-white/40 hover:bg-white/40"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/70 text-neutral-600 dark:bg-white/15 dark:text-white/80">
        {icon}
      </span>
      <span className="truncate text-[13px] font-medium text-neutral-800 dark:text-white/90">
        {label}
      </span>
    </button>
  )
}

export default function ExpandedSpotlight({
  query,
  mode,
  onQueryChangeAction,
  apps,
  onOpenApp,
  onLock,
}: {
  query: string
  mode: {
    label: string
    icon: React.ReactNode
  } | null
  onQueryChangeAction: (value: string) => void
  apps: AppEntry[]
  onOpenApp?: (id: string) => void
  onLock?: () => void
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [manualCategory, setManualCategory] = useState<string | null>(null)
  const [manualMode, setManualMode] = useState<string | null>(null)
  const [files, setFiles] = useState<FileEntry[]>([])
  const [clipboard, setClipboard] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const runAction = (id: string) => {
    if (id === "toggle-theme") {
      transitionTheme(() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      )
    } else if (id === "lock") {
      onLock?.()
    }
  }

  const isExtensionQuery = query.trim().startsWith(".")
  const isEverything = mode === null

  const modeLabel = mode?.label ?? null
  const modeCategory = modeLabel
    ? categories.find((c) => c.label === modeLabel)?.label
    : null
  const effectiveManualCategory =
    manualMode === modeLabel ? manualCategory : null
  const activeCategory = effectiveManualCategory ?? modeCategory
  const isPillActive = effectiveManualCategory !== null

  const showClipboard = isPillActive
    ? activeCategory === "Clipboard"
    : isEverything
      ? !isExtensionQuery
      : modeLabel === "Clipboard"
  const showSettings = isPillActive
    ? activeCategory === "Settings"
    : activeCategory === "Settings" || (isEverything && !isExtensionQuery)
  const showActions = isPillActive
    ? activeCategory === "Actions"
    : modeLabel === "Actions"
  const showFiles = isPillActive
    ? activeCategory === "Files"
    : !showSettings &&
      !showClipboard &&
      !showActions &&
      (isEverything || modeLabel === "Files" || isExtensionQuery)
  const showApps = !showFiles && !showClipboard && !showSettings && !showActions

  const title =
    isExtensionQuery && modeLabel !== "Files"
      ? "Files"
      : (activeCategory ?? modeLabel ?? "Everything")

  useEffect(() => {
    if (!showFiles) return
    setFiles([])
  }, [query, showFiles])

  useEffect(() => {
    if (!showClipboard) return
    let cancelled = false
    navigator.clipboard
      ?.readText()
      .then((text) => {
        if (!cancelled && text) setClipboard([text])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [showClipboard])

  const normalized = query.trim().toLowerCase()
  const filterByQuery = (name: string) =>
    !normalized || name.toLowerCase().includes(normalized)

  const filteredApps = apps.filter((app) => filterByQuery(app.name))
  const filteredFiles = files.filter((file) => filterByQuery(file.name))
  const filteredClipboard = clipboard.filter((text) => filterByQuery(text))
  const filteredPages = settingsPages.filter((page) =>
    filterByQuery(page.label)
  )
  const filteredActions = systemActions.filter(
    (action) =>
      !normalized ||
      `${action.label} ${action.keywords}`.toLowerCase().includes(normalized)
  )
  const filteredLinks = quickLinks.filter((link) => filterByQuery(link.label))
  const mathResult = showActions && normalized ? evaluateMath(normalized) : null
  const webSearchQuery = showActions && normalized ? query.trim() : null

  const hasResults =
    (showApps && filteredApps.length > 0) ||
    (showFiles && filteredFiles.length > 0) ||
    (showClipboard && filteredClipboard.length > 0) ||
    (showSettings && filteredPages.length > 0) ||
    (showActions &&
      (filteredActions.length > 0 ||
        filteredLinks.length > 0 ||
        mathResult !== null ||
        webSearchQuery !== null))

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={panelTransition}
      className="mt-3 w-full max-w-150 overflow-hidden rounded-3xl border border-white/35 bg-white/50 text-black/85 shadow-[0_20px_60px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-2xl dark:border-white/15 dark:bg-black/60 dark:text-white/90 dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center gap-3 px-4 pt-3">
        <span className="relative z-10 text-[#6b7073]">
          <Search className="size-4.5" />
        </span>
        <Input
          ref={inputRef}
          placeholder="Spotlight Search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          name="expanded-spotlight-search"
          value={query}
          onChange={(event) => onQueryChangeAction(event.target.value)}
          className="h-10 w-full flex-1 rounded-full border border-transparent bg-transparent px-0 text-[18px] font-semibold text-black caret-black placeholder:font-normal placeholder:text-neutral-600/95 dark:text-white dark:caret-white dark:placeholder:text-white/40 focus-visible:border-transparent focus-visible:ring-0"
        />
      </div>

      <div className="h-px w-full translate-y-1 bg-white/40" />

      <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto px-3 pt-2 pb-3">
        {categories.map((category) => {
          const isActive = category.label === activeCategory
          return (
            <button
              key={category.label}
              type="button"
              onClick={() => {
                setManualCategory(category.label)
                setManualMode(mode?.label ?? null)
              }}
              className="relative flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-neutral-600 transition-colors dark:text-white/70"
            >
              {isActive && (
                <motion.span
                  layoutId="category-highlight"
                  transition={panelTransition}
                  className="absolute inset-0 rounded-full bg-white/70 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                />
              )}
              <span className="relative">{category.icon}</span>
              <span className="relative">{category.label}</span>
            </button>
          )
        })}
      </div>

      {activeCategory && (
        <div className="flex items-center gap-3 px-4 pt-3">
          <span className="flex size-12 shrink-0 items-center justify-center text-neutral-700 dark:text-white/80 [&_img]:size-9 [&_img]:object-contain [&_svg]:size-9">
            {categories.find((c) => c.label === activeCategory)?.icon ??
              mode?.icon}
          </span>
          <span className="truncate text-[26px] font-semibold text-neutral-700 dark:text-white/85">
            {activeCategory}
          </span>
        </div>
      )}

      {hasResults ? (
        <div className="flex scrollbar-none flex-col gap-0.5 overflow-y-auto px-3 pt-1 pb-3">
          <AnimatePresence initial={false} mode="popLayout">
            {showFiles &&
              filteredFiles
                .slice(0, SHOW_COUNT)
                .map((file) => (
                  <motion.div
                    key={file.path}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={panelTransition}
                  >
                    <FileTile file={file} />
                  </motion.div>
                ))}
            {showClipboard &&
              filteredClipboard
                .slice(0, SHOW_COUNT)
                .map((text) => (
                  <motion.div
                    key={text}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={panelTransition}
                  >
                    <ClipboardTile text={text} />
                  </motion.div>
                ))}
            {showSettings &&
              filteredPages
                .slice(0, SHOW_COUNT)
                .map((page) => (
                  <motion.div
                    key={page.page}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={panelTransition}
                  >
                    <SettingsTile page={page} onOpen={onOpenApp} />
                  </motion.div>
                ))}
            {showApps &&
              filteredApps
                .slice(0, SHOW_COUNT)
                .map((app) => (
                  <motion.div
                    key={app.name}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={panelTransition}
                  >
                    <AppTile app={app} onOpen={onOpenApp} />
                  </motion.div>
                ))}
            {showActions && (
              <>
                {mathResult !== null && (
                  <motion.div
                    key="math"
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={panelTransition}
                  >
                    <ActionTile
                      label={`${normalized} = ${mathResult}`}
                      icon={<Calculator className="size-4" />}
                      onActivate={() => copyText(String(mathResult))}
                    />
                  </motion.div>
                )}
                {webSearchQuery && (
                  <motion.div
                    key="web-search"
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={panelTransition}
                  >
                    <ActionTile
                      label={`Search the web for "${webSearchQuery}"`}
                      icon={<Globe className="size-4" />}
                      onActivate={() =>
                        openUrl(
                          `https://www.google.com/search?q=${encodeURIComponent(webSearchQuery)}`
                        )
                      }
                    />
                  </motion.div>
                )}
                {filteredActions.slice(0, SHOW_COUNT).map((action) => (
                  <motion.div
                    key={action.label}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={panelTransition}
                  >
                    <ActionTile
                      label={action.label}
                      icon={action.icon}
                      onActivate={() => runAction(action.id)}
                    />
                  </motion.div>
                ))}
                {filteredLinks.slice(0, SHOW_COUNT).map((link) => (
                  <motion.div
                    key={link.label}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={panelTransition}
                  >
                    <ActionTile
                      label={link.label}
                      icon={link.icon}
                      onActivate={() => openUrl(link.url)}
                    />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="px-4 py-6 text-center text-[13px] text-neutral-500/70 dark:text-white/40">
          {query.trim() ? `No results for “${query}”` : "No results"}
        </div>
      )}
    </motion.div>
  )
}
