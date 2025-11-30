import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QualityStarsProps {
  quality: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function QualityStars({
  quality,
  size = 'sm',
  showLabel = false,
  className,
}: QualityStarsProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < quality);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((filled, index) => (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              filled
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({quality}/5)
        </span>
      )}
    </div>
  );
}
