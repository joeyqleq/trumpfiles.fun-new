"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface DitherImageProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  pixelSize?: number;
}

export function DitherImage({
  src,
  alt = "",
  className = "",
  width,
  height,
  pixelSize = 8,
}: DitherImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [pixelation, setPixelation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;
    if (!img.complete) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const currentPixel = isHovered ? pixelSize : 1;
    const targetPixel = isHovered ? 1 : pixelSize;
    let progress = 0;

    const animate = () => {
      progress += 0.06;
      if (progress > 1) progress = 1;

      const eased = 1 - Math.pow(1 - progress, 3);
      const currentSize = Math.max(
        1,
        Math.round(currentPixel + (targetPixel - currentPixel) * eased)
      );

      setPixelation(currentSize);

      if (currentSize > 1) {
        const w = canvas.width;
        const h = canvas.height;
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, w, h);
        const sw = Math.ceil(w / currentSize);
        const sh = Math.ceil(h / currentSize);
        ctx.drawImage(img, 0, 0, sw, sh);
        ctx.drawImage(canvas, 0, 0, sw, sh, 0, 0, w, h);
      } else {
        ctx.imageSmoothingEnabled = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(animRef.current);
    progress = 0;
    animate();

    return () => cancelAnimationFrame(animRef.current);
  }, [isHovered, pixelSize]);

  return (
    <motion.div
      className={`relative inline-block overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="block opacity-0 absolute inset-0"
        onLoad={() => setPixelation(0)}
      />
      <canvas
        ref={canvasRef}
        className="block w-full h-auto"
        style={{
          imageRendering: pixelation > 1 ? "pixelated" : "auto",
        }}
      />
    </motion.div>
  );
}
