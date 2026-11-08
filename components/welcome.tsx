"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const SF_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, "Segoe UI", sans-serif'

const CONTINUE_BUTTON =
  "h-12 rounded-full border border-sky-200/50 bg-blue-500/40 px-5 text-[12px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-xl transition-colors hover:bg-blue-400/50"

export default function Welcome({ onContinue }: { onContinue: () => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const updateFullscreen = () => {
      const browserFullscreen =
        window.innerHeight >= window.screen.height - 1 ||
        window.matchMedia("(display-mode: fullscreen)").matches
      setIsFullscreen(Boolean(document.fullscreenElement) || browserFullscreen)
    }

    updateFullscreen()
    document.addEventListener("fullscreenchange", updateFullscreen)
    window.addEventListener("resize", updateFullscreen)
    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreen)
      window.removeEventListener("resize", updateFullscreen)
    }
  }, [])

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center text-white"
      style={{ fontFamily: SF_FONT }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
      transition={{ duration: 0.45 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/25" />

      <div className="relative flex flex-1 items-center justify-center pt-[6vh]">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ clipPath: "inset(-10% 100% -10% -5%)" }}
            animate={{ clipPath: "inset(-10% -5% -10% -5%)" }}
            transition={{ duration: 2.6, ease: [0.45, 0, 0.25, 1], delay: 0.4 }}
          >
            <Image
              src="/welcome.png"
              alt="welcome"
              width={720}
              height={720}
              draggable={false}
              priority
              className="w-[min(96vw,1400px)] mix-blend-screen drop-shadow-[0_10px_30px_rgba(0,60,200,0.45)]"
            />
          </motion.div>
          {!isFullscreen && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 0.6 }}
              className="-translate-y-100 text-center text-[11px] text-white/75 drop-shadow"
            >
              Go fullscreen to see the Continue button.
            </motion.p>
          )}
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        onClick={onContinue}
        className={`relative ${CONTINUE_BUTTON}`}
      >
        Continue
      </motion.button>
      <div className="h-[10vh]" />
    </motion.div>
  )
}
