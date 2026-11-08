"use client"

import {
  DEFAULT_MENUS,
  SEPARATOR,
  type MenuConfig,
} from "@/components/topBar"

const appMenu = (app: string): MenuConfig => ({
  label: app,
  items: [
    { label: `About ${app}`, action: "about" },
    SEPARATOR,
    { label: "Settings...", action: "preferences", shortcut: "⌘," },
    SEPARATOR,
    { label: `Quit ${app}`, action: "quit", shortcut: "⌘Q" },
  ],
})

const editMenu: MenuConfig = {
  label: "Edit",
  items: [
    { label: "Undo", action: "undo", shortcut: "⌘Z" },
    { label: "Redo", action: "redo", shortcut: "⇧⌘Z" },
    SEPARATOR,
    { label: "Cut", action: "cut", shortcut: "⌘X" },
    { label: "Copy", action: "copy", shortcut: "⌘C" },
    { label: "Paste", action: "paste", shortcut: "⌘V" },
  ],
}

const windowMenu: MenuConfig = {
  label: "Window",
  items: [
    { label: "Minimize", action: "minimize", shortcut: "⌘M" },
    { label: "Zoom", action: "zoom" },
    SEPARATOR,
    { label: "Bring All to Front", action: "front" },
  ],
}

const helpMenu = (app: string): MenuConfig => ({
  label: "Help",
  items: [{ label: `${app} Help`, action: "app-help" }],
})

const FINDER_MENUS: MenuConfig[] = [
  {
    label: "File",
    items: [
      { label: "New Finder Window", action: "new-window", shortcut: "⌘N" },
      { label: "New Folder", action: "new-folder", shortcut: "⇧⌘N" },
      SEPARATOR,
      { label: "Close Window", action: "close-window", shortcut: "⌘W" },
    ],
  },
  editMenu,
  {
    label: "View",
    items: [
      { label: "as Icons", action: "view-icons", shortcut: "⌘1" },
      { label: "as List", action: "view-list", shortcut: "⌘2" },
      { label: "as Columns", action: "view-columns", shortcut: "⌘3" },
      SEPARATOR,
      { label: "Show Path Bar", action: "path-bar" },
    ],
  },
  {
    label: "Go",
    items: [
      { label: "Back", action: "go-back", shortcut: "⌘[" },
      { label: "Forward", action: "go-forward", shortcut: "⌘]" },
      SEPARATOR,
      { label: "Home", action: "go-home", shortcut: "⇧⌘H" },
      { label: "Applications", action: "go-apps", shortcut: "⇧⌘A" },
    ],
  },
  windowMenu,
  helpMenu("Finder"),
]

const TERMINAL_MENUS: MenuConfig[] = [
  {
    label: "Shell",
    items: [
      { label: "New Window", action: "new-window", shortcut: "⌘N" },
      { label: "New Tab", action: "new-tab", shortcut: "⌘T" },
      SEPARATOR,
      { label: "Close Window", action: "close-window", shortcut: "⌘W" },
    ],
  },
  editMenu,
  {
    label: "View",
    items: [{ label: "Clear Buffer", action: "clear-buffer", shortcut: "⌘K" }],
  },
  windowMenu,
  helpMenu("Terminal"),
]

const SETTINGS_MENUS: MenuConfig[] = [
  editMenu,
  {
    label: "View",
    items: [{ label: "Search Settings Field", action: "search-settings", shortcut: "⌘F" }],
  },
  windowMenu,
  helpMenu("System Settings"),
]

export function menusForApp(appId: string, appName: string): MenuConfig[] {
  if (appId === "finder" || appId === "trash") return [appMenu("Finder"), ...FINDER_MENUS]
  if (appId === "safari") return [appMenu("Safari"), ...DEFAULT_MENUS]
  if (appId === "terminal") return [appMenu("Terminal"), ...TERMINAL_MENUS]
  if (appId === "settings") return [appMenu("System Settings"), ...SETTINGS_MENUS]
  return [
    appMenu(appName),
    {
      label: "File",
      items: [{ label: "Close Window", action: "close-window", shortcut: "⌘W" }],
    },
    editMenu,
    windowMenu,
    helpMenu(appName),
  ]
}

export function displayNameForApp(appId: string, fallback: string) {
  if (appId === "finder") return "Finder"
  return fallback
}
