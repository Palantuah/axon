"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { cn } from "@/lib/utils";

export const CardSpotlight = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={cn(
        "group p-10 rounded-md relative border bg-background/80 backdrop-blur-sm",
        isDark ? "border-neutral-800" : "border-neutral-200",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute z-0 -inset-px rounded-md opacity-0 transition duration-300 group-hover:opacity-100"
      >
        {isHovering && (
          <CanvasRevealEffect
            animationSpeed={2}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              isDark 
                ? [59, 130, 246]  // blue-500
                : [37, 99, 235],  // blue-600
              isDark
                ? [139, 92, 246]  // violet-500
                : [124, 58, 237], // violet-600
            ]}
            dotSize={32}
            opacities={[0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.6, 0.6, 0.6, 0.8]}
          />
        )}
      </motion.div>
      
      {/* Blur overlay */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />
      </div>

      {/* Content with higher z-index */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};
