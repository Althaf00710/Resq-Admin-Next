'use client';

import { Plus } from 'lucide-react';
import React from 'react';

interface AddButtonProps {
  onClick?: () => void;
  label?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, label = 'Add' }) => {
  const baseClass =
    `inline-flex items-center cursor-pointer gap-2 rounded-full transition bg-blue-700 text-white 
    hover:bg-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;

  const withLabelClass = 'px-4 py-2';
  const iconOnlyClass = 'p-1.5';

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${label ? withLabelClass : iconOnlyClass}`}
      title={!label ? 'Add' : undefined} // tooltip for icon-only button
    >
      <Plus className="w-5 h-5" />
      {label && <span>{label}</span>}
    </button>
  );
};

export default AddButton;
