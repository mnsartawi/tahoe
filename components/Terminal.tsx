"use client"

import { memo, useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { transitionTheme } from "@/lib/theme-transition"
import { SYSTEM_INFO } from "@/lib/system"
import type { WallpaperChoice } from "@/components/wallpaper"

const NEOFETCH = [
  "                    'c.",
  "                 ,xNMM.",
  "               .OMMMMo",
  "               OMMM0,",
  "     .;loddo:' loolloddol;.",
  "   cKMMMMMMMMMMNWMMMMMMMMMM0:",
  " .KMMMMMMMMMMMMMMMMMMMMMMMWd.",
  " XMMMMMMMMMMMMMMMMMMMMMMMX.",
  ";MMMMMMMMMMMMMMMMMMMMMMMM:",
  ":MMMMMMMMMMMMMMMMMMMMMMMM:",
  ".MMMMMMMMMMMMMMMMMMMMMMMMX.",
  " kMMMMMMMMMMMMMMMMMMMMMMMMWd.",
  " .XMMMMMMMMMMMMMMMMMMMMMMMMMMk",
  "  .XMMMMMMMMMMMMMMMMMMMMMMMMK.",
  "    kMMMMMMMMMMMMMMMMMMMMMMd",
  "     ;KMMMMMMMWXXWMMMMMMMk.",
  "       .cooc,.    .,coo:.",
]

const SPECS = [
  ["Host", SYSTEM_INFO.host],
  ["Kernel", SYSTEM_INFO.kernel],
  ["Shell", SYSTEM_INFO.shell],
  ["DE", "Tahoe"],
  ["WM", "Tahoe Compositor"],
  ["Terminal", "tahoe-terminal"],
  ["CPU", SYSTEM_INFO.cpu],
  ["GPU", SYSTEM_INFO.gpu],
  ["Memory", SYSTEM_INFO.memory],
]

type Line = { text: string; color?: string }

const PROMPT_USER = "tahoe@mac"
const PROMPT_DIR = "~"

const HELP: [string, string][] = [
  ["help", "list commands"],
  ["neofetch", "system info"],
  ["ls", "list directory"],
  ["pwd / whoami / hostname / date / uname / uptime", "system queries"],
  ["echo <text>", "print text"],
  ["open <app>", "open a dock app"],
  ["theme [dark|light]", "toggle appearance"],
  ["wallpaper [light|dark|lake]", "change wallpaper"],
  ["say <text>", "speak text aloud"],
  ["pbcopy <text> / pbpaste", "clipboard"],
  ["battery", "system battery level"],
  ["df / ps / top", "disk & processes"],
  ["caffeinate / softwareupdate / defaults", "macOS classics"],
  ["ping <host>", "fake ping"],
  ["lock / exit / clear / history", "session"],
]

async function batteryLine(): Promise<string> {
  const nav = navigator as Navigator & {
    getBattery?: () => Promise<{ level: number; charging: boolean }>
  }
  try {
    if (!nav.getBattery) return "Battery: unknown (no API)"
    const b = await nav.getBattery()
    return `Battery: ${Math.round(b.level * 100)}%${b.charging ? " (charging)" : ""}`
  } catch {
    return "Battery: unknown"
  }
}

function Terminal({
  apps,
  onOpenApp,
  onClose,
  onLock,
  onWallpaper,
}: {
  apps?: string[]
  onOpenApp?: (id: string) => void
  onClose?: () => void
  onLock?: () => void
  onWallpaper?: (w: WallpaperChoice) => void
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [histIndex, setHistIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLines([{ text: `Last login: ${new Date().toDateString()} on ttys000` }])
  }, [])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines])

  const print = (newLines: Line[]) =>
    setLines((prev) => [...prev, ...newLines])

  const runCommand = (raw: string) => {
    const cmd = raw.trim()
    print([{ text: `${PROMPT_USER} ${PROMPT_DIR} % ${cmd}`, color: "text-white" }])
    if (!cmd) return
    setHistory((prev) => [cmd, ...prev])
    setHistIndex(-1)

    const [name, ...args] = cmd.split(/\s+/)
    const rest = args.join(" ")
    switch (name) {
      case "neofetch":
        print(
          NEOFETCH.map((art, i) => ({
            text: `${art}   ${SPECS[i] ? `${SPECS[i][0]}: ${SPECS[i][1]}` : ""}`,
            color: "text-green-400",
          }))
        )
        break
      case "help":
        print(HELP.map(([c, d]) => ({ text: `  ${c.padEnd(38)} ${d}` })))
        break
      case "ls":
        print([{ text: "Applications  Desktop  Documents  Downloads  Library" }])
        break
      case "pwd":
        print([{ text: "/Users/tahoe" }])
        break
      case "whoami":
        print([{ text: "tahoe" }])
        break
      case "hostname":
        print([{ text: "tahoe-mac" }])
        break
      case "date":
        print([{ text: new Date().toString() }])
        break
      case "uname":
        print([
          { text: "Darwin tahoe-mac 25.0.0 Darwin Kernel ARM64" },
        ])
        break
      case "uptime":
        print([{ text: "16:29  up 3 days, 42 users, load averages: 1.2 1.1 1.0" }])
        break
      case "echo":
        print([{ text: rest }])
        break
      case "history":
        setHistory((prev) => {
          print(prev.map((h, i) => ({ text: `  ${prev.length - i}  ${h}` })))
          return prev
        })
        break
      case "open":
        if (!args[0]) print([{ text: "usage: open <app>" }])
        else {
          const target = args[0].toLowerCase()
          if (apps && !apps.includes(target)) {
            print([{ text: `The application ${args[0]} does not exist.` }])
          } else {
            onOpenApp?.(target)
            print([{ text: `Opening ${args[0]}...` }])
          }
        }
        break
      case "theme": {
        const target =
          args[0] === "dark" || args[0] === "light"
            ? args[0]
            : resolvedTheme === "dark"
              ? "light"
              : "dark"
        transitionTheme(() => setTheme(target))
        print([{ text: `Appearance: ${target}` }])
        break
      }
      case "wallpaper": {
        const w = args[0]?.toLowerCase()
        if (w === "light" || w === "dark" || w === "lake") {
          onWallpaper?.(w === "lake" ? "aerial" : w)
          print([{ text: `Wallpaper: ${w}` }])
        } else print([{ text: "usage: wallpaper [light|dark|lake]" }])
        break
      }
      case "say":
        if (!rest) print([{ text: "usage: say <text>" }])
        else {
          try {
            speechSynthesis.cancel()
            speechSynthesis.speak(new SpeechSynthesisUtterance(rest))
            print([{ text: `Speaking: "${rest}"` }])
          } catch {
            print([{ text: "Speech not supported." }])
          }
        }
        break
      case "pbcopy":
        navigator.clipboard?.writeText(rest).then(
          () => print([{ text: "Copied to clipboard." }]),
          () => print([{ text: "Clipboard write failed." }])
        )
        break
      case "pbpaste":
        navigator.clipboard?.readText().then(
          (t) => print([{ text: t || "(empty)" }]),
          () => print([{ text: "Clipboard read failed." }])
        )
        break
      case "battery":
        batteryLine().then((t) => print([{ text: t }]))
        break
      case "df":
        print([
          { text: "Filesystem   Size   Used  Avail Capacity" },
          { text: "/dev/disk3s1  460Gi  120Gi  340Gi    27%" },
        ])
        break
      case "ps":
        print([
          { text: "  PID TTY           TIME CMD" },
          { text: "  501 ttys000    0:00.42 -zsh" },
          { text: "  777 ttys000    0:01.13 Safari" },
          { text: "  888 ttys000    0:00.07 Dock" },
        ])
        break
      case "top":
        print([
          { text: "Processes: 412 total, 3 running  |  CPU: 8% user 4% sys" },
          { text: "PID    COMMAND      %CPU  MEM" },
          { text: "777    Safari       12.1  890M" },
          { text: "501    Terminal      2.3   45M" },
        ])
        break
      case "caffeinate":
        print([{ text: "Preventing idle sleep. Press Ctrl+C (it won't work here)." }])
        break
      case "softwareupdate":
        print([
          { text: "Software Update Tool" },
          { text: "No updates available. Tahoe is up to date." },
        ])
        break
      case "defaults":
        print([{ text: "NSGlobalDomain: AppleInterfaceStyle = " + (resolvedTheme === "dark" ? "Dark" : "Light") }])
        break
      case "ping":
        if (!args[0]) print([{ text: "usage: ping <host>" }])
        else
          print(
            [0, 1, 2].map((i) => ({
              text: `64 bytes from ${args[0]}: icmp_seq=${i} ttl=55 time=${(8 + Math.random() * 12).toFixed(1)} ms`,
            }))
          )
        break
      case "sudo":
        print([{ text: "tahoe is not in the sudoers file. This incident will be reported." }])
        break
      case "vim":
      case "nano":
      case "emacs":
        print([{ text: `${name}: interactive editors are not supported here. Try echo instead.` }])
        break
      case "curl":
      case "wget":
        print([{ text: `${name}: networking is disabled in this terminal.` }])
        break
      case "ssh":
        print([{ text: "ssh: enjoy the simulation. You're already home." }])
        break
      case "rm":
        print([{ text: "rm: nice try." }])
        break
      case "hello":
      case "hi":
        print([{ text: "Hello! Type 'help' to see what I can do." }])
        break
      case "lock":
        onLock?.()
        break
      case "exit":
        onClose?.()
        break
      case "clear":
        setLines([])
        break
      default:
        print([{ text: `zsh: command not found: ${name}` }])
    }
  }

  return (
    <div
      className="flex h-full flex-col rounded-b-2xl bg-black/60 p-3 font-mono text-[12px] leading-relaxed text-white/85"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={bodyRef} className="flex-1 overflow-y-auto whitespace-pre-wrap">
        {lines.map((line, i) => (
          <div key={i} className={line.color ?? "text-white/85"}>
            {line.text}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-green-400">
            {PROMPT_USER} {PROMPT_DIR} %
          </span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                runCommand(input)
                setInput("")
              } else if (e.key === "ArrowUp") {
                e.preventDefault()
                if (history.length > 0) {
                  const next = Math.min(histIndex + 1, history.length - 1)
                  setHistIndex(next)
                  setInput(history[next])
                }
              } else if (e.key === "ArrowDown") {
                e.preventDefault()
                if (histIndex > 0) {
                  const next = histIndex - 1
                  setHistIndex(next)
                  setInput(history[next])
                } else {
                  setHistIndex(-1)
                  setInput("")
                }
              }
            }}
            aria-label="Terminal input"
            className="w-full bg-transparent outline-none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(Terminal)
