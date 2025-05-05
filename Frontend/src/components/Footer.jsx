import React, { useState } from 'react'
import Logo from './Logo'
import { Compass, Home, PlusSquare, Search, User2 } from 'lucide-react'
import {NavLink} from 'react-router-dom'
import SmallLogo from './SmallLogo'
import CreatePost from '../pages/CreatePost'
import { useAuthStore } from '../store/useAuthStore'
import { axiosInstance } from '../lib/axios'


function Footer() {
  const {authUser} = useAuthStore();
  const [createPost, setCreatePost] = useState(false);
  return (
    <>
      <CreatePost createPost={createPost} setCreatePost={setCreatePost}/>
      <div className='sm:hidden fixed w-full h-20 flex items-center justify-center bottom-0 left-0 right-0 bg-white shadow-md z-10'>
      <div className='flex items-start justify-evenly h-full m-auto p-4 w-full'>
                <div className='flex items-center justify-center h-full gap-3 w-full'>
                  <NavLink to = "/" className={({isActive}) => `flex items-center justify-center gap-2 p-2 rounded-lg  hover:text-blue-500 cursor-pointer w-full ${isActive ? 'bg-gray-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <Home className='size-8' /> <span className='hidden lg:block'> Home</span>
                  </NavLink>
                  
                  <NavLink to = "/explore" className={({isActive}) => `flex items-center justify-center gap-2 p-2 rounded-lg  hover:text-blue-500 cursor-pointer w-full ${isActive ? 'bg-gray-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <Compass className='size-8' /> <span className='hidden lg:block'> Explore</span>
                  </NavLink>
                  
                  <div className='flex items-center justify-center gap-2 p-2 rounded-lg  hover:text-blue-500 cursor-pointer text-gray-500  w-full hover:bg-gray-100' onClick={() => {setCreatePost(true)}}>
                        <PlusSquare className='size-8' /> <span className='hidden lg:block'> Create </span>
                  </div>
                  <NavLink to = "/search" className={({isActive}) => `flex items-center justify-center gap-2 p-2 rounded-lg  hover:text-blue-500 cursor-pointer w-full ${isActive ? 'bg-gray-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <Search className='size-8' /> <span className='hidden lg:block'> Search</span>
                  </NavLink>
                  
                  <NavLink to = {`/profile/${authUser?.userId}`} className={({isActive}) => `flex items-center justify-center gap-2 p-2 rounded-lg  hover:text-blue-500 cursor-pointer w-full ${isActive ? 'bg-gray-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <User2 className='size-8' /> <span className='hidden lg:block'> Profile </span>
                  </NavLink>
                </div>
              </div>
      </div>
    </>
  )
}

export default Footer