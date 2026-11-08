"use client"

import { memo, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react"
import { motion, useDragControls } from "framer-motion"
import Image from "next/image"
import clsx from "clsx"

type Corner = "nw" | "ne" | "sw" | "se"
type WindowVariant = "titled" | "chromeless"

type Props = {
  title?: string
  icon?: string
  minimized?: boolean
  maximized?: boolean
  focused?: boolean
  variant?: WindowVariant
  zIndex?: number
  style?: CSSProperties
  defaultWidth?: number
  defaultHeight?: number
  resizable?: boolean
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  onFocus?: () => void
  children?: ReactNode
}

type ResizeStart = {
  x: number
  y: number
  w: number
  h: number
  sx: number
  sy: number
  corner: Corner
}

const WINDOW_TRANSITION = { type: "spring", damping: 22, stiffness: 260 } as const
const TITLEBAR_HEIGHT = 52

const VARIANT_RADIUS: Record<WindowVariant, string> = {
  titled: "rounded-[20px]",
  chromeless: "rounded-[26px]",
}

const CORNER_CLASSES: Record<Corner, string> = {
  nw: "top-0 left-0 t-cursor-diag-1",
  ne: "top-0 right-0 t-cursor-diag-2",
  sw: "bottom-0 left-0 t-cursor-diag-2",
  se: "right-0 bottom-0 t-cursor-diag-1",
}

const LIGHTS = [
  {
    key: "close",
    label: "Close",
    color: "#ff5f57",
    glyph: <path d="M3.6 3.6L8.4 8.4M8.4 3.6L3.6 8.4" />,
  },
  {
    key: "minimize",
    label: "Minimize",
    color: "#febc2e",
    glyph: <path d="M3 6H9" />,
  },
  {
    key: "maximize",
    label: "Maximize",
    color: "#28c840",
    glyph: <path d="M3.4 8.6V5M3.4 8.6H7M8.6 3.4V7M8.6 3.4H5" />,
  },
] as const

const TrafficLights = memo(function TrafficLights({
  focused,
  onClose,
  onMinimize,
  onMaximize,
}: Pick<Props, "focused" | "onClose" | "onMinimize" | "onMaximize">) {
  const handlers = { close: onClose, minimize: onMinimize, maximize: onMaximize }

  return (
    <div className="group flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
      {LIGHTS.map((light) => (
        <button
          key={light.key}
          onClick={handlers[light.key]}
          aria-label={light.label}
          className="relative size-3.5 rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.22),0_0.5px_1px_rgba(0,0,0,0.12)] transition-colors"
          style={{ background: focused ? light.color : "rgba(128,128,128,0.35)" }}
        >
          <svg
            viewBox="0 0 12 12"
            className="absolute inset-0 m-auto size-3 opacity-0 transition-opacity duration-100 group-hover:opacity-100"
            fill="none"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {light.glyph}
          </svg>
        </button>
      ))}
    </div>
  )
})

function MacWindow({
  title,
  icon,
  minimized,
  maximized,
  focused = true,
  variant = "titled",
  zIndex,
  style,
  defaultWidth = 820,
  defaultHeight = 540,
  resizable = true,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children,
}: Props) {
  const dragControls = useDragControls()
  const [size, setSize] = useState({ w: defaultWidth, h: defaultHeight })
  const [shift, setShift] = useState({ x: 0, y: 0 })
  const resizeRef = useRef<ResizeStart | null>(null)

  const onResizeMove = (clientX: number, clientY: number) => {
    const start = resizeRef.current
    if (!start) return
    const east = start.corner === "ne" || start.corner === "se"
    const south = start.corner === "sw" || start.corner === "se"
    const rawW = start.w + (east ? clientX - start.x : start.x - clientX)
    const rawH = start.h + (south ? clientY - start.y : start.y - clientY)
    const w = Math.min(window.innerWidth - 32, Math.max(300, rawW))
    const h = Math.min(window.innerHeight - 32, Math.max(280, rawH))
    setSize({ w, h })
    setShift({
      x: start.sx + (east ? (w - start.w) / 2 : -(w - start.w) / 2),
      y: start.sy + (south ? (h - start.h) / 2 : -(h - start.h) / 2),
    })
  }

  const beginResize = (corner: Corner) => (e: PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    resizeRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.w,
      h: size.h,
      sx: shift.x,
      sy: shift.y,
      corner,
    }
  }

  const endResize = () => {
    resizeRef.current = null
  }

  const startDrag = (e: PointerEvent) => dragControls.start(e)
  const canResize = resizable && !maximized && !minimized
  const radius = VARIANT_RADIUS[variant]

  return (
    <motion.div
      data-window
      drag={!maximized}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      style={{
        zIndex,
        ...style,
        width: maximized ? undefined : size.w,
        height: maximized ? undefined : size.h,
        translate: `calc(-50% + ${shift.x}px) calc(-50% + ${shift.y}px)`,
      }}
      initial={{ opacity: 0, scale: 0.82, y: 80, filter: "blur(10px)" }}
      animate={{
        opacity: minimized ? 0 : 1,
        scale: minimized ? 0.92 : 1,
        y: minimized ? 400 : 0,
        filter: minimized ? "blur(8px)" : "blur(0px)",
      }}
      transition={WINDOW_TRANSITION}
      onPointerDown={onFocus}
      className={clsx(
        "tahoe-glass absolute top-1/2 left-1/2 overflow-hidden will-change-transform",
        radius,
        "backdrop-blur-[50px] backdrop-saturate-[1.8]",
        focused
          ? "shadow-[0_28px_80px_-8px_rgba(0,0,0,0.45),0_8px_24px_rgba(0,0,0,0.18),0_0_0_0.5px_rgba(0,0,0,0.35)]"
          : "shadow-[0_14px_44px_-6px_rgba(0,0,0,0.28),0_0_0_0.5px_rgba(0,0,0,0.25)]",
        maximized ? "h-[calc(100%-48px)] w-[calc(100%-32px)] max-w-none" : "max-w-[95%]",
        minimized && "genie pointer-events-none"
      )}
    >
      <div
        aria-hidden
        className={clsx(
          "pointer-events-none absolute inset-0 z-30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),inset_0_1.5px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14),inset_0_1.5px_0_rgba(255,255,255,0.22)]",
          radius
        )}
      />

      {variant === "chromeless" ? (
        <div className="flex h-full flex-col">
          <div
            className="flex h-11 shrink-0 touch-none items-center pl-5 select-none dark:bg-black"
            onPointerDown={startDrag}
          >
            <TrafficLights focused={focused} onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />
          </div>
          <div className="min-h-0 flex-1 dark:bg-black">{children}</div>
        </div>
      ) : (
        <>
          <div
            className="flex touch-none items-center px-5 select-none dark:bg-black"
            style={{ height: TITLEBAR_HEIGHT }}
            onPointerDown={startDrag}
          >
            <div className="flex w-20 shrink-0 items-center">
              <TrafficLights focused={focused} onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />
            </div>

            <div
              className={clsx(
                "flex-1 text-center text-[13px] font-semibold select-none",
                focused ? "text-black/75 dark:text-white/85" : "text-black/35 dark:text-white/35"
              )}
            >
              {title}
            </div>

            <div className="flex w-20 shrink-0 justify-end">
              {icon && <Image src={icon} alt="" width={20} height={20} className="rounded-md" />}
            </div>
          </div>

          <div className="overflow-auto px-4 pb-4 dark:bg-black" style={{ height: `calc(100% - ${TITLEBAR_HEIGHT}px)` }}>
            {children}
          </div>
        </>
      )}

      {canResize &&
        (Object.keys(CORNER_CLASSES) as Corner[]).map((corner) => (
          <div
            key={corner}
            aria-label={`Resize ${corner}`}
            className={clsx("absolute z-40 size-5 touch-none", CORNER_CLASSES[corner])}
            onPointerDown={beginResize(corner)}
            onPointerMove={(e) => {
              if (resizeRef.current) onResizeMove(e.clientX, e.clientY)
            }}
            onPointerUp={endResize}
            onPointerCancel={endResize}
          />
        ))}
    </motion.div>
  )
}

export default memo(MacWindow)
