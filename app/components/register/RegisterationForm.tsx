"use client";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { MdOutlineLock } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useRouter } from "next/navigation";
import * as yup from "yup";

const schema = yup
  .object({
    fullname: yup.string().required("Fullname is required"),
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

const RegisterationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
    const router = useRouter()

  const onSubmit = async (data: { fullname: string; email: string; password: string }) => {
    try {
      setIsLoading(true);
      await axios.post(`http://localhost:3002/auth/register`, data);
      alert('Registration successful');
      reset();
        setTimeout(()=>{
                router.push('/auth/login');
                }, 4000)
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || 'Registration failed';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <span className="bg-[#008e55] rounded-full mx-auto flex items-center justify-center w-10 h-10">
              <MdOutlineLock className="text-xl text-white" />
            </span>
            <h2 className="mt-6 text-center text-base font-extrabold text-[#008e55]">
              Registeration Form
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="relative">
                <label htmlFor="fullname" className="sr-only">
                  Fullname
                </label>
                <FaUser className="absolute left-3 top-[0.95rem] text-[#008e55]" />
                <input
                  id="text"
                  type="text"
                  autoComplete="fullname"
                  required
                  className="appearance-none relative block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-[#008e55] focus:border-[#008e55] text-sm"
                  placeholder="Fullname"
                  {...register("fullname")}
                />

                {errors.fullname && (
                  <p className="text-red-500 text-sm mb-2 mt-2">
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <FaEnvelope className="absolute left-3 top-[0.95rem] text-[#008e55]" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-[#008e55] focus:border-[#008e55] text-sm"
                  placeholder="Email address"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mb-2 mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <FaLock className="absolute left-3 top-[0.9rem] text-[#008e55]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-[#008e55] focus:border-[#008e55] text-sm"
                  placeholder="Password"
                  {...register("password")}
                />
                <span
                  className="absolute right-3 top-[0.9rem] cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-[#131b2e]" />
                  ) : (
                    <FiEye className="text-[#131b2e]" />
                  )}
                </span>

                {errors.password && (
                  <p className="text-red-500 text-sm mb-2 mt-2">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent cursor-pointer rounded-lg text-white hover:bg-white hover:text-[#008e55] transition-all ease-in-out delay-300 hover:font-bold hover:border hover:border-[#008e55] text-sm font-medium
                  ${
                    isLoading
                      ? "bg-[#008e55] cursor-not-allowed"
                      : "bg-[#008e55] hover:bg-[#008e55] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008e55]"
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in....
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterationForm;
