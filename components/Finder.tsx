"use client"

import { memo, useState } from "react"
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search } from "lucide-react"

type FinderFile = {
  name: string
  modified: string
  size: string
  kind: string
  duration?: string
  dimensions?: string
}

const FILES: FinderFile[] = [
  { name: "tahoe-day.mp4", modified: "Today at 09:41", size: "31 MB", kind: "MPEG-4 movie", duration: "02:00", dimensions: "1280×720" },
  { name: "lake.jpg", modified: "Yesterday at 18:02", size: "109 KB", kind: "JPEG image", dimensions: "1280×720" },
  { name: "welcome.png", modified: "Oct 10, 2026 at 14:20", size: "322 KB", kind: "PNG image", dimensions: "2048×1152" },
  { name: "tahoe.png", modified: "Oct 8, 2026 at 11:05", size: "510 KB", kind: "PNG image", dimensions: "1024×682" },
  { name: "aerial-ny.mov", modified: "Oct 1, 2026 at 22:47", size: "133.8 MB", kind: "QuickTime movie", duration: "04:32", dimensions: "1920×1080" },
]

const FAVORITES = [
  { label: "Recents", icon: "/sf/recents.svg" },
  { label: "Applications", icon: "/sf/apps.svg" },
  { label: "Desktop", icon: "/sf/folder.svg" },
  { label: "Documents", icon: "/sf/folder.svg" },
  { label: "Movies", icon: "/sf/movies.svg" },
  { label: "Music", icon: "/sf/music.svg" },
  { label: "Pictures", icon: "/sf/wallpaper.svg" },
]

const LOCATIONS = [
  { label: "iCloud Drive", icon: "/sf/icloud.svg" },
  { label: "Macintosh HD", icon: "/sf/drive.svg" },
  { label: "AirDrop", icon: "/sf/airdrop.svg" },
  { label: "Network", icon: "/sf/network.svg" },
]

function SfGlyph({ src, dim }: { src: string; dim?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      className={`h-4 w-5 object-contain sf-blue ${dim ? "opacity-50" : ""}`}
    />
  )
}

function Finder({
  initialFolder = "Movies",
  trashItems = [],
  onEmptyTrash,
}: {
  initialFolder?: string
  trashItems?: FinderFile[]
  onEmptyTrash?: () => void
}) {
  const [selected, setSelected] = useState(0)
  const [query, setQuery] = useState("")
  const [folder, setFolder] = useState(initialFolder)
  const [view, setView] = useState<"list" | "icons">("list")

  const isTrash = folder === "Trash"
  const source = isTrash ? trashItems : FILES
  const files = source.filter((f) => f.name.toLowerCase().includes(query.trim().toLowerCase()))
  const current = files[Math.min(selected, Math.max(0, files.length - 1))]

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] translate-y-2 overflow-hidden rounded-b-2xl text-black/85 dark:text-white/90">
      <div className="flex w-44 shrink-0 flex-col gap-4 overflow-y-auto bg-black/[0.04] px-2.5 py-3 text-[13px] dark:bg-white/[0.04]">
        <div>
          <p className="px-1.5 pb-1 text-[11px] font-semibold text-black/40 dark:text-white/40">Favorites</p>
          {FAVORITES.map((f) => (
            <button
              key={f.label}
              onClick={() => setFolder(f.label)}
              className={`flex w-full items-center gap-2 rounded-md px-1.5 py-[3px] text-left ${
                folder === f.label ? "bg-black/10 dark:bg-white/15" : "hover:bg-black/[0.05] dark:hover:bg-white/[0.07]"
              }`}
            >
              <SfGlyph src={f.icon} />
              <span className="truncate">{f.label}</span>
            </button>
          ))}
        </div>
        <div>
          <p className="px-1.5 pb-1 text-[11px] font-semibold text-black/40 dark:text-white/40">Locations</p>
          {LOCATIONS.map((f) => (
            <button
              key={f.label}
              className="flex w-full items-center gap-2 rounded-md px-1.5 py-[3px] text-left hover:bg-black/[0.05] dark:hover:bg-white/[0.07]"
            >
              <SfGlyph src={f.icon} dim />
              <span className="truncate">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-2 px-3 py-2">
          <span className="flex items-center gap-1 text-black/30 dark:text-white/30">
            <ChevronLeft className="size-5" />
            <ChevronRight className="size-5" />
          </span>
          <span className="text-[15px] font-bold">{folder}</span>
          <span className="flex-1" />
          {isTrash && trashItems.length > 0 && (
            <button
              onClick={() => {
                onEmptyTrash?.()
                setSelected(0)
              }}
              className="rounded-md border border-black/15 px-2.5 py-1 text-[12px] hover:bg-black/[0.05] dark:border-white/20 dark:hover:bg-white/10"
            >
              Empty
            </button>
          )}
          <span className="flex items-center rounded-md bg-black/[0.05] p-0.5 dark:bg-white/10">
            <button
              aria-label="Icon view"
              onClick={() => setView("icons")}
              className={`rounded p-1 ${view === "icons" ? "bg-white shadow-sm dark:bg-white/20" : "opacity-50 hover:opacity-100"}`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              aria-label="List view"
              onClick={() => setView("list")}
              className={`rounded p-1 ${view === "list" ? "bg-white shadow-sm dark:bg-white/20" : "opacity-50 hover:opacity-100"}`}
            >
              <List className="size-4" />
            </button>
          </span>
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-black/35 dark:text-white/35" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelected(0)
              }}
              placeholder="Search"
              aria-label="Search files"
              className="h-7 w-44 rounded-md border border-black/10 bg-black/[0.05] pr-2 pl-7 text-[12px] outline-none placeholder:text-black/35 dark:border-white/10 dark:bg-white/10 dark:placeholder:text-white/35"
            />
          </span>
        </div>

        {view === "list" && (
          <div className="grid shrink-0 grid-cols-[1fr_150px_80px_130px] gap-2 border-y border-black/10 px-3 py-1 text-[11px] font-semibold text-black/50 dark:border-white/10 dark:text-white/50">
            <span>Name</span>
            <span>Date Modified</span>
            <span className="text-right">Size</span>
            <span>Kind</span>
          </div>
        )}

        <div className="flex min-h-0 flex-1">
          {view === "icons" ? (
            <div className="grid min-w-0 flex-1 auto-rows-min grid-cols-3 content-start gap-4 overflow-y-auto p-4 sm:grid-cols-4">
              {files.map((f, i) => (
                <button
                  key={f.name}
                  onClick={() => setSelected(i)}
                  onDoubleClick={() => setSelected(i)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg p-2 ${
                    i === selected ? "bg-[#0a84ff]/15 ring-1 ring-[#0a84ff]/50" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.07]"
                  }`}
                >
                  {f.kind === "Folder" ? (
                    <span className="flex h-16 w-20 flex-col">
                      <span className="ml-1 h-2.5 w-8 rounded-t-md bg-[#4aa3f0]" />
                      <span className="flex-1 rounded-md rounded-tl-none bg-gradient-to-b from-[#6cc4ff] to-[#3d9df2] shadow" />
                    </span>
                  ) : (
                    <span className="flex h-16 w-14 flex-col items-center justify-end rounded-md border border-black/10 bg-white pb-1 shadow-sm dark:border-white/15 dark:bg-white/90">
                      <span className="text-[10px] font-bold text-black/50">ZIP</span>
                    </span>
                  )}
                  <span className="max-w-full text-center text-[12px] leading-tight break-words">{f.name}</span>
                </button>
              ))}
              {files.length === 0 && (
                <p className="col-span-full py-6 text-center text-[13px] text-black/40 dark:text-white/40">
                  {isTrash ? "Trash is empty" : "No matches"}
                </p>
              )}
            </div>
          ) : (
          <div className="min-w-0 flex-1 overflow-y-auto py-1">
            {files.map((f, i) => (
              <button
                key={f.name}
                onClick={() => setSelected(i)}
                onDoubleClick={() => setSelected(i)}
                className={`grid w-full grid-cols-[1fr_150px_80px_130px] items-center gap-2 rounded-md px-3 py-[3px] text-left text-[13px] ${
                  i === selected ? "bg-[#0a84ff] text-white" : "hover:bg-black/[0.05] dark:hover:bg-white/10"
                }`}
              >
                <span className="truncate">{f.name}</span>
                <span className={`truncate text-[12px] ${i === selected ? "text-white/85" : "text-black/50 dark:text-white/50"}`}>
                  {f.modified}
                </span>
                <span className={`text-right text-[12px] ${i === selected ? "text-white/85" : "text-black/50 dark:text-white/50"}`}>
                  {f.size}
                </span>
                <span className={`truncate text-[12px] ${i === selected ? "text-white/85" : "text-black/50 dark:text-white/50"}`}>
                  {f.kind}
                </span>
              </button>
            ))}
            {files.length === 0 && (
              <p className="px-3 py-6 text-center text-[13px] text-black/40 dark:text-white/40">
                {isTrash ? "Trash is empty" : "No matches"}
              </p>
            )}
          </div>
          )}

          {current && view === "list" && (
            <div className="hidden w-56 shrink-0 flex-col overflow-y-auto border-l border-black/10 p-3 sm:flex dark:border-white/10">
              <span className="relative block overflow-hidden rounded-lg bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/aerial/lake.jpg" alt="" draggable={false} className="aspect-video w-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-9 items-center justify-center rounded-full bg-black/45 text-[13px] text-white">
                    ▶
                  </span>
                </span>
              </span>
              <p className="mt-2 truncate text-center text-[13px] font-semibold">{current.name}</p>
              <p className="text-center text-[12px] text-black/50 dark:text-white/50">{current.size}</p>
              <dl className="mt-3 space-y-1.5 text-[12px]">
                {[
                  ["Kind", current.kind],
                  ["Size", current.size],
                  ["Modified", current.modified],
                  ...(current.dimensions ? [["Dimensions", current.dimensions] as [string, string]] : []),
                  ...(current.duration ? [["Duration", current.duration] as [string, string]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <dt className="shrink-0 text-black/45 dark:text-white/45">{k}</dt>
                    <dd className="truncate text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(Finder)
