"use client"

import { memo, useEffect, useState } from "react"
import {
  Compass,
  Gamepad2,
  Hammer,
  Briefcase,
  Play,
  Code2,
  LayoutGrid,
  ArrowDownToLine,
  Search,
} from "lucide-react"
import Avatar from "@/components/avatar"
import { loadAccount, type Account } from "@/lib/account"

const NAV = [
  { id: "discover", label: "Discover", icon: Compass },
  { id: "arcade", label: "Arcade", icon: Gamepad2 },
  { id: "create", label: "Create", icon: Hammer },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "play", label: "Play", icon: Play },
  { id: "develop", label: "Develop", icon: Code2 },
  { id: "categories", label: "Categories", icon: LayoutGrid },
  { id: "updates", label: "Updates", icon: ArrowDownToLine },
]

const APPS = [
  { name: "Pixel Studio", cat: "Create", color: "from-violet-500 via-purple-500 to-fuchsia-600", price: "$4.99" },
  { name: "Focus Timer", cat: "Work", color: "from-sky-400 via-blue-500 to-indigo-600", price: "Free" },
  { name: "Star Trails", cat: "Play", color: "from-neutral-700 via-neutral-800 to-black", price: "$9.99" },
  { name: "Code Runner", cat: "Develop", color: "from-emerald-400 via-teal-500 to-cyan-700", price: "Free" },
  { name: "Mindful", cat: "Create", color: "from-amber-300 via-orange-400 to-rose-500", price: "$2.99" },
  { name: "Orbit Sim", cat: "Play", color: "from-indigo-400 via-blue-600 to-slate-800", price: "$14.99" },
]

function AppStore() {
  const [tab, setTab] = useState("discover")
  const [query, setQuery] = useState("")
  const [installed, setInstalled] = useState<Set<string>>(new Set())
  const [account, setAccount] = useState<Account | null>(null)

  useEffect(() => {
    setAccount(loadAccount())
  }, [])

  const shown = APPS.filter(
    (a) =>
      (tab === "discover" || a.cat.toLowerCase() === tab) &&
      (a.name.toLowerCase().includes(query.toLowerCase()))
  )

  const toggle = (name: string) =>
    setInstalled((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] overflow-hidden translate-y-2 rounded-b-2xl text-black/85 dark:text-white">
      <div className="flex w-48 shrink-0 flex-col bg-black/[0.04] px-2.5 py-3 text-[13px] dark:bg-black/25">
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-black/40 dark:text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search App Store"
            className="h-7 w-full rounded-md bg-black/[0.06] pr-2 pl-7 text-[12px] outline-none placeholder:text-black/35 dark:bg-white/10 dark:placeholder:text-white/35"
          />
        </div>
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 rounded-md px-2 py-[5px] text-left ${
              tab === id
                ? "bg-black/10 font-medium dark:bg-white/15"
                : "text-black/75 hover:bg-black/[0.05] dark:text-white/75 dark:hover:bg-white/[0.07]"
            }`}
          >
            <Icon className="size-4 shrink-0 opacity-70" />
            {label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <Avatar emoji={account?.avatar ?? "🐱"} className="size-7 text-[15px]" />
          <span className="truncate text-[12px] opacity-80">
            {account?.fullName ?? "tahoe"}
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto px-6 py-5">
        {tab === "discover" && !query && (
          <>
            <h2 className="text-[24px] font-bold tracking-tight">Discover</h2>
            <div className="mt-3 overflow-hidden rounded-2xl bg-black/[0.05] dark:bg-white/[0.07]">
              <div className="flex">
                <div className="flex w-44 shrink-0 flex-col justify-center p-4">
                  <p className="text-[10px] font-bold tracking-wider opacity-50">MAJOR UPDATE</p>
                  <p className="mt-1 text-[17px] leading-tight font-bold">See what&apos;s new in macOS Tahoe</p>
                  <p className="mt-2 text-[11px] leading-snug opacity-55">
                    A gorgeous new look, a supercharged Spotlight and more.
                  </p>
                </div>
                <div
                  className="min-h-44 flex-1 bg-cover bg-center"
                  style={{ backgroundImage: "url('/light.jpg')" }}
                />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-black/[0.05] p-4 dark:bg-white/[0.07]">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-600 text-2xl">
                  🚀
                </span>
                <span>
                  <p className="text-[10px] font-bold tracking-wider opacity-50">GET STARTED</p>
                  <p className="text-[14px] font-bold">The Apple Games app is your new home</p>
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-black/[0.05] p-4 dark:bg-white/[0.07]">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-2xl font-bold text-white">
                  A
                </span>
                <span>
                  <p className="text-[10px] font-bold tracking-wider opacity-50">FROM THE EDITORS</p>
                  <p className="text-[14px] font-bold">Welcome to the Mac App Store!</p>
                </span>
              </div>
            </div>
          </>
        )}

        <div className="mt-4 flex items-baseline justify-between">
          <h3 className="text-[15px] font-bold">
            {query ? `Results for "${query}"` : tab === "discover" ? "Apps That Look Great on macOS Tahoe" : NAV.find((n) => n.id === tab)?.label}
          </h3>
          <span className="text-[12px] text-[#0a84ff] dark:text-[#4c9bff]">See All</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3 pb-2 lg:grid-cols-3">
          {shown.map((a) => (
            <div key={a.name} className="flex items-center gap-3 rounded-2xl bg-black/[0.05] p-3 dark:bg-white/[0.07]">
              <span className={`size-12 shrink-0 rounded-xl bg-gradient-to-br shadow ${a.color}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold">{a.name}</span>
                <span className="block text-[11px] opacity-50">{a.price}</span>
              </span>
              <button
                onClick={() => toggle(a.name)}
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${
                  installed.has(a.name)
                    ? "bg-black/10 opacity-70 dark:bg-white/15"
                    : "bg-[#0a84ff] text-white hover:bg-[#0077ed]"
                }`}
              >
                {installed.has(a.name) ? "OPEN" : "GET"}
              </button>
            </div>
          ))}
          {shown.length === 0 && (
            <p className="col-span-full py-8 text-center text-[13px] opacity-40">No results</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(AppStore)
