"use client"

import { memo, useState } from "react"
import { Folder, PenLine, Search, Trash2 } from "lucide-react"

type Note = { id: string; title: string; snippet: string; date: string; group: string; body: string; folder: string }

const NOTES: Note[] = [
  {
    id: "n1", title: "Docker Process", snippet: "Find the App Github page", date: "1:22 AM", group: "Today",
    folder: "Notes",
    body: "Find the App Github page\nDocker Compose file or direct CLI command\nDefine database or other values\n-up docker compose\nThis is the Docker app",
  },
  {
    id: "n2", title: "Tahoe ideas", snippet: "lockscreen clock frost effect", date: "Yesterday", group: "Yesterday",
    folder: "Notes",
    body: "lockscreen clock frost effect\nanimated lake wallpaper\nspotlight reader mode",
  },
  {
    id: "n3", title: "Groceries", snippet: "oat milk, sourdough, berries", date: "Yesterday", group: "Yesterday",
    folder: "Notes",
    body: "oat milk\nsourdough\nberries\ncoffee beans",
  },
  {
    id: "n4", title: "Dev", snippet: "Postgres - pass = Parth", date: "14/04/25", group: "April",
    folder: "Notes",
    body: "Postgres - pass = Parth\nremember to rotate before demo",
  },
  {
    id: "n5", title: "Call with Erica", snippet: "friday dinner plans", date: "08/04/25", group: "April",
    folder: "Notes",
    body: "friday dinner plans\nbook the italian place",
  },
]

const FOLDERS = ["All iCloud", "Notes", "Tahoe", "Ideas", "Receipts"]

function Notes() {
  const [notes, setNotes] = useState(NOTES)
  const [folder, setFolder] = useState("All iCloud")
  const [selectedId, setSelectedId] = useState("n1")
  const [query, setQuery] = useState("")
  const selected = notes.find((n) => n.id === selectedId) ?? notes[0]

  const groups = ["Today", "Yesterday", "April"].map((g) => ({
    label: g,
    items: notes.filter(
      (n) =>
        n.group === g &&
        (n.title.toLowerCase().includes(query.toLowerCase()) || n.body.toLowerCase().includes(query.toLowerCase()))
    ),
  })).filter((g) => g.items.length > 0)

  const updateBody = (body: string) =>
    setNotes((prev) => prev.map((n) => (n.id === selectedId ? { ...n, body, title: body.split("\n")[0] || "New Note", snippet: body.split("\n")[1] ?? "" } : n)))

  const addNote = () => {
    const note: Note = { id: `n${Date.now()}`, title: "New Note", snippet: "", date: "Today", group: "Today", folder: "Notes", body: "" }
    setNotes((prev) => [note, ...prev])
    setSelectedId(note.id)
  }

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] overflow-hidden translate-y-4 rounded-b-2xl text-[13px]">
      <div className="flex w-44 shrink-0 flex-col overflow-y-auto bg-black/[0.04] px-2.5 py-3 dark:bg-white/[0.04]">
        <p className="px-1.5 pb-1 text-[11px] font-semibold text-black/40 dark:text-white/40">iCloud</p>
        {FOLDERS.map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={`flex items-center gap-2 rounded-md px-1.5 py-[4px] text-left ${
              folder === f ? "bg-[#e8c33c]/30 font-medium" : "hover:bg-black/[0.05] dark:hover:bg-white/[0.07]"
            }`}
          >
            <Folder className="size-4 shrink-0 text-[#e8c33c]" />
            <span className="truncate">{f}</span>
          </button>
        ))}
      </div>

      <div className="flex w-64 shrink-0 flex-col border-x border-black/10 dark:border-white/10">
        <div className="flex shrink-0 items-center gap-1.5 border-b border-black/10 p-2 dark:border-white/10">
          <p className="flex-1 px-1 text-[13px] font-bold">{folder}</p>
          <button onClick={addNote} aria-label="New note" className="rounded-md p-1.5 hover:bg-black/[0.06] dark:hover:bg-white/10">
            <PenLine className="size-4" />
          </button>
          <button aria-label="Delete note" className="rounded-md p-1.5 hover:bg-black/[0.06] dark:hover:bg-white/10">
            <Trash2 className="size-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="px-3 pt-2 pb-0.5 text-[11px] font-semibold text-black/40 dark:text-white/40">{g.label}</p>
              {g.items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedId(n.id)}
                  className={`mx-1.5 mb-1 block w-[calc(100%-12px)] rounded-lg px-2.5 py-2 text-left ${
                    selectedId === n.id ? "bg-[#f5d90a]/60 dark:bg-[#f5d90a]/25" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="block truncate text-[13px] font-bold">{n.title}</span>
                  <span className="block truncate text-[12px] opacity-60">
                    {n.date} <span className="ml-1">{n.snippet}</span>
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-2 px-3 py-2">
          <span className="flex-1" />
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 opacity-40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search notes"
              className="h-7 w-36 rounded-md bg-black/[0.06] pr-2 pl-7 text-[12px] outline-none dark:bg-white/10"
            />
          </span>
        </div>
        {selected && (
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2">
            <p className="text-center text-[12px] opacity-40">{selected.date}</p>
            <textarea
              value={selected.body}
              onChange={(e) => updateBody(e.target.value)}
              aria-label="Note body"
              className="mt-1 h-full min-h-64 w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(Notes)
