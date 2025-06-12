"use client";

import React, { useEffect, useRef, useState } from "react";

export default function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // on arrête d’observer une fois visible
        }
      },
      { threshold: 0.1 } // déclenche quand 10% de la div est visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-in-section ${isVisible ? "is-visible" : ""}`}>
      {children}
    </div>
  );
}
