"use client"

import { memo, useState } from "react"
import { CalendarDays, Check, Flag, Inbox, Search, Star, Tag, Users } from "lucide-react"

type Item = { id: string; text: string; emoji?: string; done: boolean }
type Section = { title: string; items: Item[] }

const INITIAL: Section[] = [
  { title: "Bakery", items: [
    { id: "b1", text: "Croissants", emoji: "🥐", done: false },
    { id: "b2", text: "Bread", emoji: "🍞", done: false },
  ]},
  { title: "Dairy", items: [
    { id: "d1", text: "Milk", emoji: "🥛", done: false },
    { id: "d2", text: "Cheese", emoji: "🧀", done: false },
    { id: "d3", text: "Butter", emoji: "🧈", done: false },
  ]},
  { title: "Fruits", items: [
    { id: "f1", text: "Bananas", emoji: "🍌", done: false },
    { id: "f2", text: "Apples", emoji: "🍏", done: false },
    { id: "f3", text: "Grapes", emoji: "🍇", done: false },
  ]},
  { title: "Protein", items: [] },
]

const TILES = [
  { label: "Today", count: 1, bg: "bg-[#0a84ff]", icon: CalendarDays },
  { label: "Scheduled", count: 15, bg: "bg-[#ff6482]", icon: CalendarDays },
  { label: "All", count: 114, bg: "bg-[#48484a]", icon: Inbox },
  { label: "Flagged", count: 0, bg: "bg-[#ff9f0a]", icon: Flag },
  { label: "Completed", count: 0, bg: "bg-[#98989f]", icon: Check },
  { label: "Assigned", count: 2, bg: "bg-[#30d158]", icon: Users },
]

const LISTS = [
  { label: "Reminders", count: 10, color: "bg-[#0a84ff]", glyph: "≡" },
  { label: "Family", count: 7, color: "bg-[#ff6482]", glyph: "♥" },
  { label: "Work", count: 5, color: "bg-[#0a84ff]", glyph: "★" },
  { label: "Camping Trip", count: 18, color: "bg-[#ac7e5b]", glyph: "▲" },
  { label: "Groceries", count: 16, color: "bg-[#ff9f0a]", glyph: "🛒" },
  { label: "Book club", count: 10, color: "bg-[#bf5af2]", glyph: "🔖" },
  { label: "Gardening", count: 17, color: "bg-[#ffd60a]", glyph: "☀" },
  { label: "Plants to get", count: 5, color: "bg-[#30d158]", glyph: "🌱" },
  { label: "Family Tasks", count: 13, color: "bg-[#5e5ce6]", glyph: "👥" },
]

function Reminders() {
  const [sections, setSections] = useState(INITIAL)
  const [list, setList] = useState("Groceries")
  const [query, setQuery] = useState("")

  const toggle = (sid: string, id: string) =>
    setSections((prev) =>
      prev.map((s) =>
        s.title === sid
          ? { ...s, items: s.items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)) }
          : s
      )
    )

  const total = sections.reduce((n, s) => n + s.items.length, 0)
  const done = sections.reduce((n, s) => n + s.items.filter((i) => i.done).length, 0)

  const shown = sections
    .map((s) => ({ ...s, items: s.items.filter((i) => i.text.toLowerCase().includes(query.trim().toLowerCase())) }))
    .filter((s) => s.items.length > 0 || !query.trim())

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] overflow-hidden rounded-b-2xl">
      <div className="flex w-56 shrink-0 flex-col overflow-y-auto bg-black/[0.04] p-2.5 dark:bg-white/[0.04]">
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 opacity-40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search reminders"
            className="h-7 w-full rounded-md bg-black/[0.06] pr-2 pl-7 text-[12px] outline-none dark:bg-white/10"
          />
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {TILES.map(({ label, count, bg, icon: Icon }) => (
            <button key={label} className="rounded-xl bg-white p-2 text-left shadow-sm dark:bg-white/10">
              <span className="flex items-start justify-between">
                <Icon className="size-4 opacity-70" />
                <span className="text-[18px] leading-none font-bold">{label === "Completed" ? done : count}</span>
              </span>
              <span className={`mt-1 block text-[13px] font-semibold text-white/95 ${bg} -mx-2 -mb-2 rounded-b-xl px-2 pt-1 pb-1.5`}>
                {label}
              </span>
            </button>
          ))}
        </div>
        <p className="px-1.5 pt-3 pb-1 text-[11px] font-semibold opacity-40">My Lists</p>
        {LISTS.map((l) => (
          <button
            key={l.label}
            onClick={() => setList(l.label)}
            className={`flex items-center gap-2 rounded-md px-1.5 py-[5px] text-left text-[13px] ${
              list === l.label ? "bg-[#0a84ff] font-medium text-white" : "hover:bg-black/[0.05] dark:hover:bg-white/[0.07]"
            }`}
          >
            <span className={`flex size-5 items-center justify-center rounded-full text-[11px] text-white ${l.color}`}>
              {l.glyph}
            </span>
            <span className="min-w-0 flex-1 truncate">{l.label}</span>
            <span className="opacity-50">{l.label === "Groceries" ? total : l.count}</span>
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col px-5 py-3">
        <div className="flex shrink-0 items-baseline justify-between">
          <h2 className="text-[28px] font-bold text-[#ff9f0a]">{list}</h2>
          <span className="text-[28px] font-bold text-[#ff9f0a]">{total}</span>
        </div>
        <p className="shrink-0 text-[12px] opacity-50">
          {done} Completed · Clear
        </p>
        <div className="mt-1 min-h-0 flex-1 overflow-y-auto">
          {shown.map((s) => (
            <div key={s.title} className="border-t border-black/10 py-2 first:border-t-0 dark:border-white/10">
              <p className="pb-1 text-[15px] font-bold">{s.title}</p>
              {s.items.map((i) => (
                <button
                  key={i.id}
                  onClick={() => toggle(s.title, i.id)}
                  className="flex w-full items-center gap-2.5 py-[5px] text-left text-[14px]"
                >
                  <span
                    className={`flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                      i.done ? "border-[#0a84ff] bg-[#0a84ff] text-white" : "border-black/25 dark:border-white/30"
                    }`}
                  >
                    {i.done && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <span className={i.done ? "text-black/35 line-through dark:text-white/35" : ""}>
                    {i.emoji} {i.text}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(Reminders)
