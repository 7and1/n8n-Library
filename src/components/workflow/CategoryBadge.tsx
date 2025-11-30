import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  slug: string;
  name: string;
  icon?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  className?: string;
}

const colorClasses: Record<string, string> = {
  'cat-ai': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50',
  'cat-comm': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50',
  'cat-prod': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50',
  'cat-devops': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50',
  'cat-crm': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50',
  'cat-ecom': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/50',
  'cat-data': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50',
  'cat-util': 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-sm',
};

export function CategoryBadge({
  slug,
  name,
  icon,
  color = 'cat-util',
  size = 'sm',
  clickable = true,
  className,
}: CategoryBadgeProps) {
  const colorClass = colorClasses[color] || colorClasses['cat-util'];

  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
        sizeClasses[size],
        colorClass,
        clickable && 'cursor-pointer',
        className
      )}
    >
      {icon && <span>{icon}</span>}
      <span>{name}</span>
    </span>
  );

  if (clickable) {
    return (
      <Link href={`/category/${slug}/`} className="no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
