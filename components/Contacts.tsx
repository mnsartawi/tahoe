"use client"

import { memo, useState } from "react"
import { MessageCircle, Phone, Search, Share, Video } from "lucide-react"

type Contact = { id: string; name: string; phone: string; tile: string; bg: string }

const CONTACTS: Contact[] = [
  { id: "c1", name: "Erica Souza", phone: "341-556-0102", tile: "/memoji/cat.webp", bg: "bg-[#d6e9f8]" },
  { id: "c2", name: "Luis Coderque", phone: "341-556-0132", tile: "LC", bg: "bg-gradient-to-b from-blue-400 to-indigo-600" },
  { id: "c3", name: "John Appleseed", phone: "341-556-0119", tile: "JA", bg: "bg-gradient-to-b from-amber-400 to-orange-600" },
  { id: "c4", name: "Armando Cajide", phone: "341-556-0147", tile: "/memoji/panda.png", bg: "bg-[#dff0d8]" },
]

function Face({ c, size }: { c: Contact; size: string }) {
  if (c.tile.startsWith("/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={c.tile} alt="" draggable={false} className={`${size} rounded-full object-cover`} />
    )
  }
  return (
    <span className={`${size} flex items-center justify-center rounded-full text-white ${c.bg} text-[13px] font-bold`}>
      {c.tile}
    </span>
  )
}

function Contacts() {
  const [activeId, setActiveId] = useState("c1")
  const [query, setQuery] = useState("")
  const active = CONTACTS.find((c) => c.id === activeId) ?? CONTACTS[0]
  const visible = CONTACTS.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] translate-y-2 gap-2 overflow-hidden rounded-b-2xl p-2">
      <div className="flex w-64 shrink-0 flex-col overflow-hidden rounded-xl bg-white/60 dark:bg-white/[0.07]">
        <div className="flex shrink-0 gap-2 overflow-x-auto p-2">
          {CONTACTS.map((c) => (
            <button key={c.id} onClick={() => setActiveId(c.id)} className={`shrink-0 rounded-xl p-1 ${c.id === activeId ? "bg-[#0a84ff]/15 ring-1 ring-[#0a84ff]/40" : ""}`}>
              <span className={`flex size-10 items-center justify-center overflow-hidden rounded-full ${c.bg}`}>
                <Face c={c} size="size-9" />
              </span>
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-2">
          {visible.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left ${
                c.id === activeId ? "bg-black/[0.06] dark:bg-white/10" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              }`}
            >
              <span className={`flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full ${c.bg}`}>
                <Face c={c} size="size-8" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold">{c.name}</span>
                <span className="block text-[11px] text-black/40 dark:text-white/40">{c.phone}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center overflow-y-auto rounded-xl bg-[#c7cede] px-6 py-6 dark:bg-black/60">
        <span className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-white/40 shadow-inner">
          <Face c={active} size="size-24" />
        </span>
        <p className="mt-2 text-[17px] font-semibold text-[#2c2c34] dark:text-white">{active.name}</p>
        <div className="mt-2 flex items-center gap-5 text-[#2c2c34] dark:text-white">
          <MessageCircle className="size-4" />
          <Phone className="size-4" />
          <Video className="size-4" />
          <Share className="size-4" />
        </div>
        <div className="mt-4 w-full max-w-72 space-y-1.5 text-[12px]">
          {[
            ["phone", active.phone],
            ["FaceTime", active.phone],
          ].map(([k, v]) => (
            <p key={k} className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2 dark:bg-black/25">
              <span className="opacity-55">{k}</span>
              <span className="font-medium">{v}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(Contacts)
