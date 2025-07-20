'use client';

import { Plus } from 'lucide-react';
import React from 'react';

interface AddButtonProps {
  onClick?: () => void;
  label?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, label = 'Add' }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
};

export default AddButton;
