import React from 'react';
import { Icon } from '@iconify/react';
import { X } from 'lucide-react';

import { EmergencyCategory } from '@/graphql/types/emergencyCategory';

interface EmergencyButtonProps {
  category: EmergencyCategory;
  onRemove: (mappingId: string) => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ category, onRemove }) => (
  <div className="inline-flex items-center justify-center space-x-1 px-3 py-1 bg-gray-200 rounded-full hover:shadow-md transition-colors">
    <Icon icon={category.icon} className="w-5 h-5" />
    <span className="text-sm font-medium text-gray-700">{category.name}</span>
    <button
      onClick={() => onRemove(category.id)}
      className="p-1 hover:bg-red-300 rounded-full transition-colors cursor-pointer"
      aria-label={`Remove ${category.name}`}
    >
      <X className="w-3 h-3 text-red-700" />
    </button>
  </div>
);