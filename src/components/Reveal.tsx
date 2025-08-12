import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

const Reveal: React.FC<RevealProps> = ({ children, className, threshold = 0.2 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-transform",
        visible ? "animate-in fade-in-50 slide-in-from-bottom-2 duration-500" : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Reveal;
