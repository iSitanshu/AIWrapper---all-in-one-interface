"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setUserEmail } from "@/lib/features/Infodetail/infoDetailSlice";
import { Loader } from "lucide-react";
import { setCurrentUserToken } from "@/lib/features/currentToken/currentTokenSlice";

const LoginPopup = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ Loading Screen
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="flex flex-col items-center space-y-4 bg-white px-8 py-6 rounded-xl shadow-lg">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600 font-medium">Creating your account...</p>
        </div>
      </div>
    );
  }

  const handleSubmitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);

    try {
      console.log("hello")
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/initiate_signup`,
        userDetail
      );

      if (response.data.success) {
        dispatch(setUserEmail(userDetail.email));
        dispatch(setCurrentUserToken(response.data.token))
        router.push("/", { scroll: false });
      } else {
        setShowError(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        router.push("/api/chill-out");
        return; // ⛔ prevent further execution
      }
      console.error("Signup error:", error);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col gap-6 items-center justify-center bg-black bg-opacity-60 z-50">
      <form
        onSubmit={handleSubmitSignup}
        className="bg-white w-[90%] sm:w-[400px] p-6 rounded-2xl shadow-xl relative"
      >
        {/* Title */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Sign up</h2>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4 mb-4">
          {showError && (
            <p className="text-red-600 text-sm">
              Account Already exit. Try Login
            </p>
          )}

          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            value={userDetail.name}
            onChange={(e) =>
              setUserDetail({ ...userDetail, name: e.target.value })
            }
            className="border border-gray-300 text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={userDetail.email}
            onChange={(e) =>
              setUserDetail({ ...userDetail, email: e.target.value })
            }
            className="border border-gray-300 text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter the Password"
            required
            value={userDetail.password}
            onChange={(e) =>
              setUserDetail({ ...userDetail, password: e.target.value })
            }
            className="border border-gray-300 text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-yellow-400 text-gray-900 py-2 rounded-md font-semibold hover:bg-yellow-500 transition duration-300"
        >
          Sign up
        </button>

        {/* Terms and Conditions */}
        <div className="flex items-start mt-4 gap-2 text-sm text-gray-600">
          <input type="checkbox" required className="mt-1" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {/* Switch Auth Mode */}
        <p className="mt-4 text-sm text-center text-gray-700">
          Already have an account?{" "}
          <span
            className="text-yellow-600 font-semibold cursor-pointer hover:underline"
            onClick={() => {
              setLoading(true);
              // ✅ Wait a bit to let loading spinner show before navigation
              setTimeout(() => router.push("/sign-in"), 200);
            }}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;
