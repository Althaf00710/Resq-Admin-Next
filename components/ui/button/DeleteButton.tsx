'use client';

import { Trash2 } from 'lucide-react';
import React from 'react';

interface DeleteButtonProps {
  onClick?: () => void;
  label?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, label = 'Delete' }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-red-600 rounded-full hover:bg-red-700 transition cursor-pointer"
    >
      <Trash2 className="w-4 h-4" />
      {label}
    </button>
  );
};

export default DeleteButton;
