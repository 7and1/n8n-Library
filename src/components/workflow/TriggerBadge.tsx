import { Webhook, Clock, Zap, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TriggerType } from '@/types';

interface TriggerBadgeProps {
  trigger: TriggerType;
  size?: 'sm' | 'md';
  className?: string;
}

const triggerConfig: Record<TriggerType, {
  label: string;
  icon: React.ReactNode;
  colorClass: string;
}> = {
  webhook: {
    label: 'Webhook',
    icon: <Webhook className="w-3 h-3" />,
    colorClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  schedule: {
    label: 'Scheduled',
    icon: <Clock className="w-3 h-3" />,
    colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  event: {
    label: 'Event',
    icon: <Zap className="w-3 h-3" />,
    colorClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  manual: {
    label: 'Manual',
    icon: <Play className="w-3 h-3" />,
    colorClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  },
};

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
};

export function TriggerBadge({
  trigger,
  size = 'sm',
  className,
}: TriggerBadgeProps) {
  const config = triggerConfig[trigger];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded font-medium',
        sizeClasses[size],
        config.colorClass,
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
