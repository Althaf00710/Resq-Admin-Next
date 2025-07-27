'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import FloatingInput from '@/components/ui/input/FloatingInput';
import ColoredSelect, { Option } from '@/components/ui/select/ColoredSelect';

interface SearchWithFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (value: string) => void;
  selectOptions: Option[];
  selectedFilter: string;
  placeholder?: string;
  delay?: number;
  selectLabel: string;
}

const SearchWithFilter: React.FC<SearchWithFilterProps> = ({
  onSearch,
  onFilterChange,
  selectOptions,
  selectedFilter,
  placeholder = 'Search...',
  delay = 500,
  selectLabel,
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
    <div className="relative w-full max-w-2xl">
      {/* Search icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />

      {/* Input field with right padding */}
      <FloatingInput
        label={placeholder}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-60" 
      />

      {/* Select inside the input container, positioned right */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-48">
        <ColoredSelect
          label={selectLabel}
          value={selectedFilter}
          onChange={onFilterChange}
          options={selectOptions}
        />
      </div>
    </div>
  );
};

export default SearchWithFilter;
