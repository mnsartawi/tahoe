export type WindowVariant = "titled" | "chromeless"

export type WindowConfig = {
  variant: WindowVariant
  width: number
  height: number
  resizable: boolean
}

const DEFAULT_CONFIG: WindowConfig = {
  variant: "titled",
  width: 820,
  height: 540,
  resizable: true,
}

const WINDOW_CONFIG: Record<string, Partial<WindowConfig>> = {
  settings: { variant: "chromeless", width: 800, height: 600 },
  about: { variant: "chromeless", width: 340, height: 500, resizable: false },
  terminal: { width: 640, height: 420 },
}

export const getWindowConfig = (id: string): WindowConfig => ({
  ...DEFAULT_CONFIG,
  ...WINDOW_CONFIG[id],
})
