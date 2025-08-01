'use client';

import { MapPin } from 'lucide-react';
import React from 'react';

interface LocationProps {
  onClick?: () => void;
  label?: string;
}

const LocationButton: React.FC<LocationProps> = ({ onClick, label = 'Location' }) => {
  const baseClass =
    'inline-flex items-center transition cursor-pointer rounded-full focus:outline-none bg-orange-500 hover:bg-orange-600 text-white';

  const withLabelClass =
    'gap-1 px-3 py-1.5 text-sm';

  const iconOnlyClass =
    'p-2';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClass} ${label ? withLabelClass : iconOnlyClass}`}
      title='Location'
    >
      <MapPin className="w-4 h-4" />
      {label && <span>{label}</span>}
    </button>
  );
};

export default LocationButton;
