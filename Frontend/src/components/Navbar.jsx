import React, { useState } from 'react'
import Logo from './Logo'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowLeftCircle, Bookmark, Heart, Menu } from 'lucide-react';

function Navbar() {
  const { authUser,handleLogout,setUserNull } = useAuthStore();
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);

  return (

    <div className='fixed top-0 left-0 right-0 flex items-center justify-between w-full p-4 bg-white shadow-md z-10 h-15'>
      <div className='flex items-center gap-4'>
        <h1 className='text-2xl font-bold'><Logo /></h1>
      </div>
      {!authUser ? (
        <div className='items-center gap-4 hidden sm:flex'>
          <button className='bg-black text-white rounded-xl px-4 py-2 border-none'
            onClick={() => {
              navigate("/login");
            }}>Login</button>
          <button onClick={() => {
            navigate("/signup");
          }}>Signup</button>
        </div>
      ) : (
        <div className='relative '>
          <Menu className='w-8 h-8 text-gray-500 cursor-pointer' onClick={() => {
            setHidden(!hidden);
          }} />
          <div className={`absolute top-[100%] left-[-150px] rounded-lg flex flex-col items-start p-3 justify-start right-0 w-48 h-44 bg-white shadow-lg z-10 ${hidden ? 'block' : 'hidden'}`}>
            <div className='py-1 border-b-1 border-gray-200 w-full'>
              <h1 className='text-sm text-black font-semibold hover:bg-gray-200 p-3 rounded-2xl w-[95%] flex items-center gap-1' onClick={() => {
                navigate("/")
              }}><Heart size={12} />Liked</h1>
            </div>
            <div className='py-1 border-b-1 border-gray-200 w-full'>
              <h1 className='text-sm text-black font-semibold hover:bg-gray-200 p-3 rounded-2xl w-[95%] flex items-center gap-1' onClick={() => {
                navigate(`/profile/${authUser?.userId}/saved`)
              }}>
                <Bookmark size={14} />Saved</h1>
            </div>
            <div className='py-1 w-full'>
              <h1 className='text-sm text-black font-semibold hover:bg-gray-200 p-3 rounded-2xl w-[95%] flex items-center gap-1' onClick={async () => {
                try {
                  const res = await handleLogout();
                  setUserNull();
                  navigate('/login');
                } catch (error) {
                  console.log(error);
                }
              }}><ArrowLeftCircle size={14} /> Log out</h1>
            </div>
          </div>
        </div>


      )}

    </div>
  )
}

export default Navbar