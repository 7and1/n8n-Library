'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from 'use-debounce';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
  redirectOnSearch?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-9 text-sm pl-9 pr-8',
  md: 'h-11 text-base pl-11 pr-10',
  lg: 'h-14 text-lg pl-14 pr-12',
};

const iconSizes = {
  sm: 'w-4 h-4 left-2.5',
  md: 'w-5 h-5 left-3.5',
  lg: 'w-6 h-6 left-4',
};

export function SearchBar({
  initialQuery = '',
  placeholder = 'Search 2,348+ n8n workflow templates...',
  size = 'md',
  autoFocus = false,
  onSearch,
  redirectOnSearch = true,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search callback
  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (onSearch) {
      onSearch(value);
    }
    setIsSearching(false);
  }, 300);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setIsSearching(true);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        if (redirectOnSearch) {
          router.push(`/search/?q=${encodeURIComponent(query.trim())}`);
        } else if (onSearch) {
          onSearch(query.trim());
        }
      }
    },
    [query, router, redirectOnSearch, onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative">
        {/* Search icon */}
        <Search
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none',
            iconSizes[size]
          )}
        />

        {/* Input */}
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'rounded-xl border-gray-200 dark:border-gray-700',
            'focus:border-brand-500 focus:ring-brand-500',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            sizeClasses[size]
          )}
        />

        {/* Clear button / Loading indicator */}
        {query && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isSearching ? (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
                onClick={handleClear}
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        )}

        {/* Keyboard shortcut hint */}
        {!query && size !== 'sm' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        )}
      </div>
    </form>
  );
}
