'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';


export interface BlobCursorProps {
  blobType?: 'circle' | 'square';
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterId?: string;
  filterStdDeviation?: number;
  filterColorMatrixValues?: string;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  fastEase?: string;
  slowEase?: string;
  zIndex?: number;
}

export default function BlobCursor({
  blobType = 'circle',
  fillColor = '#f97316', // Orange-500
  trailCount = 3,
  sizes = [60, 100, 50],
  innerSizes = [20, 30, 15],
  innerColor = 'rgba(255,255,255,0.8)',
  opacities = [0.6, 0.4, 0.2],
  shadowColor = 'rgba(249, 115, 22, 0.4)',
  shadowBlur = 10,
  shadowOffsetX = 0,
  shadowOffsetY = 0,
  filterId = 'blob',
  filterStdDeviation = 20,
  filterColorMatrixValues = '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -10',
  useFilter = true,
  fastDuration = 0.2,
  slowDuration = 0.8,
  fastEase = 'power2.out',
  slowEase = 'elastic.out(1, 0.5)',
  zIndex = 50
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);
  // Use a global event listener instead of useMouse for smoother performance if needed, 
  // but let's stick to the event in a fixed container.

  const updateOffset = useCallback(() => {
    // Since we are fixed inset-0, offset is 0
    return { left: 0, top: 0 };
  }, []);

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      const y = 'clientY' in e ? e.clientY : e.touches[0].clientY;

      blobsRef.current.forEach((el, i) => {
        if (!el) return;
        const isLead = i === 0;
        gsap.to(el, {
          x: x,
          y: y,
          duration: isLead ? fastDuration : slowDuration + (i * 0.1),
          ease: isLead ? fastEase : slowEase,
          overwrite: 'auto'
        });
      });
    },
    [fastDuration, slowDuration, fastEase, slowEase]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [handleMove]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex }}
    >
      {useFilter && (
        <svg className="absolute w-0 h-0">
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={filterStdDeviation} />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}

      <div
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{ filter: useFilter ? `url(#${filterId})` : undefined }}
      >
        {Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={el => {
              blobsRef.current[i] = el;
            }}
            className="absolute top-0 left-0 will-change-transform transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: sizes[i % sizes.length],
              height: sizes[i % sizes.length],
              borderRadius: blobType === 'circle' ? '50%' : '0',
              backgroundColor: fillColor,
              opacity: opacities[i % opacities.length],
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`
            }}
          >
          </div>
        ))}
      </div>
    </div>
  );
}
