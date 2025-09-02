
"use client"

import { createContext, useEffect, useState } from "react"
import { Inter, PT_Sans, Roboto } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ptSans = PT_Sans({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-pt-sans" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-roboto" });

type FontContextType = {
  font: string
  setFont: (font: string) => void
}

export const FontContext = createContext<FontContextType | undefined>(undefined)

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFont] = useState("pt-sans")

  useEffect(() => {
    const storedFont = localStorage.getItem("ui-font")
    if (storedFont) {
      setFont(storedFont)
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty("--font-sans", `var(--font-${font})`)
    localStorage.setItem("ui-font", font)
  }, [font])

  return (
    <FontContext.Provider value={{ font, setFont }}>
      <div className={`${inter.variable} ${ptSans.variable} ${roboto.variable}`}>
        {children}
      </div>
    </FontContext.Provider>
  )
}
