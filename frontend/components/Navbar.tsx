"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const updateAuth = () => {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("username");
      setUsername(token && name ? name : null);
    };

    updateAuth();

    window.addEventListener("auth-change", updateAuth);

    return () => {
      window.removeEventListener("auth-change", updateAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    window.dispatchEvent(new Event("auth-change"));

    router.push("/login");
  };

  return (
    <nav className="w-full flex items-center justify-between p-4 bg-white border-b shadow-sm">
      <h1 className="font-bold text-xl">ProgressPal</h1>

      {username ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{username}</span>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={() => router.push("/login")}>
          Login
        </Button>
      )}
    </nav>
  );
}
