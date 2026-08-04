"use client";

import React from "react";
import Image from "next/image";

/* ---------------------------------------------------------------------------
 * DynamicCardImage
 * ---------------------------------------------------------------------------
 * Renders an image using Next.js intrinsic width/height ratio scaling.
 *
 * Key Features:
 * - NO fixed heights or static pixel dimensions.
 * - NO blurred backgrounds or overlay tints.
 * - NO padding or unwanted spacing.
 * - NO cropping (100% of the image subject is preserved).
 * - Dynamically expands to fill card width while matching native aspect ratio.
 * ------------------------------------------------------------------------- */

const toSrc = (img: unknown): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && (img as { src?: string }).src) {
    return (img as { src: string }).src;
  }
  return "";
};

export interface DynamicCardImageProps {
  /** The image: a static import (`{ src }`), a string URL, or undefined. */
  src?: unknown;
  /** Accessible alt text for the image. */
  alt?: string;
  /** Optional extra classes for the image element itself. */
  imageClassName?: string;
  /** Optional extra classes for the outer wrapper container. */
  className?: string;
}

export const BlurTintImage: React.FC<DynamicCardImageProps> = ({
  src,
  alt = "",
  imageClassName = "",
  className = "",
}) => {
  const resolvedSrc = toSrc(src);

  if (!resolvedSrc) return null;

  return (
    <div className={`w-full overflow-hidden flex items-center justify-center bg-white ${className}`}>
      <Image
        src={resolvedSrc}
        alt={alt}
        width={0}
        height={0}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`w-full h-auto object-contain block ${imageClassName}`}
      />
    </div>
  );
};

export default BlurTintImage;