'use client';

import { Trash2 } from 'lucide-react';
import React from 'react';

interface DeleteButtonProps {
  onClick?: () => void;
  label?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, label = 'Delete' }) => {
  const baseClass =
    'inline-flex items-center transition cursor-pointer rounded-full focus:outline-none';

  const withLabelClass =
    'gap-1 px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700';

  const iconOnlyClass =
    'p-2 text-white bg-red-600 hover:bg-red-700';

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${label ? withLabelClass : iconOnlyClass}`}
      title={!label ? 'Delete' : undefined}
    >
      <Trash2 className="w-4 h-4" />
      {label && <span>{label}</span>}
    </button>
  );
};

export default DeleteButton;
