'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import DebouncedSearchBar from '@/components/ui/search/DebouncedSearchBar';
import AddButton from '@/components/ui/button/AddButton';
import UserTable from '@/components-page/Users/UserTable';
import UserForm from '@/components-page/Users/UserForm';
import GooLoader from '@/components/ui/Loader';
import {
  CreateUserVars,
  UpdateUserVars,
  User,
} from '@/graphql/types/user';
import { GET_ALL_USERS } from '@/graphql/queries/userQueries';
import {
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
} from '@/graphql/mutations/userMutations';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS);
  const users = data?.users || [];

  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const filteredUsers = users.filter((u:User) =>
    [u.name, u.username, u.email]
      .some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleAdd = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleDelete = async (user: User) => {
    try {
      await deleteUser({ variables: { id: parseInt(user.id, 10) } });
      await refetch();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleFormSubmit = async (
    data: CreateUserVars | UpdateUserVars
  ) => {
    try {
      if ('id' in data) {
        // Update existing
        await updateUser({
          variables: {
            id: parseInt(data.id, 10),
            input: data.input,
            profilePicture: data.profilePicture ?? null,
          },
        });
      } else {
        // Create new
        await createUser({
          variables: {
            input: data.input,
            profilePicture: data.profilePicture ?? null,
          },
        });
      }

      await refetch();
      setFormOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to submit form:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-semibold text-gray-700">Users</h1>
        <div className="flex-1 max-w-md mx-auto sm:mx-0">
          <DebouncedSearchBar
            onSearch={setSearchTerm}
            placeholder="Search Users"
          />
        </div>
        <AddButton onClick={handleAdd} />
      </div>

      {/* Loading / Error */}
      {loading && <GooLoader />}
      {error && (
        <p className="text-red-500">Error fetching users.</p>
      )}

      {/* Table */}
      {!loading && !error && (
        <UserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal Form */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={
          editingUser
            ? {
                id: editingUser.id,
                name: editingUser.name,
                username: editingUser.username,
                email: editingUser.email,
                profilePicturePath:
                  editingUser.profilePicturePath || undefined,
              }
            : undefined
        }
      />
    </div>
  );
}
