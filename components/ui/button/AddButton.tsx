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
      className="inline-flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <Plus className="w-5 h-5" />
      {label}
    </button>
  );
};

export default AddButton;
