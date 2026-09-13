"use client";

import React, { useRef, useState, ReactElement } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: ReactElement;
  className?: string;
}

export default function Magnetic({ children, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return; // Disable on mobile to prevent click cancellation
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn("w-full sm:w-auto inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
