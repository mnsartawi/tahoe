"use client"

import { memo, useState } from "react"

export type RecoveryOption = "timemachine" | "reinstall" | "safari" | "diskutil"

const OPTIONS: {
  id: RecoveryOption
  title: string
  desc: string
  icon: React.ReactNode
}[] = [
  {
    id: "timemachine",
    title: "Restore from Time Machine",
    desc: "If you have backup of your system that you want to restore.",
    icon: (
      <img
        src="/timemachine.png"
        alt="timemachine"
        draggable={false}
        className="translate-x-1 translate-y-2"
      />
    ),
  },
  {
    id: "reinstall",
    title: "Reinstall macOS Tahoe",
    desc: "Install a new copy of macOS Tahoe onto your Mac.",
    // eslint-disable-next-line @next/next/no-img-element
    icon: (
      <img
        src="/tahoe.png"
        alt="tahoe"
        className="size-16 -translate-x-0.5 object-cover"
        draggable={false}
      />
    ),
  },
  {
    id: "safari",
    title: "Safari",
    desc: "Browse Apple Support to get help with your Mac.",
    icon: (
      <img
        src="/icons/Safari.png"
        alt="safari"
        className="size-14 -translate-x-0.5"
        draggable={false}
      />
    ),
  },
  {
    id: "diskutil",
    title: "Disk Utility",
    desc: "Repair or erase a disk using Disk Utility.",
    icon: (
      <img
        src="/diskutility.png"
        alt="disk utility"
        className="translate-x-0.5"
        draggable={false}
      />
    ),
  },
]

function Recovery({
  onContinue,
}: {
  onContinue: (opt: RecoveryOption) => void
}) {
  const [selected, setSelected] = useState<RecoveryOption>("reinstall")

  return (
    <div className="h-117 w-140 rounded-lg border border-white/15 bg-[#1e1e20]/95 p-3 shadow-[0_32px_90px_rgba(0,0,0,0.7)]">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          onClick={() => setSelected(o.id)}
          className={`flex w-full items-center gap-4 rounded px-3 py-2.5 text-left transition-colors ${
            selected === o.id ? "bg-white/15" : "hover:bg-white/[0.07]"
          }`}
        >
          <span className="flex size-20 shrink-0 items-center justify-center overflow-hidden">
            {o.icon}
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-white">
              {o.title}
            </span>
            <span className="block truncate text-[12px] text-white/55">
              {o.desc}
            </span>
          </span>
        </button>
      ))}
      <div className="flex justify-end px-1 pt-2 pb-1">
        <button
          onClick={() => onContinue(selected)}
          className="h-6 min-w-20 rounded-sm bg-white/25 px-4 text-[13px] font-medium text-white transition-colors hover:bg-white/15"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default memo(Recovery)
