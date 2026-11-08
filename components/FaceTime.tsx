"use client"

import { memo, useState } from "react"
import { MessageCircle, Mic, Phone, PhoneMissed, Search, Video } from "lucide-react"

type Contact = {
  id: string
  name: string
  tile: string
  tileBg: string
  detailBg: string
  time: string
  missed?: boolean
  phone: string
}

const CONTACTS: Contact[] = [
  { id: "c1", name: "Luis Coderque", tile: "/memoji/cat.webp", tileBg: "bg-[#e9a8d8]", detailBg: "from-[#e0609f] to-[#b0488f]", time: "9:41 AM", phone: "341-556-0132" },
  { id: "c2", name: "Erica Souza", tile: "/memoji/panda.png", tileBg: "bg-[#dff0d8]", detailBg: "from-[#3f9e4d] to-[#1e6b34]", time: "Yesterday", phone: "341-556-0147" },
  { id: "c3", name: "MP", tile: "MP", tileBg: "bg-[#b8e26a]", detailBg: "from-[#7fb539] to-[#4e7d22]", time: "Tuesday", phone: "341-556-0102" },
  { id: "c4", name: "John Appleseed", tile: "JA", tileBg: "bg-[#e8c88a]", detailBg: "from-[#c98f3d] to-[#8a5f22]", time: "Monday", missed: true, phone: "341-556-0119" },
]

function TileFace({ c, size }: { c: Contact; size: string }) {
  if (c.tile.startsWith("/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={c.tile} alt="" draggable={false} className={`${size} rounded-full object-cover`} />
    )
  }
  return (
    <span
      className={`${size} flex items-center justify-center rounded-full text-white/95 ${c.tileBg} text-[13px] font-bold`}
    >
      {c.tile}
    </span>
  )
}

function FaceTime() {
  const [activeId, setActiveId] = useState("c1")
  const [query, setQuery] = useState("")
  const [calling, setCalling] = useState(false)
  const active = CONTACTS.find((c) => c.id === activeId) ?? CONTACTS[0]

  const visible = CONTACTS.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] gap-2 overflow-hidden rounded-b-2xl p-2">
      <div className="flex w-64 shrink-0 flex-col overflow-hidden rounded-xl bg-white/60 dark:bg-white/[0.07]">
        <div className="flex shrink-0 gap-2 overflow-x-auto p-2.5 pb-1">
          {CONTACTS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-xl p-1.5 ${
                c.id === activeId ? "bg-[#0a84ff]/15 ring-1 ring-[#0a84ff]/40" : "hover:bg-black/[0.04] dark:hover:bg-white/10"
              }`}
            >
              <span className={`flex size-14 items-center justify-center overflow-hidden rounded-full ${c.tileBg}`}>
                <TileFace c={c} size="size-14" />
              </span>
              <span className="max-w-16 truncate text-[10px]">{c.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        <p className="shrink-0 px-3 pt-1 pb-0.5 text-[11px] font-semibold text-black/40 dark:text-white/40">Recents</p>
        <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-2">
          {visible.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left ${
                c.id === activeId ? "bg-black/[0.06] dark:bg-white/10" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              }`}
            >
              <span className={`flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full ${c.tileBg}`}>
                <TileFace c={c} size="size-8" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-[12px] font-semibold ${c.missed ? "text-red-500" : ""}`}>
                  {c.name}
                </span>
                <span className="block text-[11px] text-black/40 dark:text-white/40">
                  {c.missed ? "Missed · " : ""}{c.time}
                </span>
              </span>
              {c.missed ? (
                <PhoneMissed className="size-3.5 shrink-0 text-red-500" />
              ) : (
                <Phone className="size-3.5 shrink-0 text-black/30 dark:text-white/30" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl">
        <div className={`relative flex min-h-0 flex-1 flex-col items-center justify-center bg-gradient-to-b ${active.detailBg} p-4`}>
          <div className="absolute top-2.5 right-2.5">
            <span className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2 size-3 -translate-y-1/2 text-white/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search contacts"
                className="h-6 w-24 rounded-md bg-black/20 pr-1.5 pl-6 text-[11px] text-white outline-none placeholder:text-white/50"
              />
            </span>
          </div>
          <span className="flex size-28 items-center justify-center overflow-hidden rounded-full bg-black/15">
            <TileFace c={active} size="size-28" />
          </span>
          <p className="mt-2 text-[17px] font-semibold text-white">{active.name}</p>
          <div className="mt-2 flex items-center gap-4 text-white">
            <button
              aria-label={calling ? "End call" : "Call"}
              onClick={() => setCalling((v) => !v)}
              className={`flex size-9 items-center justify-center rounded-full transition-transform hover:scale-105 ${calling ? "bg-red-500" : "bg-white/25"}`}
            >
              <Phone className="size-4" />
            </button>
            <button aria-label="Video" className="flex size-9 items-center justify-center rounded-full bg-white/25 transition-transform hover:scale-105">
              <Video className="size-4" />
            </button>
            <button aria-label="Message" className="flex size-9 items-center justify-center rounded-full bg-white/25 transition-transform hover:scale-105">
              <MessageCircle className="size-4" />
            </button>
            <button aria-label="Mute" className="flex size-9 items-center justify-center rounded-full bg-white/25 transition-transform hover:scale-105">
              <Mic className="size-4" />
            </button>
          </div>
          {calling && <p className="mt-2 animate-pulse text-[12px] text-white/85">Calling {active.name}…</p>}
        </div>
        <div className="shrink-0 bg-white/70 px-4 py-2.5 text-[12px] dark:bg-white/[0.08]">
          <p className="flex items-center justify-between">
            <span className="text-black/45 dark:text-white/45">phone</span>
            <span className="font-medium">{active.phone}</span>
          </p>
          <p className="mt-1 flex items-center justify-between">
            <span className="text-black/45 dark:text-white/45">FaceTime</span>
            <span className="font-medium text-[#0a84ff]">{active.phone}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default memo(FaceTime)
