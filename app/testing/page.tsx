'use client';

import React, { useState } from 'react';
import SnakeForm from '@/components-page/snakes/SnakeForm';
import SnakeCard from '@/components-page/snakes/SnakeCard';
import {
  Snake,
  CreateSnakeVars,
  UpdateSnakeVars,
} from '@/graphql/types/snake';

export default function SnakeListPage() {
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingSnake, setEditingSnake] = useState<Snake | undefined>();

  const sampleSnake: Snake = {
    id: '1',
    name: 'Russell’s Viper',
    scientificName: 'Daboia russelii',
    venomType: 'Hemotoxic',
    description:
      'A highly venomous snake found in Asia, known for its distinctive chain-like pattern.',
    imageUrl: '/images/russells-viper.jpg', // make sure this image exists in public/images/
  };

  const handleEdit = (snake: Snake) => {
    setEditingSnake(snake);
    setFormOpen(true);
  };

  const handleDelete = (snake: Snake) => {
    alert(`Delete requested for ${snake.name}`);
  };

  const handleSubmit = (data: CreateSnakeVars | UpdateSnakeVars) => {
    console.log('Submitted snake data:', data);
    setFormOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Snake List</h1>

      <SnakeCard snake={sampleSnake} onEdit={handleEdit} onDelete={handleDelete} />

      <SnakeForm
        isOpen={isFormOpen}
        onClose={() => {
          setEditingSnake(undefined);
          setFormOpen(false);
        }}
        onSubmit={handleSubmit}
        initialData={editingSnake}
      />
    </div>
  );
}
