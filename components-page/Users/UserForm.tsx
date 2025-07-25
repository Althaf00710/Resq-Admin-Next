'use client';

import React, { useState, useEffect } from 'react';
import ValidatedInput from '@/components/ui/input/ValidatedInput';
import { Mail, User as UserIcon, Lock, ImagePlus, X } from 'lucide-react';
import { CreateUserVars, UpdateUserVars } from '@/graphql/types/user';
import { useLazyQuery } from '@apollo/client';
import { CHECK_EMAIL, CHECK_USERNAME } from '@/graphql/queries/userQueries';

interface InitialData {
  id?: string;
  email?: string;
  name?: string;
  username?: string;
  profilePicturePath?: string;
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserVars | UpdateUserVars) => void;
  initialData?: InitialData;
}

const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  // form state
  const [formData, setFormData] = useState<CreateUserVars['input']>({
    email: initialData?.email || '',
    name: initialData?.name || '',
    username: initialData?.username || '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [pictureDeleted, setPictureDeleted] = useState(false);
  const [checkUsername, { data: usernameData }] = useLazyQuery(CHECK_USERNAME);
  const [checkEmail, { data: emailData }] = useLazyQuery(CHECK_EMAIL);


  // initialize on open / initialData change
  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || '',
        name: initialData.name || '',
        username: initialData.username || '',
        password: '',
      });
      setConfirmPassword('');
      setPictureDeleted(false);

      if (initialData.profilePicturePath) {
        setPreviewUrl(
          `${process.env.NEXT_PUBLIC_SERVER_URL}${initialData.profilePicturePath}`
        );
      } else {
        setPreviewUrl(undefined);
      }
    } else {
      setFormData({ email: '', name: '', username: '', password: '' });
      setConfirmPassword('');
      setPreviewUrl(undefined);
      setPictureDeleted(false);
    }
  }, [initialData]);

  // when user picks a new file, override preview
  useEffect(() => {
    if (profilePicture) {
      setPreviewUrl(URL.createObjectURL(profilePicture));
      setPictureDeleted(false);
    }
  }, [profilePicture]);

  const isPasswordMatch =
    formData.password && confirmPassword
      ? formData.password === confirmPassword
      : null;
  const isValidEmail = /\S+@\S+\.\S+/.test(formData.email);

  const handleInputChange = (
    field: keyof CreateUserVars['input'],
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'username' && value.length > 0) {
      checkUsername({ variables: { username: value } });
    }
    if (field === 'email' && /\S+@\S+\.\S+/.test(value)) {
      checkEmail({ variables: { email: value } });
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // basic validation
    if (!formData.email || !formData.name || !formData.username) return;
    if (formData.password !== confirmPassword) return;

    if (initialData?.id) {
      // update path
      const updateData: UpdateUserVars = {
        id: initialData.id,
        input: {
          ...formData,
          pictureDeleted,
        },
        profilePicture,
      };
      onSubmit(updateData);
    } else {
      // create path
      const createData: CreateUserVars = {
        input: formData,
        profilePicture,
      };
      onSubmit(createData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl mb-2 text-center">
          {initialData ? 'Update User' : 'Create User'}
        </h2>

        {/* Profile picture preview + delete / upload */}
        <div className="flex flex-col items-center space-y-3">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(undefined);
                  setProfilePicture(undefined);
                  setPictureDeleted(true);
                }}
                className="absolute top-0 right-0 m-1 p-1 bg-gray-300 rounded-full opacity-70 hover:opacity-100 transition cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileChange}
                hidden
              />
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 w-full hover:border-blue-500">
                <ImagePlus className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-500">
                  {initialData
                    ? 'Change profile picture'
                    : 'Click to upload profile picture'}
                </p>
              </div>
            </label>
          )}
        </div>

        {/* Input fields */}
        <div className="space-y-4">
          <ValidatedInput
            label="Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            LeftIcon={<UserIcon className="w-5 h-5 text-muted-foreground" />}
            required
          />
          <ValidatedInput
            label="Username"
            value={formData.username}
            onChange={(e) =>
              handleInputChange('username', e.target.value)
            }
            isValid={usernameData?.checkUsername === false}
            LeftIcon={<UserIcon className="w-5 h-5 text-muted-foreground" />}
            required
          />
          <ValidatedInput
            label="Email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            isValid={emailData?.checkEmail === false}
            LeftIcon={<Mail className="w-5 h-5 text-muted-foreground" />}
            type="email"
            required
          />
          <ValidatedInput
            label="Password"
            value={formData.password}
            onChange={(e) =>
              handleInputChange('password', e.target.value)
            }
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
            className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !isValidEmail ||
              isPasswordMatch === false ||
              !formData.name ||
              !formData.username
            }
            className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
