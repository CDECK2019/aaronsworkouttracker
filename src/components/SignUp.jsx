import React from 'react'
import { useForm } from 'react-hook-form'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import Input from './Input'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../Appwrite/auth'

import { Sparkles } from 'lucide-react';

export default function SignInForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPassword, setShowPassword] = React.useState(false)

  const [error, setError] = React.useState("")
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setError("");
    try {
      const response = await authService.createAccount(data);
      console.log(response)
      navigate("/login")
    } catch (error) {
      console.log("Signup error:", error);
      setError("Signup failed: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-800 p-8 rounded-3xl shadow-xl">
        <div className='flex flex-col justify-center items-center'>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
            <Sparkles className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">You Got This!</h1>
          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm tracking-widest uppercase mb-2">An Optimal Life</p>
        </div>
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Begin your journey to peak performance
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Input
                label="Name"
                placeholder="Enter your name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Valid email required",
                  }
                })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" }
                })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Choose a strong password"
              />
              <button
                type="button"
                className="absolute right-4 top-[38px] text-gray-400 hover:text-emerald-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
              {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transform hover:scale-[1.02] transition-all"
            >
              Sign Up
            </button>
          </div>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}