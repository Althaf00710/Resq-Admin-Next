'use client';

import { Pencil } from 'lucide-react';
import React from 'react';

interface EditButtonProps {
  onClick?: () => void;
  label?: string;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, label = 'Edit' }) => {
  const baseClass =
    'inline-flex items-center transition cursor-pointer rounded-full focus:outline-none';

  const withLabelClass =
    'gap-1 px-3 py-1.5 text-sm border border-gray-300 bg-white hover:bg-gray-50';

  const iconOnlyClass =
    'p-2 border border-gray-300 bg-white hover:bg-gray-100';

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${label ? withLabelClass : iconOnlyClass}`}
      title={!label ? 'Edit' : undefined}
    >
      <Pencil className="w-4 h-4" />
      {label && <span>{label}</span>}
    </button>
  );
};

export default EditButton;
