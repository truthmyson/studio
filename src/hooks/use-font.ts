
"use client"

import { useContext } from "react"
import { FontContext } from "@/components/font-provider"

export function useFont() {
  const context = useContext(FontContext)
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider")
  }
  return context
}
