"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Eye, EyeOff } from "lucide-react";

import { authService } from "@/features/auth/services/auth-service";
import { useAuth } from "@/features/auth/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LoginAnimation } from "@/features/auth/components/login-animation";
import { AUTH_MESSAGES, DASHBOARD_ROUTES } from "@/features/auth/constants";


export function LoginForm() {

  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("ems_v2_") || key.startsWith("ems_v3_")) {
          localStorage.removeItem(key);
        }
      });
    }
  }, []);



  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError(AUTH_MESSAGES.REQUIRED_FIELD);

      return;
    }

    try {
      setLoading(true);

      const response = await authService.login({
        email: email.trim(),

        password,
      });

      if (!response.success || !response.user) {

        setError(response.message);

        return;
      }

      login(response.user);
      router.replace(DASHBOARD_ROUTES[response.user.role]);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);

        return;
      }

      setError(AUTH_MESSAGES.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-7xl overflow-hidden rounded-[32px] p-0 shadow-2xl">
        <div className="grid md:grid-cols-2">
          {/* Left Section */}

          <div className="flex flex-col justify-center bg-amber-300 p-10 text-black">
            <div className="mb-10">
              <h1 className="text-4xl font-bold">Welcome Back!</h1>

              <p className="mt-2">Login to Employee Management System</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-blue-950">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  className="border-white placeholder:text-blue-950 focus-visible:border-white focus-visible:ring-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold text-blue-950">
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading}
                    className="border-white pr-10 placeholder:text-blue-950 focus-visible:border-white focus-visible:ring-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-950"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="cursor-pointer text-right text-sm text-amber-950 hover:underline">
                Forgot Password?
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-blue-950 text-white hover:bg-amber-950"
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </form>
          </div>

          {/* Right Section */}

          <div className="hidden items-center justify-center bg-white md:flex">
            <div className="w-full max-w-xl p-8">
              <LoginAnimation />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
