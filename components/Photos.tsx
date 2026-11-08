"use client"

import { memo, useState } from "react"
import { Clock, Heart, Map, Search, Star, Trash2, Users, Video, X } from "lucide-react"

const SEEDS = [
  "tahoe-lake", "tahoe-pines", "tahoe-sunset", "tahoe-snow", "tahoe-cabin",
  "tahoe-dawn", "tahoe-trail", "tahoe-stars", "tahoe-falls", "tahoe-meadow",
  "tahoe-peak", "tahoe-mist", "tahoe-gold", "tahoe-ridge", "tahoe-cove",
]

const thumb = (seed: string, w = 400, h = 300) => `https://picsum.photos/seed/${seed}/${w}/${h}`

const SIDEBAR: { section: string; items: { label: string; icon: React.ReactNode; count?: string }[] }[] = [
  {
    section: "",
    items: [
      { label: "Library", icon: <Clock className="size-4" /> },
      { label: "Collections", icon: <Star className="size-4" /> },
    ],
  },
  {
    section: "Pinned",
    items: [
      { label: "Favourites", icon: <Heart className="size-4" /> },
      { label: "Recently Saved", icon: <Clock className="size-4" /> },
      { label: "Map", icon: <Map className="size-4" /> },
      { label: "Videos", icon: <Video className="size-4" /> },
      { label: "People & Pets", icon: <Users className="size-4" /> },
      { label: "Recently Deleted", icon: <Trash2 className="size-4" /> },
    ],
  },
  {
    section: "Albums",
    items: [{ label: "Tahoe Trip", icon: <Star className="size-4" />, count: "15" }],
  },
]

function Photos() {
  const [section, setSection] = useState("Library")
  const [tab, setTab] = useState("All Photos")
  const [query, setQuery] = useState("")
  const [viewer, setViewer] = useState<string | null>(null)
  const [favs, setFavs] = useState<Set<string>>(new Set(["tahoe-sunset", "tahoe-stars"]))

  const photos = SEEDS.filter((s) => {
    if (query.trim() && !s.includes(query.trim().toLowerCase())) return false
    if (section === "Favourites") return favs.has(s)
    return true
  })

  const toggleFav = (seed: string) =>
    setFavs((prev) => {
      const next = new Set(prev)
      if (next.has(seed)) next.delete(seed)
      else next.add(seed)
      return next
    })

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] overflow-hidden translate-y-2 rounded-b-2xl">
      <div className="flex w-44 shrink-0 flex-col overflow-y-auto bg-black/[0.04] px-2.5 py-3 text-[13px] dark:bg-white/[0.04]">
        {SIDEBAR.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-3" : ""}>
            {!!group.section && (
              <p className="px-1.5 pb-1 text-[11px] font-semibold text-black/40 dark:text-white/40">
                {group.section}
              </p>
            )}
            {group.items.map((item) => (
              <button
                key={item.label}
                onClick={() => setSection(item.label)}
                className={`flex w-full items-center gap-2 rounded-md px-1.5 py-[4px] text-left ${
                  section === item.label
                    ? "bg-black/10 dark:bg-white/15"
                    : "hover:bg-black/[0.05] dark:hover:bg-white/[0.07]"
                }`}
              >
                <span className="text-[#0a84ff]">{item.icon}</span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {!!item.count && (
                  <span className="text-[11px] text-black/40 dark:text-white/40">{item.count}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-2 px-3 py-2">
          <span className="text-[15px] font-bold">{section}</span>
          <span className="flex-1" />
          <span className="flex items-center rounded-full bg-black/[0.06] p-0.5 text-[12px] dark:bg-white/10">
            {["Years", "Months", "All Photos"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-2.5 py-1 ${tab === t ? "bg-white font-medium shadow-sm dark:bg-white/20" : "opacity-60 hover:opacity-100"}`}
              >
                {t}
              </button>
            ))}
          </span>
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 opacity-40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search photos"
              className="h-7 w-32 rounded-md bg-black/[0.06] pr-2 pl-7 text-[12px] outline-none dark:bg-white/10"
            />
          </span>
        </div>

        <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-3 content-start gap-1 overflow-y-auto p-1 sm:grid-cols-4 lg:grid-cols-5">
          {photos.map((seed) => (
            <button
              key={seed}
              onClick={() => setViewer(seed)}
              className="group relative aspect-[4/3] overflow-hidden rounded-[4px] bg-black/10 dark:bg-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb(seed)}
                alt={seed}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              />
              {favs.has(seed) && (
                <Heart className="absolute bottom-1 left-1 size-3.5 fill-white text-white drop-shadow" />
              )}
            </button>
          ))}
          {photos.length === 0 && (
            <p className="col-span-full py-10 text-center text-[13px] opacity-50">No photos</p>
          )}
        </div>
      </div>

      {viewer && (
        <div
          className="absolute inset-0 z-10 flex flex-col bg-black/90 backdrop-blur-xl"
          onClick={() => setViewer(null)}
        >
          <div className="flex shrink-0 items-center justify-end p-2">
            <button
              aria-label="Favorite"
              onClick={(e) => {
                e.stopPropagation()
                toggleFav(viewer)
              }}
              className="rounded-full p-2 text-white/80 hover:bg-white/15"
            >
              <Heart className={`size-5 ${favs.has(viewer) ? "fill-white" : ""}`} />
            </button>
            <button
              aria-label="Close"
              onClick={() => setViewer(null)}
              className="rounded-full p-2 text-white/80 hover:bg-white/15"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb(viewer, 1200, 900)} alt={viewer} draggable={false} className="max-h-full max-w-full rounded-lg object-contain" />
          </div>
          <p className="shrink-0 pb-4 text-center text-[13px] text-white/70">{viewer.replace(/-/g, " ")}</p>
        </div>
      )}
    </div>
  )
}

export default memo(Photos)
