'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '@/graphql/mutations/userMutations';
import { LoginUserData, LoginUserVars } from '@/graphql/types/user';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const router = useRouter();
  const [loginUser, { loading }] = useMutation<LoginUserData, LoginUserVars>(LOGIN_USER);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await loginUser({
        variables: {
          username,
          password,
        },
      });

      if (data?.loginUser.success) {
        // Store user/session info
        localStorage.setItem('token', JSON.stringify(data.loginUser.message));
        router.push('/dashboard');
      } else {
        setMessage(data?.loginUser.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Login error. Try again.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {message && <p className="text-red-600 text-sm">{message}</p>}
      </form>
    </div>
  );
}