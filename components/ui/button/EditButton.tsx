'use client';

import { Pencil } from 'lucide-react';
import React from 'react';

interface EditButtonProps {
  onClick?: () => void;
  label?: string;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, label = 'Edit' }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
    >
      <Pencil className="w-4 h-4" />
      {label}
    </button>
  );
};

export default EditButton;
