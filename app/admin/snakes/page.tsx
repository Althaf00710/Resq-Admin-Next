'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import DebouncedSearchBar from '@/components/ui/search/DebouncedSearchBar';
import AddButton from '@/components/ui/button/AddButton';
import SnakeCard from '@/components-page/snakes/SnakeCard';
import SnakeForm from '@/components-page/snakes/SnakeForm';
import GooLoader from '@/components/ui/Loader';
import ColoredSelect, { Option } from '@/components/ui/button/ColoredSelect';

import {
  CreateSnakeVars,
  UpdateSnakeVars,
  Snake,
} from '@/graphql/types/snake';
import { GET_ALL_SNAKES } from '@/graphql/queries/snakeQueries';
import {
  CREATE_SNAKE,
  UPDATE_SNAKE,
  DELETE_SNAKE,
} from '@/graphql/mutations/snakeMutations';

export default function SnakePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingSnake, setEditingSnake] = useState<Snake | null>(null);
  const [venomFilter, setVenomFilter] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_ALL_SNAKES);
  const [createSnake] = useMutation(CREATE_SNAKE);
  const [updateSnake] = useMutation(UPDATE_SNAKE);
  const [deleteSnake] = useMutation(DELETE_SNAKE);

  const snakes: Snake[] = data?.snakes || [];

  const venomOptions: Option[] = [
    { label: 'All', value: '', color: 'bg-gray-400' },
    { label: 'Neurotoxic', value: 'neurotoxic', color: 'bg-blue-500' },
    { label: 'Hemotoxic', value: 'hemotoxic', color: 'bg-red-500' },
    { label: 'Cytotoxic', value: 'cytotoxic', color: 'bg-yellow-400 text-black' },
    { label: 'Non-Venomous', value: 'non-venomous', color: 'bg-green-500' },
];

  const filteredSnakes = snakes.filter((s) => {
    const matchesSearch = [s.name, s.scientificName, s.venomType]
        .some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const matchesVenom = venomFilter
        ? s.venomType.toLowerCase() === venomFilter.toLowerCase()
        : true;

    return matchesSearch && matchesVenom;
  });


  const handleAdd = () => {
    setEditingSnake(null);
    setFormOpen(true);
  };

  const handleEdit = (snake: Snake) => {
    setEditingSnake(snake);
    setFormOpen(true);
  };

  const handleDelete = async (snake: Snake) => {
    try {
      await deleteSnake({ variables: { id: snake.id } });
      await refetch();
    } catch (err) {
      console.error('Failed to delete snake:', err);
    }
  };

  const handleFormSubmit = async (
    data: CreateSnakeVars | UpdateSnakeVars
  ) => {
    try {
      if ('id' in data) {
        await updateSnake({
          variables: {
            id: parseInt(data.id, 10),
            input: data.input,
            image: data.image ?? null,
          },
        });
      } else {
        await createSnake({
          variables: {
            input: data.input,
            image: data.image ?? null,
          },
        });
      }

      await refetch();
      setFormOpen(false);
      setEditingSnake(null);
    } catch (err) {
      console.error('Failed to submit snake form:', err);
    }
  };

  return (
    <div className="p-4 space-y-6">
        {/* Header */}
        <div className="relative flex items-center justify-between mb-4 h-12 w-full">
        {/* Left Placeholder (for structure balance if needed) */}
        <h1 className="text-2xl font-semibold text-gray-700">Snakes</h1>

        {/* Search Bar - centered */} 
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md">
            <DebouncedSearchBar
            onSearch={setSearchTerm}
            placeholder="Search Snakes"
            />
        </div>

        {/* Dropdown - right next to search bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 translate-x-[calc(100%+3rem)] w-48">
            <ColoredSelect
            label="Venom Type"
            value={venomFilter}
            onChange={setVenomFilter}
            options={venomOptions}
            />
        </div>

        {/* Add Button - aligned right */}
        <div className="w-32 flex justify-end">
            <AddButton onClick={handleAdd} />
        </div>
    </div>



      {/* Loading / Error */}
      {loading && <GooLoader />}
      {error && <p className="text-red-500">Error fetching snakes.</p>}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSnakes.map((snake) => (
          <SnakeCard
            key={snake.id}
            snake={snake}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modal Form */}
      <SnakeForm
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSnake || undefined}
      />
    </div>
  );
}
