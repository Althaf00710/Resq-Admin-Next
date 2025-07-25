'use client';

import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '@/graphql/queries/userQueries';
import { User } from '@/graphql/types/user';
import GooLoader from '@/components/ui/Loader';

export default function UserList() {
  const { data, loading, error } = useQuery(GET_ALL_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <GooLoader/>
  );
}
