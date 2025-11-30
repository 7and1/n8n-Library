import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

const colorClasses: Record<string, {
  bg: string;
  bgHover: string;
  text: string;
  border: string;
}> = {
  'cat-ai': {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    bgHover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
  'cat-comm': {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    bgHover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  'cat-prod': {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    bgHover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  'cat-devops': {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    bgHover: 'hover:bg-amber-100 dark:hover:bg-amber-900/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
  'cat-crm': {
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    bgHover: 'hover:bg-pink-100 dark:hover:bg-pink-900/30',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-200 dark:border-pink-800',
  },
  'cat-ecom': {
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    bgHover: 'hover:bg-teal-100 dark:hover:bg-teal-900/30',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-800',
  },
  'cat-data': {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    bgHover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  'cat-util': {
    bg: 'bg-gray-50 dark:bg-gray-800/50',
    bgHover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
  },
};

export function CategoryCard({
  category,
  variant = 'default',
  className,
}: CategoryCardProps) {
  const isCompact = variant === 'compact';
  const colorKey = category.color || 'cat-util';
  const colors = colorClasses[colorKey] || colorClasses['cat-util'];

  return (
    <Link href={`/category/${category.slug}/`} className="block no-underline group">
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-200',
          colors.bg,
          colors.bgHover,
          colors.border,
          'hover:-translate-y-0.5 hover:shadow-md',
          className
        )}
      >
        <div className={cn('p-4', isCompact && 'p-3')}>
          {/* Icon & Count */}
          <div className="flex items-start justify-between mb-3">
            <span className={cn('text-3xl', isCompact && 'text-2xl')}>
              {category.icon}
            </span>
            <span
              className={cn(
                'text-sm font-medium px-2 py-0.5 rounded-full',
                colors.bg,
                colors.text
              )}
            >
              {category.count}
            </span>
          </div>

          {/* Name */}
          <h3
            className={cn(
              'font-semibold text-gray-900 dark:text-gray-100 mb-1',
              'group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors',
              isCompact ? 'text-base' : 'text-lg'
            )}
          >
            {category.name}
          </h3>

          {/* Description */}
          {!isCompact && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {category.description}
            </p>
          )}

          {/* Arrow */}
          <div className="flex items-center text-sm font-medium group">
            <span className={cn('transition-colors', colors.text)}>
              Browse templates
            </span>
            <ArrowRight
              className={cn(
                'w-4 h-4 ml-1 transition-transform group-hover:translate-x-1',
                colors.text
              )}
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Grid of category cards
interface CategoryGridProps {
  categories: Category[];
  variant?: 'default' | 'compact';
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function CategoryGrid({
  categories,
  variant = 'default',
  columns = 4,
  className,
}: CategoryGridProps) {
  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)}>
      {categories.map((category) => (
        <CategoryCard
          key={category.slug}
          category={category}
          variant={variant}
        />
      ))}
    </div>
  );
}
