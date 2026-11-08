"use client"

import { memo } from "react"

function AnimatedWallpaper() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#0a1030]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/aerial/lake.jpg')" }}
      />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/aerial/tahoe-day.mp4"
        poster="/aerial/lake.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  )
}

export default memo(AnimatedWallpaper)
