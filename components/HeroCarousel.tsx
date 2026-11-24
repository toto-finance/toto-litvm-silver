"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { slides } from "@/lib/catalog";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5600);
    return () => window.clearInterval(id);
  }, [paused]);

  function go(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  return (
    <section
      className="carousel"
      aria-roledescription="carousel"
      aria-label="Silver"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, slideIndex) => (
        <div
          className={slideIndex === index ? "slide is-active" : "slide"}
          key={slide.src}
          aria-hidden={slideIndex !== index}
        >
          <Image
            src={slide.src}
            alt={slide.title}
            fill
            priority={slideIndex === 0}
            sizes="100vw"
          />
          <div className="caption">
            <p className="kicker">{slide.kicker}</p>
            <p className="caption-title">{slide.title}</p>
            <p>{slide.text}</p>
          </div>
        </div>
      ))}
      <div className="carousel-controls">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide">
          ‹
        </button>
        <div className="dots">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show ${slide.title}`}
              aria-current={slideIndex === index ? "true" : undefined}
              onClick={() => setIndex(slideIndex)}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next slide">
          ›
        </button>
      </div>
    </section>
  );
}
