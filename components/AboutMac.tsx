"use client"

import { memo } from "react"
import { SYSTEM_INFO } from "@/lib/system"
import Image from "next/image"
function AboutMac({ onMoreInfo }: { onMoreInfo?: () => void }) {
  return (
    <div className="flex h-full flex-col select-none items-center px-6 pt-5 pb-4 text-center">
      <div className="flex flex-col items-center">
        <Image
          src="/macbook.png"
          alt="macbook pro"
          width={300}
          height={300}
          draggable={false}
        />
      </div>

      <h2 className="mt-3 text-[17px] font-bold text-black/85 dark:text-white/90">
        {SYSTEM_INFO.deviceName}
      </h2>

      <div className="mt-2 space-y-0.5 text-[11px] text-black/60 dark:text-white/60">
        <p>Chip&nbsp;&nbsp;{SYSTEM_INFO.chip}</p>
        <p>Memory&nbsp;&nbsp;{SYSTEM_INFO.memory}</p>
        <p>Serial number&nbsp;&nbsp;{SYSTEM_INFO.serial}</p>
        <p>
          {SYSTEM_INFO.osName}&nbsp;&nbsp;{SYSTEM_INFO.osVersion}
        </p>
      </div>

      <button
        onClick={onMoreInfo}
        className="mt-3 rounded-full bg-black/10 px-3 py-1 text-[11px] font-medium text-black/70 transition-colors hover:bg-black/15 dark:bg-white/15 dark:text-white/80 dark:hover:bg-white/25"
      >
        More Info...
      </button>

      <p className="mt-auto text-[9px] leading-tight text-black/40 dark:text-white/40">
        ™ and © 1983-2025 Apple Inc.
        <br />
        All Rights Reserved.
      </p>
    </div>
  )
}

export default memo(AboutMac)
