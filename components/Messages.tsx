"use client"

import { memo, useEffect, useRef, useState } from "react"
import {
  AudioLines,
  ChevronLeft,
  Plus,
  Search,
  Smile,
  Video,
} from "lucide-react"

type Msg = { from: "me" | "them"; text: string; time?: string; reply?: string }

type Chat = {
  id: string
  name: string
  initials: string
  color: string
  time: string
  messages: Msg[]
}

const CHATS: Chat[] = [
  {
    id: "armando",
    name: "Armando Cajide",
    initials: "AC",
    color: "from-blue-400 to-blue-600",
    time: "9:00 AM",
    messages: [
      { from: "them", text: "Hey!" },
      { from: "them", text: "I got a new 🐶", reply: "1 Reply" },
      { from: "me", text: "Hey Armando!" },
      { from: "me", text: "It was great catching up with you the other day." },
      { from: "them", text: "I got a new 🐶", reply: "1 Reply" },
      {
        from: "me",
        text: "That's awesome! I can only imagine the fun you're having! 😄",
      },
    ],
  },
  {
    id: "lauren",
    name: "Lauren Ulrick",
    initials: "LU",
    color: "from-purple-400 to-purple-600",
    time: "8:25 AM",
    messages: [
      { from: "them", text: "Thanks so much! I should be there by 9:00." },
    ],
  },
  {
    id: "justin",
    name: "Justin Shumaker",
    initials: "JS",
    color: "from-sky-400 to-cyan-600",
    time: "Yesterday",
    messages: [
      {
        from: "them",
        text: "I'd love to hear more about your project. Call me back when you have a chance!",
      },
    ],
  },
  {
    id: "john",
    name: "John Appleseed",
    initials: "JA",
    color: "from-amber-400 to-orange-600",
    time: "Yesterday",
    messages: [{ from: "them", text: "See you at the park!" }],
  },
]

const APP_DRAWER = ["Photos", "Memoji Stickers", "#images", "Message Effects"]

function Bubble({ msg }: { msg: Msg }) {
  const mine = msg.from === "me"
  return (
    <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[75%] px-3.5 py-2 text-[14px] leading-snug ${
          mine
            ? "rounded-2xl rounded-br-md bg-[#0a84ff] text-white"
            : "rounded-2xl rounded-bl-md bg-black/[0.07] text-black/85 dark:bg-white/15 dark:text-white/90"
        }`}
      >
        {msg.text}
      </div>
      {msg.reply && (
        <span className="mt-0.5 text-[11px] text-[#0a84ff] dark:text-[#4c9bff]">
          {msg.reply}
        </span>
      )}
    </div>
  )
}

function Messages() {
  const [chats, setChats] = useState<Chat[]>(CHATS)
  const [activeId, setActiveId] = useState("armando")
  const [query, setQuery] = useState("")
  const [draft, setDraft] = useState("")
  const [drawer, setDrawer] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const active = chats.find((c) => c.id === activeId) ?? chats[0]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [active.messages.length, activeId])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, { from: "me", text }] }
          : c
      )
    )
    setDraft("")
  }

  const visible = chats.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] overflow-hidden rounded-b-2xl py-3">
      <div className="flex w-60 shrink-0 flex-col border-r border-black/10 dark:border-white/10">
        <div className="shrink-0 p-2.5 pb-1.5">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-black/35 dark:text-white/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search conversations"
              className="h-8 w-full rounded-lg bg-black/[0.06] pr-2 pl-8 text-[13px] outline-none placeholder:text-black/35 dark:bg-white/10 dark:placeholder:text-white/35"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {visible.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left ${
                c.id === activeId
                  ? "bg-black/[0.07] dark:bg-white/10"
                  : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              }`}
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b text-[13px] font-semibold text-white ${c.color}`}
              >
                {c.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[13px] font-semibold">
                    {c.name}
                  </span>
                  <span className="shrink-0 text-[11px] text-black/40 dark:text-white/40">
                    {c.time}
                  </span>
                </span>
                <span className="block truncate text-[12px] text-black/50 dark:text-white/50">
                  {c.messages[c.messages.length - 1]?.text ?? ""}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-black/10 px-4 py-2 dark:border-white/10">
          <ChevronLeft className="size-4 text-black/30 sm:hidden dark:text-white/30" />
          <span className="min-w-0 flex-1 truncate text-center text-[13px]">
            <span className="text-black/45 dark:text-white/45">To: </span>
            <span className="font-semibold">{active.name}</span>
          </span>
          <Video className="size-4 shrink-0 text-[#0a84ff]" />
        </div>

        <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-4 py-3">
          <p className="pb-1 text-center text-[11px] text-black/35 dark:text-white/35">
            Today 9:00 AM
          </p>
          {active.messages.map((m, i) => (
            <Bubble key={i} msg={m} />
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="relative shrink-0 px-3 pb-3">
          {drawer && (
            <div className="tahoe-glass-dark absolute bottom-12 left-3 w-52 rounded-2xl p-1.5 text-white">
              {APP_DRAWER.map((label) => (
                <button
                  key={label}
                  onClick={() => setDrawer(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] hover:bg-white/10"
                >
                  <span className="size-2 rounded-full bg-current opacity-70" />
                  {label}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1.5 rounded-full border border-black/15 px-1.5 py-1 dark:border-white/15">
            <button
              onClick={() => setDrawer((v) => !v)}
              aria-label="Apps"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black/[0.07] text-black/60 hover:bg-black/[0.12] dark:bg-white/10 dark:text-white/70"
            >
              <Plus className="size-4" />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send()
                e.stopPropagation()
              }}
              placeholder="iMessage"
              aria-label="Message"
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-black/30 dark:placeholder:text-white/30"
            />
            <AudioLines className="size-4 shrink-0 text-black/40 dark:text-white/40" />
            <Smile className="size-4 shrink-0 text-black/40 dark:text-white/40" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Messages)
