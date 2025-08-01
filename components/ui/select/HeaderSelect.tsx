// components/ui/select/HeaderSelect.tsx
'use client';

import React from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

export interface HeaderOption {
  value: string;
  label: string;
  colorClass: string;
}

interface HeaderSelectProps {
  options: HeaderOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  buttonLabel?: string;
}

export default function HeaderSelect({
  options,
  selectedValue,
  onChange,
  buttonLabel = 'Status',
}: HeaderSelectProps) {
  const current = options.find((o) => o.value === selectedValue) ?? options[0];

  return (
    <Listbox value={current.value} onChange={onChange}>
      <div className="relative inline-block text-left">
        {/* Glassy button */}
        <Listbox.Button
          className="
            inline-flex items-center gap-1 px-3 py-1 rounded-full
            bg-white/20 backdrop-blur-md border border-white/30
            text-gray-800 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer
          "
        >
          <span className={`w-2 h-2 rounded-full mr-2 ${current.colorClass}`} />
          <span className="font-semibold mr-1">{buttonLabel}</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </Listbox.Button>

        {/* Glassy dropdown panel */}
        <Listbox.Options
          className="
            absolute mt-1 w-32
            bg-white/20 backdrop-blur-md border border-white/30 rounded-lg
            shadow-lg text-sm text-gray-800 z-50 max-h-48 overflow-auto
          "
        >
          {options.map((opt) => (
            <Listbox.Option
              key={opt.value}
              value={opt.value}
              className={({ active }) =>
                `flex items-center gap-2 px-3 py-2 cursor-pointer ${
                  active ? 'bg-white/30' : ''
                }`
              }
            >
              <span className={`w-2 h-2 rounded-full ${opt.colorClass}`} />
              <span className="font-medium">{opt.label}</span>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
