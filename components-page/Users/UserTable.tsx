'use client';

import React from 'react';
import { User } from '@/graphql/types/user'; 
import Image from 'next/image';
import EditButton from '@/components/ui/button/EditButton'; 
import DeleteButton from '@/components/ui/button/DeleteButton';

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3">Profile</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Username</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Last Active</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={user.profilePicturePath || '/defaultProfile.png'}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              </td>
              <td className="px-4 py-2 font-medium">{user.name}</td>
              <td className="px-4 py-2 text-gray-600">@{user.username}</td>
              <td className="px-4 py-2 text-gray-600">{user.email}</td>
              <td className="px-4 py-2 text-gray-600">
                {new Date(user.joinedDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-gray-600">
                {new Date(user.lastActive).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <EditButton
                    onClick={() => onEdit?.(user)}
                  />
                  <DeleteButton
                    onClick={() => onDelete?.(user)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
