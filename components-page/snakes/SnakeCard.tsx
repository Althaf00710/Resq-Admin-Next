'use client';

import React from 'react';
import Image from 'next/image';
import { Snake } from '@/graphql/types/snake';
import EditButton from '@/components/ui/button/EditButton';
import DeleteButton from '@/components/ui/button/DeleteButton';

interface SnakeCardProps {
  snake: Snake;
  onEdit: (snake: Snake) => void;
  onDelete: (snake: Snake) => void;
}

const venomColorMap: Record<string, string> = {
  neurotoxic: 'bg-blue-600 dark:bg-blue-500',
  hemotoxic: 'bg-red-600 dark:bg-red-500',
  cytotoxic: 'bg-yellow-500 dark:bg-yellow-400 text-black',
  'non-venomous': 'bg-green-600 dark:bg-green-500',
};

const SnakeCard: React.FC<SnakeCardProps> = ({ snake, onEdit, onDelete }) => {
  const venomClass =
    venomColorMap[snake.venomType.toLowerCase()] || 'bg-gray-600 dark:bg-gray-500';

  return (
    <div className="bg-gray-200 dark:bg-neutral-900 rounded-xl overflow-hidden shadow-lg">
      {/* Image Section */}
      <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
        <Image
          src={process.env.NEXT_PUBLIC_SERVER_URL+snake.imageUrl}
          alt={snake.name}
          fill
          className="object-cover"
        />
        <span
          className={`absolute top-2 right-2 text-white text-xs font-semibold px-2 py-1 rounded-full ${venomClass}`}
        >
          {snake.venomType}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-0">
          {snake.name}
        </h2>
        <h3 className="text-sm text-gray-500 dark:text-gray-400 mt-0 italic">
          {snake.scientificName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {snake.description.length > 100
            ? snake.description.slice(0, 100) + '...'
            : snake.description}
        </p>
        <hr className="my-2 border-t border-gray-300 dark:border-neutral-700" />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-1">
          <EditButton onClick={() => onEdit(snake)} />
          <DeleteButton onClick={() => onDelete(snake)} />
        </div>
      </div>
    </div>
  );
};

export default SnakeCard;
