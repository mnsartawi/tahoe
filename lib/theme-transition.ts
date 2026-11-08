"use client"

export function transitionTheme(apply: () => void) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => void
  }
  if (typeof doc.startViewTransition === "function") {
    doc.startViewTransition(apply)
  } else {
    apply()
  }
}
