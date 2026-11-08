"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  CircleGauge,
  Eraser,
  Info,
  PieChart,
  Plus,
  RotateCcw,
  Copy,
  Eject,
  Minus,
} from "lucide-react"

type Drive = {
  id: string
  name: string
  kind: "drive" | "volume"
  children?: Drive[]
  used: string
  other: string
  free: string
  capacity: string
  mount: string
  type: string
  owners: string
  connection: string
  device: string
}

const TREE: Drive[] = [
  {
    id: "internal-hd",
    name: "Macintosh HD",
    kind: "drive",
    used: "120 GB",
    other: "8.1 GB",
    free: "871 GB",
    capacity: "999.96 GB",
    mount: "/",
    type: "APFS Volume",
    owners: "Enabled",
    connection: "Internal",
    device: "disk3s1",
    children: [
      {
        id: "internal-hd-data",
        name: "Macintosh HD",
        kind: "volume",
        used: "118 GB",
        other: "8.1 GB",
        free: "871 GB",
        capacity: "999.96 GB",
        mount: "/System/Volumes/Data",
        type: "APFS Volume",
        owners: "Enabled",
        connection: "Internal",
        device: "disk3s1s1",
      },
      {
        id: "internal-data",
        name: "Data",
        kind: "volume",
        used: "2 GB",
        other: "0 KB",
        free: "871 GB",
        capacity: "999.96 GB",
        mount: "/Volumes/Data",
        type: "APFS Volume",
        owners: "Enabled",
        connection: "Internal",
        device: "disk3s5",
      },
    ],
  },
  {
    id: "mydrive",
    name: "MYDRIVE",
    kind: "drive",
    used: "893 KB",
    other: "207.1 MB",
    free: "999.75 GB",
    capacity: "999.96 GB",
    mount: "/Volumes/MYDRIVE",
    type: "APFS Volume",
    owners: "Disabled",
    connection: "USB",
    device: "disk5s1",
  },
]

const TOOLS = [
  { label: "Volume", icon: Plus },
  { label: "First Aid", icon: CircleGauge },
  { label: "Partition", icon: PieChart },
  { label: "Erase", icon: Eraser },
  { label: "Restore", icon: RotateCcw },
  { label: "Unmount", icon: Eject },
  { label: "Info", icon: Info },
]

function DiskUtility({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState("mydrive")
  const [aid, setAid] = useState<string | null>(null)

  const find = (list: Drive[]): Drive | undefined => {
    for (const d of list) {
      if (d.id === selected) return d
      const hit = d.children ? find(d.children) : undefined
      if (hit) return hit
    }
  }
  const drive = find(TREE) ?? TREE[1]

  const runFirstAid = () => {
    setAid("Checking volumes…")
    window.setTimeout(() => setAid("First Aid found no problems. The volume appears to be OK."), 2200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 26, stiffness: 320 }}
      className="dark flex h-full flex-col overflow-hidden rounded-2xl bg-[#1e1e20] text-white/90 shadow-[0_32px_90px_rgba(0,0,0,0.6)]"
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-black/10 px-3 py-2 dark:border-white/10">
        <span className="flex items-center gap-2">
          <button onClick={onClose} aria-label="Close" className="size-3 rounded-full bg-[#ff5f57]" />
          <button aria-label="Minimize" className="size-3 rounded-full bg-[#ffbd2e]" />
          <button aria-label="Maximize" className="size-3 rounded-full bg-[#28c840]" />
        </span>
        <span className="min-w-0 flex-1 truncate text-center text-[13px] font-bold">Disk Utility</span>
        <span className="flex items-center gap-0.5">
          {TOOLS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              title={label}
              onClick={label === "First Aid" ? runFirstAid : undefined}
              className="flex flex-col items-center gap-0.5 rounded-lg px-1.5 py-1 text-[9px] opacity-80 hover:bg-black/[0.05] hover:opacity-100 dark:hover:bg-white/10"
            >
              <Icon className="size-4" strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="w-44 shrink-0 overflow-y-auto border-r border-black/10 p-2 text-[13px] dark:border-white/10">
          <p className="px-1.5 pb-1 text-[11px] font-semibold opacity-40">Internal</p>
          {TREE.filter((d) => d.connection === "Internal").map((d) => (
            <div key={d.id}>
              <button
                onClick={() => setSelected(d.id)}
                className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left ${selected === d.id ? "bg-black/10 dark:bg-white/15" : ""}`}
              >
                <Copy className="size-3.5 opacity-60" />
                <span className="truncate font-medium">{d.name}</span>
              </button>
              {d.children?.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={`ml-4 flex w-[calc(100%-16px)] items-center gap-1.5 rounded-md px-1.5 py-1 text-left ${selected === c.id ? "bg-black/10 dark:bg-white/15" : ""}`}
                >
                  <Minus className="size-3 opacity-50" />
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          ))}
          <p className="px-1.5 pt-3 pb-1 text-[11px] font-semibold opacity-40">External</p>
          {TREE.filter((d) => d.connection !== "Internal").map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d.id)}
              className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left ${selected === d.id ? "bg-[#0a84ff] font-medium text-white" : ""}`}
            >
              <Copy className="size-3.5 opacity-70" />
              <span className="truncate">{d.name}</span>
            </button>
          ))}
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-10 flex-col overflow-hidden rounded-[4px] border border-black/20">
              <span className="h-2/5 bg-[#e8a33d]" />
              <span className="flex-1 bg-gradient-to-b from-[#cfcfd2] to-[#a9a9ad]" />
            </span>
            <div>
              <p className="text-[19px] font-bold tracking-tight">{drive.name}</p>
              <p className="text-[12px] opacity-50">{drive.type} · APFS</p>
            </div>
            <span className="flex-1" />
            <div className="text-right">
              <p className="rounded-md border border-black/15 px-2.5 py-1 text-[13px] dark:border-white/20">{drive.capacity}</p>
              <p className="mt-0.5 text-[10px] opacity-40">ONE VOLUME</p>
            </div>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <div className="flex h-full">
              <span className="bg-[#0a84ff]" style={{ width: "2%" }} />
              <span className="bg-black/30 dark:bg-white/30" style={{ width: "8%" }} />
            </div>
          </div>
          <div className="mt-1.5 grid grid-cols-3 text-center text-[11px]">
            <span><i className="mr-1 inline-block size-2 rounded-[3px] bg-[#0a84ff] not-italic" />Used<span className="block opacity-60">{drive.used}</span></span>
            <span><i className="mr-1 inline-block size-2 rounded-[3px] bg-black/30 not-italic dark:bg-white/30" />Other Volumes<span className="block opacity-60">{drive.other}</span></span>
            <span><i className="mr-1 inline-block size-2 rounded-[3px] border border-black/25 not-italic dark:border-white/30" />Free<span className="block opacity-60">{drive.free}</span></span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-8 overflow-hidden rounded-lg border border-black/10 text-[12px] dark:border-white/10">
            {[
              ["Mount Point:", drive.mount],
              ["Type:", drive.type],
              ["Capacity:", drive.capacity],
              ["Owners:", drive.owners],
              ["Available:", drive.free],
              ["Connection:", drive.connection],
              ["Used:", drive.used],
              ["Device:", drive.device],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-2 border-b border-black/[0.06] px-3 py-1.5 dark:border-white/[0.06]">
                <dt className="opacity-50">{k}</dt>
                <dd className="truncate">{v}</dd>
              </div>
            ))}
          </dl>

          {aid && (
            <p className="mt-3 rounded-lg bg-black/[0.05] px-3 py-2 text-[12px] dark:bg-white/10">{aid}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default DiskUtility
