"use client";
import { useRouter } from "next/navigation";


const LoginPopup = () => {
  const router = useRouter();
  

  return (
    <div className="fixed inset-0 flex flex-col gap-6 items-center justify-center bg-black bg-opacity-60 z-50">
      <form
        className="bg-white w-[90%] sm:w-[400px] p-6 rounded-2xl shadow-xl relative"
      >
        {/* Title and Close */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Sign-up</h2>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4 mb-4">
          
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
              className="border border-gray-300 text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="border border-gray-300 text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter the Password"
            required
            className="border border-gray-300 text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-yellow-300 text-white py-2 rounded-md font-semibold hover:bg-yellow-600 transition duration-300"
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
                  router.push('/sign-in')
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