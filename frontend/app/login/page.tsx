"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // If already logged in, redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.toLowerCase().trim(),
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Login failed");
      } else {
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", result.user.name);

        window.dispatchEvent(new Event("auth-change"));

        router.push("/dashboard");
      }
    } catch (err) {
      setServerError("Could not reach server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-semibold text-center mb-6">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="name@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-red-600 text-center">{serverError}</p>
          )}

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
