import React, { useEffect, useState } from 'react'
import {Eye, EyeOff, IdCard, Loader, Lock, Mail, User, X } from 'lucide-react'
import Logo from '../components/Logo'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import Navbar from '../components/Navbar';
function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignup, handleVerify } = useAuthStore();
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const navigate = useNavigate();

  useEffect(()=>{
    if(otpSent && seconds >= 0) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  },[otpSent,seconds>=0])

  return (
    <>
      <Navbar/>
      <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <div className='flex flex-col items-center justify-evenly gap-10 w-85 sm:w-105 p-6 h-140 rounded-lg shadow-lg'>
          <Logo />


          <div className='w-full'>
            <h1 className='text-2xl font-bold'>Create an account</h1>
            <p className='text-sm'>Please enter your details to create an account</p>
          </div>


          <div className='flex flex-col items-start justify-center gap-5 w-full'>
            <div className='w-full'>
            <div className='relative w-full'>
                <IdCard className='absolute top-2 left-2 text-gray-400' />
                <input type='text' value={userId} placeholder='User Id' className='w-full p-2 pl-8 mb-4 border rounded-lg' onChange={(e) => {
                  setUserId(e.target.value);
                }} readOnly={sendingOtp || otpSent} />
              </div>
              <div className='relative w-full'>
                <User className='absolute top-2 left-2 text-gray-400' />
                <input type='text' value={username} placeholder='name' className='w-full p-2 pl-8 mb-4 border rounded-lg' onChange={(e) => {
                  setusername(e.target.value);
                }} readOnly={sendingOtp || otpSent} />
              </div>
              <div className='relative w-full'>
                <Mail className='absolute top-2 left-2 text-gray-400' />
                <input type='email' value={email} placeholder='Email' className='w-full p-2 mb-4 border rounded-lg pl-8' onChange={(e) => {
                  setEmail(e.target.value);
                }} readOnly={sendingOtp || otpSent} />
              </div>
              <div className='relative w-full'>
                <Lock className='absolute top-2 left-2 text-gray-400' />
                <input type={showPassword ? "text" : "password"}
                  value={password} onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder='Password' className='w-full p-2 mb-4 border rounded-lg pl-8' readOnly={sendingOtp || otpSent} />
                {showPassword ? (
                  <Eye className='absolute right-2 top-2 cursor-pointer' onClick={() => setShowPassword(false)} />
                ) : (
                  <EyeOff className='absolute right-2 top-2 cursor-pointer' onClick={() => setShowPassword(true)} />
                )}
              </div>
              <div>
                {otpSent ? (
                  <div className='flex items-center justify-center gap-2 absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-50'>
                      
                  <div className='bg-white p-4 rounded-lg flex flex-col items-center justify-center gap-2 w-90 z-20 h-70 relative'>
                   <X className='absolute top-2 right-2 cursor-pointer' onClick={() => {
                       setSeconds(60);
                       setSendingOtp(false);
                       setOtpSent(false);
                     }} />
                    <input type='text' maxLength={6} minLength={6} value={otp} onChange={(e) => { setOtp(e.target.value) }} className='border-b-2 w-50 focus:outline-none' />
                    <button className='w-50 p-2 mb-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600' onClick={async () => {
                      
                      setVerifyingOtp(true);
                      const res = await handleVerify(email, password, otp, username,userId);
                      if (res.status === 200) {
                        toast.success(res.data.message);
                        setVerifyingOtp(false);
                        setOtpSent(false);
                        setTimeout(() => {
                          navigate("/");
                        },1000);
                      }
                      else {
                        toast.error(res.response.data.message);
                        setVerifyingOtp(false);
                      }
                    }}>
                      {verifyingOtp ? <Loader /> : "Verify Otp"}
                    </button>
                    <div>
                      <div>
                        {seconds > 0 ? `You can resend otp after ${seconds} seconds` : "You can resend otp now"}
                      </div>
                      <button className='text-blue-500 hover:text-blue-600 hover:underline ' onClick={async() => {
                        if(seconds > 1) {
                          toast.error("Please wait for the timer to finish before resending otp");
                          return;}
                        setSeconds(60);
                        setOtpSent(false);
                        setSendingOtp(true);
                        const res = await handleSignup(username, email, password,userId);
                        if (res.status === 200) {
                          toast.success(res.data.message);
                          setSendingOtp(false);
                          setOtpSent(true);
                        }
                        else {
                          toast.error(res.response.data.message);
                          setSendingOtp(false);
                        }
                      }} disabled={seconds === 0}>Resend Otp</button>
                    </div>
                  </div>
                </div>
                ) : (
                  sendingOtp ? <>
                    <div className='flex items-center justify-center gap-2 absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-50'>
                      
                      <div className='bg-white p-4 rounded-lg flex items-center justify-center gap-2 w-90 z-20 h-40 relative'>
                       <X className='absolute top-2 right-2 cursor-pointer' onClick={() => {
                           setSendingOtp(false);
                           setOtpSent(false);
                         }} />
                        <Loader className='animate-spin white' /> <p>Sending Otp...</p>
                      </div>
                    </div>
                  </>
                     :
                     <button className='w-full p-2 mb-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600' onClick={async () => {
                      if(!username || !email || !password || !userId) {
                        toast.error("All fields are required");
                        return;
                      }
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if(emailRegex.test(email) === false) {
                        toast.error("Invalid email address");
                        return;
                      }
                      email.trim();
                      username.trim();
                      setSendingOtp(true);
                      const res = await handleSignup(username, email, password,userId);
                      if (res.status === 200) {
                        toast.success(res.data.message);
                        setSendingOtp(false);
                        setOtpSent(true);
                      }
                      else {
                        toast.error(res.response.data.message);
                        setSendingOtp(false);
                      }
                    }}>Signup</button>
                )}
              </div>
              <div>
                Already have an account? <Link to='/login' className='text-blue-500 hover:text-blue-600 hover:underline'>Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup