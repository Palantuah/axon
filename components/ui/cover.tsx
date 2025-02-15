"use client";
import React, { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { SparklesCore } from "@/components/ui/sparkles";

export const Cover = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [beamPositions, setBeamPositions] = useState<number[]>([]);

  useEffect(() => {
    if (ref.current) {
      setContainerWidth(ref.current?.clientWidth ?? 0);
      const height = ref.current?.clientHeight ?? 0;
      const numberOfBeams = Math.floor(height / 12);
      const positions = Array.from(
        { length: numberOfBeams },
        (_, i) => (i + 1) * (height / (numberOfBeams + 1))
      );
      setBeamPositions(positions);
    }
  }, [ref.current]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
      className="relative group/cover inline-flex items-center justify-center bg-glass-bg dark:bg-neutral-900/50 px-4 py-3 transition-all duration-500 rounded-2xl border border-glass-border backdrop-blur-md"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full w-full overflow-hidden absolute inset-0 rounded-lg"
          >
            <motion.div
              animate={{
                translateX: ["-50%", "0%"],
              }}
              transition={{
                translateX: {
                  duration: 20,
                  ease: "linear",
                  repeat: Infinity,
                },
              }}
              className="w-[200%] h-full flex"
            >
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={500}
                className="w-full h-full"
                particleColor="rgba(139, 92, 246, 0.5)"
              />
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={500}
                className="w-full h-full"
                particleColor="rgba(139, 92, 246, 0.5)"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {beamPositions.map((position, index) => (
        <Beam
          key={index}
          hovered={hovered}
          duration={Math.random() * 1.5 + 1.5}
          delay={Math.random() * 1.5}
          width={containerWidth}
          style={{
            top: `${position}px`,
          }}
        />
      ))}
      <motion.span
        key={String(hovered)}
        animate={{
          scale: hovered ? 0.98 : 1,
          y: hovered ? -1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          mass: 0.1,
          duration: 0.5,
        }}
        className={cn(
          "dark:text-white inline-block text-neutral-900 relative z-20 group-hover/cover:text-white transition-colors duration-500",
          className
        )}
      >
        {children}
      </motion.span>
      <motion.div 
        initial={false}
        animate={{
          opacity: hovered ? 0 : 1,
          scale: hovered ? 0.9 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0 flex"
      >
        <CircleIcon className="absolute -right-[2px] -top-[2px]" />
        <CircleIcon className="absolute -bottom-[2px] -right-[2px]" delay={0.4} />
        <CircleIcon className="absolute -left-[2px] -top-[2px]" delay={0.8} />
        <CircleIcon className="absolute -bottom-[2px] -left-[2px]" delay={1.6} />
      </motion.div>
    </div>
  );
};

export const Beam = ({
  className,
  delay,
  duration,
  hovered,
  width = 600,
  ...svgProps
}: {
  className?: string;
  delay?: number;
  duration?: number;
  hovered?: boolean;
  width?: number;
} & React.ComponentProps<typeof motion.svg>) => {
  const id = useId();

  return (
    <motion.svg
      width={width ?? "600"}
      height="1"
      viewBox={`0 0 ${width ?? "600"} 1`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute inset-x-0 w-full", className)}
      {...svgProps}
    >
      <motion.path
        d={`M0 0.5H${width ?? "600"}`}
        stroke={`url(#svgGradient-${id})`}
      />

      <defs>
        <motion.linearGradient
          id={`svgGradient-${id}`}
          key={String(hovered)}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: "0%",
            x2: hovered ? "-10%" : "-5%",
            y1: 0,
            y2: 0,
          }}
          animate={{
            x1: "110%",
            x2: hovered ? "100%" : "105%",
            y1: 0,
            y2: 0,
          }}
          transition={{
            duration: hovered ? 0.8 : duration ?? 2,
            ease: [0.22, 1, 0.36, 1],
            repeat: Infinity,
            delay: hovered ? Math.random() * 0.4 : 0,
            repeatDelay: hovered ? Math.random() * 0.8 : delay ?? 1,
          }}
        >
          <stop stopColor="rgba(139, 92, 246, 0)" />
          <stop stopColor="rgba(139, 92, 246, 0.3)" />
          <stop offset="1" stopColor="rgba(139, 92, 246, 0)" />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  );
};

export const CircleIcon = ({
  className,
  delay,
}: {
  className?: string;
  delay?: number;
}) => {
  return (
    <div
      className={cn(
        `pointer-events-none animate-pulse group-hover/cover:opacity-0 transition-opacity duration-500 h-1.5 w-1.5 rounded-full bg-violet-500/20 dark:bg-violet-500/30 opacity-20`,
        className
      )}
    ></div>
  );
};
