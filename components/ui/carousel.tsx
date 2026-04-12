"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type CarouselProps = {
  slides: { title: string; subtitle: string }[];
};

export function Carousel({ slides }: CarouselProps) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[32px] border border-[#9F8B6C]/30 bg-gradient-to-br from-[#F5EFE7] to-[#EDE4D8] p-6 shadow-lg sm:p-8">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-[#9F8B6C]/5 to-transparent lg:block" />
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.title}
            className={cn(
              "relative transition-all duration-500",
              slideIndex === index ? "opacity-100" : "absolute inset-0 opacity-0",
            )}
          >
            <p className="text-xs uppercase tracking-[0.32em] text-[#6B5D4F]">Highlight</p>
            <h3 className="mt-3 max-w-2xl text-3xl font-semibold text-[#3D3428] sm:text-4xl">{slide.title}</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#6B5D4F] sm:text-base">{slide.subtitle}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.title}
            onClick={() => setIndex(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              slideIndex === index ? "w-10 bg-[#9F8B6C]" : "w-4 bg-[#9F8B6C]/30 hover:bg-[#9F8B6C]/50",
            )}
          />
        ))}
      </div>
    </div>
  );
}
