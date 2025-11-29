"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Habit {
  id: string;
  title: string;
  description?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("username");

    if (!token) {
      router.push("/login");
      return;
    }

    setUsername(storedName);
    setLoading(false);
  }, [router]);

  // Load habits once user exists
  useEffect(() => {
    if (!username) return;

    api.get("/habits").then((res) => setHabits(res.data));
  }, [username]);

  const addHabit = async () => {
    const res = await api.post("/habits", {
      title,
      description: desc,
    });

    setHabits((prev) => [...prev, res.data]);
    setShowModal(false);
    setTitle("");
    setDesc("");
  };

  const deleteHabit = async (id: string) => {
    try {
      await api.delete(`/habits/${id}`);

      setHabits((prev) => prev.filter((habit) => habit.id !== id));
    } catch (err) {
      console.log("Delete failed", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 gap-6 p-8">
      {/* Greeting Card */}
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold">Hi, {username}!</h1>
        <p className="mt-2 text-gray-600">Welcome to your dashboard</p>
      </div>

      {/* Habit List */}
      {habits.map((h) => (
        <Card key={h.id} className="relative p-4 w-full max-w-md">
          {/* Delete button top right */}
          <button
            onClick={() => deleteHabit(h.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
          >
            ✕
          </button>

          <h2 className="font-semibold text-lg break-all">{h.title}</h2>
          <p className="text-gray-500 break-all">{h.description}</p>
        </Card>
      ))}

      {/* Add Habit Button */}
      <Button size="lg" onClick={() => setShowModal(true)}>
        Add your habit
      </Button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">New Habit</h2>

            {/* Title */}
            <input
              className={`border w-full p-2 rounded mb-1 ${
                title.length > 50 ? "border-red-500" : ""
              }`}
              placeholder="Habit title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {title.length > 50 && (
              <p className="text-red-500 text-sm">
                Title cannot exceed 50 characters
              </p>
            )}

            {/* Description */}
            <textarea
              className={`border w-full p-2 rounded mb-1 ${
                desc.length > 200 ? "border-red-500" : ""
              }`}
              placeholder="Description (optional)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            {desc.length > 200 && (
              <p className="text-red-500 text-sm">
                Description cannot exceed 200 characters
              </p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={addHabit}
                disabled={
                  title.length === 0 || title.length > 50 || desc.length > 200
                }
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
