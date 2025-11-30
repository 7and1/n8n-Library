'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const SIMPLE_ICONS_CDN = 'https://cdn.simpleicons.org';

interface IntegrationIconProps {
  slug: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showName?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const containerClasses = {
  sm: 'w-6 h-6 p-1',
  md: 'w-8 h-8 p-1.5',
  lg: 'w-10 h-10 p-1.5',
};

export function IntegrationIcon({
  slug,
  name,
  size = 'md',
  className,
  showName = false,
}: IntegrationIconProps) {
  const [hasError, setHasError] = useState(false);

  const firstLetter = name.charAt(0).toUpperCase();

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center gap-2',
          className
        )}
        title={name}
      >
        <div
          className={cn(
            containerClasses[size],
            'flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium text-xs'
          )}
        >
          {firstLetter}
        </div>
        {showName && (
          <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        className
      )}
      title={name}
    >
      <div
        className={cn(
          containerClasses[size],
          'flex items-center justify-center rounded-md bg-gray-50 dark:bg-gray-800'
        )}
      >
        <img
          src={`${SIMPLE_ICONS_CDN}/${slug}`}
          alt={name}
          className={cn(sizeClasses[size], 'object-contain dark:invert')}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      </div>
      {showName && (
        <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
      )}
    </div>
  );
}

interface IntegrationIconsProps {
  integrations: Array<{ slug: string; name: string; icon: string }>;
  maxIcons?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function IntegrationIcons({
  integrations,
  maxIcons = 4,
  size = 'sm',
  className,
}: IntegrationIconsProps) {
  const visibleIntegrations = integrations.slice(0, maxIcons);
  const remainingCount = integrations.length - maxIcons;

  return (
    <div className={cn('flex items-center -space-x-1', className)}>
      {visibleIntegrations.map((integration) => (
        <div
          key={integration.slug}
          className="rounded-md border-2 border-white dark:border-gray-900 bg-gray-50 dark:bg-gray-800 overflow-hidden"
        >
          <IntegrationIcon
            slug={integration.icon}
            name={integration.name}
            size={size}
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            containerClasses[size],
            'flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium border-2 border-white dark:border-gray-900'
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
