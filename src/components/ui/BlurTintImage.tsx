"use client";

import React from "react";
import Image from "next/image";

/* ---------------------------------------------------------------------------
 * BlurTintImage
 * ---------------------------------------------------------------------------
 * Renders an image on top of a soft blurred copy of itself — the classic
 * "blurred backdrop + crisp foreground" card-tile treatment. The blurred layer
 * fills the container (never crops) and gives the card a seamless, tinted aura
 * around the fully visible `object-contain` foreground image.
 * ------------------------------------------------------------------------- */

// Normalises both static imports ({ src }) and string URLs into a usable src.
const toSrc = (img: unknown): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && (img as { src?: string }).src) {
    return (img as { src: string }).src;
  }
  return "";
};

export interface BlurTintImageProps {
  /** The image: a static import (`{ src }`), a string URL, or undefined. */
  src?: unknown;
  /** Accessible alt text for the visible foreground image. */
  alt?: string;
  /** Optional extra classes for the image element. */
  imageClassName?: string;
  /** Optional extra classes for the outer container. */
  className?: string;
  /** Fixed height for the container (px number, or any CSS length/unit string). */
  height?: number | string;
  /** Background colour behind the image, shown before the blurred layer loads. */
  backgroundColor?: string;
  /** Extra classes for the blurred background layer (appended after defaults). */
  backgroundClassName?: string;
  /** Extra classes for the soft white gradient overlay. */
  overlayClassName?: string;
}

/**
 * A card-tile image with a blurred self-portrait backdrop and a crisp,
 * never-cropped foreground image.
 */
export const BlurTintImage: React.FC<BlurTintImageProps> = ({
  src,
  alt = "",
  imageClassName = "",
  className = "",
  height = 180,
  backgroundColor = "#f3f4f6",
  backgroundClassName = "",
  overlayClassName = "",
}) => {
  const resolvedSrc = toSrc(src);

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        backgroundColor,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      {resolvedSrc && (
        <>
          {/* Blurred background layer (decorative, hidden from assistive tech) */}
          <Image
            src={resolvedSrc}
            fill
            alt=""
            aria-hidden
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover scale-[1.8] blur-3xl brightness-95 opacity-40 ${backgroundClassName}`}
          />
          {/* Soft white gradient over the blurred backdrop */}
          <div
            className={`absolute inset-0 bg-gradient-to-b from-white/10 to-white/30 ${overlayClassName}`}
          />
          {/* Crisp foreground image (never cropped) */}
          <Image
            src={resolvedSrc}
            fill
            alt={alt}
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`relative z-10 object-contain ${imageClassName}`}
          />
        </>
      )}
    </div>
  );
};

export default BlurTintImage;
