"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("username");

    if (!token) {
      router.push("/login");
      return;
    }

    setUsername(storedName);
  }, []);

  if (!username) return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-semibold text-center">Hi, {username}!</h1>
        <p className="text-center mt-2 text-gray-600">
          Welcome to your dashboard
        </p>
      </div>
    </div>
  );
}
