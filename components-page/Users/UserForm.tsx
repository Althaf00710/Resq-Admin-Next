'use client';

import React, { useState } from 'react';
import ValidatedInput from '@/components/ui/input/ValidatedInput';
import { Mail, User, Lock, ImagePlus } from 'lucide-react';
import { CreateUserVars } from '@/graphql/types/user';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserVars) => void;
  initialData?: Partial<CreateUserVars['input']>;
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<CreateUserVars['input']>({
    email: initialData?.email || '',
    name: initialData?.name || '',
    username: initialData?.username || '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | undefined>();

  const isPasswordMatch = formData.password && confirmPassword
    ? formData.password === confirmPassword
    : null;

  const isValidEmail = /\S+@\S+\.\S+/.test(formData.email);

  const handleInputChange = (field: keyof CreateUserVars['input'], value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!formData.email || !formData.name || !formData.username || !formData.password) return;
    if (formData.password !== confirmPassword) return;
    onSubmit({ input: formData, profilePicture });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold mb-2 text-center">
          {initialData ? 'Update User' : 'Create User'}
        </h2>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center space-y-3">
        {profilePicture ? (
            <>
            <img
                src={URL.createObjectURL(profilePicture)}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border"
            />
            <label className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm">
                <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicture}
                hidden
                />
                Change Picture
            </label>
            </>
        ) : (
            <label className="cursor-pointer w-full">
            <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicture}
                hidden
            />
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 w-full hover:border-blue-500">
                <ImagePlus className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-500">Click to upload profile picture</p>
            </div>
            </label>
        )}
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <ValidatedInput
            label="Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            LeftIcon={<User className="w-5 h-5 text-muted-foreground" />}
            required
          />

          <ValidatedInput
            label="Username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            isValid={formData.username.length > 2}
            LeftIcon={<User className="w-5 h-5 text-muted-foreground" />}
            required
          />

          <ValidatedInput
            label="Email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            isValid={isValidEmail}
            LeftIcon={<Mail className="w-5 h-5 text-muted-foreground" />}
            type="email"
            required
          />

          <ValidatedInput
            label="Password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            LeftIcon={<Lock className="w-5 h-5 text-muted-foreground" />}
            type="password"
            required
          />

          <ValidatedInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isValid={isPasswordMatch}
            LeftIcon={<Lock className="w-5 h-5 text-muted-foreground" />}
            type="password"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValidEmail || !isPasswordMatch}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
