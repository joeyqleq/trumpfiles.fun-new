import { Fragment } from 'react';
import ChartPanel from '@/components/visualizer-lab/ChartPanel';
import type { VisualizerLabPressureMatrix } from '@/lib/visualizer-lab/types';

interface PressureMatrixViewProps {
  matrix: VisualizerLabPressureMatrix;
}

const getHeatTone = (value: number): string => {
  if (value >= 8) return 'bg-red-500/35 text-red-50 border-red-400/35';
  if (value >= 7) return 'bg-orange-500/32 text-orange-50 border-orange-400/30';
  if (value >= 6) return 'bg-amber-500/26 text-amber-50 border-amber-400/25';
  if (value >= 5) return 'bg-yellow-500/18 text-yellow-50 border-yellow-300/20';
  return 'bg-white/[0.03] text-foreground/75 border-white/8';
};

export default function PressureMatrixView({ matrix }: PressureMatrixViewProps) {
  return (
    <ChartPanel
      title="Pressure matrix"
      description="Average scoring pressure by category and dimension. Darker cells indicate where the archive’s average profile is most severe."
      contentClassName="overflow-x-auto"
    >
      <div className="min-w-[760px]">
        <div className="grid" style={{ gridTemplateColumns: `220px repeat(${matrix.dimensions.length}, minmax(110px, 1fr))` }}>
          <div className="sticky left-0 z-10 border-b border-white/10 bg-black/85 px-4 py-3 text-xs uppercase tracking-[0.22em] text-foreground/45">
            Category
          </div>
          {matrix.dimensions.map((dimension) => (
            <div
              key={dimension}
              className="border-b border-white/10 bg-black/85 px-3 py-3 text-center text-[11px] uppercase tracking-[0.18em] text-foreground/45"
            >
              {dimension.replace(/_/g, ' ')}
            </div>
          ))}

          {matrix.categories.map((category) => (
            <Fragment key={category}>
              <div className="sticky left-0 z-10 border-b border-white/8 bg-black/85 px-4 py-4 text-sm font-semibold text-foreground">
                {category}
              </div>
              {matrix.dimensions.map((dimension) => {
                const cell = matrix.cells.find((candidate) => candidate.category === category && candidate.dimension === dimension);
                const value = cell?.average ?? 0;

                return (
                  <div key={`${category}-${dimension}`} className="border-b border-white/8 px-2 py-2">
                    <div className={`rounded-xl border px-3 py-4 text-center ${getHeatTone(value)}`}>
                      <div className="text-lg font-black">{value.toFixed(2)}</div>
                      <div className="mt-1 text-[11px] uppercase tracking-[0.18em] opacity-75">
                        {cell?.count ?? 0} rows
                      </div>
                    </div>
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </ChartPanel>
  );
}
