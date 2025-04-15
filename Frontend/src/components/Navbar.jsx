import React from 'react'
import Logo from './Logo'
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  return (
    
    <div className='fixed top-0 left-0 right-0 flex items-center justify-between w-full p-4 bg-white shadow-md'>
        <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold'><Logo/></h1>
        </div>
        <div className='items-center gap-4 hidden sm:flex'>
          <button className='bg-black text-white rounded-xl px-4 py-2 border-none'
          onClick={()=>{
            navigate("/login");
          }}>Login</button>
          <button onClick={()=>{
            navigate("/signup");
          }}>Signup</button>
        </div>
    </div>
  )
}

export default Navbar