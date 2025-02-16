"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-8 w-8 rounded-full"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div className="relative h-4 w-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: theme === "dark" ? 1 : 0,
            opacity: theme === "dark" ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Moon className="h-4 w-4 text-neutral-200 transition-colors" />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: theme === "light" ? 1 : 0,
            opacity: theme === "light" ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Sun className="h-4 w-4 text-neutral-700 transition-colors" />
        </motion.div>
      </div>
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-emerald-500/20 opacity-0 
                 hover:opacity-100 blur-sm transition-opacity duration-500"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 