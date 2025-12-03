"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Registration failed");
      } else {
        setSuccess(true);
        router.push("/login");
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
        <h1 className="text-3xl font-semibold text-center mb-6">
          Create Account
        </h1>

        {success ? (
          <p className="text-green-600 text-center font-medium">
            🎉 Account created! You can now log in.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                {...register("name")}
                placeholder="Your name"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-red-600 text-center">{serverError}</p>
            )}

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </button>
            <p className="text-center mt-4 text-gray-600">
              Already got an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Log in
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
