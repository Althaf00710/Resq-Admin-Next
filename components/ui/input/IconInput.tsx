'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import FloatingInput from './FloatingInput';
import { Star } from 'lucide-react';

interface IconInputPreviewProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  debounceDelay?: number;
}

const IconInput: React.FC<IconInputPreviewProps> = ({
  label,
  value,
  onChange,
  debounceDelay = 300,
  className = '',
  ...props
}) => {
  const [previewIcon, setPreviewIcon] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewIcon(value);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [value, debounceDelay]);

  return (
    <div className="relative w-full">
      {/* Left Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <Star className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Right Live Iconify Preview */}
      {previewIcon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <Icon icon={previewIcon} className="w-10 h-10 text-gray-700 dark:text-white" />
        </div>
      )}

      <FloatingInput
        label={label}
        value={value}
        onChange={onChange}
        className={`pl-10 pr-10 ${className}`}
        {...props}
      />
    </div>
  );
};

export default IconInput;
