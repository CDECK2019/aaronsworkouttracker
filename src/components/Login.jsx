import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Input from "./Input";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, UserCircle } from "lucide-react";
import { setGuestMode, getAuthService, getServiceMode } from "../services/serviceProvider";

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if full auth is available
  const isFullAuthAvailable = getServiceMode() === 'appwrite';

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const authService = getAuthService();
      const session = await authService.login(data);

      if (session) {
        const userData = await authService.getCurrentUser();

        if (userData) {
          navigate("/dashboard");
        } else {
          throw new Error("User not found");
        }
      } else {
        setError("User not found");
      }
    } catch (error) {
      console.log("login error:", error);

      if (error.message.includes("User not found")) {
        setError("User not found");
      } else {
        setError("Login failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    setGuestMode(true);
    navigate("/dashboard");
  };

  const handleGoogleAuth = async () => {
    try {
      const authService = getAuthService();
      await authService.googleAuth();
    } catch (error) {
      console.log(error);
      setError("Google login requires Appwrite configuration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo */}
        <Link to="/" className="flex justify-center items-center group">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mr-3 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all">
            <Dumbbell className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Fitness World
          </h1>
        </Link>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
          <div>
            <h2 className="text-center text-2xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-slate-300">
              Sign in to continue your fitness journey
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-center text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Guest Mode Button - Primary Action */}
          <div className="mt-6">
            <button
              onClick={handleGuestMode}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
            >
              <UserCircle className="w-5 h-5" />
              Continue as Guest
            </button>
            <p className="text-center text-xs text-slate-400 mt-2">
              No account needed • Data saved locally
            </p>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-slate-400">
                or sign in with account
              </span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is Required",
                    validate: {
                      matchPatern: (value) =>
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                          value
                        ) || "Email address must be a valid address",
                    },
                  })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 placeholder-slate-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 placeholder-slate-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-9 text-slate-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading || !isFullAuthAvailable}
              className="w-full py-3 px-4 border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in with Email"}
            </button>

            {!isFullAuthAvailable && (
              <p className="text-xs text-center text-slate-400">
                Email login requires Appwrite configuration
              </p>
            )}
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogleAuth}
              disabled={!isFullAuthAvailable}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-white/20 rounded-xl text-slate-300 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcGoogle className="h-5 w-5" />
              Sign in with Google
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-400">
            New to FitnessApp?{" "}
            <Link
              to="/signup"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
