"use client"

import { memo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Airplay,
  AudioLines,
  ChevronDown,
  Clock3,
  Coffee,
  Disc3,
  Ellipsis,
  Heart,
  House,
  Library,
  ListMusic,
  MoonStar,
  Music2,
  Pause,
  Play,
  RadioTower,
  Search,
  SkipBack,
  SkipForward,
  Sparkles,
  Star,
  Sun,
  UserRound,
  Volume2,
  Zap,
} from "lucide-react"

type CoverKind =
  | "panda"
  | "brat"
  | "heart"
  | "moon"
  | "car"
  | "sun"
  | "wave"
  | "rings"
  | "bolt"
  | "grid"
  | "type"

type Album = {
  title: string
  artist: string
  bg: string
  kind: CoverKind
  label?: string
  image?: string
}

type Mood = {
  label: string
  sub: string
  bg: string
  icon: LucideIcon
}

const ALBUMS: Album[] = [
  {
    title: "Besties",
    artist: "Black Country, New Road",
    bg: "from-[#ffb56b] via-[#ff5f7e] to-[#b81c66]",
    kind: "panda",
    image: "/memoji/panda.png",
  },
  {
    title: "BRAT",
    artist: "Charli xcx",
    bg: "from-[#dcff52] via-[#aee51c] to-[#70bf00]",
    kind: "brat",
    label: "brat",
  },
  {
    title: "Short n' Sweet",
    artist: "Sabrina Carpenter",
    bg: "from-[#f9ead8] via-[#f7cdd8] to-[#9cc7e8]",
    kind: "heart",
  },
  {
    title: "Midnights",
    artist: "Taylor Swift",
    bg: "from-[#5366b5] via-[#2d3975] to-[#11152d]",
    kind: "moon",
  },
  {
    title: "GNX",
    artist: "Kendrick Lamar",
    bg: "from-[#5a5a5a] via-[#1a1a1a] to-[#000000]",
    kind: "car",
    image: "/bmw1.jpg",
    label: "GNX",
  },
  {
    title: "Eternal Sunshine",
    artist: "Ariana Grande",
    bg: "from-[#ffe797] via-[#ffb56b] to-[#ff7a8a]",
    kind: "sun",
  },
  {
    title: "Hit Me Hard and Soft",
    artist: "Billie Eilish",
    bg: "from-[#0d3f77] via-[#0a5da8] to-[#04213f]",
    kind: "wave",
    image: "/wallpaper1.jpg",
  },
  {
    title: "The Secret of Us",
    artist: "Gracie Abrams",
    bg: "from-[#f8dde2] via-[#f0b8c8] to-[#aec4ec]",
    kind: "rings",
  },
  {
    title: "GUTS",
    artist: "Olivia Rodrigo",
    bg: "from-[#7a2cf0] via-[#b6208a] to-[#ff4d6d]",
    kind: "bolt",
  },
  {
    title: "Stick Season",
    artist: "Noah Kahan",
    bg: "from-[#c99e65] via-[#8a5a33] to-[#472b17]",
    kind: "grid",
    label: "STICK|SEASON",
  },
  {
    title: "1989 (Taylor's Version)",
    artist: "Taylor Swift",
    bg: "from-[#b9e8ff] via-[#8ecdf4] to-[#559dd6]",
    kind: "type",
    label: "1989",
  },
  {
    title: "The Tortured Poets Department",
    artist: "Taylor Swift",
    bg: "from-[#ded2c0] via-[#a99680] to-[#6a5d4d]",
    kind: "type",
    label: "TTPD",
  },
]

const MOODS: Mood[] = [
  {
    label: "Feel Good",
    sub: "Upbeat pop",
    bg: "from-[#ff9f1c] via-[#ff4d6d] to-[#c9184a]",
    icon: Sparkles,
  },
  {
    label: "Chill",
    sub: "Lo-fi & downtempo",
    bg: "from-[#48cae4] via-[#0077b6] to-[#023e8a]",
    icon: Coffee,
  },
  {
    label: "Focus",
    sub: "Deep concentration",
    bg: "from-[#7b2cbf] via-[#5a189a] to-[#240046]",
    icon: Disc3,
  },
  {
    label: "Late Night",
    sub: "After-hours moods",
    bg: "from-[#3a0ca3] via-[#240046] to-[#10002b]",
    icon: MoonStar,
  },
  {
    label: "Energy",
    sub: "Get moving",
    bg: "from-[#b5e48c] via-[#52b788] to-[#1b4332]",
    icon: Zap,
  },
  {
    label: "Love Songs",
    sub: "All the feels",
    bg: "from-[#ffafcc] via-[#ff477e] to-[#a4133c]",
    icon: Heart,
  },
  {
    label: "Acoustic",
    sub: "Warm & unplugged",
    bg: "from-[#e9c46a] via-[#f4a261] to-[#e76f51]",
    icon: Sun,
  },
  {
    label: "Discover",
    sub: "Fresh finds",
    bg: "from-[#00b4d8] via-[#4361ee] to-[#3a0ca3]",
    icon: RadioTower,
  },
]

const NAV: { label: string; icon: LucideIcon }[] = [
  { label: "Home", icon: House },
  { label: "New", icon: Sparkles },
  { label: "Radio", icon: RadioTower },
]

const LIBRARY: { label: string; icon: LucideIcon }[] = [
  { label: "Recently Added", icon: Clock3 },
  { label: "Artists", icon: UserRound },
  { label: "Albums", icon: Disc3 },
  { label: "Songs", icon: Music2 },
  { label: "Made for You", icon: Sparkles },
]

const PLAYLISTS = [
  "Favorite Songs",
  "Chill Mix",
  "Coding Focus",
  "Late Night Drive",
]

function AlbumCover({
  album,
  className = "",
}: {
  album: Album
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[10px] bg-gradient-to-br ${album.bg} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_14%,rgba(255,255,255,0.38),transparent_52%)]" />

      {album.kind === "panda" && album.image && (
        <img
          src={album.image}
          alt=""
          draggable={false}
          className="absolute inset-x-0 bottom-[-7%] h-[114%] w-full scale-[1.08] object-contain object-bottom drop-shadow-[0_10px_18px_rgba(70,0,40,0.35)]"
        />
      )}

      {album.kind === "brat" && (
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full"
          aria-hidden
        >
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fontSize="37"
            fontWeight="600"
            letterSpacing="-3.5"
            fill="rgba(0,0,0,0.72)"
          >
            brat
          </text>
          <circle
            cx="50"
            cy="50"
            r="43"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
          />
        </svg>
      )}

      {album.kind === "heart" && (
        <>
          <Heart
            className="absolute inset-0 m-auto size-[43%] text-white/85"
            fill="rgba(255,255,255,0.82)"
            strokeWidth={1}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/20 to-transparent" />
        </>
      )}

      {album.kind === "moon" && (
        <>
          <MoonStar
            className="absolute right-2 bottom-2 size-[52%] text-[#f2e6a5]"
            strokeWidth={1.1}
          />
          <Star
            className="absolute top-3 left-3 size-[13%] text-white/70"
            fill="currentColor"
            strokeWidth={0}
          />
          <Star
            className="absolute top-[30%] right-[18%] size-[8%] text-white/50"
            fill="currentColor"
            strokeWidth={0}
          />
        </>
      )}

      {album.kind === "car" && album.image && (
        <>
          <img
            src={album.image}
            alt=""
            draggable={false}
            className="absolute inset-0 size-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <span className="absolute bottom-2 left-2 text-[10px] font-black tracking-[0.2em] text-white">
            {album.label}
          </span>
        </>
      )}

      {album.kind === "sun" && (
        <>
          <div className="absolute top-1/2 left-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35" />
          <div className="absolute top-1/2 left-1/2 size-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[2px]" />
          <Sun
            className="absolute inset-0 m-auto size-[38%] text-white/90"
            strokeWidth={1.4}
          />
        </>
      )}

      {album.kind === "wave" && album.image && (
        <>
          <img
            src={album.image}
            alt=""
            draggable={false}
            className="absolute inset-0 size-full object-cover opacity-75 saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a2b57]/70 via-[#0a57a0]/20 to-[#02111f]/85" />
          <AudioLines
            className="absolute right-2 bottom-2 size-[26%] text-white/70"
            strokeWidth={1.4}
          />
        </>
      )}

      {album.kind === "rings" && (
        <>
          <div className="absolute -right-[18%] -bottom-[24%] size-[80%] rounded-full border-[3px] border-white/30" />
          <div className="absolute -right-[4%] -bottom-[10%] size-[52%] rounded-full border-[2px] border-white/25" />
          <Sparkles
            className="absolute top-1/2 left-1/2 size-[30%] -translate-x-1/2 -translate-y-1/2 text-white"
            strokeWidth={1.3}
          />
        </>
      )}

      {album.kind === "bolt" && (
        <>
          <Zap
            className="absolute inset-0 m-auto size-[47%] text-white/90"
            fill="rgba(255,255,255,0.2)"
            strokeWidth={1.3}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/25 to-transparent" />
        </>
      )}

      {album.kind === "grid" && album.label && (
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full"
          aria-hidden
        >
          {[24, 48, 72].map((y) => (
            <line
              key={y}
              x1="16"
              x2="84"
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.8"
            />
          ))}
          {album.label.split("|").map((line, index) => (
            <text
              key={line}
              x="50"
              y={44 + index * 16}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              letterSpacing="3.6"
              fill="rgba(255,255,255,0.88)"
            >
              {line}
            </text>
          ))}
        </svg>
      )}

      {album.kind === "type" && album.label && (
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full"
          aria-hidden
        >
          <text
            x="50"
            y="53"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
            fontWeight="700"
            letterSpacing="2"
            fill="rgba(255,255,255,0.92)"
          >
            {album.label}
          </text>
        </svg>
      )}

      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-black/10 ring-inset" />
    </div>
  )
}

function AlbumCard({
  album,
  onPlay,
  compact = false,
  fluid = false,
}: {
  album: Album
  onPlay: () => void
  compact?: boolean
  fluid?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className={`group text-left ${fluid ? "w-full" : compact ? "w-[116px] shrink-0" : "w-[148px] shrink-0"}`}
    >
      <div className="relative">
        <AlbumCover
          album={album}
          className="aspect-square w-full shadow-[0_10px_26px_-12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-[1.015]"
        />
        <span className="absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-black/75 text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-150 group-hover:opacity-100">
          <Play className="ml-0.5 size-3.5 fill-current" />
        </span>
      </div>
      <p
        className={`mt-2 truncate leading-tight font-semibold ${compact ? "text-[11.5px]" : "text-[12.5px]"}`}
      >
        {album.title}
      </p>
      <p
        className={`mt-0.5 truncate leading-tight text-black/45 dark:text-white/45 ${compact ? "text-[10.5px]" : "text-[11.5px]"}`}
      >
        {album.artist}
      </p>
    </button>
  )
}

function MoodCard({ mood, fluid = false }: { mood: Mood; fluid?: boolean }) {
  const Icon = mood.icon
  return (
    <button
      type="button"
      className={`group relative h-[94px] overflow-hidden rounded-2xl bg-gradient-to-br p-3 text-left text-white shadow-[0_10px_24px_-14px_rgba(0,0,0,0.55)] transition-transform duration-200 hover:-translate-y-0.5 ${fluid ? "w-full" : "w-[174px] shrink-0"} ${mood.bg}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_5%,rgba(255,255,255,0.34),transparent_55%)]" />
      <Icon
        className="absolute -right-2 -bottom-2 size-14 text-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
        strokeWidth={1.4}
      />
      <div className="relative flex h-full flex-col justify-end">
        <p className="text-[13px] leading-tight font-semibold">{mood.label}</p>
        <p className="mt-0.5 text-[10px] leading-tight text-white/70">
          {mood.sub}
        </p>
      </div>
    </button>
  )
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <h2 className="text-[16px] font-bold tracking-[-0.01em]">{title}</h2>
      <button
        type="button"
        className="shrink-0 text-[11px] font-medium text-[#fa2d48] opacity-90 hover:opacity-100"
      >
        See All
      </button>
    </div>
  )
}

function Music() {
  const [track, setTrack] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [query, setQuery] = useState("")
  const [view, setView] = useState("Home")
  const current = ALBUMS[track]

  const needle = query.trim().toLowerCase()
  const filteredAlbums = ALBUMS.filter(
    (album) =>
      album.title.toLowerCase().includes(needle) ||
      album.artist.toLowerCase().includes(needle)
  )
  const filteredMoods = MOODS.filter(
    (mood) =>
      mood.label.toLowerCase().includes(needle) ||
      mood.sub.toLowerCase().includes(needle)
  )

  const play = (index: number) => {
    setTrack(index)
    setPlaying(true)
  }

  const next = () => setTrack((value) => (value + 1) % ALBUMS.length)
  const previous = () =>
    setTrack((value) => (value - 1 + ALBUMS.length) % ALBUMS.length)

  return (
    <div className="relative -m-4 flex h-[calc(100%+2rem)] translate-y-2 overflow-hidden rounded-b-2xl bg-[#fbfbfa] text-[#1d1d1f] dark:bg-[#101011] dark:text-white">
      <aside className="flex w-[188px] shrink-0 [scrollbar-width:none] flex-col overflow-y-auto border-r border-black/[0.06] bg-[#f1f0ee] px-2.5 pt-3 pb-3 dark:border-white/[0.06] dark:bg-[#1b1b1d] [&::-webkit-scrollbar]:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-black/35 dark:text-white/40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search music"
            className="h-8 w-full rounded-lg border border-black/[0.04] bg-black/[0.055] pr-2 pl-8 text-[12px] outline-none placeholder:text-black/35 focus:border-[#fa2d48]/40 focus:bg-white dark:border-white/[0.06] dark:bg-white/[0.08] dark:placeholder:text-white/35 dark:focus:bg-white/[0.12]"
          />
        </div>

        <nav className="mt-3 space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = view === item.label
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setView(item.label)
                  setQuery("")
                }}
                aria-pressed={active}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-[6px] text-left text-[12px] transition-colors ${
                  active
                    ? "bg-black/[0.075] font-semibold dark:bg-white/[0.13]"
                    : "text-black/70 hover:bg-black/[0.045] dark:text-white/70 dark:hover:bg-white/[0.07]"
                }`}
              >
                <Icon
                  className={`size-3.5 ${active ? "text-[#fa2d48]" : "text-black/45 dark:text-white/45"}`}
                  strokeWidth={active ? 2.2 : 1.9}
                />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-4 border-t border-black/[0.06] pt-3 dark:border-white/[0.07]">
          <div className="flex items-center px-2 pb-1.5 text-[10px] font-semibold tracking-[0.12em] text-black/35 uppercase dark:text-white/35">
            <Library className="mr-1.5 size-3" />
            Library
            <ChevronDown className="ml-auto size-3" />
          </div>
          {LIBRARY.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-[6px] text-left text-[12px] text-black/70 transition-colors hover:bg-black/[0.045] dark:text-white/70 dark:hover:bg-white/[0.07]"
              >
                <Icon
                  className="size-3.5 text-black/40 dark:text-white/40"
                  strokeWidth={1.9}
                />
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="mt-3 border-t border-black/[0.06] pt-3 dark:border-white/[0.07]">
          <p className="px-2 pb-1.5 text-[10px] font-semibold tracking-[0.12em] text-black/35 uppercase dark:text-white/35">
            Playlists
          </p>
          {PLAYLISTS.map((name) => (
            <button
              key={name}
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-2 py-[6px] text-left text-[12px] text-black/70 transition-colors hover:bg-black/[0.045] dark:text-white/70 dark:hover:bg-white/[0.07]"
            >
              <ListMusic
                className="size-3.5 text-black/40 dark:text-white/40"
                strokeWidth={1.9}
              />
              <span className="truncate">{name}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto px-6 pt-4 pb-28 [&::-webkit-scrollbar]:hidden">
          {needle ? (
            <>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-[#fa2d48] uppercase">
                    Search
                  </p>
                  <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.03em]">
                    Search Results
                  </h1>
                  <p className="mt-1 text-[11.5px] text-black/45 dark:text-white/45">
                    {filteredAlbums.length + filteredMoods.length} results for “
                    {query.trim()}”
                  </p>
                </div>
              </div>

              {filteredAlbums.length > 0 && (
                <div className="mt-5 grid grid-cols-3 gap-x-4 gap-y-5 xl:grid-cols-4">
                  {filteredAlbums.map((album) => (
                    <AlbumCard
                      key={album.title}
                      album={album}
                      onPlay={() => play(ALBUMS.indexOf(album))}
                      fluid
                    />
                  ))}
                </div>
              )}

              {filteredMoods.length > 0 && (
                <div className="mt-6">
                  <SectionHeading title="Moods & Activities" />
                  <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-3">
                    {filteredMoods.map((mood) => (
                      <MoodCard key={mood.label} mood={mood} fluid />
                    ))}
                  </div>
                </div>
              )}

              {filteredAlbums.length + filteredMoods.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Search
                    className="size-8 text-black/20 dark:text-white/20"
                    strokeWidth={1.5}
                  />
                  <p className="mt-3 text-[13px] font-semibold">No results</p>
                  <p className="mt-0.5 text-[11.5px] text-black/45 dark:text-white/45">
                    Try a different artist, album, or mood.
                  </p>
                </div>
              )}
            </>
          ) : view === "New" ? (
            <>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-[#fa2d48] uppercase">
                    Fresh releases
                  </p>
                  <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.03em]">
                    New
                  </h1>
                </div>
                <ProfileButton />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-x-4 gap-y-5 xl:grid-cols-4">
                {ALBUMS.map((album) => (
                  <AlbumCard
                    key={album.title}
                    album={album}
                    onPlay={() => play(ALBUMS.indexOf(album))}
                    fluid
                  />
                ))}
              </div>
            </>
          ) : view === "Radio" ? (
            <>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-[#fa2d48] uppercase">
                    Live & on demand
                  </p>
                  <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.03em]">
                    Radio
                  </h1>
                </div>
                <ProfileButton />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-3">
                {MOODS.map((mood) => (
                  <MoodCard key={mood.label} mood={mood} fluid />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-[#fa2d48] uppercase">
                    Listen now
                  </p>
                  <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.03em]">
                    Home
                  </h1>
                </div>
                <ProfileButton />
              </div>

              <section className="mt-6">
                <SectionHeading title="Top Picks for You" />
                <div className="flex [scrollbar-width:none] gap-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                  {ALBUMS.slice(0, 6).map((album) => (
                    <AlbumCard
                      key={album.title}
                      album={album}
                      onPlay={() => play(ALBUMS.indexOf(album))}
                    />
                  ))}
                </div>
              </section>

              <section className="mt-6">
                <SectionHeading title="Listen Again" />
                <div className="flex [scrollbar-width:none] gap-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                  {ALBUMS.slice(5, 12).map((album) => (
                    <AlbumCard
                      key={album.title}
                      album={album}
                      onPlay={() => play(ALBUMS.indexOf(album))}
                      compact
                    />
                  ))}
                </div>
              </section>

              <section className="mt-6">
                <SectionHeading title="Mood for You" />
                <div className="flex [scrollbar-width:none] gap-2.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                  {MOODS.map((mood) => (
                    <MoodCard key={mood.label} mood={mood} />
                  ))}
                </div>
              </section>

              <section className="mt-6">
                <SectionHeading title="Recently Played" />
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {ALBUMS.slice(2, 10).map((album) => (
                    <button
                      key={album.title}
                      type="button"
                      onClick={() => play(ALBUMS.indexOf(album))}
                      className="group flex items-center gap-2.5 rounded-xl p-1.5 pr-2 text-left transition-colors hover:bg-black/[0.045] dark:hover:bg-white/[0.06]"
                    >
                      <AlbumCover
                        album={album}
                        className="size-10 shrink-0 rounded-lg"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] font-medium">
                          {album.title}
                        </span>
                        <span className="block truncate text-[10.5px] text-black/45 dark:text-white/40">
                          {album.artist}
                        </span>
                      </span>
                      <Ellipsis className="size-4 shrink-0 text-black/30 opacity-0 transition-opacity group-hover:opacity-100 dark:text-white/30" />
                    </button>
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
            className={`absolute -inset-1 rounded-[22px] bg-gradient-to-r opacity-25 blur-xl ${current.bg}`}
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-white/80 p-2 pr-3 shadow-[0_16px_44px_-16px_rgba(0,0,0,0.45)] backdrop-blur-2xl dark:border-white/[0.12] dark:bg-[#2a2a2d]/85">
            <div className="flex items-center gap-3">
              <AlbumCover
                album={current}
                className="size-[42px] shrink-0 rounded-lg shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] leading-tight font-semibold">
                  {current.title}
                </p>
                <p className="mt-0.5 truncate text-[10.5px] leading-tight text-black/45 dark:text-white/45">
                  {current.artist}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  aria-label="Previous track"
                  onClick={previous}
                  className="rounded-full p-1.5 transition-colors hover:bg-black/[0.06] active:scale-90 dark:hover:bg-white/10"
                >
                  <SkipBack className="size-3.5 fill-current" />
                </button>
                <button
                  type="button"
                  aria-label={playing ? "Pause" : "Play"}
                  onClick={() => setPlaying((value) => !value)}
                  className="flex size-8 items-center justify-center rounded-full bg-[#1d1d1f] text-white shadow-sm transition-transform active:scale-95 dark:bg-white dark:text-black"
                >
                  {playing ? (
                    <Pause className="size-3.5 fill-current" />
                  ) : (
                    <Play className="ml-0.5 size-3.5 fill-current" />
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Next track"
                  onClick={next}
                  className="rounded-full p-1.5 transition-colors hover:bg-black/[0.06] active:scale-90 dark:hover:bg-white/10"
                >
                  <SkipForward className="size-3.5 fill-current" />
                </button>
              </div>

              <div className="hidden shrink-0 items-center gap-0.5 border-l border-black/[0.07] pl-1.5 sm:flex dark:border-white/10">
                <button
                  type="button"
                  aria-label="AirPlay"
                  className="rounded-full p-1.5 transition-colors hover:bg-black/[0.06] dark:hover:bg-white/10"
                >
                  <Airplay className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Volume"
                  className="rounded-full p-1.5 transition-colors hover:bg-black/[0.06] dark:hover:bg-white/10"
                >
                  <Volume2 className="size-3.5" />
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
              <div className="h-full w-[38%] rounded-full bg-black/45 dark:bg-white/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileButton() {
  return (
    <button
      type="button"
      aria-label="Profile"
      className="relative size-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#ffb56b] via-[#ff5f7e] to-[#b81c66] p-[2px] shadow-sm ring-1 ring-black/10"
    >
      <span className="block size-full overflow-hidden rounded-full bg-white dark:bg-[#1d1d1f]">
        <img
          src="/memoji/panda.png"
          alt=""
          draggable={false}
          className="size-full object-contain object-bottom p-[1px]"
        />
      </span>
    </button>
  )
}

export default memo(Music)
