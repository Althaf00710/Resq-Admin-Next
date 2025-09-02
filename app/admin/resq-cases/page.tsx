'use client'
import RequestsTable from '@/components-page/resq-cases/CaseTable';
import DebouncedSearchBar from '@/components/ui/search/DebouncedSearchBar';
import React, { useState } from 'react';

export default function Page() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 p-2">
      <div className="grid grid-cols-3 items-center">
        <h1 className="text-xl font-semibold">Emergency Categories</h1>
        <div className="justify-self-center w-full max-w-md">
          <DebouncedSearchBar
            placeholder="Search by Request ID…"
            onSearch={setSearch}
            delay={400}
          />
        </div>
      </div>
      <RequestsTable searchQuery={search} />
    </div>
  );
}
