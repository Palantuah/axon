"use client";

import { cn } from "@/lib/utils";
import { motion, MotionProps, useScroll } from "framer-motion";
import React from "react";

interface ScrollProgressProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {}

export const ScrollProgress = React.forwardRef<
  HTMLDivElement,
  ScrollProgressProps
>(({ className, ...props }, ref) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-0.5 origin-left",
        "bg-gradient-to-r from-gradient-start via-gradient-middle to-gradient-end",
        "dark:from-gradient-start/80 dark:via-gradient-middle/80 dark:to-gradient-end/80",
        className,
      )}
      style={{
        scaleX: scrollYProgress,
        transformOrigin: "0%",
      }}
      {...props}
    />
  );
});

ScrollProgress.displayName = "ScrollProgress";
