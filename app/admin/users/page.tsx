'use client';

import React, { useState } from 'react';
import DebouncedSearchBar from '@/components/ui/search/DebouncedSearchBar';
import AddButton from '@/components/ui/button/AddButton';
import UserTable from '@/components-page/Users/UserTable';
import UserForm from '@/components-page/Users/UserForm';
import { CreateUserVars, User } from '@/graphql/types/user';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '@/graphql/queries/userQueries';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const users: User[] = data?.users || [];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleDelete = (user: User) => {
    // You can implement a GraphQL delete mutation here
    console.log("Delete user:", user.id);
  };

  const handleFormSubmit = async (data: { input: CreateUserVars['input'], profilePicture?: File }) => {
    // Implement create/update mutation here
    console.log("Form submitted with data:", data);
    setFormOpen(false);
    setEditingUser(null);
    refetch(); // Refresh the list
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Users</h1>

        <div className="flex-1 max-w-md mx-auto sm:mx-0">
          <DebouncedSearchBar onSearch={setSearchTerm} />
        </div>

        <AddButton onClick={handleAdd} />
      </div>

      {/* Loading/Error */}
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">Error fetching users.</p>}

      {/* Table */}
      {!loading && !error && (
        <UserTable users={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* Modal Form */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingUser ?? undefined}
      />
    </div>
  );
}
