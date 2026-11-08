"use client"

import { memo, useState } from "react"
import {
  Archive,
  ChevronDown,
  Flag,
  Inbox,
  MailOpen,
  Pencil,
  Reply,
  ReplyAll,
  Search,
  Send,
  Star,
  Trash2,
} from "lucide-react"

type Email = {
  id: string
  from: string
  initials: string
  color: string
  subject: string
  snippet: string
  body: string[]
  date: string
  mailbox: string
  unread?: boolean
  flagged?: boolean
}

const MAILBOXES = [
  { label: "All Inboxes", count: "7,355", icon: Inbox },
  { label: "VIPs", count: "1", icon: Star },
  { label: "Flagged", count: "21", icon: Flag },
  { label: "All Drafts", count: "5", icon: Pencil },
  { label: "All Sent", count: "", icon: Send },
]

const EMAILS: Email[] = [
  {
    id: "m1",
    from: "Erica Souza",
    initials: "ES",
    color: "from-pink-400 to-rose-600",
    subject: "Dinner this Friday?",
    snippet: "Found that Italian place you mentioned — 7pm work for you?",
    body: [
      "Hi!",
      "Found that Italian place you mentioned near downtown. They have a table free this Friday at 7pm — does that work for you?",
      "Let me know, I can book it tonight.",
      "— Erica",
    ],
    date: "Today at 9:12 AM",
    mailbox: "Inbox - Gmail",
    unread: true,
  },
  {
    id: "m2",
    from: "Design Team",
    initials: "DT",
    color: "from-blue-400 to-indigo-600",
    subject: "New Tahoe mockups are ready for review",
    snippet: "Figma link inside — feedback by Thursday please.",
    body: [
      "Hello,",
      "The new Tahoe mockups are ready for review. Figma link is pinned in the channel — please leave feedback by Thursday so we can lock the layout.",
      "Thanks!",
    ],
    date: "Yesterday at 4:47 PM",
    mailbox: "Inbox - Work",
    unread: true,
    flagged: true,
  },
  {
    id: "m3",
    from: "Apple",
    initials: "A",
    color: "from-neutral-400 to-neutral-600",
    subject: "Your receipt from Apple",
    snippet: "Thanks for your purchase — order details inside.",
    body: [
      "Dear customer,",
      "Thank you for your purchase. Your receipt and order details are attached to this email.",
      "Apple Store",
    ],
    date: "Monday at 10:03 AM",
    mailbox: "Inbox - iCloud",
  },
  {
    id: "m4",
    from: "Mom",
    initials: "M",
    color: "from-green-400 to-emerald-600",
    subject: "Photos from the lake!",
    snippet: "Look how clear the water was!!",
    body: [
      "Hi honey,",
      "Look how clear the water was!! Attaching a few favorites from the weekend.",
      "Love, Mom",
    ],
    date: "Sunday at 6:22 PM",
    mailbox: "Inbox - Gmail",
  },
  {
    id: "m5",
    from: "GitHub",
    initials: "GH",
    color: "from-violet-400 to-purple-600",
    subject: "[tahoe] PR #42 merged",
    snippet: "Your pull request was merged into main.",
    body: [
      "Your pull request #42 (animated wallpaper) was merged into main.",
      "Nice work!",
    ],
    date: "Oct 10 at 2:15 PM",
    mailbox: "Inbox - Work",
  },
  {
    id: "m6",
    from: "Airline Rewards",
    initials: "AR",
    color: "from-sky-400 to-cyan-600",
    subject: "Your trip is coming up ✈️",
    snippet: "Check in opens 24h before departure.",
    body: [
      "Your trip is coming up!",
      "Check in opens 24 hours before departure. Have your boarding pass ready.",
    ],
    date: "Oct 9 at 8:00 AM",
    mailbox: "Inbox - Gmail",
  },
]

function Mail() {
  const [mailbox, setMailbox] = useState("All Inboxes")
  const [selectedId, setSelectedId] = useState("m1")
  const [read, setRead] = useState<Record<string, boolean>>({})
  const [query, setQuery] = useState("")

  const emails = EMAILS.filter(
    (e) =>
      e.subject.toLowerCase().includes(query.toLowerCase()) ||
      e.from.toLowerCase().includes(query.toLowerCase())
  )
  const selected = emails.find((e) => e.id === selectedId) ?? emails[0]
  const isUnread = (e: Email) => (e.unread && !read[e.id]) ?? false

  const open = (id: string) => {
    setSelectedId(id)
    setRead((r) => ({ ...r, [id]: true }))
  }

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] translate-y-4 overflow-hidden rounded-b-2xl text-[13px]">
      <div className="flex w-44 shrink-0 flex-col overflow-y-auto bg-black/[0.04] px-2.5 py-3 dark:bg-white/[0.04]">
        <p className="px-1.5 pb-1 text-[11px] font-semibold text-black/40 dark:text-white/40">
          Mailboxes
        </p>
        {MAILBOXES.map(({ label, count, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setMailbox(label)}
            className={`flex items-center gap-2 rounded-md px-1.5 py-[4px] text-left ${
              mailbox === label
                ? "bg-black/10 dark:bg-white/15"
                : "hover:bg-black/[0.05] dark:hover:bg-white/[0.07]"
            }`}
          >
            <Icon className="size-4 shrink-0 text-[#0a84ff]" />
            <span className="min-w-0 flex-1 truncate">{label}</span>
            {!!count && (
              <span className="text-[11px] text-black/40 dark:text-white/40">
                {count}
              </span>
            )}
          </button>
        ))}
        <p className="px-1.5 pt-3 pb-1 text-[11px] font-semibold text-black/40 dark:text-white/40">
          Smart Mailboxes
        </p>
        {["Today", "Unread"].map((label) => (
          <button
            key={label}
            className="flex items-center gap-2 rounded-md px-1.5 py-[4px] text-left hover:bg-black/[0.05] dark:hover:bg-white/[0.07]"
          >
            <MailOpen className="size-4 shrink-0 text-[#0a84ff]" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>

      <div className="flex w-64 shrink-0 flex-col border-x border-black/10 dark:border-white/10">
        <div className="shrink-0 border-b border-black/10 p-2 dark:border-white/10">
          <p className="px-1 pb-1 text-[13px] font-bold">{mailbox}</p>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-black/35 dark:text-white/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search mail"
              className="h-7 w-full rounded-md bg-black/[0.06] pr-2 pl-7 text-[12px] outline-none placeholder:text-black/35 dark:bg-white/10 dark:placeholder:text-white/35"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {emails.map((e) => (
            <button
              key={e.id}
              onClick={() => open(e.id)}
              className={`flex w-full gap-2 border-b border-black/[0.06] px-2.5 py-2 text-left dark:border-white/[0.06] ${
                selected?.id === e.id
                  ? "bg-[#0a84ff]/15"
                  : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              }`}
            >
              <span
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b text-[10px] font-bold text-white ${e.color}`}
              >
                {e.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span
                    className={`truncate ${isUnread(e) ? "font-bold" : "font-medium"}`}
                  >
                    {e.from}
                  </span>
                  {isUnread(e) && (
                    <span className="size-2 shrink-0 rounded-full bg-[#0a84ff]" />
                  )}
                </span>
                <span
                  className={`block truncate text-[12px] ${isUnread(e) ? "font-semibold text-black/80 dark:text-white/85" : "text-black/60 dark:text-white/60"}`}
                >
                  {e.subject}
                </span>
                <span className="block truncate text-[12px] text-black/45 dark:text-white/45">
                  {e.snippet}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-0.5 border-b border-black/10 px-2 py-1.5 text-black/60 dark:border-white/10 dark:text-white/60">
          {[Reply, ReplyAll, Archive, Trash2, Flag].map((Icon, i) => (
            <button
              key={i}
              className="rounded-md p-1.5 hover:bg-black/[0.06] dark:hover:bg-white/10"
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
        {selected ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <div className="flex items-start gap-3">
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b text-[12px] font-bold text-white ${selected.color}`}
              >
                {selected.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold">{selected.subject}</p>
                <p className="mt-0.5 text-[12px] text-black/50 dark:text-white/50">
                  {selected.mailbox} · {selected.date}
                </p>
                <p className="mt-1 text-[13px]">
                  From: <span className="font-medium">{selected.from}</span>
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-[14px] leading-relaxed">
              {selected.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        ) : (
          <p className="p-6 text-center text-black/40 dark:text-white/40">
            No message selected
          </p>
        )}
      </div>
    </div>
  )
}

export default memo(Mail)
