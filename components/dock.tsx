"use client"

import Image from "next/image"
import React, { useState, useRef, useCallback, useEffect } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

interface DockApp {
  id: string
  name: string
  icon: string
  className?: string
}

interface MacOSDockProps {
  apps: DockApp[]
  onAppClick: (appId: string) => void
  onAppClose?: (appId: string) => void
  onRemoveFromDock?: (appId: string) => void
  onShowInFinder?: (appId: string) => void
  onKeepInDock?: (appId: string) => void
  onEmptyTrash?: (appId: string) => void
  openApps?: string[]
  className?: string
}

type DockPosition = "left" | "bottom" | "right"

const MacOSDock: React.FC<MacOSDockProps> = ({
  apps,
  onAppClick,
  onAppClose,
  onRemoveFromDock,
  onShowInFinder,
  onKeepInDock,
  onEmptyTrash,
  openApps = [],
  className = "",
}) => {
  const [mouseX, setMouseX] = useState<number | null>(null)
  const [hoveredApp, setHoveredApp] = useState<string | null>(null)
  const [magnificationEnabled, setMagnificationEnabled] = useState(true)
  const [dockPosition, setDockPosition] = useState<DockPosition>("bottom")
  const [dockMenuOpen, setDockMenuOpen] = useState(false)
  const [dockMenuPosition, setDockMenuPosition] = useState({ x: 0, y: 0 })
  const [contextMenuApp, setContextMenuApp] = useState<string | null>(null)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })

  const dockRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const scalesRef = useRef<number[]>([])
  const positionsRef = useRef<number[]>([])
  const lastMouseMoveTime = useRef<number>(0)
  const contextMenuRef = useRef<HTMLDivElement>(null)

  const getResponsiveConfig = useCallback(() => {
    if (typeof window === "undefined") {
      return { baseIconSize: 64, maxScale: 1.75, effectWidth: 300 }
    }

    const smallerDimension = Math.min(window.innerWidth, window.innerHeight)

    if (smallerDimension < 480) {
      return { baseIconSize: 44, maxScale: 1.4, effectWidth: 180 }
    }

    if (smallerDimension < 768) {
      return { baseIconSize: 52, maxScale: 1.5, effectWidth: 220 }
    }

    return { baseIconSize: 64, maxScale: 1.75, effectWidth: 300 }
  }, [])

  const [config, setConfig] = useState(getResponsiveConfig)
  const { baseIconSize, maxScale, effectWidth } = config
  const minScale = 1
  const baseSpacing = Math.max(4, baseIconSize * 0.08)

  const [currentScales, setCurrentScales] = useState<number[]>(
    apps.map(() => 1)
  )
  const [currentPositions, setCurrentPositions] = useState<number[]>([])

  useEffect(() => {
    const handleResize = () => setConfig(getResponsiveConfig())
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [getResponsiveConfig])

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setContextMenuApp(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  const calculateTargetMagnification = useCallback(
    (mousePosition: number | null) => {
      if (!magnificationEnabled || mousePosition === null) {
        return apps.map(() => minScale)
      }

      return apps.map((_, index) => {
        const normalIconCenter =
          index * (baseIconSize + baseSpacing) + baseIconSize / 2
        const distance = Math.abs(mousePosition - normalIconCenter)

        if (distance > effectWidth / 2) return minScale

        return (
          Math.cos((distance / (effectWidth / 2)) * Math.PI * 0.5) *
            (maxScale - minScale) +
          minScale
        )
      })
    },
    [
      apps,
      baseIconSize,
      baseSpacing,
      effectWidth,
      maxScale,
      magnificationEnabled,
    ]
  )

  const calculatePositions = useCallback(
    (scales: number[]) => {
      let currentX = 0
      return scales.map((scale) => {
        const scaledWidth = baseIconSize * scale
        const centerX = currentX + scaledWidth / 2
        currentX += scaledWidth + baseSpacing
        return centerX
      })
    },
    [baseIconSize, baseSpacing]
  )

  useEffect(() => {
    const initialScales = apps.map(() => minScale)
    const initialPositions = calculatePositions(initialScales)
    scalesRef.current = initialScales
    positionsRef.current = initialPositions
    setCurrentScales(initialScales)
    setCurrentPositions(initialPositions)
  }, [apps, calculatePositions])

  useEffect(() => {
    const rate = mouseX !== null ? 0.2 : 0.25
    const animate = () => {
      const targetScales = calculateTargetMagnification(mouseX)
      const targetPositions = calculatePositions(targetScales)

      let settled = true
      const nextScales = scalesRef.current.map((scale, index) => {
        const delta = targetScales[index] - scale
        if (Math.abs(delta) > 0.001) settled = false
        return scale + delta * rate
      })
      const nextPositions = positionsRef.current.map((position, index) => {
        const delta = targetPositions[index] - position
        if (Math.abs(delta) > 0.25) settled = false
        return position + delta * rate
      })

      if (settled) {
        const exactScales = targetScales.map((t) => t)
        const exactPositions = targetPositions.map((t) => t)
        scalesRef.current = exactScales
        positionsRef.current = exactPositions
        setCurrentScales(exactScales)
        setCurrentPositions(exactPositions)
        animationFrameRef.current = null
        return
      }

      scalesRef.current = nextScales
      positionsRef.current = nextPositions
      setCurrentScales(nextScales)
      setCurrentPositions(nextPositions)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [mouseX, calculateTargetMagnification, calculatePositions])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!magnificationEnabled) return

      const now = performance.now()
      if (now - lastMouseMoveTime.current < 16) return
      lastMouseMoveTime.current = now

      if (dockRef.current) {
        const rect = dockRef.current.getBoundingClientRect()
        const padding = Math.max(8, baseIconSize * 0.12)
        setMouseX(e.clientX - rect.left - padding)
      }
    },
    [baseIconSize, magnificationEnabled]
  )

  const handleMouseLeave = useCallback(() => {
    setMouseX(null)
    setHoveredApp(null)
  }, [])

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  useEffect(() => clearLongPress, [clearLongPress])

  const updateMouseFromClientX = useCallback(
    (clientX: number) => {
      if (!magnificationEnabled || !dockRef.current) return
      const now = performance.now()
      if (now - lastMouseMoveTime.current < 16) return
      lastMouseMoveTime.current = now
      const rect = dockRef.current.getBoundingClientRect()
      const pad = Math.max(8, baseIconSize * 0.12)
      setMouseX(clientX - rect.left - pad)
    },
    [baseIconSize, magnificationEnabled]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0]
      if (t) updateMouseFromClientX(t.clientX)
    },
    [updateMouseFromClientX]
  )

  const handleTouchEnd = useCallback(() => {
    clearLongPress()
    setMouseX(null)
    setHoveredApp(null)
  }, [clearLongPress])

  const startLongPress = useCallback(
    (onFire: () => void) => {
      clearLongPress()
      longPressTimer.current = setTimeout(onFire, 550)
    },
    [clearLongPress]
  )

  const handleAppClick = (appId: string, index: number) => {
    const element = iconRefs.current[index]

    if (element) {
      element.animate(
        [
          { transform: "translateY(0px)" },
          { transform: `translateY(${-baseIconSize * 0.18}px)` },
          { transform: "translateY(0px)" },
        ],
        { duration: 400, easing: "ease-out" }
      )
    }

    onAppClick(appId)
  }

  const handleDockContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setDockMenuPosition({ x: e.clientX, y: e.clientY })
    setDockMenuOpen(true)
  }

  const handleAppContextMenu = (e: React.MouseEvent, appId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setContextMenuApp(appId)
  }

  const handleContextMenuAction = (action: () => void) => {
    action()
    setContextMenuApp(null)
  }

  const contentWidth =
    currentPositions.length > 0
      ? Math.max(
          ...currentPositions.map(
            (position, index) =>
              position + (baseIconSize * currentScales[index]) / 2
          )
        )
      : apps.length * (baseIconSize + baseSpacing)

  const padding = Math.max(8, baseIconSize * 0.12)

  return (
    <>
      <div
        ref={dockRef}
        data-dock
        className={`relative backdrop-blur-2xl select-none ${className}`}
        style={{
          width: `${contentWidth + padding * 2}px`,
          padding: `${padding}px`,
          borderRadius: `${baseIconSize * 0.28}px`,
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
          touchAction: "none",
          WebkitTouchCallout: "none",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleDockContextMenu}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchStart={(e) => {
          const t = e.touches[0]
          if (!t) return
          const x = t.clientX
          const y = t.clientY
          startLongPress(() => {
            setDockMenuPosition({ x, y })
            setDockMenuOpen(true)
          })
        }}
      >
        <div className="relative" style={{ height: `${baseIconSize}px` }}>
          {apps.map((app, index) => {
            const scale = currentScales[index] || 1
            const position = currentPositions[index] || 0
            const scaledSize = baseIconSize * scale
            const isOpen = openApps.includes(app.id)

            return (
              <div
                key={app.id}
                ref={(el) => {
                  iconRefs.current[index] = el
                }}
                className={`absolute flex items-end justify-center ${app.className || ""}`}
                style={{
                  left: `${position - scaledSize / 2}px`,
                  bottom: 0,
                  width: `${scaledSize}px`,
                  height: `${scaledSize}px`,
                  zIndex: Math.round(scale * 100),
                  cursor: "default",
                }}
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
                onClick={(e) => {
                  if (e.button === 2) return
                  handleAppClick(app.id, index)
                }}
                onContextMenu={(e) => handleAppContextMenu(e, app.id)}
                onTouchStart={(e) => {
                  e.stopPropagation()
                  const t = e.touches[0]
                  if (!t) return
                  const x = t.clientX
                  const y = t.clientY
                  setHoveredApp(app.id)
                  startLongPress(() => {
                    setContextMenuPosition({ x, y })
                    setContextMenuApp(app.id)
                  })
                }}
              >
                {hoveredApp === app.id && (
                  <div
                    className="absolute whitespace-nowrap"
                    style={{
                      bottom: `${scaledSize + 12}px`,
                      background: "rgba(240,240,240,0.96)",
                      color: "#222",
                      fontSize: `${Math.max(11, baseIconSize * 0.18)}px`,
                      fontWeight: 500,
                      padding: `${baseIconSize * 0.08}px ${baseIconSize * 0.18}px`,
                      borderRadius: `${baseIconSize * 0.14}px`,
                      boxShadow:
                        "0 4px 14px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
                      pointerEvents: "none",
                    }}
                  >
                    {app.name}
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        bottom: "-5px",
                        width: "10px",
                        height: "10px",
                        background: "rgba(240,240,240,0.96)",
                        transform: "translateX(-50%) rotate(45deg)",
                      }}
                    />
                  </div>
                )}

                <Image
                  src={app.icon}
                  alt={app.name}
                  width={scaledSize}
                  height={scaledSize}
                  draggable={false}
                  priority
                  className={`overflow-hidden object-cover ${app.className || ""}`}
                  style={{
                    width: `${scaledSize}px`,
                    height: `${scaledSize}px`,
                    filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.28))",
                    pointerEvents: "none",
                  }}
                />

                {isOpen && (
                  <div
                    className="absolute"
                    style={{
                      bottom: `${-baseIconSize * 0.06}px`,
                      width: `${baseIconSize * 0.08}px`,
                      height: `${baseIconSize * 0.08}px`,
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.95)",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <DropdownMenu open={dockMenuOpen} onOpenChange={setDockMenuOpen}>
        <DropdownMenuContent
          sideOffset={12}
          style={{
            position: "fixed",
            left: dockMenuPosition.x,
            top: dockMenuPosition.y,
          }}
          className="w-64 rounded-2xl border border-white/10 bg-zinc-900/95 text-white backdrop-blur-2xl"
        >
          <DropdownMenuItem
            onClick={() => setMagnificationEnabled((prev) => !prev)}
          >
            {magnificationEnabled
              ? "Turn Magnification Off"
              : "Turn Magnification On"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Position on Screen</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="rounded-2xl border border-white/10 bg-zinc-900/95 text-white backdrop-blur-2xl">
                <DropdownMenuItem onClick={() => setDockPosition("left")}>
                  {dockPosition === "left" ? "✓ " : ""}Left
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDockPosition("bottom")}>
                  {dockPosition === "bottom" ? "✓ " : ""}Bottom
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDockPosition("right")}>
                  {dockPosition === "right" ? "✓ " : ""}Right
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      {contextMenuApp && (
        <div
          ref={contextMenuRef}
          className="fixed z-[9999] w-60 rounded-2xl border border-white/10 bg-zinc-900/95 py-1.5 text-white shadow-2xl backdrop-blur-2xl"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
          }}
        >
          <button
            className="w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/10"
            onClick={() =>
              handleContextMenuAction(() => onAppClick(contextMenuApp))
            }
          >
            Open
          </button>

          {openApps.includes(contextMenuApp) && (
            <button
              className="w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/10"
              onClick={() =>
                handleContextMenuAction(() => onAppClose?.(contextMenuApp))
              }
            >
              Quit
            </button>
          )}

          {contextMenuApp === "trash" && (
            <button
              className="w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/10"
              onClick={() =>
                handleContextMenuAction(() => onEmptyTrash?.(contextMenuApp))
              }
            >
              Empty Trash
            </button>
          )}

          <div className="my-1.5 h-px bg-white/10" />

          <button
            className="w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/10"
            onClick={() =>
              handleContextMenuAction(() => onShowInFinder?.(contextMenuApp))
            }
          >
            Show in Finder
          </button>

          <button
            className="w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/10"
            onClick={() =>
              handleContextMenuAction(() => onKeepInDock?.(contextMenuApp))
            }
          >
            Keep in Dock
          </button>

          <div className="my-1.5 h-px bg-white/10" />

          <button
            className="w-full px-3 py-1.5 text-left text-sm text-red-400 transition-colors hover:bg-white/10"
            onClick={() =>
              handleContextMenuAction(() => onRemoveFromDock?.(contextMenuApp))
            }
          >
            Remove from Dock
          </button>
        </div>
      )}
    </>
  )
}

export default MacOSDock
