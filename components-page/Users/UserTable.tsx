'use client';

import React from 'react';
import { User } from '@/graphql/types/user';
import Image from 'next/image';
import EditButton from '@/components/ui/button/EditButton';
import DeleteButton from '@/components/ui/button/DeleteButton';
import { ChevronDown } from 'lucide-react';

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onStatusChange?: (status: 'Online' | 'Offline') => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, onStatusChange }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-300 text-left text-gray-800">
          <tr>
            <th className="px-4 py-3 font-semibold">Profile</th>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Username</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Joined Date</th>
            <th className="px-4 py-3 text-left">
              <div className="inline-flex items-center relative group cursor-pointer">
                <span className=" font-semibold">Active</span>
                <ChevronDown className="ml-1 w-4 h-4 text-gray-800" />
                <div className="p-1 absolute top-full left-1/2 transform -translate-x-1/2 hidden group-hover:block z-50 bg-white border border-gray-200 rounded-lg shadow-lg text-sm">
                  <button
                    type="button"
                    className="flex items-center w-full text-left py-1 px-4 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => onStatusChange?.('Online')}
                  >
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <span className="font-light text-sm">Online</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center w-full text-left py-1 px-4 mt-1 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => onStatusChange?.('Offline')}
                  >
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2" />
                    <span className="font-light text-sm">Offline</span>
                  </button>
                </div>
              </div>
            </th>
            <th className="px-4 py-3 text-center font-semibold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="bg-gray-50 hover:bg-gray-100">
              <td className="px-4 py-2">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={
                      user.profilePicturePath
                        ? `${process.env.NEXT_PUBLIC_SERVER_URL}${user.profilePicturePath}`
                        : '/defaultProfile.png'
                    }
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
                {user.lastActive === 'Online' ? (
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <span className='font-medium'>Online</span>
                  </div>
                ) : user.lastActive === 'Offline' ? (
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2" />
                    <span className='font-medium'>Offline</span>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2" />
                      <span className='font-medium'>Offline</span>
                    </div>
                    <span className="ml-4 text-sm text-gray-500">
                      {new Date(user.lastActive).toLocaleString()}
                    </span>
                  </div>
                )}
              </td>

              <td className="px-4 py-2">
                <div className="flex gap-2 items-center justify-center">
                  <EditButton onClick={() => onEdit?.(user)} />
                  <DeleteButton onClick={() => onDelete?.(user)} />
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
