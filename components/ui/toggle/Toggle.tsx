'use client';

import React from 'react';

interface ToggleSwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const ToggleSwitch = React.forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ label = '', className = '', ...props }, ref) => {
    return (
      <label className={`inline-flex items-center cursor-pointer ${className}`}>
        {/* Visually‑hidden checkbox */}
        <input
          ref={ref}
          type="checkbox"
          className="sr-only peer"
          {...props}
        />

        {/* Slider */}
        <div
          className="
            relative w-11 h-6 rounded-full
            bg-gray-200 peer-checked:bg-blue-600 dark:bg-gray-700
            peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800
            after:content-[''] after:absolute after:top-[2px] after:start-[2px]
            after:h-5 after:w-5 after:rounded-full after:bg-white after:border after:border-gray-300
            after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
            peer-checked:after:border-white dark:border-gray-600
          "
        />

        {/* Label text */}
        {label && (
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {label}
          </span>
        )}
      </label>
    );
  }
);

ToggleSwitch.displayName = 'ToggleSwitch';

export default ToggleSwitch;
