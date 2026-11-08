"use client"

import { memo, useEffect, useRef, useState } from "react"

const DISK_BASE_SIZE = "w-40"


const DISKS = [
  {
    id: "hd",
    name: "Macintosh HD",
    size: "983.83 GB total",
    free: "770.07 GB available",
  },
  {
    id: "ext",
    name: "HDD",
    size: "989.14 GB total",
    free: "980.14 GB available",
  },
]

const LICENSE = `ENGLISH

APPLE INC.
SOFTWARE LICENSE AGREEMENT FOR macOS Tahoe 26

For use on Apple-branded Systems

PLEASE READ THIS SOFTWARE LICENSE AGREEMENT ("LICENSE") CAREFULLY BEFORE USING THE APPLE SOFTWARE. BY USING THE APPLE SOFTWARE, YOU ARE AGREEING TO BE BOUND BY THE TERMS OF THIS LICENSE.

A copy of the License will be saved on your system and can be found through About This Mac after installation. It is also posted at https://www.apple.com/legal/sla`

function Orb({ size = "size-90" }: { size?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/tahoe.png"
      alt=""
      draggable={false}
      className={`${size} mx-auto block rounded-full object-cover`}
    />
  )
}

function Reinstall({
  onBack,
  onInstall,
}: {
  onBack: () => void
  onInstall: (disk: string) => void
}) {
  const [phase, setPhase] = useState<
    "intro" | "license" | "disks" | "installing"
  >("intro")
  const [selected, setSelected] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  const stopInstall = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startInstall = () => {
    if (!selected) return
    setProgress(0)
    setPhase("installing")
    stopInstall()
    timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          stopInstall()
          window.setTimeout(() => onInstall(selected), 600)
          return 100
        }
        return p + 2
      })
    }, 120)
  }

  const shell =
    "w-230 h-180 border border-white/15 select-none bg-[#141416] px-10 py-10 text-center shadow-[0_32px_90px_rgba(0,0,0,0.7)]"

  if (phase === "intro") {
    return (
      <div className={shell}>
        <div className="my-20">
          <Orb />
        </div>
        <p className="font-weight-800 mt-5 -translate-y-20 text-[26px] font-extrabold text-white">
          macOS Tahoe
        </p>
        <p className="mx-auto mt-4 max-w-200 -translate-y-20 text-[16px] text-white/70">
          To set up the installation of macOS Tahoe, click Continue.
        </p>
        <div className="mt-8">
          <button
            onClick={() => setPhase("license")}
            className="h-8 min-w-18 rounded-full bg-[#0a84ff] -translate-y-8 px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#0077ed]"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  if (phase === "license") {
    return (
      <>
      <div className={shell}>
        <Orb size="size-60" />
        <p className="text-[30px] font-bold text-white">macOS Tahoe</p>
        <p className="mx-auto mt-3 max-w-180 text-[14px] text-white/90">
          To continue installing the software, you must agree to the terms of
          the software license agreement.
        </p>
        <div className="mx-auto mt-5 h-44 max-w-160 overflow-y-auto font-extrabold border border-white/10 bg-black/40 p-4 text-left text-[12px] leading-relaxed whitespace-pre-line text-white/80">
          {LICENSE}
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onBack}
            className="h-7 min-w-20 rounded-md bg-white/15 px-4 text-[13px] text-white transition-colors hover:bg-white/25"
          >
            Disagree
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="h-7 min-w-20 rounded-md bg-white/15 px-4 text-[13px] text-white transition-colors hover:bg-white/25"
          >
            Agree
          </button>
        </div>
      </div>
      {confirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div className="w-70 h-56 rounded-3xl border border-white/15 bg-[#1e1e20] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
            <span className="flex size-23 items-center justify-center overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/tahoedownload.png" alt="" draggable={false} className="h-full w-full -translate-x-2 object-cover" />
            </span>
            <p className="-my-1 mx-1 text-left text-[14px] max-w-50 leading-snug font-bold  text-white">
              I have read and agree to the terms of the software license agreement.
            </p>
            <div className="mt-4 flex gap-2.5">
              <button
                onClick={() => setConfirmOpen(false)}
                className="h-7 flex-1 rounded-full bg-white/20 text-[13px] text-white transition-colors hover:bg-white/30"
              >
                Disagree
              </button>
              <button
              onClick={() => {
                setConfirmOpen(false)
                setPhase("disks")
              }}
                className="h-7 flex-1 rounded-full bg-white/20 text-[13px] text-white transition-colors hover:bg-white/30"
              >
                Agree
              </button>
            </div>
          </div>
        </div>
      )}
      </>
    )
  }

  if (phase === "installing") {
    const disk = DISKS.find((d) => d.id === selected)
    return (
      <div className={shell}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tahoe.png"
          alt=""
          draggable={false}
          className="mx-auto -my-1 h-60 translate-y-10 object-contain"
        />
        <p className="mt-4 translate-y-5 text-[28px] font-extrabold text-white">macOS Tahoe</p>
        <p className="mt-6 translate-y-2 text-[16px] font-bold text-white">
          macOS Tahoe will be installed on the disk &ldquo;{disk?.name ?? ""}
          &rdquo;.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/machd.png"
          alt=""
          draggable={false}
          className="mx-auto mt-8 h-30 object-contain"
        />
        <p className="-translate-y-3 text-[13px] text-white/85">{disk?.name}</p>
        <div className="relative mx-auto mt-3 h-1.5 w-80 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-[#0a84ff] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-5 -translate-y-2 text-[13px] font-bold text-white/90">
          About {Math.max(1, Math.ceil(((100 - progress) / 100) * 29))} minutes
          remaining
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              stopInstall()
              setPhase("disks")
            }}
            className="h-7 min-w-20 rounded-2xl bg-white/15 px-4 text-[13px] text-white transition-colors hover:bg-white/25"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-230 h-180 border border-white/15 bg-[#141416] px-10 py-10 text-center shadow-[0_32px_90px_rgba(0,0,0,0.7)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/tahoe.png"
        alt=""
        draggable={false}
        className="mx-auto -my-3 h-60 translate-y-10 object-contain"
      />
      <p className="font-weight-700 mt-4 translate-y-5 text-[28px] font-extrabold text-white">
        macOS Tahoe
      </p>
      <p className="mt-6 translate-y-2 text-[16px] font-bold text-white">
        macOS Tahoe will be installed on the disk &ldquo;
        {DISKS.find((d) => d.id === selected)?.name ?? "Macintosh HD"}
        &rdquo;.
      </p>

      <div className="mt-6 flex justify-center gap-9">
        {DISKS.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelected(d.id)}
            className={`flex origin-center flex-col items-center gap-1.5 rounded-xl border-2 border-transparent p-3 transition-all duration-200 ${DISK_BASE_SIZE} ${
              selected === d.id ? "bg-white/15" : ""
            }`}
          >
            <span className="flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/machd.png"
                alt="drive"
                draggable={false}
                className="size-30 rounded-full object-cover"
              />
            </span>
            <span className="text-[12px] font-medium text-white">{d.name}</span>
            <span className="text-[10px] leading-tight text-white/45">
              {d.size}
              <br />
              {d.free}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={() => setPhase("license")}
          className="font-weight-700 h-7 w-20 rounded-xl bg-white/15 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-white/25"
        >
          Back
        </button>
        <button
          onClick={startInstall}
          disabled={!selected}
          className={`rounded-xl px-4 text-[13px] font-medium transition-colors ${
            selected
              ? "font-weight-700 h-7 w-22 rounded-xl bg-white/15 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-white/25"
              : "h-7 min-w-20 rounded-xl bg-white/10 text-[12px] text-white/35"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default memo(Reinstall)
