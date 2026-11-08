"use client"

import { memo, useState } from "react"
import { Power, RotateCcw } from "lucide-react"
import Image from "next/image"
export type StartupChoice = "Macintosh HD" | "Options"

function StartupManager({
  onContinue,
  onShutdown,
  onRestart,
}: {
  onContinue: (choice: StartupChoice) => void
  onShutdown: () => void
  onRestart: () => void
}) {
  const [selected, setSelected] = useState<StartupChoice>("Macintosh HD")

  const order: StartupChoice[] = ["Macintosh HD", "Options"]

  return (
    <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        {order.map((id) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className="flex w-55 flex-col items-center gap-2"
          >
            <span
              className={`flex size-50 h-50 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 transition-colors ${
                selected === id ? "border-white/30" : "border-transparent"
              }`}
            >
              {id === "Macintosh HD" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/machd.png"
                  alt=""
                  draggable={false}
                  className="size-40 object-cover"
                />
              ) : (
                <span className="flex size-32 items-center justify-center">
                  <Image
                    src="/options.png"
                    alt="recovery"
                    width={400}
                    height={400}
                    className="size-32 object-contain"
                    draggable={false}
                  />
                </span>
              )}
              <span className="text-center text-[13px] text-white">
                {id === "Macintosh HD" ? "Macintosh HD" : "Options"}
              </span>
            </span>
          </button>
        ))}
        {selected === "Options" && <span />}
        <span className="flex justify-center">
          <button
            onClick={() => onContinue(selected)}
            className="h-6.5 min-w-28 rounded-full bg-white/85 px-6 text-[14px] font-medium text-black transition-colors hover:bg-white/50"
          >
            Continue
          </button>
        </span>
      </div>

      <div className="absolute bottom-10 flex items-center gap-10">
        <button
          onClick={onShutdown}
          className="flex flex-col items-center gap-1.5 text-white"
        >
          <Power className="size-6" strokeWidth={1.8} />
          <span className="text-[12px]">Shut Down</span>
        </button>
        <button
          onClick={onRestart}
          className="flex flex-col items-center gap-1.5 text-white"
        >
          <RotateCcw className="size-6" strokeWidth={1.8} />
          <span className="text-[12px]">Restart</span>
        </button>
      </div>
    </div>
  )
}

export default memo(StartupManager)
