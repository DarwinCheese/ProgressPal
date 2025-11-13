"use client";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between p-4 bg-white border-b shadow-sm">
      <h1 className="font-bold text-xl">ProgressPal</h1>
      <Button variant="outline">Login</Button>
    </nav>
  );
}