'use client';

import { Listbox } from '@headlessui/react';
import { Check } from 'lucide-react';
import React from 'react';

export interface Option {
  label: string;
  value: string;
  color: string;
}

interface ColoredSelectProps {
  label: string; // Used inside options, not outside
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const ColoredSelect: React.FC<ColoredSelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
}) => {
  const selected = options.find((opt) => opt.value === value);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative w-full">
        <Listbox.Button className="w-full px-4 py-3 text-left rounded-full border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-900 text-sm text-gray-800 dark:text-white">
          {selected ? (
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${selected.color}`} />
              <span>{selected.label}</span>
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </Listbox.Button>

        <Listbox.Options className="absolute z-100 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-gray-100 dark:bg-neutral-800 py-1 text-sm shadow-lg ring-1 ring-gray-400 ring-opacity-5 focus:outline-none">
          {/* Label as a disabled option */}
          <div className="px-4 py-2 text-gray-400 text-xs uppercase tracking-wide">
            {label}
          </div>

          {options.map((opt) => (
            <Listbox.Option
              key={opt.value}
              value={opt.value}
              className={({ active }) =>
                `cursor-pointer select-none px-4 py-2 flex items-center gap-2 ${
                  active ? 'bg-gray-300 dark:bg-neutral-700' : ''
                }`
              }
            >
              <span className={`w-3 h-3 rounded-full ${opt.color}`} />
              <span>{opt.label}</span>
              {opt.value === value && (
                <Check className="ml-auto h-4 w-4 text-blue-700" />
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default ColoredSelect;
