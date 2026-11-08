'use client'
import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import MacOSMenuBar from "@/components/topBar"
import MacOSDock from "@/components/dock"
import MacWindow from "@/components/MacWindow"
import SystemSettings from "@/components/SystemSettings"
import Wallpaper, {
  loadCustomWallpaper,
  loadWallpaper,
  saveCustomWallpaper,
  saveWallpaper,
  type WallpaperChoice,
} from "@/components/wallpaper"
import { SafariBrowser } from "@/components/Safari"
import { useTheme } from "next-themes"
import Spotlight from "@/components/spotlight"
import ControlCenter from "@/components/control-center"
import AppsDialog from "@/components/AppsDialog"
import Terminal from "@/components/Terminal"
import LoadingScreen from "@/components/loading-screen"
import AboutMac from "@/components/AboutMac"
import Finder from "@/components/Finder"
import Messages from "@/components/Messages"
import Mail from "@/components/Mail"
import Maps from "@/components/Maps"
import Photos from "@/components/Photos"
import FaceTime from "@/components/FaceTime"
import CalendarApp from "@/components/Calendar"
import Contacts from "@/components/Contacts"
import Reminders from "@/components/Reminders"
import Notes from "@/components/Notes"
import Music from "@/components/Music"
import Podcasts from "@/components/Podcasts"
import AppStore from "@/components/AppStore"
import PowerDialog, { type PowerKind } from "@/components/power-dialog"
import DesktopMenu, { type DesktopAction } from "@/components/desktop-menu"
import StartupManager, { type StartupChoice } from "@/components/startup-disk"
import Recovery, { type RecoveryOption } from "@/components/recovery"
import Reinstall from "@/components/reinstall"
import DiskUtility from "@/components/diskutility"
import { RecoveryTopBar } from "@/components/topBar"
import { displayNameForApp, menusForApp } from "@/lib/app-menus"
import { getWindowConfig } from "@/lib/window-config"
import Lockscreen from "@/components/lockscreen"
import Setup, { type SetupResult } from "@/components/setup"
import Welcome from "@/components/welcome"
import { DEFAULT_ACCOUNT, hashPassword, loadAccount, saveAccount, verifyPassword, type Account } from "@/lib/account"

const APPS = [
  { id: "finder", name: "Finder", icon: "/icons/Finder.png" },
  { id: "safari", name: "Safari", icon: "/icons/Safari.png" },
  { id: "messages", name: "Messages", icon: "/icons/Messages.png" },
  { id: "mail", name: "Mail", icon: "/icons/Mail.png" },
  { id: "maps", name: "Maps", icon: "/icons/Maps.png" },
  { id: "photos", name: "Photos", icon: "/icons/Photos.png" },
  { id: "facetime", name: "FaceTime", icon: "/icons/FaceTime.png" },
  { id: "calendar", name: "Calendar", icon: "/icons/Calendar.png" },
  { id: "contacts", name: "Contacts", icon: "/icons/Contacts.png" },
  { id: "reminders", name: "Reminders", icon: "/icons/Reminders.png" },
  { id: "notes", name: "Notes", icon: "/icons/Notes.png" },
  { id: "music", name: "Music", icon: "/icons/Music.png" },
  { id: "podcasts", name: "Podcasts", icon: "/icons/Podcasts.png" },
  { id: "appstore", name: "App Store", icon: "/icons/App Store.png" },
  { id: "settings", name: "System Settings", icon: "/icons/System Settings.png" },
  { id: "terminal", name: "Terminal", icon: "/icons/Terminal.png" },
  { id: "apps", name: "Apps", icon: "/icons/Launch Pad.png" },
  { id: "trash", name: "Trash", icon: "/icons/Trash Empty.png" },
]

const ABOUT_APP = { id: "about", name: "About This Mac", icon: "/apple.png" }

function ClockWidget() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(id)
  }, [])
  return (
    <>
      <p className="text-[11px] opacity-60">
        {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </p>
      <p className="text-[28px] leading-tight font-semibold tabular-nums">
        {now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false }).replace(/^0/, "")}
      </p>
    </>
  )
}

function AppContent({
  id,
  icon,
  name,
  onOpenApp,
  onClose,
  onLock,
  onWallpaper,
  apps,
  suspended,
  trashItems,
  onEmptyTrash,
}: {
  id: string
  icon?: string
  name?: string
  onOpenApp?: (id: string) => void
  onClose?: () => void
  onLock?: () => void
  onWallpaper?: (w: WallpaperChoice) => void
  apps?: string[]
  suspended?: boolean
  trashItems?: { name: string; modified: string; size: string; kind: string }[]
  onEmptyTrash?: () => void
}) {
  if (id === "safari") return <SafariBrowser suspended={suspended} />
  if (id === "finder") return <Finder trashItems={trashItems} onEmptyTrash={onEmptyTrash} />
  if (id === "trash")
    return <Finder initialFolder="Trash" trashItems={trashItems} onEmptyTrash={onEmptyTrash} />
  if (id === "messages") return <Messages />
  if (id === "mail") return <Mail />
  if (id === "maps") return <Maps suspended={suspended} />
  if (id === "photos") return <Photos />
  if (id === "facetime") return <FaceTime />
  if (id === "calendar") return <CalendarApp />
  if (id === "contacts") return <Contacts />
  if (id === "reminders") return <Reminders />
  if (id === "notes") return <Notes/>
  if (id === "music") return <Music />
  if (id === "podcasts") return <Podcasts />
  if (id === "appstore") return <AppStore />
  if (id === "terminal")
    return (
      <Terminal
        apps={apps}
        onOpenApp={onOpenApp}
        onClose={onClose}
        onLock={onLock}
        onWallpaper={onWallpaper}
      />
    )
  if (id === "about") return <AboutMac onMoreInfo={() => onOpenApp?.("settings")} />
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-white">
      {icon && (
        <img
          src={icon}
          alt={name ?? id}
          width={72}
          height={72}
          draggable={false}
          className="h-[72px] w-[72px] rounded-[16px]"
        />
      )}
      <p className="text-[15px] font-semibold text-white/90">{name ?? id}</p>
      <p className="text-[12px] text-white/60">Coming soon</p>
    </div>
  )
}

export default function Page() {
  const [unlocked, setUnlocked] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [booted, setBooted] = useState(false)
  const [account, setAccount] = useState<Account | null>(null)
  const [wallpaper, setWallpaper] = useState<WallpaperChoice>("light")
  const [customSrc, setCustomSrc] = useState<string | null>(null)
  const [windows, setWindows] = useState<string[]>([])
  const [minimized, setMinimized] = useState<Record<string, boolean>>({})
  const [maximized, setMaximized] = useState<Record<string, boolean>>({})
  const [order, setOrder] = useState<string[]>([])
  const [spotlightOpen, setSpotlightOpen] = useState(false)
  const [appsOpen, setAppsOpen] = useState(false)
  const [controlCenterOpen, setControlCenterOpen] = useState(false)
  const [brightness, setBrightness] = useState(() => {
    try {
      return Number(window.localStorage.getItem("tahoe-brightness") ?? 100)
    } catch {
      return 100
    }
  })
  const appsRef = useRef<HTMLDivElement>(null)
  const [spotlightQuery, setSpotlightQuery] = useState("")
  const spotlightRef = useRef<HTMLDivElement>(null)
  const [powerAction, setPowerAction] = useState<PowerKind | null>(null)
  const [blackout, setBlackout] = useState<"sleep" | "off" | null>(null)
  const [closeFailed, setCloseFailed] = useState(false)
  const [lockMode, setLockMode] = useState<"password" | "none">("password")
  const [recoveryView, setRecoveryView] = useState<"options" | "reinstall">("options")
  const [diskOpen, setDiskOpen] = useState(false)
  const [screen, setScreen] = useState<"macos" | "startup" | "recovery">("macos")
  const [deskMenu, setDeskMenu] = useState<{ x: number; y: number } | null>(null)
  const [stacks, setStacks] = useState(false)
  const [deskFolders, setDeskFolders] = useState<{ id: number; name: string; rx: number; ry: number }[]>(() => {
    try {
      const raw = JSON.parse(window.localStorage.getItem("tahoe-deskfolders") ?? "[]")
      if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "object") return raw
      const names: string[] = Array.isArray(raw) ? raw : []
      return names.map((name, i) => ({ id: Date.now() + i, name, rx: 12, ry: 12 + i * 92 }))
    } catch {
      return []
    }
  })
  const [folderMenu, setFolderMenu] = useState<{ x: number; y: number; id: number } | null>(null)
  const [renaming, setRenaming] = useState<{ id: number; value: string } | null>(null)
  const dragRef = useRef<{ id: number; startX: number; startY: number; origRx: number; origRy: number; moved: boolean } | null>(null)
  const [trashItems, setTrashItems] = useState([
    { name: "untitled folder 5", modified: "Today at 8:14 AM", size: "0 bytes", kind: "Folder" },
    { name: "untitled folder 5.zip", modified: "Today at 8:15 AM", size: "4 KB", kind: "ZIP Archive" },
  ])
  const [widgetsOpen, setWidgetsOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const themedApps = APPS.map((a) => {
    const file =
      a.id === "trash" && trashItems.length > 0 ? "Trash Full.png" : a.icon.split("/").pop()
    return { ...a, icon: isDark ? `/icons/dark/${file}` : `/icons/${file}` }
  })

  const bootTimer = useRef<number | null>(null)
  const recoveryQueued = useRef(false)

  useEffect(() => {
    const syncBrightness = (event: Event) => {
      const value = (event as CustomEvent<number>).detail
      if (Number.isFinite(value)) setBrightness(value)
    }
    window.addEventListener("tahoe-brightness-change", syncBrightness)
    return () => window.removeEventListener("tahoe-brightness-change", syncBrightness)
  }, [])

  const changeBrightness = (value: number) => {
    setBrightness(value)
    try {
      window.localStorage.setItem("tahoe-brightness", String(value))
      window.dispatchEvent(new CustomEvent("tahoe-brightness-change", { detail: value }))
    } catch {}
  }

  const boot = () => {
    setBooted(false)
    if (bootTimer.current) window.clearTimeout(bootTimer.current)
    bootTimer.current = window.setTimeout(() => {
      setBooted(true)
      if (recoveryQueued.current) {
        recoveryQueued.current = false
        setRecoveryView("options")
        setDiskOpen(false)
        setUnlocked(false)
        setScreen("recovery")
      }
    }, 2600)
  }

  useEffect(() => {
    setWallpaper(loadWallpaper())
    setCustomSrc(loadCustomWallpaper())
    setAccount(loadAccount())
    for (const src of [
      "/light.jpg",
      "/dark.jpg",
      "/aerial/lake.jpg",
      "/wallpaper1.jpg",
      "/bmw1.jpg",
      "/bmw.jpg",
    ]) {
      const img = new Image()
      img.src = src
    }
    boot()
    return () => {
      if (bootTimer.current) window.clearTimeout(bootTimer.current)
    }
  }, [])

  useEffect(() => {
    const other = resolvedTheme === "dark" ? "light" : "dark"
    for (const a of APPS) {
      const file = a.icon.split("/").pop()
      const img = new Image()
      img.src = other === "dark" ? `/icons/dark/${file}` : `/icons/${file}`
    }
  }, [resolvedTheme])

  const changeWallpaper = (w: WallpaperChoice) => {
    setWallpaper(w)
    saveWallpaper(w)
  }

  const saveCustom = (src: string) => {
    setCustomSrc(src)
    saveCustomWallpaper(src)
    changeWallpaper("custom")
  }

  const completeSetup = async ({ country, username, accountName, avatar, password, hint }: SetupResult) => {
    const created: Account = {
      ...DEFAULT_ACCOUNT,
      fullName: username.trim() || "tahoe",
      username: accountName || "tahoe",
      avatar: avatar ?? "/memoji/cat.webp",
      passwordHash: password ? await hashPassword(accountName || "tahoe", password) : "",
      hint,
      country,
    }
    saveAccount(created)
    setAccount(created)
    setUnlocked(true)
    setShowWelcome(true)
  }

  const eraseAllContent = () => {
    window.localStorage.clear()
    window.location.reload()
  }

  const focusApp = (id: string) =>
    setOrder((prev) => [...prev.filter((a) => a !== id), id])

  const openApp = (id: string) => {
    if (id === "apps") {
      setSpotlightOpen(false)
      setAppsOpen(true)
      return
    }
    setWindows((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setMinimized((prev) => ({ ...prev, [id]: false }))
    focusApp(id)
  }

  const closeApp = (id: string) => {
    setWindows((prev) => prev.filter((a) => a !== id))
    setOrder((prev) => prev.filter((a) => a !== id))
  }

  const closeControlCenter = useCallback(() => setControlCenterOpen(false), [])

  const toggleControlCenter = useCallback(() => {
    setSpotlightOpen(false)
    setAppsOpen(false)
    setControlCenterOpen((open) => !open)
  }, [])

  const lockScreen = () => {
    setSpotlightOpen(false)
    setAppsOpen(false)
    setControlCenterOpen(false)
    setPowerAction(null)
    setLockMode("none")
    setUnlocked(false)
  }

  const logout = () => {
    setSpotlightOpen(false)
    setControlCenterOpen(false)
    setPowerAction(null)
    setLockMode("password")
    setUnlocked(false)
  }

  const enterStartup = () => {
    setSpotlightOpen(false)
    setAppsOpen(false)
    setControlCenterOpen(false)
    setPowerAction(null)
    setBlackout("off")
    window.setTimeout(() => {
      setBlackout(null)
      setUnlocked(false)
      setScreen("startup")
      boot()
    }, 1200)
  }

  const leaveStartup = (choice: StartupChoice) => {
    setRecoveryView("options")
    setDiskOpen(false)
    if (choice === "Options") {
      setScreen("recovery")
      boot()
    } else {
      setScreen("macos")
      setUnlocked(false)
      setLockMode("password")
      boot()
    }
  }

  const handleRecoveryOption = (opt: RecoveryOption) => {
    if (opt === "reinstall") setRecoveryView("reinstall")
    else if (opt === "safari") window.open("https://support.apple.com/mac", "_blank", "noopener")
    else if (opt === "diskutil") setDiskOpen(true)
    else {
      setScreen("macos")
      setUnlocked(true)
      boot()
    }
  }

  const closeTab = () => {
    window.setTimeout(() => window.close(), 1200)
    window.setTimeout(() => window.close(), 1500)
    window.setTimeout(() => setCloseFailed(true), 1900)
  }

  const powerOnAgain = () => {
    setCloseFailed(false)
    setBlackout(null)
    setScreen("macos")
    setRecoveryView("options")
    setUnlocked(false)
    setLockMode("password")
    boot()
  }

  const recoveryAction = (action: string) => {
    if (action === "shutdown") {
      setBlackout("off")
      closeTab()
    } else if (action === "restart") {
      setScreen("macos")
      setRecoveryView("options")
      setDiskOpen(false)
      setUnlocked(false)
      setLockMode("password")
      boot()
    }
  }

  const confirmPower = (kind: PowerKind, reopen: boolean) => {
    setPowerAction(null)
    if (!reopen) {
      setWindows([])
      setOrder([])
      setMinimized({})
      setMaximized({})
    }
    if (kind === "logout") {
      logout()
      return
    }
    setBlackout("off")
    if (kind === "shutdown") {
      closeTab()
      return
    }
    window.setTimeout(() => {
      setBlackout(null)
      setUnlocked(false)
      setLockMode("password")
      boot()
    }, 1200)
  }

  const frontApp = order.length > 0 ? order[order.length - 1] : "finder"

  const persistFolders = (next: { id: number; name: string; rx: number; ry: number }[]) => {
    try {
      window.localStorage.setItem("tahoe-deskfolders", JSON.stringify(next))
    } catch {}
  }

  const handleDesktopMenu = (action: DesktopAction) => {
    if (action === "new-folder") {
      const id = Date.now()
      setDeskFolders((prev) => {
        const n = prev.length + 1
        const next = [
          ...prev,
          {
            id,
            name: n === 1 ? "untitled folder" : `untitled folder ${n}`,
            rx: 12,
            ry: 110 + prev.length * 92,
          },
        ]
        persistFolders(next)
        return next
      })
      setRenaming({ id, value: "untitled folder" })
    } else if (action === "get-info") openApp("about")
    else if (action === "wallpaper") openApp("settings")
    else if (action === "widgets") setWidgetsOpen((v) => !v)
    else if (action === "toggle-stacks") setStacks((v) => !v)
  }

  const commitRename = () => {
    if (!renaming) return
    const value = renaming.value.trim() || "untitled folder"
    setDeskFolders((prev) => {
      const next = prev.map((f) => (f.id === renaming.id ? { ...f, name: value } : f))
      persistFolders(next)
      return next
    })
    setRenaming(null)
  }

  const moveToTrash = (id: number) => {
    const target = deskFolders.find((f) => f.id === id)
    if (target) {
      setTrashItems((t) => [
        ...t,
        { name: target.name, modified: "Today", size: "0 bytes", kind: "Folder" },
      ])
    }
    setDeskFolders((prev) => {
      const next = prev.filter((f) => f.id !== id)
      persistFolders(next)
      return next
    })
    setFolderMenu(null)
  }

  const onFolderPointerDown = (e: React.PointerEvent, id: number) => {
    if (e.button !== 0) return
    const f = deskFolders.find((d) => d.id === id)
    if (!f) return
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, origRx: f.rx, origRy: f.ry, moved: false }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const onFolderPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true
    if (!d.moved) return
    const rx = Math.max(0, d.origRx - dx)
    const ry = Math.max(0, d.origRy + dy)
    setDeskFolders((prev) => {
      const next = prev.map((f) => (f.id === d.id ? { ...f, rx, ry } : f))
      persistFolders(next)
      return next
    })
  }

  const endFolderDrag = () => {
    dragRef.current = null
  }

  const onDesktopContextMenu = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-window],[data-dock],[data-menubar]")) return
    e.preventDefault()
    setDeskMenu({ x: e.clientX, y: e.clientY })
  }
  const frontAppName =
    displayNameForApp(frontApp, themedApps.find((a) => a.id === frontApp)?.name ?? "Finder")

  const handleMenuAction = (action: string) => {
    if (action === "about") openApp("about")
    else if (action === "preferences") openApp("settings")
    else if (action === "app-store") openApp("appstore")
    else if (action === "lock") lockScreen()
    else if (action === "sleep") setBlackout("sleep")
    else if (action === "restart" || action === "shutdown" || action === "logout")
      setPowerAction(action)
    else if (action === "quit" || action === "close-window") {
      if (order.length > 0) closeApp(order[order.length - 1])
    } else if (action === "force-quit") {
      setWindows([])
      setOrder([])
      setMinimized({})
      setMaximized({})
    } else if (action === "minimize") {
      if (order.length > 0)
        setMinimized((prev) => ({ ...prev, [order[order.length - 1]]: true }))
    }
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!booted && (e.metaKey || e.ctrlKey) && e.code === "KeyR") {
        e.preventDefault()
        recoveryQueued.current = true
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault()
        setSpotlightOpen((prev) => !prev)
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === "KeyQ") {
        e.preventDefault()
        setPowerAction("logout")
      } else if (e.ctrlKey && e.altKey && e.code === "KeyQ") {
        e.preventDefault()
        lockScreen()
      } else if (e.key === "Escape") {
        setSpotlightOpen(false)
        setAppsOpen(false)
        setControlCenterOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [booted])

  useEffect(() => {
    if (!folderMenu) return
    const close = (e: Event) => {
      if ((e.target as HTMLElement).closest?.("[data-foldermenu]")) return
      setFolderMenu(null)
    }
    document.addEventListener("mousedown", close)
    document.addEventListener("touchstart", close)
    return () => {
      document.removeEventListener("mousedown", close)
      document.removeEventListener("touchstart", close)
    }
  }, [folderMenu])

  useEffect(() => {
    if (!spotlightOpen && !appsOpen) return
    const onPointerDown = (e: Event) => {
      if (spotlightRef.current && !spotlightRef.current.contains(e.target as Node)) {
        setSpotlightOpen(false)
      }
      if (appsRef.current && !appsRef.current.contains(e.target as Node)) {
        setAppsOpen(false)
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("touchstart", onPointerDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("touchstart", onPointerDown)
    }
  }, [spotlightOpen, appsOpen])

  return (
    <div className="relative min-h-svh overflow-hidden bg-black [touch-action:manipulation]">
      {booted && <Wallpaper choice={wallpaper} customSrc={customSrc} />}

      {!booted && screen !== "macos" && <LoadingScreen key="boot-overlay" />}
      <AnimatePresence mode="wait">
        {screen !== "macos" ? null : !booted ? (
          <LoadingScreen key="boot" />
        ) : !account ? (
          <Setup key="setup" onComplete={completeSetup} />
        ) : showWelcome ? (
          <Welcome key="welcome" onContinue={() => setShowWelcome(false)} />
        ) : !unlocked ? (
          <Lockscreen
            key="lock"
            user={account}
            verify={(password) => verifyPassword(account, password)}
            onUnlock={() => setUnlocked(true)}
            noPassword={lockMode === "none"}
          />
        ) : (
          <motion.div
            key="desktop"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10 flex flex-col"
          >
            <MacOSMenuBar
              appName={frontAppName}
              menus={menusForApp(frontApp, frontAppName)}
              onSpotlight={() => {
                setAppsOpen(false)
                setControlCenterOpen(false)
                setSpotlightOpen(true)
              }}
              onControlCenter={toggleControlCenter}
              onMenuAction={handleMenuAction}
            />
            <AnimatePresence>
              {controlCenterOpen && (
                <motion.div
                  key="control-center"
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -6 }}
                  transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
                  style={{ transformOrigin: "top right" }}
                  className="absolute top-[38px] right-2 z-50"
                >
                  <ControlCenter
                    brightness={brightness}
                    onBrightnessChange={changeBrightness}
                    onClose={closeControlCenter}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative flex-1" onContextMenu={onDesktopContextMenu}>
              <button
                onDoubleClick={enterStartup}
                className="absolute top-3 right-3 z-[5] flex w-max flex-col items-center gap-1 select-none"
                aria-label="Recovery"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/macosinstaller.png"
                  alt=""
                  draggable={false}
                  className="h-14 w-14 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
                />
                <span className="max-w-full truncate rounded px-1 text-center text-[11px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                  Install macOS
                </span>
              </button>
              <div className="pointer-events-none absolute inset-0 z-[5]">
                {(stacks && deskFolders.length > 0
                  ? [{ id: -1, name: "Desktop Stack", rx: 12, ry: 12 }]
                  : deskFolders
                ).map((f) => (
                  <button
                    key={f.id}
                    onDoubleClick={() => {
                      if (dragRef.current?.moved) return
                      openApp("finder")
                    }}
                    onContextMenu={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      if (f.id === -1) return
                      setFolderMenu({ x: e.clientX, y: e.clientY, id: f.id })
                    }}
                    onPointerDown={(e) => f.id !== -1 && onFolderPointerDown(e, f.id)}
                    onPointerMove={onFolderPointerMove}
                    onPointerUp={endFolderDrag}
                    onPointerCancel={endFolderDrag}
                    className="pointer-events-auto absolute flex w-20 touch-none flex-col items-center gap-1 select-none"
                    style={{ right: f.rx, top: f.ry }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/sf/folder.svg" alt="" draggable={false} className="sf-blue h-12 w-14 object-contain" />
                    {renaming?.id === f.id ? (
                      <input
                        autoFocus
                        value={renaming.value}
                        onChange={(e) => setRenaming({ id: f.id, value: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename()
                          else if (e.key === "Escape") setRenaming(null)
                          e.stopPropagation()
                        }}
                        onBlur={commitRename}
                        onPointerDown={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                        aria-label="Folder name"
                        className="w-20 rounded bg-white px-1 text-center text-[11px] text-black outline-none"
                      />
                    ) : (
                      <span className="max-w-full truncate rounded px-1 text-center text-[11px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                        {f.name}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {folderMenu && (
                <div
                  data-foldermenu
                  className="tahoe-glass-dark fixed z-[9999] w-48 rounded-2xl py-1.5 text-white"
                  style={{ left: Math.min(folderMenu.x, window.innerWidth - 200), top: folderMenu.y }}
                >
                  <button
                    onClick={() => {
                      setFolderMenu(null)
                      openApp("finder")
                    }}
                    className="block w-full px-3 py-[5px] text-left text-[13px] hover:bg-[#0a84ff]"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => {
                      const target = deskFolders.find((d) => d.id === folderMenu.id)
                      setFolderMenu(null)
                      if (target) setRenaming({ id: target.id, value: target.name })
                    }}
                    className="block w-full px-3 py-[5px] text-left text-[13px] hover:bg-[#0a84ff]"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => moveToTrash(folderMenu.id)}
                    className="block w-full px-3 py-[5px] text-left text-[13px] hover:bg-[#0a84ff]"
                  >
                    Move to Trash
                  </button>
                </div>
              )}
              {widgetsOpen && (
                <div className="absolute top-3 left-3 z-[5] flex gap-2">
                  <div className="tahoe-glass w-36 rounded-2xl p-3 text-center">
                    <ClockWidget />
                  </div>
                  <div className="tahoe-glass w-36 rounded-2xl p-3 text-center">
                    <p className="text-[11px] opacity-60">Cupertino</p>
                    <p className="text-[28px] font-light">72°</p>
                    <p className="text-[11px] opacity-60">Sunny</p>
                  </div>
                </div>
              )}
              {windows.map((id) => {
                const app = themedApps.find((a) => a.id === id) ?? (id === "about" ? ABOUT_APP : undefined)
                const config = getWindowConfig(id)
                const z = order.indexOf(id)
                return (
                  <MacWindow
                    key={id}
                    title={app?.name ?? id}
                    icon={app?.icon}
                    variant={config.variant}
                    defaultWidth={config.width}
                    defaultHeight={config.height}
                    resizable={config.resizable}
                    minimized={!!minimized[id]}
                    maximized={!!maximized[id]}
                    focused={z === order.length - 1}
                    zIndex={10 + z}
                    onFocus={() => focusApp(id)}
                    onClose={() => closeApp(id)}
                    onMinimize={() => setMinimized((prev) => ({ ...prev, [id]: true }))}
                    onMaximize={() => setMaximized((prev) => ({ ...prev, [id]: !prev[id] }))}
                  >
                    {id === "settings" ? (
                      <SystemSettings
                        wallpaper={wallpaper}
                        onWallpaper={changeWallpaper}
                        customSrc={customSrc}
                        onCustom={saveCustom}
                        onErase={eraseAllContent}
                      />
                    ) : !minimized[id] ? (
                      <AppContent
                        id={id}
                        icon={app?.icon}
                        name={app?.name}
                        onOpenApp={openApp}
                        onClose={() => closeApp(id)}
                        onLock={lockScreen}
                        onWallpaper={changeWallpaper}
                        apps={APPS.map((a) => a.id)}
                        suspended={z !== order.length - 1}
                        trashItems={trashItems}
                        onEmptyTrash={() => setTrashItems([])}
                      />
                    ) : null}
                  </MacWindow>
                )
              })}
            </div>
            <div className="flex justify-center pb-4">
              <MacOSDock
                apps={themedApps}
                openApps={windows}
                onAppClick={(id) => {
                  setSpotlightOpen(false)
                  setAppsOpen(false)
                  if (id === "apps") {
                    setAppsOpen(true)
                    return
                  }
                  openApp(id)
                }}
                onAppClose={closeApp}
                onEmptyTrash={() => setTrashItems([])}
                onRemoveFromDock={() => {}}
                onShowInFinder={() => {}}
                onKeepInDock={() => {}}
              />
            </div>
            <AnimatePresence>
              {spotlightOpen && (
                <motion.div
                  key="spotlight"
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.18 }}
                  className="pointer-events-none absolute inset-x-0 top-[12vh] z-40 flex justify-center px-4"
                >
                  <div ref={spotlightRef} className="pointer-events-auto w-full max-w-150">
                    <Spotlight
                      isRevealed={spotlightOpen}
                      apps={themedApps}
                      query={spotlightQuery}
                      onQueryChange={setSpotlightQuery}
                      onOpenApp={(id) => {
                        setSpotlightOpen(false)
                        openApp(id)
                      }}
                      onLock={lockScreen}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {appsOpen && (
                <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-4">
                  <div ref={appsRef} className="pointer-events-auto">
                    <AppsDialog
                      apps={themedApps}
                      onOpen={(id) => {
                        setAppsOpen(false)
                        openApp(id)
                      }}
                    />
                  </div>
                </div>
              )}
            </AnimatePresence>
            {brightness < 100 && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[45] bg-black"
                style={{ opacity: ((100 - brightness) / 90) * 0.7 }}
              />
            )}
            {powerAction && (
              <PowerDialog
                kind={powerAction}
                onCancel={() => setPowerAction(null)}
                onConfirm={(reopen) => confirmPower(powerAction, reopen)}
              />
            )}
            {deskMenu && (
              <DesktopMenu
                x={deskMenu.x}
                y={deskMenu.y}
                stacks={stacks}
                onAction={handleDesktopMenu}
                onClose={() => setDeskMenu(null)}
              />
            )}
            {blackout && blackout === "sleep" && (
              <div
                className="absolute inset-0 z-50 bg-black"
                onClick={() => setBlackout(null)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {blackout && blackout === "off" && (
        <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-black">
          {closeFailed && (
            <>
              <p className="text-center text-[20px] text-white/80">
                Failed to close tab from browser restriction, power on again?
              </p>
              <button
                onClick={powerOnAgain}
                aria-label="Power on"
                className="cursor-pointer transition hover:scale-105 active:scale-95"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/powerbutton.png"
                  alt="Power"
                  draggable={false}
                  className="h-80 w-80 object-contain"
                />
              </button>
            </>
          )}
        </div>
      )}
      {screen === "startup" && booted && (
        <StartupManager
          onContinue={leaveStartup}
          onShutdown={() => {
            setBlackout("off")
            closeTab()
          }}
          onRestart={enterStartup}
        />
      )}
      {screen === "recovery" && booted && (
        <div className="absolute inset-0 z-[55] flex flex-col bg-[#0a0a0c]">
          <RecoveryTopBar onAction={recoveryAction} />
          <div className="flex flex-1 items-center justify-center px-4">
            {recoveryView === "reinstall" ? (
              <Reinstall
                onBack={() => setRecoveryView("options")}
                onInstall={() => {
                  try {
                    window.localStorage.clear()
                  } catch {}
                  setRecoveryView("options")
                  setScreen("macos")
                  setAccount(null)
                  setWallpaper("light")
                  setCustomSrc(null)
                  setWindows([])
                  setOrder([])
                  setMinimized({})
                  setMaximized({})
                  setDeskFolders([])
                  setTrashItems([])
                  setUnlocked(false)
                  setLockMode("password")
                  boot()
                }}
              />
            ) : (
              <Recovery onContinue={handleRecoveryOption} />
            )}
          </div>
          {diskOpen && (
            <div
              className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
              onClick={() => setDiskOpen(false)}
            >
              <div
                className="h-[min(560px,88vh)] w-[min(860px,94vw)]"
                onClick={(e) => e.stopPropagation()}
              >
                <DiskUtility onClose={() => setDiskOpen(false)} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
