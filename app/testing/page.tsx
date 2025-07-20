'use client';
import UserTable from "@/components-page/Users/UserTable";

const users: User[] = [];

export default function Page() {
  return (
    <div className="p-6">
      <UserTable users={users} />
    </div>
  );
}