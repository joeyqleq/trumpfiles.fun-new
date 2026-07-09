import { type ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartPanelProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function ChartPanel({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: ChartPanelProps) {
  return (
    <Card className={cn('min-w-0 glass-card border-orange-500/20 bg-black/55', className)}>
      <CardHeader className="min-w-0 space-y-3 border-b border-white/8 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-base font-semibold tracking-wide text-orange-300">
              {title}
            </CardTitle>
            {description ? (
              <CardDescription className="max-w-3xl text-sm text-foreground/65">
                {description}
              </CardDescription>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </CardHeader>
      <CardContent className={cn('pt-5', contentClassName)}>{children}</CardContent>
    </Card>
  );
}
