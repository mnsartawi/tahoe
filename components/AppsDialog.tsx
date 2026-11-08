"use client"

import { memo } from "react"
import { motion } from "framer-motion"

export type DialogApp = { id: string; name: string; icon: string }

const SECTIONS: { title: string; ids: string[] }[] = [
  { title: "Suggestions", ids: ["safari", "settings", "terminal", "messages", "mail"] },
  { title: "Utilities", ids: ["appstore", "settings", "terminal", "calendar", "contacts"] },
  { title: "Productivity & Finance", ids: ["notes", "reminders", "maps", "photos", "music"] },
]

function AppsDialog({
  apps,
  onOpen,
}: {
  apps: DialogApp[]
  onOpen: (id: string) => void
}) {
  const byId = (id: string) => apps.find((a) => a.id === id)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-[min(680px,94vw)] rounded-3xl border border-white/50 bg-white/65 p-6 text-black/85 shadow-[0_32px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-black dark:text-white dark:shadow-[0_32px_90px_rgba(0,0,0,0.6)]"
    >
      <p className="mb-4 px-1 text-[20px] font-bold tracking-tight">Applications</p>
      {SECTIONS.map((section) => (
        <div key={section.title} className="mb-3">
          <div className="mb-2 flex items-baseline justify-between px-1">
            <p className="text-[13px] font-semibold text-black/60 dark:text-white/60">{section.title}</p>
            <button className="text-[13px] text-[#0a84ff] dark:text-[#4c9bff]">Show More</button>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {section.ids.map((id) => {
              const app = byId(id)
              if (!app) return null
              return (
                <button
                  key={id}
                  onClick={() => onOpen(id)}
                  className="flex flex-col items-center gap-2 rounded-2xl p-2.5 transition-colors hover:bg-black/[0.05] dark:hover:bg-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={app.icon} alt="" draggable={false} className="size-14 rounded-[15px]" />
                  <span className="max-w-full truncate text-[12px]">{app.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

export default memo(AppsDialog)
