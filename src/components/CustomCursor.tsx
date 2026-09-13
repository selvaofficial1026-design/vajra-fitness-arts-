"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hasMoved, setHasMoved] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isOverInput, setIsOverInput] = useState(false);
  const hasMovedRef = useRef(false);

  const mouseX = useSpring(0, { stiffness: 500, damping: 28 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const checkTarget = (target: HTMLElement | null) => {
      if (!target) return;

      const isInput = Boolean(
        target.tagName.toLowerCase() === "textarea" ||
        target.tagName.toLowerCase() === "select" ||
        target.isContentEditable ||
        (target.tagName.toLowerCase() === "input" && !["submit", "button", "checkbox", "radio"].includes((target as HTMLInputElement).type?.toLowerCase())) ||
        target.closest("textarea, select, [contenteditable='true']") ||
        target.closest("input:not([type='submit']):not([type='button']):not([type='checkbox']):not([type='radio'])")
      );

      setIsOverInput(isInput);

      if (!isInput && (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button")
      )) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        mouseX.jump(e.clientX);
        mouseY.jump(e.clientY);
        setHasMoved(true);
      } else {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      checkTarget(e.target as HTMLElement | null);
    };

    const handleMouseLeave = () => {
      setHasMoved(false);
      hasMovedRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (!hasMoved) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] hidden [@media(hover:hover)]:block">
      <motion.div
        className="w-4 h-4 bg-cappuccino rounded-full flex items-center justify-center mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isOverInput ? 0 : isHovering ? 4 : 1,
          opacity: isOverInput ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        {isHovering && !isOverInput && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-1 h-1 bg-coffee-dark rounded-full"
          />
        )}
      </motion.div>
    </div>
  );
}
