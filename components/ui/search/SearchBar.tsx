'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', onSearch, defaultValue = '' }) => {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm w-full max-w-md">
      <Search className="w-5 h-5 text-gray-500" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-grow outline-none text-sm bg-transparent"
      />
      <button
        type="submit"
        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
