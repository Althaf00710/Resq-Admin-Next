'use client';

import React, { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { Icon } from '@iconify/react';

import type { EmergencyCategory } from '@/graphql/types/emergencyCategory';

interface EmergencySelectProps {
  statusId: string;
  options: EmergencyCategory[];
  loading: boolean;
  onOpen: (statusId: string) => void;
  onAdd: (statusId: string, categoryId: string) => void;
  label?: string;
}

export const EmergencySelect: React.FC<EmergencySelectProps> = ({
  statusId,
  options,
  loading,
  onOpen,
  onAdd,
  label = '+ Add Category',
}) => {
  const [selected, setSelected] = useState<EmergencyCategory | undefined>(undefined);
  const [hasOpened, setHasOpened] = useState(false);

  return (
    <Listbox
      value={selected}
      onChange={(cat) => {
        setSelected(undefined);
        onAdd(statusId, cat.id);
      }}
    >
      <div className="relative inline-block text-left">
        <Listbox.Button
          onClick={() => {
            if (!hasOpened) {
              onOpen(statusId);
              setHasOpened(true);
            }
          }}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-2xl text-sm hover:bg-blue-200 transition-colors cursor-pointer"
        >
          {label}
        </Listbox.Button>

        <Listbox.Options className="absolute mt-1 w-48 bg-gray-50/40 border border-gray-400 shadow-2xl rounded-xl z-10 max-h-60 overflow-auto backdrop-blur-lg">
          {loading && <div className="p-2 text-sm">Loading...</div>}

          {!loading && options.length === 0 && (
            <div className="p-2 text-sm text-gray-500">No categories</div>
          )}

          {!loading &&
            options.map((cat) => (
              <Listbox.Option
                key={cat.id}
                value={cat}
                className={({ active }) =>
                  `flex items-center gap-2 p-2 cursor-pointer ${
                    active ? 'bg-gray-300/50 backdrop-blur-md' : ''
                  }`
                }
              >
                <Icon icon={cat.icon} className="w-4 h-4" />
                <span className="text-sm">{cat.name}</span>
              </Listbox.Option>
            ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};
