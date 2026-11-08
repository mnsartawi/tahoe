"use client"

import { memo } from "react"
import AnimatedWallpaper from "@/components/AnimatedWallpaper"

export type WallpaperChoice =
  | "light"
  | "dark"
  | "aerial"
  | "custom"
  | "wallpaper1"
  | "bmw1"
  | "bmw"

const KEY = "tahoe-wallpaper"
const CUSTOM_KEY = "tahoe-wallpaper-custom"

const STATIC_IMAGES: Partial<Record<WallpaperChoice, string>> = {
  wallpaper1: "/wallpaper1.jpg",
  bmw1: "/bmw1.jpg",
  bmw: "/bmw.jpg",
}

const CHOICES: WallpaperChoice[] = [
  "light",
  "dark",
  "aerial",
  "custom",
  ...(Object.keys(STATIC_IMAGES) as WallpaperChoice[]),
]

export function loadWallpaper(): WallpaperChoice {
  if (typeof window === "undefined") return "light"
  const v = window.localStorage.getItem(KEY)
  return CHOICES.includes(v as WallpaperChoice) ? (v as WallpaperChoice) : "light"
}

export function saveWallpaper(w: WallpaperChoice) {
  try {
    window.localStorage.setItem(KEY, w)
  } catch {}
}

export function loadCustomWallpaper(): string | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage.getItem(CUSTOM_KEY)
  } catch {
    return null
  }
}

export function saveCustomWallpaper(src: string) {
  try {
    window.localStorage.setItem(CUSTOM_KEY, src)
  } catch {}
}

export function downscaleImage(file: File, maxEdge = 1920): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error("canvas"))
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL("image/jpeg", 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("decode"))
    }
    img.src = url
  })
}

function Wallpaper({ choice, customSrc }: { choice: WallpaperChoice; customSrc?: string | null }) {
  if (choice === "aerial") return <AnimatedWallpaper />
  const staticImage = STATIC_IMAGES[choice]
  if (staticImage) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${staticImage}')` }}
      />
    )
  }
  if (choice === "custom" && customSrc) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${customSrc}')` }}
      />
    )
  }
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 transition-opacity duration-500 dark:opacity-0"
        style={{ backgroundImage: "url('/light.jpg')" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-500 dark:opacity-100"
        style={{ backgroundImage: "url('/dark.jpg')" }}
      />
    </>
  )
}

export default memo(Wallpaper)
