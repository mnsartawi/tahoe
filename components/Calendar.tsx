"use client"

import { memo, useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const DOW = ["S", "M", "T", "W", "T", "F", "S"]

function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()
  const cells: { day: number; other: boolean }[] = []
  for (let i = first - 1; i >= 0; i--) cells.push({ day: prevDays - i, other: true })
  for (let d = 1; d <= days; d++) cells.push({ day: d, other: false })
  while (cells.length % 7 !== 0 || cells.length < 35)
    cells.push({ day: cells.length - first - days + 1, other: true })
  return cells.slice(0, 42)
}

function MiniMonth({ year, month, today }: { year: number; month: number; today: Date }) {
  return (
    <div>
      <p className="mb-1 text-center text-[12px] font-semibold">
        {MONTHS[month]} {year}
      </p>
      <div className="grid grid-cols-7 text-center text-[10px] text-black/40 dark:text-white/40">
        {DOW.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-[11px]">
        {monthCells(year, month).map((c, i) => {
          const isToday =
            !c.other &&
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === c.day
          return (
            <span
              key={i}
              className={`flex aspect-square items-center justify-center ${
                c.other ? "text-black/25 dark:text-white/25" : ""
              } ${isToday ? "rounded-full bg-[#ff3b30] font-bold text-white" : ""}`}
            >
              {c.day}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function CalendarApp() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [view, setView] = useState("Year")
  const today = now

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] translate-y-2 overflow-hidden rounded-b-2xl">
      <div className="flex w-48 shrink-0 flex-col gap-3 overflow-y-auto bg-black/[0.04] p-3 dark:bg-white/[0.04]">
        <div className="flex rounded-full bg-black/[0.07] p-0.5 text-[12px] dark:bg-white/10">
          <span className="flex-1 rounded-full bg-[#ff3b30] py-1 text-center font-medium text-white">New</span>
          <span className="flex-1 py-1 text-center opacity-60">Replied</span>
        </div>
        <MiniMonth year={year} month={today.getMonth()} today={today} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 px-3 py-2">
          <button aria-label="Add event" className="rounded-full p-1.5 hover:bg-black/[0.06] dark:hover:bg-white/10">
            <Plus className="size-4" />
          </button>
          <span className="flex-1" />
          <span className="flex items-center rounded-full bg-black/[0.06] p-0.5 text-[12px] dark:bg-white/10">
            {["Day", "Week", "Month", "Year"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-3 py-1 ${view === v ? "bg-white font-medium shadow-sm dark:bg-white/20" : "opacity-60 hover:opacity-100"}`}
              >
                {v}
              </button>
            ))}
          </span>
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 opacity-40" />
            <input
              placeholder="Search"
              aria-label="Search events"
              className="h-7 w-32 rounded-full bg-black/[0.06] pr-2 pl-7 text-[12px] outline-none dark:bg-white/10"
            />
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 px-3 pb-1">
          <span className="text-[28px] font-bold tracking-tight">{year}</span>
          <span className="flex-1" />
          <button aria-label="Previous year" onClick={() => setYear((y) => y - 1)} className="rounded-full p-1 hover:bg-black/[0.06] dark:hover:bg-white/10">
            <ChevronLeft className="size-4" />
          </button>
          <button onClick={() => setYear(now.getFullYear())} className="rounded-full bg-black/[0.06] px-3 py-1 text-[12px] font-medium dark:bg-white/10">
            Today
          </button>
          <button aria-label="Next year" onClick={() => setYear((y) => y + 1)} className="rounded-full p-1 hover:bg-black/[0.06] dark:hover:bg-white/10">
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-x-4 gap-y-5 overflow-y-auto px-4 pt-2 pb-4 sm:grid-cols-3 lg:grid-cols-4">
          {MONTHS.map((name, m) => (
            <div key={name}>
              <p className="mb-1 text-[14px] font-semibold text-[#ff3b30]">{name}</p>
              <div className="grid grid-cols-7 text-center text-[10px] text-black/40 dark:text-white/40">
                {DOW.map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center text-[11px]">
                {monthCells(year, m).map((c, i) => {
                  const isToday =
                    !c.other &&
                    today.getFullYear() === year &&
                    today.getMonth() === m &&
                    today.getDate() === c.day
                  return (
                    <span
                      key={i}
                      className={`flex aspect-square items-center justify-center ${
                        c.other ? "text-black/25 dark:text-white/25" : ""
                      } ${isToday ? "rounded-full bg-[#ff3b30] font-bold text-white" : ""}`}
                    >
                      {c.day}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(CalendarApp)
