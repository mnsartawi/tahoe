"use client"

import { memo, useState } from "react"
import { Loader2, MapPin, Navigation, Search } from "lucide-react"

type Place = {
  name: string
  lat: string
  lon: string
}

const DEFAULT: Place = { name: "Lake Tahoe", lat: "39.0968", lon: "-120.0324" }

function Maps({ suspended }: { suspended?: boolean }) {
  const [query, setQuery] = useState("")
  const [place, setPlace] = useState<Place>(DEFAULT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async () => {
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
        { headers: { Accept: "application/json" } }
      )
      if (!res.ok) throw new Error()
      const [first] = (await res.json()) as { display_name: string; lat: string; lon: string }[]
      if (!first) {
        setError(`No results for "${q}"`)
        return
      }
      setPlace({ name: first.display_name.split(",").slice(0, 2).join(","), lat: first.lat, lon: first.lon })
    } catch {
      setError("Search failed — check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const lat = parseFloat(place.lat)
  const lon = parseFloat(place.lon)
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.12}%2C${lat - 0.08}%2C${lon + 0.12}%2C${lat + 0.08}&layer=mapnik&marker=${lat}%2C${lon}`

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] translate-y-2 flex-col overflow-hidden rounded-b-2xl">
      <div className="flex shrink-0 items-center gap-2 px-3 py-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 opacity-40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") search()
              e.stopPropagation()
            }}
            placeholder="Search Maps"
            aria-label="Search Maps"
            spellCheck={false}
            autoComplete="off"
            className="h-9 w-full rounded-full bg-black/[0.06] pr-3 pl-9 text-[13px] outline-none placeholder:text-black/35 focus:bg-black/[0.09] dark:bg-white/10 dark:placeholder:text-white/35 dark:focus:bg-white/[0.14]"
          />
        </div>
        <a
          href={`https://maps.apple.com/?q=${encodeURIComponent(place.name)}&ll=${lat},${lon}`}
          target="_blank"
          rel="noreferrer"
          title="Open in Apple Maps"
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#0a84ff] px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-[#0077ed]"
        >
          <Navigation className="size-3.5" />
          <span className="hidden sm:inline">Apple Maps</span>
        </a>
      </div>

      <div className="t-cursor-location relative min-h-0 flex-1">
        {suspended ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/[0.04] px-6 text-center dark:bg-white/[0.04]">
            <MapPin className="size-5 text-[#0a84ff]" />
            <p className="max-w-64 truncate text-[14px] font-medium">{place.name}</p>
            <p className="text-[12px] opacity-50">Paused while in the background</p>
          </div>
        ) : (
          <iframe
            key={embed}
            title="Map"
            src={embed}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
          />
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}
        <div className="tahoe-glass pointer-events-none absolute bottom-3 left-3 flex max-w-[70%] items-center gap-2 rounded-2xl px-3 py-2">
          <MapPin className="size-4 shrink-0 text-[#0a84ff]" />
          <span className="truncate text-[13px] font-medium">{place.name}</span>
        </div>
      </div>
      {error && <p className="shrink-0 px-3 py-1.5 text-[12px] text-red-500">{error}</p>}
    </div>
  )
}

export default memo(Maps)
