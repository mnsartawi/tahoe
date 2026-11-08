"use client"

import React, { useCallback, useRef, useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Plus,
  RotateCw,
  Search,
  Share2,
  X,
} from "lucide-react"
import Loader from "@/components/ui/spinner"

type TabStatus = "start" | "loading" | "ready" | "error" | "direct"

type Tab = {
  id: number
  url: string
  input: string
  title: string
  status: TabStatus
  view: "direct" | "reader"
  markdown: string
  error: string | null
}

const FAVORITES = [
  { label: "Apple", url: "https://www.apple.com/newsroom/" },
  { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/MacOS_Tahoe" },
  { label: "GitHub", url: "https://github.com/trending" },
  { label: "MDN", url: "https://developer.mozilla.org/en-US/" },
  { label: "Hacker News", url: "https://news.ycombinator.com/" },
  { label: "Vercel", url: "https://vercel.com/blog" },
]

let tabSeq = 1

function FavIcon({ url, label }: { url: string; label: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className="flex size-10 items-center justify-center rounded-xl bg-[#0a84ff]/15 text-[16px] font-bold text-[#0a84ff]">
        {label.charAt(0)}
      </span>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${hostOf(url)}&sz=64`}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
      className="size-10 rounded-xl bg-white object-contain p-1.5 shadow-sm dark:bg-white/10"
    />
  )
}
const blankTab = (): Tab => ({
  id: tabSeq++,
  url: "",
  input: "",
  title: "Start Page",
  status: "start",
  view: "direct",
  markdown: "",
  error: null,
})

function normalizeInput(raw: string): string {
  const text = raw.trim()
  if (!text) return ""
  if (/^https?:\/\//i.test(text)) return text
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(text)) return `https://${text}`
  return `https://html.duckduckgo.com/html/?q=${encodeURIComponent(text)}`
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

function inlineMd(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    let m = part.match(/^\*\*(.+)\*\*$/)
    if (m) return <strong key={key}>{m[1]}</strong>
    m = part.match(/^\*([^*]+)\*$/)
    if (m) return <em key={key}>{m[1]}</em>
    m = part.match(/^`([^`]+)`$/)
    if (m)
      return (
        <code key={key} className="rounded bg-black/10 px-1 font-mono text-[0.9em] dark:bg-white/15">
          {m[1]}
        </code>
      )
    m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (m)
      return (
        <a
          key={key}
          href={m[2]}
          onClick={(e) => {
            e.preventDefault()
            const ev = new CustomEvent<string>("safari:navigate", { detail: m![2] })
            window.dispatchEvent(ev)
          }}
          className="text-[#0a84ff] underline decoration-[#0a84ff]/40 underline-offset-2 hover:decoration-[#0a84ff]"
        >
          {m[1]}
        </a>
      )
    return <React.Fragment key={key}>{part}</React.Fragment>
  })
}

function Article({ markdown }: { markdown: string }) {
  const blocks = markdown.split(/\n{2,}/)
  const out: React.ReactNode[] = []
  let list: string[] | null = null

  const flushList = (key: string) => {
    if (list) {
      out.push(
        <ul key={key} className="my-2 list-disc space-y-1 pl-6">
          {list.map((item, i) => (
            <li key={i}>{inlineMd(item, `${key}-${i}`)}</li>
          ))}
        </ul>
      )
      list = null
    }
  }

  blocks.forEach((block, bi) => {
    const line = block.trim()
    if (!line) return
    if (/^```/.test(line)) {
      flushList(`list-pre-${bi}`)
      out.push(
        <pre
          key={`code-${bi}`}
          className="my-3 overflow-x-auto rounded-lg bg-black/[0.06] p-3 font-mono text-[12.5px] dark:bg-white/10"
        >
          {line.replace(/^```\w*\n?|\n?```$/g, "")}
        </pre>
      )
      return
    }
    const h = line.match(/^(#{1,3})\s+(.*)$/)
    if (h) {
      flushList(`list-h-${bi}`)
      const level = h[1].length
      const cls =
        level === 1
          ? "mb-1 text-[24px] font-bold tracking-tight"
          : level === 2
            ? "mt-5 mb-1 text-[19px] font-bold tracking-tight"
            : "mt-4 mb-1 text-[16px] font-semibold"
      out.push(
        <div key={`h-${bi}`} className={cls}>
          {inlineMd(h[2], `hh-${bi}`)}
        </div>
      )
      return
    }
    const li = line.match(/^[-*]\s+([\s\S]*)$/)
    if (li) {
      if (!list) list = []
      list.push(li[1].replace(/\n/g, " "))
      return
    }
    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (img) {
      flushList(`list-img-${bi}`)
      out.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`img-${bi}`}
          src={img[2]}
          alt={img[1]}
          loading="lazy"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          className="my-3 max-h-72 rounded-lg object-contain"
        />
      )
      return
    }
    if (/^>\s?/.test(line)) {
      flushList(`list-q-${bi}`)
      out.push(
        <blockquote
          key={`q-${bi}`}
          className="my-2 border-l-2 border-[#0a84ff]/50 pl-3 text-black/70 italic dark:text-white/70"
        >
          {inlineMd(line.replace(/^>\s?/gm, ""), `qq-${bi}`)}
        </blockquote>
      )
      return
    }
    flushList(`list-p-${bi}`)
    out.push(
      <p key={`p-${bi}`} className="my-2 leading-relaxed">
        {inlineMd(line.replace(/\n/g, " "), `pp-${bi}`)}
      </p>
    )
  })
  flushList("list-tail")

  return <div className="mx-auto max-w-[640px] px-6 py-6 text-[14.5px]">{out}</div>
}

export const SafariBrowser: React.FC<{ suspended?: boolean }> = ({ suspended }) => {
  const [tabs, setTabs] = useState<Tab[]>([blankTab()])
  const [activeId, setActiveId] = useState(1)
  const [backStack, setBackStack] = useState<string[]>([])
  const [fwdStack, setFwdStack] = useState<string[]>([])
  const abortRef = useRef<AbortController | null>(null)

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0]

  const patchTab = useCallback((id: number, patch: Partial<Tab>) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }, [])

  const loadUrl = useCallback(
    async (id: number, raw: string, pushHistory = true) => {
      const url = normalizeInput(raw)
      if (!url) return
      abortRef.current?.abort()
      const prev = tabs.find((t) => t.id === id)
      if (pushHistory && prev && prev.url && prev.url !== url) {
        setBackStack((s) => [...s, prev.url])
        setFwdStack([])
      }
      const view = prev?.view ?? "direct"
      if (view === "direct") {
        patchTab(id, {
          url,
          input: url,
          status: "direct",
          title: hostOf(url),
          error: null,
          markdown: "",
        })
        return
      }
      const controller = new AbortController()
      abortRef.current = controller
      patchTab(id, { url, input: url, status: "loading", error: null, markdown: "" })
      try {
        const res = await fetch(`https://r.jina.ai/${url}`, { signal: controller.signal })
        if (!res.ok) throw new Error(`Reader returned ${res.status}`)
        const text = await res.text()
        const firstHeading = text.match(/^#\s+(.+)$/m)?.[1]?.slice(0, 60) ?? hostOf(url)
        patchTab(id, { status: "ready", markdown: text, title: firstHeading })
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        patchTab(id, {
          status: "error",
          error: "Couldn't load a readable version of this page. The site may block readers or be offline.",
        })
      }
    },
    [patchTab, tabs]
  )

  const setView = (id: number, view: "direct" | "reader") => {
    const tab = tabs.find((t) => t.id === id)
    if (!tab) return
    patchTab(id, { view })
    if (view === "reader" && tab.url && !tab.markdown) loadUrl(id, tab.url, false)
    else if (view === "direct" && tab.url)
      patchTab(id, { status: "direct", title: hostOf(tab.url) })
  }

  useEffectNavigate(loadUrl, activeId)

  const goBack = () => {
    if (backStack.length === 0) return
    const prev = backStack[backStack.length - 1]
    if (active.url) setFwdStack((s) => [active.url, ...s])
    setBackStack((s) => s.slice(0, -1))
    loadUrl(active.id, prev, false)
  }

  const goForward = () => {
    if (fwdStack.length === 0) return
    const [next, ...rest] = fwdStack
    if (active.url) setBackStack((s) => [...s, active.url])
    setFwdStack(rest)
    loadUrl(active.id, next, false)
  }

  const closeTab = (id: number) => {
    setTabs((prev) => {
      if (prev.length === 1) {
        setActiveId(prev[0].id)
        patchTab(id, { url: "", input: "", title: "Start Page", status: "start", view: "direct", markdown: "", error: null })
        return prev
      }
      const next = prev.filter((t) => t.id !== id)
      if (id === activeId) setActiveId(next[next.length - 1].id)
      return next
    })
  }

  const share = async () => {
    if (!active.url) return
    try {
      if (navigator.share) await navigator.share({ title: active.title, url: active.url })
      else {
        await navigator.clipboard.writeText(active.url)
        alert("URL copied to clipboard!")
      }
    } catch {}
  }

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] flex-col overflow-hidden">
      <div className="flex shrink-0 items-end gap-1 px-3 pt-2">
        <div className="flex min-w-0 flex-1 translate-y-1 items-end gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`flex h-8 max-w-44 min-w-0 flex-1 items-center gap-1.5 rounded-t-lg px-2.5 text-left text-[12px] ${
                t.id === activeId
                  ? "bg-black/[0.06] font-medium dark:bg-white/10"
                  : "text-black/55 hover:bg-black/[0.04] dark:text-white/55 dark:hover:bg-white/[0.06]"
              }`}
            >
              <span className="flex size-4 shrink-0 items-center justify-center rounded bg-[#0a84ff]/15 text-[10px] font-bold text-[#0a84ff]">
                {(t.title || "?").charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate">{t.title}</span>
              <span
                role="button"
                aria-label="Close tab"
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(t.id)
                }}
                className="rounded p-0.5 hover:bg-black/10 dark:hover:bg-white/15"
              >
                <X className="size-3" />
              </span>
            </button>
          ))}
        </div>
        <button
          aria-label="New tab"
          onClick={() => {
            const t = blankTab()
            setTabs((prev) => [...prev, t])
            setActiveId(t.id)
          }}
          className="mb-1 rounded p-1.5 hover:bg-black/10 dark:hover:bg-white/15"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 px-3 py-1.5">
        <button
          onClick={goBack}
          disabled={backStack.length === 0}
          aria-label="Back"
          className="rounded-md p-1.5 hover:bg-black/10 disabled:opacity-30 dark:hover:bg-white/15"
        >
          <ArrowLeft className="size-4" />
        </button>
        <button
          onClick={goForward}
          disabled={fwdStack.length === 0}
          aria-label="Forward"
          className="rounded-md p-1.5 hover:bg-black/10 disabled:opacity-30 dark:hover:bg-white/15"
        >
          <ArrowRight className="size-4" />
        </button>
        <button
          onClick={() => active.url && loadUrl(active.id, active.url, false)}
          aria-label="Reload"
          className="rounded-md p-1.5 hover:bg-black/10 dark:hover:bg-white/15"
        >
          <RotateCw className="size-4" />
        </button>
        <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full bg-black/[0.06] px-3.5 dark:bg-white/10">
          <Search className="size-3.5 shrink-0 opacity-50" />
          <input
            value={active.input}
            onChange={(e) => patchTab(active.id, { input: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") loadUrl(active.id, active.input)
              e.stopPropagation()
            }}
            placeholder="Search or enter website name"
            spellCheck={false}
            autoComplete="off"
            aria-label="Address"
            className="min-w-0 flex-1 bg-transparent text-center text-[13px] outline-none placeholder:text-black/35 focus:text-left dark:placeholder:text-white/35"
          />
        </div>
        <button
          onClick={share}
          aria-label="Share"
          className="rounded-md p-1.5 hover:bg-black/10 dark:hover:bg-white/15"
        >
          <Share2 className="size-4" />
        </button>
        <div className="flex shrink-0 items-center rounded-full bg-black/[0.06] p-0.5 dark:bg-white/10">
          <button
            onClick={() => setView(active.id, "direct")}
            aria-label="Direct view"
            title="Direct"
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
              active.view === "direct" ? "bg-white shadow dark:bg-white/20" : "opacity-55 hover:opacity-90"
            }`}
          >
            Direct
          </button>
          <button
            onClick={() => setView(active.id, "reader")}
            aria-label="Reader view"
            title="Reader"
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              active.view === "reader" ? "bg-white shadow dark:bg-white/20" : "opacity-55 hover:opacity-90"
            }`}
          >
            <BookOpen className="size-3" />
            Reader
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {active.status === "direct" && active.url && suspended ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="max-w-64 truncate text-[14px] font-medium">{active.title}</p>
            <p className="text-[12px] opacity-50">Paused while in the background — click to resume</p>
          </div>
        ) : null}
        {active.status === "direct" && active.url && !suspended && (
          <div className="flex h-full flex-col">
            <iframe
              key={active.url}
              src={active.url}
              title={active.title}
              className="min-h-0 flex-1 border-0"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
            <button
              onClick={() => setView(active.id, "reader")}
              className="flex shrink-0 items-center justify-center gap-1.5 bg-black/[0.05] px-3 py-1 text-[11px] opacity-70 hover:opacity-100 dark:bg-white/[0.07]"
            >
              <BookOpen className="size-3" />
              Blank page? This site blocks embedding — open Reader View
            </button>
          </div>
        )}
        {active.status === "start" && (
          <div className="mx-auto max-w-[560px] px-6 py-10">
            <p className="text-[22px] font-bold tracking-tight">Favorites</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {FAVORITES.map((f) => (
                <button
                  key={f.url}
                  onClick={() => loadUrl(active.id, f.url)}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition-transform hover:scale-[1.02] dark:border-white/10 dark:bg-white/10"
                >
                  <FavIcon url={f.url} label={f.label} />
                  <span className="text-[12px] font-medium">{f.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-6 flex items-start gap-2 text-[12px] leading-relaxed opacity-60">
              <BookOpen className="mt-0.5 size-4 shrink-0" />
              Pages open in Reader View — clean article text that works even on sites that block embeds.
            </p>
          </div>
        )}
        {active.status === "loading" && (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <Loader size="sm" color="black" />
            <p className="max-w-64 truncate text-[12px] opacity-60">{hostOf(active.url)}…</p>
          </div>
        )}
        {active.status === "error" && (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <AlertCircle className="mb-3 size-10 text-red-500" />
            <p className="text-[15px] font-semibold">Couldn&apos;t open this page</p>
            <p className="mt-1 max-w-sm text-[13px] opacity-60">{active.error}</p>
          </div>
        )}
        {active.status === "ready" && <Article markdown={active.markdown} />}
      </div>
    </div>
  )
}

function useEffectNavigate(loadUrl: (id: number, raw: string) => void, activeId: number) {
  React.useEffect(() => {
    const onNav = (e: Event) => {
      const url = (e as CustomEvent<string>).detail
      if (/^https?:\/\//i.test(url)) loadUrl(activeId, url)
      else if (url.startsWith("/")) loadUrl(activeId, url)
      else window.open(url, "_blank", "noopener")
    }
    window.addEventListener("safari:navigate", onNav)
    return () => window.removeEventListener("safari:navigate", onNav)
  }, [loadUrl, activeId])
}
