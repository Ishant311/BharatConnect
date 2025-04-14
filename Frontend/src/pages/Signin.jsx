import React, { useState } from 'react'
import {Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Logo from '../components/Logo'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/useAuthStore';

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useAuthStore();
  const navigate = useNavigate();


  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-170 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="flex flex-col items-center justify-evenly w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
          <Logo />

          <div className="w-full text-center">
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-sm text-gray-600">Login to access your account</p>
          </div>

          <div className="flex flex-col items-start justify-center w-full space-y-4">
            <div className="w-full">
              <div className="relative w-full">
                <Mail className="absolute top-2.5 left-2.5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  placeholder="Email or User ID"
                  className="w-full p-3 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative w-full mt-4">
                <Lock className="absolute top-2.5 left-2.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-3 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showPassword ? (
                  <Eye
                    className="absolute right-2.5 top-2.5 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <EyeOff
                    className="absolute right-2.5 top-2.5 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>
            <button
              className="w-full p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={async () => {
                if (!email || !password) {
                  toast.error("Please fill all the fields");
                  return;
                }
                const userId = email;
                const res = await handleLogin(email, password, userId);
                if (res.status === 200) {
                  toast.success("Login Successful");
                  setTimeout(() => {
                    navigate("/");
                  }, 1000);
                } else {
                  toast.error(res.response.data.message);
                }
              }}
            >
              Login
            </button>
            <button
              className="w-full p-3 text-blue-500 bg-transparent rounded-lg hover:text-blue-600 hover:underline focus:outline-none"
              onClick={() => {
                // TODO: implement forget password functionality
              }}
            >
              Forgot Password?
            </button>
            <div className="text-center">
              <span className="text-gray-600">Not an existing user? </span>
              <Link
                to="/signup"
                className="text-blue-500 hover:text-blue-600 hover:underline"
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signin