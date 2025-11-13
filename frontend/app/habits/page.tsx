"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Habit {
  id: string;
  title: string;
  description?: string;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    api.get("/habits").then((res) => setHabits(res.data));
  }, []);

  return (
    <div className="p-6 grid gap-4 md:grid-cols-3">
      {habits.map((h) => (
        <Card key={h.id} className="p-4">
          <h2 className="font-semibold text-lg">{h.title}</h2>
          <p className="text-gray-500">{h.description}</p>
        </Card>
      ))}
      <Button>Add Habit</Button>
    </div>
  );
}