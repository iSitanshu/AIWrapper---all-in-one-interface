"use client";
import { setCurrentUserToken } from "@/lib/features/currentToken/currentTokenSlice";
import { useAppDispatch } from "@/lib/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";


const Login_Popup = () => {
  const router = useRouter();
  const [userRegister, setUserRegister] = useState({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserRegister({ ...userRegister, [e.target.name]: e.target.value });
  };

  const handleloginSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const response = await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, userRegister);
      
      dispatch(setCurrentUserToken(response.data.token))
      router.push('/')
    } catch (error) {
      console.error("Error while login",error);
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col gap-6 items-center justify-center bg-black bg-opacity-60 z-50">
      <form
        className="bg-white w-[90%] sm:w-[400px] p-6 rounded-2xl shadow-xl relative"
        onSubmit={handleloginSubmit}
      >
        {/* Title and Close */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4 mb-4">
          
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            onChange={handleChange}
            className="border border-gray-300 text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter the Password"
            required
            onChange={handleChange}
            className="border border-gray-300 text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-yellow-300 text-white py-2 rounded-md font-semibold hover:bg-yellow-600 transition duration-300"
        >
          Login
        </button>

        {/* Terms and Conditions */}
        <div className="flex items-start mt-4 gap-2 text-sm text-gray-600">
          <input type="checkbox" required className="mt-1" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {/* Switch to sign in */}
        <p className="mt-4 text-sm text-center text-gray-700">
              Create a new account?{" "}
              <span
                className="text-yellow-600 font-semibold cursor-pointer hover:underline"
                onClick={() => {
                  router.push('/sign-up')
                }}
              >
                Click here
              </span>
            </p>
      </form>
    </div>
  );
};

export default Login_Popup;