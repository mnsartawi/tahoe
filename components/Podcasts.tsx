"use client"

import { memo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Airplay,
  AudioLines,
  Baby,
  BriefcaseBusiness,
  ChevronDown,
  Clock3,
  Coffee,
  Compass,
  Cpu,
  Download,
  Dumbbell,
  Ellipsis,
  FaceSlightlySmiling,
  FingerprintPattern,
  FlaskConical,
  Globe,
  GraduationCap,
  House,
  Lightbulb,
  ListMusic,
  Music2,
  Newspaper,
  Palette,
  Pause,
  Play,
  Radio,
  RotateCcw,
  RotateCw,
  Search,
  Trophy,
  Volume2,
  WandSparkles,
} from "lucide-react"

type Category = {
  name: string
  sub: string
  icon: LucideIcon
  bg: string
}

type ShowKind = "type" | "icon"

type Show = {
  title: string
  author: string
  bg: string
  kind: ShowKind
  label?: string
  icon?: LucideIcon
  ink?: "light" | "dark"
}

const CATEGORIES: Category[] = [
  {
    name: "Arts",
    sub: "Design, books & more",
    icon: Palette,
    bg: "from-[#ff9966] via-[#ff5e62] to-[#c9184a]",
  },
  {
    name: "Business",
    sub: "Careers & leadership",
    icon: BriefcaseBusiness,
    bg: "from-[#4facfe] via-[#2b6cb0] to-[#1a365d]",
  },
  {
    name: "Comedy",
    sub: "Stand-up & humor",
    icon: FaceSlightlySmiling,
    bg: "from-[#ffd166] via-[#ff9f1c] to-[#e85d04]",
  },
  {
    name: "Education",
    sub: "Learning & language",
    icon: GraduationCap,
    bg: "from-[#43e97b] via-[#38b2ac] to-[#0f766e]",
  },
  {
    name: "Fiction",
    sub: "Drama & storytelling",
    icon: WandSparkles,
    bg: "from-[#b388ff] via-[#7c3aed] to-[#4c1d95]",
  },
  {
    name: "History",
    sub: "People & places",
    icon: Clock3,
    bg: "from-[#d4a373] via-[#9c6644] to-[#5e3b25]",
  },
  {
    name: "Health & Fitness",
    sub: "Fitness & wellness",
    icon: Dumbbell,
    bg: "from-[#34d399] via-[#059669] to-[#065f46]",
  },
  {
    name: "Kids & Family",
    sub: "Stories for kids",
    icon: Baby,
    bg: "from-[#ffafbd] via-[#ff6fa5] to-[#a4133c]",
  },
  {
    name: "Leisure",
    sub: "Hobbies & games",
    icon: Coffee,
    bg: "from-[#f4a261] via-[#e76f51] to-[#9c2c13]",
  },
  {
    name: "Music",
    sub: "Interviews & hits",
    icon: Music2,
    bg: "from-[#818cf8] via-[#6366f1] to-[#312e81]",
  },
  {
    name: "News",
    sub: "Daily headlines",
    icon: Newspaper,
    bg: "from-[#ff7b7b] via-[#ef4444] to-[#991b1b]",
  },
  {
    name: "Science",
    sub: "Discovery & innovation",
    icon: FlaskConical,
    bg: "from-[#22d3ee] via-[#0891b2] to-[#164e63]",
  },
  {
    name: "Society & Culture",
    sub: "Culture & identity",
    icon: Globe,
    bg: "from-[#2dd4bf] via-[#0d9488] to-[#134e4a]",
  },
  {
    name: "Sports",
    sub: "Football & more",
    icon: Trophy,
    bg: "from-[#84cc16] via-[#4d7c0f] to-[#1a2e05]",
  },
  {
    name: "Technology",
    sub: "Gadgets & the future",
    icon: Cpu,
    bg: "from-[#60a5fa] via-[#2563eb] to-[#1e3a8a]",
  },
  {
    name: "True Crime",
    sub: "Real-life mysteries",
    icon: FingerprintPattern,
    bg: "from-[#9ca3af] via-[#4b5563] to-[#111827]",
  },
]

const SHOWS: Show[] = [
  {
    title: "The Daily",
    author: "The New York Times",
    bg: "from-[#f5f5f5] via-[#e2e2e2] to-[#c8c8c8]",
    kind: "type",
    label: "The Daily",
    ink: "dark",
  },
  {
    title: "Huberman Lab",
    author: "Scicomm Media",
    bg: "from-[#1e6091] via-[#16425b] to-[#081c2b]",
    kind: "icon",
    icon: FlaskConical,
  },
  {
    title: "Crime Junkie",
    author: "audiochuck",
    bg: "from-[#7a1520] via-[#3b0d12] to-[#140507]",
    kind: "icon",
    icon: FingerprintPattern,
  },
  {
    title: "SmartLess",
    author: "Jason Bateman, Sean Hayes, Will Arnett",
    bg: "from-[#ffe566] via-[#ffc02e] to-[#f08c00]",
    kind: "type",
    label: "SMARTLESS",
    ink: "dark",
  },
  {
    title: "The Diary of a CEO",
    author: "Steven Bartlett",
    bg: "from-[#3a3a3c] via-[#1c1c1e] to-[#090909]",
    kind: "type",
    label: "DOAC",
    ink: "light",
  },
  {
    title: "Stuff You Should Know",
    author: "iHeartPodcasts",
    bg: "from-[#2dd4bf] via-[#0f766e] to-[#083344]",
    kind: "icon",
    icon: Lightbulb,
  },
  {
    title: "Planet Money",
    author: "NPR",
    bg: "from-[#d9f99d] via-[#84cc16] to-[#3f6212]",
    kind: "type",
    label: "PLANET|MONEY",
    ink: "dark",
  },
  {
    title: "Radiolab",
    author: "WNYC Studios",
    bg: "from-[#38bdf8] via-[#0369a1] to-[#082f49]",
    kind: "icon",
    icon: AudioLines,
  },
]

const EPISODES = [
  { show: 0, title: "The Headlines: A Changing World", meta: "Today · 24 min" },
  {
    show: 1,
    title: "How to Build Better Habits",
    meta: "Yesterday · 1 hr 42 min",
  },
  { show: 2, title: "WANTED: The Vanishing at the Lake", meta: "Mon · 38 min" },
  { show: 3, title: "A Very SmartLess Thanksgiving", meta: "Sun · 52 min" },
  { show: 4, title: "The CEO Who Walked Away", meta: "Sat · 1 hr 8 min" },
  { show: 5, title: "How Does a Microwave Work?", meta: "Fri · 45 min" },
]

const NAV: { label: string; icon: LucideIcon }[] = [
  { label: "Home", icon: House },
  { label: "Browse", icon: Compass },
  { label: "Charts", icon: Trophy },
  { label: "Latest Episodes", icon: AudioLines },
]

const LIBRARY: { label: string; icon: LucideIcon }[] = [
  { label: "Recently Played", icon: Clock3 },
  { label: "Shows", icon: Radio },
  { label: "Episodes", icon: ListMusic },
  { label: "Downloaded", icon: Download },
]

function ShowArt({ show, className = "" }: { show: Show; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${show.bg} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_12%,rgba(255,255,255,0.32),transparent_52%)]" />
      {show.kind === "type" &&
        show.label &&
        (() => {
          const lines = show.label.split("|")
          const ink =
            show.ink === "dark"
              ? "rgba(20,20,20,0.82)"
              : "rgba(255,255,255,0.94)"
          return (
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 size-full"
              aria-hidden
            >
              {lines.map((line, index) => {
                const size = line.length > 10 ? 9 : line.length > 7 ? 12 : 17
                const offset = (index - (lines.length - 1) / 2) * size * 1.12
                return (
                  <text
                    key={line}
                    x="50"
                    y={50 + offset}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={size}
                    fontWeight="800"
                    letterSpacing="1.1"
                    fill={ink}
                  >
                    {line}
                  </text>
                )
              })}
            </svg>
          )
        })()}
      {show.kind === "icon" &&
        show.icon &&
        (() => {
          const Icon = show.icon
          return (
            <>
              <div className="absolute -right-[22%] -bottom-[26%] size-[78%] rounded-full border border-white/20" />
              <div className="absolute -right-[6%] -bottom-[10%] size-[52%] rounded-full border border-white/15" />
              <Icon
                className="absolute inset-0 m-auto size-[46%] text-white/90 drop-shadow-[0_6px_16px_rgba(0,0,0,0.3)]"
                strokeWidth={1.4}
              />
            </>
          )
        })()}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-black/10 ring-inset" />
    </div>
  )
}

function ShowCard({
  show,
  onPlay,
  fluid = false,
}: {
  show: Show
  onPlay: () => void
  fluid?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className={`group text-left ${fluid ? "w-full" : "w-[110px] shrink-0"}`}
    >
      <div className="relative">
        <ShowArt
          show={show}
          className="aspect-square w-full shadow-[0_10px_26px_-14px_rgba(0,0,0,0.65)] transition-transform duration-300 group-hover:scale-[1.015]"
        />
        <span className="absolute right-2 bottom-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-150 group-hover:opacity-100">
          <Play className="ml-0.5 size-3 fill-current" />
        </span>
      </div>
      <p className="mt-2 truncate text-[11.5px] leading-tight font-semibold">
        {show.title}
      </p>
      <p className="mt-0.5 truncate text-[10px] leading-tight text-black/45 dark:text-white/45">
        {show.author}
      </p>
    </button>
  )
}

function CategoryTile({ category }: { category: Category }) {
  const Icon = category.icon
  return (
    <button
      type="button"
      className={`group relative h-[84px] overflow-hidden rounded-[14px] bg-gradient-to-br p-2.5 text-left text-white shadow-[0_10px_22px_-14px_rgba(0,0,0,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-14px_rgba(0,0,0,0.8)] ${category.bg}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.34),transparent_55%)]" />
      <Icon
        className="absolute -right-2.5 -bottom-3.5 size-[62px] text-white/25 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
        strokeWidth={1.3}
      />
      <div className="relative flex h-full flex-col justify-between">
        <p className="text-[12.5px] leading-tight font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]">
          {category.name}
        </p>
        <p className="text-[8.5px] font-medium tracking-[0.06em] text-white/70 uppercase">
          {category.sub}
        </p>
      </div>
    </button>
  )
}

function Podcasts() {
  const [show, setShow] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<"apple" | "library">("apple")
  const [view, setView] = useState("Home")
  const current = SHOWS[show]

  const needle = query.trim().toLowerCase()
  const matchingShows = SHOWS.filter(
    (item) =>
      item.title.toLowerCase().includes(needle) ||
      item.author.toLowerCase().includes(needle)
  )
  const matchingCategories = CATEGORIES.filter(
    (category) =>
      category.name.toLowerCase().includes(needle) ||
      category.sub.toLowerCase().includes(needle)
  )

  const play = (index: number) => {
    setShow(index)
    setPlaying(true)
  }

  const selectView = (nextView: string) => {
    setView(nextView)
    setTab("apple")
    setQuery("")
  }

  const selectLibrary = (nextView: string) => {
    setView(nextView)
    setTab("library")
    setQuery("")
  }

  const next = () => setShow((value) => (value + 1) % SHOWS.length)
  const previous = () =>
    setShow((value) => (value - 1 + SHOWS.length) % SHOWS.length)

  return (
    <div className="relative -m-4 flex h-[calc(100%+2rem)] translate-y-2 overflow-hidden rounded-b-2xl bg-[#f7f7f9] text-[#17171a] dark:bg-[#0b0b0d] dark:text-white">
      <aside className="flex w-[188px] shrink-0 [scrollbar-width:none] flex-col overflow-y-auto border-r border-black/[0.06] bg-[#efeff2] px-2.5 pt-3 pb-3 dark:border-white/[0.06] dark:bg-[#141416] [&::-webkit-scrollbar]:hidden">
        <div className="mb-3 flex items-center gap-2 px-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/Podcasts.png" alt="" draggable={false} className="size-6 rounded-lg" />
          <span className="text-[12.5px] font-bold tracking-[-0.01em]">
            Podcasts
          </span>
          <span className="ml-auto rounded-md bg-black/[0.05] px-1 py-0.5 text-[7px] font-bold tracking-[0.08em] text-black/40 uppercase dark:bg-white/[0.08] dark:text-white/40">
            Beta
          </span>
        </div>

        <nav className="space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = tab === "apple" && view === item.label
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => selectView(item.label)}
                aria-pressed={active}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-[6px] text-left text-[12px] transition-colors ${
                  active
                    ? "bg-[#8b5cf6]/15 font-semibold text-[#7c3aed] dark:bg-white/[0.11] dark:text-white"
                    : "text-black/70 hover:bg-black/[0.045] dark:text-white/70 dark:hover:bg-white/[0.07]"
                }`}
              >
                <Icon
                  className={`size-3.5 ${active ? "text-[#8b5cf6] dark:text-[#c4b5fd]" : "text-black/40 dark:text-white/40"}`}
                  strokeWidth={active ? 2.2 : 1.9}
                />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-4 border-t border-black/[0.06] pt-3 dark:border-white/[0.07]">
          <div className="flex items-center px-2 pb-1.5 text-[10px] font-semibold tracking-[0.12em] text-black/35 uppercase dark:text-white/35">
            Library
            <ChevronDown className="ml-auto size-3" />
          </div>
          {LIBRARY.map((item) => {
            const Icon = item.icon
            const active = tab === "library" && view === item.label
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => selectLibrary(item.label)}
                aria-pressed={active}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-[6px] text-left text-[12px] transition-colors ${
                  active
                    ? "bg-[#8b5cf6]/15 font-semibold text-[#7c3aed] dark:bg-white/[0.11] dark:text-white"
                    : "text-black/70 hover:bg-black/[0.045] dark:text-white/70 dark:hover:bg-white/[0.07]"
                }`}
              >
                <Icon
                  className={`size-3.5 ${active ? "text-[#8b5cf6] dark:text-[#c4b5fd]" : "text-black/40 dark:text-white/40"}`}
                  strokeWidth={active ? 2.2 : 1.9}
                />
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="mt-3 border-t border-black/[0.06] pt-3 dark:border-white/[0.07]">
          <p className="px-2 pb-1.5 text-[10px] font-semibold tracking-[0.12em] text-black/35 uppercase dark:text-white/35">
            Genres
          </p>
          {["Comedy", "News", "True Crime"].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => selectView("Home")}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-[6px] text-left text-[12px] text-black/70 transition-colors hover:bg-black/[0.045] dark:text-white/70 dark:hover:bg-white/[0.07]"
            >
              <span className="size-1.5 rounded-full bg-gradient-to-br from-[#d946ef] to-[#7c3aed]" />
              {name}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-black/[0.06] bg-[#fbfbfc]/85 px-4 py-2.5 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#0d0d0f]/85">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-black/35 dark:text-white/40" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              aria-label="Search podcasts"
              className="h-[30px] w-full max-w-[280px] rounded-lg border border-black/[0.04] bg-black/[0.055] pr-2 pl-8 text-[12px] outline-none placeholder:text-black/35 focus:border-[#8b5cf6]/40 focus:bg-white dark:border-white/[0.06] dark:bg-white/[0.08] dark:placeholder:text-white/35 dark:focus:bg-white/[0.12]"
            />
          </div>
          <div className="flex shrink-0 items-center rounded-lg bg-black/[0.055] p-0.5 text-[10.5px] font-medium dark:bg-white/[0.07]">
            <button
              type="button"
              onClick={() => setTab("apple")}
              aria-pressed={tab === "apple"}
              className={`rounded-[7px] px-2.5 py-[4px] transition-colors ${
                tab === "apple"
                  ? "bg-white text-black shadow-sm dark:bg-[#3a3a3c] dark:text-white"
                  : "text-black/50 hover:text-black/75 dark:text-white/50 dark:hover:text-white/80"
              }`}
            >
              Apple Podcasts
            </button>
            <button
              type="button"
              onClick={() => setTab("library")}
              aria-pressed={tab === "library"}
              className={`rounded-[7px] px-2.5 py-[4px] transition-colors ${
                tab === "library"
                  ? "bg-white text-black shadow-sm dark:bg-[#3a3a3c] dark:text-white"
                  : "text-black/50 hover:text-black/75 dark:text-white/50 dark:hover:text-white/80"
              }`}
            >
              Library
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto px-5 pt-4 pb-32 [&::-webkit-scrollbar]:hidden">
          {needle ? (
            <>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8b5cf6] uppercase dark:text-[#c4b5fd]">
                  Search
                </p>
                <h1 className="mt-0.5 text-[27px] font-bold tracking-[-0.03em]">
                  Search Results
                </h1>
                <p className="mt-1 text-[11px] text-black/45 dark:text-white/45">
                  {matchingShows.length + matchingCategories.length} results for
                  “{query.trim()}”
                </p>
              </div>

              {matchingShows.length > 0 && (
                <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-5">
                  {matchingShows.map((item) => (
                    <ShowCard
                      key={item.title}
                      show={item}
                      onPlay={() => play(SHOWS.indexOf(item))}
                      fluid
                    />
                  ))}
                </div>
              )}

              {matchingCategories.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-[15px] font-bold">Categories</h2>
                  <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {matchingCategories.map((category) => (
                      <CategoryTile key={category.name} category={category} />
                    ))}
                  </div>
                </div>
              )}

              {matchingShows.length + matchingCategories.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Search
                    className="size-8 text-black/20 dark:text-white/20"
                    strokeWidth={1.5}
                  />
                  <p className="mt-3 text-[13px] font-semibold">No results</p>
                  <p className="mt-0.5 text-[11px] text-black/45 dark:text-white/45">
                    Try a different show, host, or category.
                  </p>
                </div>
              )}
            </>
          ) : tab === "library" ? (
            <>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8b5cf6] uppercase dark:text-[#c4b5fd]">
                  Saved for later
                </p>
                <h1 className="mt-0.5 text-[27px] font-bold tracking-[-0.03em]">
                  Your Library
                </h1>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-5">
                {SHOWS.slice(0, 6).map((item) => (
                  <ShowCard
                    key={item.title}
                    show={item}
                    onPlay={() => play(SHOWS.indexOf(item))}
                    fluid
                  />
                ))}
              </div>

              <div className="mt-7">
                <h2 className="text-[15px] font-bold">Recently Played</h2>
                <div className="mt-2 space-y-1">
                  {EPISODES.slice(0, 4).map((episode) => {
                    const item = SHOWS[episode.show]
                    return (
                      <button
                        key={episode.title}
                        type="button"
                        onClick={() => play(episode.show)}
                        className="flex w-full items-center gap-3 rounded-xl p-1.5 pr-2 text-left transition-colors hover:bg-black/[0.045] dark:hover:bg-white/[0.06]"
                      >
                        <ShowArt
                          show={item}
                          className="size-9 shrink-0 rounded-lg"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] font-medium">
                            {episode.title}
                          </span>
                          <span className="block truncate text-[10px] text-black/45 dark:text-white/40">
                            {item.title} · {episode.meta}
                          </span>
                        </span>
                        <Play className="size-3.5 shrink-0 fill-current text-black/35 dark:text-white/35" />
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          ) : view === "Charts" ? (
            <>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8b5cf6] uppercase dark:text-[#c4b5fd]">
                  What everyone is listening to
                </p>
                <h1 className="mt-0.5 text-[27px] font-bold tracking-[-0.03em]">
                  Top Charts
                </h1>
              </div>

              <div className="mt-4 space-y-1">
                {SHOWS.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => play(index)}
                    className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-black/[0.045] dark:hover:bg-white/[0.06]"
                  >
                    <span className="w-5 shrink-0 text-center text-[15px] font-bold text-black/25 dark:text-white/25">
                      {index + 1}
                    </span>
                    <ShowArt
                      show={item}
                      className="size-10 shrink-0 rounded-lg"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-semibold">
                        {item.title}
                      </span>
                      <span className="block truncate text-[10.5px] text-black/45 dark:text-white/40">
                        {item.author}
                      </span>
                    </span>
                    <span className="flex size-7 items-center justify-center rounded-full bg-black/[0.055] text-black/50 transition-colors group-hover:bg-[#8b5cf6] group-hover:text-white dark:bg-white/[0.08] dark:text-white/50">
                      <Play className="ml-0.5 size-3 fill-current" />
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : view === "Latest Episodes" ? (
            <>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8b5cf6] uppercase dark:text-[#c4b5fd]">
                  Fresh from your shows
                </p>
                <h1 className="mt-0.5 text-[27px] font-bold tracking-[-0.03em]">
                  Latest Episodes
                </h1>
              </div>

              <div className="mt-4 space-y-1.5">
                {EPISODES.map((episode) => {
                  const item = SHOWS[episode.show]
                  return (
                    <button
                      key={episode.title}
                      type="button"
                      onClick={() => play(episode.show)}
                      className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-black/[0.045] dark:hover:bg-white/[0.06]"
                    >
                      <ShowArt
                        show={item}
                        className="size-11 shrink-0 rounded-lg"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] font-semibold">
                          {episode.title}
                        </span>
                        <span className="block truncate text-[10.5px] text-black/45 dark:text-white/40">
                          {item.title} · {episode.meta}
                        </span>
                      </span>
                      <span className="flex size-7 items-center justify-center rounded-full bg-black/[0.055] text-black/50 transition-colors group-hover:bg-[#8b5cf6] group-hover:text-white dark:bg-white/[0.08] dark:text-white/50">
                        <Play className="ml-0.5 size-3 fill-current" />
                      </span>
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8b5cf6] uppercase dark:text-[#c4b5fd]">
                    Apple Podcasts
                  </p>
                  <h1 className="mt-0.5 text-[27px] font-bold tracking-[-0.03em]">
                    Browse Categories
                  </h1>
                </div>
                <button
                  type="button"
                  className="shrink-0 pb-1 text-[11px] font-medium text-[#8b5cf6] dark:text-[#c4b5fd]"
                >
                  See All
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {CATEGORIES.map((category) => (
                  <CategoryTile key={category.name} category={category} />
                ))}
              </div>

              <section className="mt-7">
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <h2 className="text-[15px] font-bold">Top Shows</h2>
                  <button
                    type="button"
                    className="text-[11px] font-medium text-[#8b5cf6] dark:text-[#c4b5fd]"
                  >
                    See All
                  </button>
                </div>
                <div className="flex [scrollbar-width:none] gap-3.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                  {SHOWS.map((item) => (
                    <ShowCard
                      key={item.title}
                      show={item}
                      onPlay={() => play(SHOWS.indexOf(item))}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <div className="pointer-events-none absolute right-0 bottom-0 left-[188px] z-20 flex justify-center px-4 pb-3">
        <div className="pointer-events-auto relative w-full max-w-[560px]">
          <div
            className={`absolute -inset-1 rounded-[22px] bg-gradient-to-r opacity-30 blur-xl ${current.bg}`}
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-white/85 p-2 pr-3 shadow-[0_18px_48px_-16px_rgba(0,0,0,0.55)] backdrop-blur-2xl dark:border-white/[0.12] dark:bg-[#1c1c1f]/90">
            <div className="flex items-center gap-3">
              <ShowArt
                show={current}
                className="size-[42px] shrink-0 rounded-lg shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] leading-tight font-semibold">
                  {current.title}
                </p>
                <p className="mt-0.5 truncate text-[10px] leading-tight text-black/45 dark:text-white/45">
                  {current.author}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  aria-label="Back 15 seconds"
                  onClick={previous}
                  className="rounded-full p-1.5 transition-colors hover:bg-black/[0.06] active:scale-90 dark:hover:bg-white/10"
                >
                  <RotateCcw className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={playing ? "Pause" : "Play"}
                  onClick={() => setPlaying((value) => !value)}
                  className="flex size-8 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-[0_4px_12px_-3px_rgba(139,92,246,0.6)] transition-transform active:scale-95 dark:bg-white dark:text-black"
                >
                  {playing ? (
                    <Pause className="size-3.5 fill-current" />
                  ) : (
                    <Play className="ml-0.5 size-3.5 fill-current" />
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Forward 30 seconds"
                  onClick={next}
                  className="rounded-full p-1.5 transition-colors hover:bg-black/[0.06] active:scale-90 dark:hover:bg-white/10"
                >
                  <RotateCw className="size-3.5" />
                </button>
              </div>

              <div className="hidden shrink-0 items-center gap-0.5 border-l border-black/[0.07] pl-1.5 sm:flex dark:border-white/10">
                <button
                  type="button"
                  aria-label="Volume"
                  className="rounded-full p-1.5 transition-colors hover:bg-black/[0.06] dark:hover:bg-white/10"
                >
                  <Volume2 className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="AirPlay"
                  className="rounded-full p-1.5 transition-colors hover:bg-black/[0.06] dark:hover:bg-white/10"
                >
                  <Airplay className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="More options"
                  className="rounded-full p-1.5 transition-colors hover:bg-black/[0.06] dark:hover:bg-white/10"
                >
                  <Ellipsis className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="absolute right-3 bottom-0 left-[58px] h-[2px] overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/10">
              <div className="h-full w-[42%] rounded-full bg-[#8b5cf6] dark:bg-white/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Podcasts)
