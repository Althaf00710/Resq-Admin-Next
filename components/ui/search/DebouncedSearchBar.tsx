'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import FloatingInput from '@/components/ui/input/FloatingInput'; 

interface DebouncedSearchBarProps {
  onSearch: (query: string) => void;
  delay?: number;
  placeholder?: string;
}

const DebouncedSearchBar: React.FC<DebouncedSearchBarProps> = ({
  onSearch,
  delay = 500,
  placeholder = 'Search...',
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
      <FloatingInput
        label={placeholder}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
};

export default DebouncedSearchBar;
