"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { VPN_CONNECTED_CONFIG_STORAGE_KEY, VPN_ENABLED_STORAGE_KEY, VPN_MENU_BAR_STORAGE_KEY, VPN_STATUS_EVENT, type VpnStatus } from "@/lib/vpn-status"

export interface MenuItemOption {
  label?: string
  action?: string
  shortcut?: string
  type?: "item" | "separator"
  hasSubmenu?: boolean
}

export interface MenuConfig {
  label: string
  items: MenuItemOption[]
}

interface MacOSMenuBarProps {
  appName?: string
  menus?: MenuConfig[]
  onMenuAction?: (action: string) => void
  onSpotlight?: () => void
  onControlCenter?: () => void
  className?: string
}

interface BatteryManager extends EventTarget {
  level: number
  charging: boolean
}

export const SEPARATOR: MenuItemOption = { type: "separator" }

export const DEFAULT_MENUS: MenuConfig[] = [
  {
    label: "File",
    items: [
      { label: "New Tab", action: "new-tab", shortcut: "⌘T" },
      { label: "New Window", action: "new-window", shortcut: "⌘N" },
      { label: "New Private Window", action: "new-private", shortcut: "⇧⌘N" },
      SEPARATOR,
      { label: "Open File...", action: "open-file", shortcut: "⌘O" },
      { label: "Open Location...", action: "open-location", shortcut: "⌘L" },
      SEPARATOR,
      { label: "Close Window", action: "close-window", shortcut: "⇧⌘W" },
      { label: "Close Tab", action: "close-tab", shortcut: "⌘W" },
      { label: "Save Page As...", action: "save-page", shortcut: "⌘S" },
      SEPARATOR,
      { label: "Share", action: "share", hasSubmenu: true },
      SEPARATOR,
      { label: "Print...", action: "print", shortcut: "⌘P" },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Undo", action: "undo", shortcut: "⌘Z" },
      { label: "Redo", action: "redo", shortcut: "⇧⌘Z" },
      SEPARATOR,
      { label: "Cut", action: "cut", shortcut: "⌘X" },
      { label: "Copy", action: "copy", shortcut: "⌘C" },
      { label: "Paste", action: "paste", shortcut: "⌘V" },
      { label: "Select All", action: "select-all", shortcut: "⌘A" },
      SEPARATOR,
      { label: "Find", action: "find", shortcut: "⌘F" },
      { label: "Find Next", action: "find-next", shortcut: "⌘G" },
      { label: "Find Previous", action: "find-prev", shortcut: "⇧⌘G" },
      SEPARATOR,
      { label: "Emoji & Symbols", action: "emoji", shortcut: "⌃⌘␣" },
    ],
  },
  {
    label: "View",
    items: [
      { label: "as Icons", action: "view-icons", shortcut: "⌘1" },
      { label: "as List", action: "view-list", shortcut: "⌘2" },
      { label: "as Columns", action: "view-columns", shortcut: "⌘3" },
      { label: "as Gallery", action: "view-gallery", shortcut: "⌘4" },
      SEPARATOR,
      { label: "Use Stacks", action: "use-stacks", shortcut: "⌃⌘0" },
      { label: "Sort By", action: "sort-by", hasSubmenu: true },
      SEPARATOR,
      { label: "Hide Sidebar", action: "hide-sidebar", shortcut: "⌥⌘S" },
      { label: "Show Preview", action: "show-preview", shortcut: "⇧⌘P" },
      SEPARATOR,
      { label: "Enter Full Screen", action: "fullscreen", shortcut: "⌃⌘F" },
    ],
  },
  {
    label: "Go",
    items: [
      { label: "Back", action: "go-back", shortcut: "⌘[" },
      { label: "Forward", action: "go-forward", shortcut: "⌘]" },
      { label: "Enclosing Folder", action: "go-enclosing", shortcut: "⌘↑" },
      SEPARATOR,
      { label: "Recents", action: "go-recents", shortcut: "⇧⌘F" },
      { label: "Documents", action: "go-documents", shortcut: "⇧⌘O" },
      { label: "Desktop", action: "go-desktop", shortcut: "⇧⌘D" },
      { label: "Downloads", action: "go-downloads", shortcut: "⌥⌘L" },
      { label: "Applications", action: "go-applications", shortcut: "⇧⌘A" },
      SEPARATOR,
      { label: "Go to Folder...", action: "go-folder", shortcut: "⇧⌘G" },
    ],
  },
  {
    label: "Window",
    items: [
      { label: "Minimize", action: "minimize", shortcut: "⌘M" },
      { label: "Zoom", action: "zoom" },
      SEPARATOR,
      { label: "Cycle Through Windows", action: "cycle-windows", shortcut: "⌘`" },
      SEPARATOR,
      { label: "Bring All to Front", action: "bring-to-front" },
    ],
  },
  {
    label: "Help",
    items: [
      { label: "Search", action: "search-help" },
      SEPARATOR,
      { label: "App Help", action: "app-help" },
      { label: "Keyboard Shortcuts", action: "shortcuts" },
      SEPARATOR,
      { label: "Contact Support", action: "contact-support" },
    ],
  },
]

const APPLE_MENU_ITEMS: MenuItemOption[] = [
  { label: "About This Mac", action: "about" },
  SEPARATOR,
  { label: "System Preferences...", action: "preferences" },
  { label: "App Store...", action: "app-store" },
  SEPARATOR,
  { label: "Recent Items", action: "recent", hasSubmenu: true },
  SEPARATOR,
  { label: "Force Quit Applications...", action: "force-quit", shortcut: "⌥⌘⎋" },
  SEPARATOR,
  { label: "Sleep", action: "sleep" },
  { label: "Restart...", action: "restart" },
  { label: "Shut Down...", action: "shutdown" },
  SEPARATOR,
  { label: "Lock Screen", action: "lock", shortcut: "⌃⌘Q" },
  { label: "Log Out...", action: "logout", shortcut: "⇧⌘Q" },
]

const MENU_TOP = 34

const DROPDOWN_GLASS: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
  backdropFilter: "blur(30px) saturate(200%) brightness(1.1)",
  WebkitBackdropFilter: "blur(30px) saturate(200%) brightness(1.1)",
  border: "0.5px solid rgba(255, 255, 255, 0.28)",
  boxShadow:
    "0 2px 12px rgba(0, 0, 0, 0.18), inset 0 0.5px 0 rgba(255, 255, 255, 0.35)",
}

const MenuDropdown = React.memo(function MenuDropdown({
  items,
  x,
  onClose,
  onAction,
}: {
  items: MenuItemOption[]
  x: number
  onClose: () => void
  onAction: (action: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const handleOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handleOutside)
    document.addEventListener("touchstart", handleOutside)
    return () => {
      document.removeEventListener("mousedown", handleOutside)
      document.removeEventListener("touchstart", handleOutside)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute min-w-[220px] rounded-lg"
      style={{
        ...DROPDOWN_GLASS,
        left: x,
        top: MENU_TOP,
        zIndex: 60,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-4px)",
        transition:
          "opacity 150ms cubic-bezier(0.23, 1, 0.32, 1), transform 150ms cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div className="py-1">
        {items.map((item, index) =>
          item.type === "separator" ? (
            <div key={index} className="mx-2 my-1 h-px bg-white/15" />
          ) : (
            <div
              key={index}
              className="flex cursor-pointer items-center justify-between px-4 py-1 text-sm text-white transition-colors duration-100 hover:bg-white/10"
              onClick={() => {
                if (item.action) onAction(item.action)
                onClose()
              }}
            >
              <span className="flex items-center">
                {item.label}
                {item.hasSubmenu && (
                  <span className="ml-2 text-xs opacity-70">▶</span>
                )}
              </span>
              {item.shortcut && (
                <span className="ml-4 text-xs text-white/60">{item.shortcut}</span>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
})

const MenuClock = React.memo(function MenuClock() {
  const [stamp, setStamp] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const parts = Object.fromEntries(
        new Intl.DateTimeFormat("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
          .formatToParts(now)
          .map((part) => [part.type, part.value])
      )
      setStamp(
        `${parts.weekday} ${parts.day} ${parts.month} ${parts.hour}:${parts.minute}`
      )
    }
    update()
    const interval = setInterval(update, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className="cursor-pointer text-[13px] font-medium whitespace-nowrap text-white select-none"
      suppressHydrationWarning
    >
      {stamp}
    </span>
  )
})

const BatteryIndicator = React.memo(function BatteryIndicator() {
  const [level, setLevel] = useState(100)
  const [charging, setCharging] = useState(true)

  useEffect(() => {
    let battery: BatteryManager | null = null
    let cancelled = false

    const sync = () => {
      if (!battery) return
      setLevel(Math.round(battery.level * 100))
      setCharging(battery.charging)
    }

    const nav = navigator as Navigator & {
      getBattery?: () => Promise<BatteryManager>
    }

    nav
      .getBattery?.()
      .then((manager) => {
        if (cancelled) return
        battery = manager
        sync()
        manager.addEventListener("levelchange", sync)
        manager.addEventListener("chargingchange", sync)
      })
      .catch(() => {})

    return () => {
      cancelled = true
      battery?.removeEventListener("levelchange", sync)
      battery?.removeEventListener("chargingchange", sync)
    }
  }, [])

  const fill = charging ? "#34c759" : level < 20 ? "#ff3b30" : "#ffffff"

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] font-medium text-white">{level}%</span>
      <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
        <rect x="0.75" y="0.75" width="21.5" height="11.5" rx="3.25" stroke="white" strokeOpacity="0.55" strokeWidth="1.2" />
        <rect x="23.5" y="4.25" width="1.8" height="4.5" rx="0.9" fill="white" fillOpacity="0.55" />
        <rect x="2.25" y="2.25" width={Math.max(2, (level / 100) * 18.5)} height="8.5" rx="2" fill={fill} />
        {charging && (
          <path
            d="M12.6 2.6 8.2 7.2h2.6l-.7 3.2 4.4-4.7h-2.6l.7-3.1Z"
            fill="#1c1c1e"
          />
        )}
      </svg>
    </div>
  )
})

const TrayIcon = React.memo(function TrayIcon({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <div
      role="button"
      aria-label={label}
      onClick={onClick}
      className="flex cursor-pointer items-center transition-opacity duration-150 hover:opacity-70"
    >
      {children}
    </div>
  )
})

const AppleLogo = () => (
  <svg width="15" height="19" viewBox="0 0 110 140" fill="white" style={{ display: "block" }}>
    <path
      d="M0 0 C5.58236403 2.09904125 9.60467483 0.88914551 14.97265625 -1.09375 C24.52115711 -4.439908 34.11309717 -4.54862597 43.35546875 -0.23046875 C48.12396107 2.4076135 50.86575425 5.08527779 53.41015625 9.90625 C52.35828125 10.69 51.30640625 11.47375 50.22265625 12.28125 C44.71078889 17.03285979 41.56508326 23.28635633 40.47265625 30.46875 C40.03168138 38.29605399 41.87292643 44.10920342 46.82421875 50.18359375 C49.69950343 53.3067478 52.89615914 55.56358526 56.41015625 57.90625 C53.62981681 69.36905295 47.16852412 82.51930379 37.16015625 89.40625 C32.57853571 91.90531575 28.55304343 92.53884155 23.41015625 91.90625 C21.37403354 91.28785199 19.35323208 90.61750058 17.34765625 89.90625 C8.57237805 86.84256185 3.23794872 88.20952158 -5.43359375 91.00390625 C-10.61364364 92.48483636 -14.47478385 92.64004629 -19.65234375 90.84375 C-33.68747534 81.58653555 -41.78781841 64.33028781 -45.19067383 48.33569336 C-47.46721739 34.48010623 -46.65131557 19.75938694 -38.46484375 8.03125 C-28.23499655 -4.14713952 -14.17528672 -5.71090688 0 0 Z"
      transform="translate(45.58984375,33.09375)"
    />
    <path
      d="M0 0 C0.57231958 7.72631433 -0.96546021 14.10973315 -5.80078125 20.30859375 C-10.93255592 25.73930675 -15.29387058 28.82351765 -22.9375 29.1875 C-23.948125 29.125625 -24.95875 29.06375 -26 29 C-26.59493662 20.81962143 -24.35167303 14.76774508 -19.375 8.25 C-14.46051828 2.89895264 -7.38077314 -0.97115436 0 0 Z"
      transform="translate(76,0)"
    />
  </svg>
)

const InputIcon = () => (
  <span className="flex h-[13px] w-[13px] items-center justify-center rounded-[3px] bg-white text-[10px] leading-none font-bold text-[#1c1c1e]">
    A
  </span>
)

const WifiIcon = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
    <path d="M8 9.4c.7 0 1.2.5 1.2 1.1S8.7 11.7 8 11.7s-1.2-.5-1.2-1.2S7.3 9.4 8 9.4Z" />
    <path d="M8 5.6c1.4 0 2.7.5 3.6 1.5l-1.1 1.1C9.9 7.6 9 7.3 8 7.3s-1.9.3-2.5.9L4.4 7.1C5.3 6.1 6.6 5.6 8 5.6Z" />
    <path d="M8 1.900c2.4 0 4.5.9 6.1 2.5L13 5.5C11.7 4.2 9.9 3.5 8 3.5S4.3 4.2 3 5.5L1.9 4.4C3.5 2.8 5.6 1.9 8 1.9Z" />
  </svg>
)

const VpnStatusIndicator = React.memo(function VpnStatusIndicator() {
  const [status, setStatus] = useState<VpnStatus>({ show: false, connected: false })

  useEffect(() => {
    const sync = () => {
      try {
        setStatus({
          show: window.localStorage.getItem(VPN_MENU_BAR_STORAGE_KEY) !== "0",
          connected:
            window.localStorage.getItem(VPN_ENABLED_STORAGE_KEY) === "1" &&
            Boolean(window.localStorage.getItem(VPN_CONNECTED_CONFIG_STORAGE_KEY)),
        })
      } catch {
        setStatus({ show: false, connected: false })
      }
    }
    const handleStatusChange = (event: Event) => {
      setStatus((event as CustomEvent<VpnStatus>).detail)
    }

    sync()
    window.addEventListener(VPN_STATUS_EVENT, handleStatusChange)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(VPN_STATUS_EVENT, handleStatusChange)
      window.removeEventListener("storage", sync)
    }
  }, [])

  if (!status.show || !status.connected) return null

  return (
    <span
      title="VPN Connected"
      aria-label="VPN Connected"
      className="rounded-[5px] border border-white/75 px-1.5 py-px text-[10px] leading-[14px] font-semibold text-white"
    >
      VPN
    </span>
  )
})

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 15 15" fill="none" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
    <circle cx="6.5" cy="6.5" r="5" stroke="white" strokeWidth="2" />
    <path d="M10.5 10.5 14 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const ControlCenterIcon = () => (
  <picture>
    <source srcSet="/control-center.svg" type="image/svg+xml" />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/control-center-dark.png"
      alt=""
      draggable={false}
      className="block h-4 w-4 brightness-0 invert"
    />
  </picture>
)

const MacOSMenuBar: React.FC<MacOSMenuBarProps> = ({
  appName = "Finder",
  menus = DEFAULT_MENUS,
  onMenuAction,
  onSpotlight,
  onControlCenter,
  className = "",
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [dropdownX, setDropdownX] = useState(0)
  const triggerRefs = useRef<Record<string, HTMLElement | null>>({})

  const closeDropdown = useCallback(() => setActiveMenu(null), [])

  const handleAction = useCallback(
    (action: string) => onMenuAction?.(action),
    [onMenuAction]
  )

  const toggleMenu = useCallback(
    (key: string) => {
      if (activeMenu === key) {
        setActiveMenu(null)
        return
      }
      const trigger = triggerRefs.current[key]
      if (!trigger) return
      const parentLeft = trigger.offsetParent?.getBoundingClientRect().left ?? 0
      setDropdownX(trigger.getBoundingClientRect().left - parentLeft)
      setActiveMenu(key)
    },
    [activeMenu]
  )

  const activeItems =
    activeMenu === "apple"
      ? APPLE_MENU_ITEMS
      : (menus.find((menu) => menu.label === activeMenu)?.items ?? null)

  return (
    <div className="relative" data-menubar>
      <div
        className={`h-8 rounded-[10px] ${className}`}
        style={{ background: "transparent", border: "none", boxShadow: "none" }}
      >
        <div className="flex h-full w-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div
              ref={(el) => {
                triggerRefs.current.apple = el
              }}
              onClick={() => toggleMenu("apple")}
              className="cursor-pointer transition-opacity duration-150 hover:opacity-80"
            >
              <AppleLogo />
            </div>

            <span className="text-[13px] font-bold text-white">{appName}</span>

            {menus.map((menu) => (
              <span
                key={menu.label}
                ref={(el) => {
                  triggerRefs.current[menu.label] = el
                }}
                onClick={() => toggleMenu(menu.label)}
                className="cursor-pointer text-[13px] text-white transition-opacity duration-150 select-none hover:opacity-80"
              >
                {menu.label}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3.5">
            <TrayIcon label="Input menu">
              <InputIcon />
            </TrayIcon>
            <BatteryIndicator />
            <VpnStatusIndicator />
            <TrayIcon label="Wi-Fi">
              <WifiIcon />
            </TrayIcon>
            <TrayIcon label="Spotlight search" onClick={onSpotlight}>
              <SearchIcon />
            </TrayIcon>
            <TrayIcon
              label="Control Center"
              onClick={() => {
                setActiveMenu(null)
                onControlCenter?.()
              }}
            >
              <ControlCenterIcon />
            </TrayIcon>
            <MenuClock />
          </div>
        </div>
      </div>

      {activeItems && (
        <MenuDropdown
          items={activeItems}
          x={dropdownX}
          onClose={closeDropdown}
          onAction={handleAction}
        />
      )}
    </div>
  )
}

export default React.memo(MacOSMenuBar)

const RECOVERY_MENUS: MenuConfig[] = [
  {
    label: "File",
    items: [{ label: "Close Window", action: "close-window", shortcut: "⌘W" }],
  },
  {
    label: "Edit",
    items: [
      { label: "Undo", action: "undo", shortcut: "⌘Z" },
      { label: "Copy", action: "copy", shortcut: "⌘C" },
      { label: "Paste", action: "paste", shortcut: "⌘V" },
    ],
  },
  {
    label: "Utilities",
    items: [
      { label: "Terminal", action: "recovery-terminal" },
      { label: "Disk Utility", action: "recovery-disk" },
      { label: "Startup Security Utility", action: "recovery-security" },
    ],
  },
  {
    label: "Window",
    items: [{ label: "Minimize", action: "minimize", shortcut: "⌘M" }],
  },
]

const RECOVERY_APPLE_ITEMS: MenuItemOption[] = [
  { label: "Restart...", action: "restart" },
  { label: "Shut Down...", action: "shutdown" },
]

export const RecoveryTopBar: React.FC<{ onAction?: (action: string) => void }> = React.memo(
  function RecoveryTopBar({ onAction }) {
    const [open, setOpen] = useState<string | null>(null)
    const [x, setX] = useState(0)
    const refs = useRef<Record<string, HTMLElement | null>>({})

    const toggle = (key: string) => {
      if (open === key) {
        setOpen(null)
        return
      }
      const el = refs.current[key]
      if (el) setX(el.getBoundingClientRect().left)
      setOpen(key)
    }

    const fire = (action?: string) => {
      setOpen(null)
      if (action) onAction?.(action)
    }

    const itemsFor = (key: string): MenuItemOption[] =>
      key === "__apple" ? RECOVERY_APPLE_ITEMS : (RECOVERY_MENUS.find((m) => m.label === key)?.items ?? [])

    return (
      <div className="relative" data-menubar>
        <div className="flex h-8 items-center gap-5 bg-black/60 px-4 backdrop-blur-xl">
          <span
            ref={(el) => {
              refs.current.__apple = el
            }}
            onClick={() => toggle("__apple")}
            className="cursor-pointer transition-opacity hover:opacity-80"
          >
            <AppleLogo />
          </span>
          <span className="cursor-default text-[13px] font-bold text-white">Recovery</span>
          {RECOVERY_MENUS.map((m) => (
            <span
              key={m.label}
              ref={(el) => {
                refs.current[m.label] = el
              }}
              onClick={() => toggle(m.label)}
              className="cursor-pointer text-[13px] text-white transition-opacity select-none hover:opacity-80"
            >
              {m.label}
            </span>
          ))}
        </div>
        {open && (
          <MenuDropdown
            items={itemsFor(open)}
            x={x}
            onClose={() => setOpen(null)}
            onAction={fire}
          />
        )}
      </div>
    )
  }
)
