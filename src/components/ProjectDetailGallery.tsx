'use client';

import { useState } from "react";
import Image from "next/image";
import type { ProjectImage } from "@/lib/projects";

export function ProjectDetailGallery({ images }: { images: ProjectImage[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-[4/3] border border-outline-variant/20 hover:border-primary-container/40 transition-colors duration-300 overflow-hidden bg-background">
        <Image
          src={images[active].src}
          alt={images[active].alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
        <span className="absolute bottom-3 left-3 text-[0.6rem] font-sans font-bold uppercase tracking-widest text-primary bg-background/80 px-2 py-1">
          {images[active].caption}
        </span>
      </div>

      {images.length > 1 && (
        <div className={`grid gap-2 ${images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View ${img.caption}`}
              aria-pressed={i === active}
              className={`relative aspect-[4/3] border overflow-hidden transition-all duration-200 cursor-pointer bg-transparent p-0 ${
                i === active
                  ? "border-primary-container ring-1 ring-primary-container/50"
                  : "border-outline-variant/20 opacity-50 hover:opacity-80 hover:border-outline-variant/50"
              }`}
            >
              <Image src={img.src} alt={img.alt} fill sizes="160px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
