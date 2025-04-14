import React, { use, useEffect, useState } from 'react'
import Logo from './Logo'
import { ArrowLeftCircle, Bookmark, Compass, Heart, Home, Menu, PlusSquare, Search, User2 } from 'lucide-react'
import {Link, NavLink, useNavigate} from 'react-router-dom'
import SmallLogo from './SmallLogo'
import CreatePost from '../pages/CreatePost'
import { useAuthStore } from '../store/useAuthStore'
import { axiosInstance } from '../lib/axios'

function Sidebar() {
      const [createPost, setCreatePost] = useState(false);
      const [hidden,setHidden] = useState(false);
      const navigate = useNavigate();
      const {authUser,handleLogout} = useAuthStore();
  return (
    <>
      <CreatePost createPost={createPost} setCreatePost={setCreatePost}/>
        <div className='hidden sm:w-[80px] sm:block lg:w-[250px] h-screen lg:block bg-white border-r-1 border-gray-200 fixed'>
            <div className='flex flex-col items-start justify-evenly h-full m-auto p-4 w-full'>
                <div className='flex items-start justify-start rounded-lg cursor-pointer w-full'>

                <h1 className='py-5 px-2 hidden lg:block w-full'><Logo/></h1>
                <h1 className='text-3xl lg:hidden'><SmallLogo/></h1>
                </div>
                <div className='flex flex-col items-center justify-start h-100 gap-3 w-full'>
                  <NavLink to = "/" className={({isActive}) => `flex items-center justify-start gap-2 p-2 rounded-lg  hover:text-blue-500 cursor-pointer w-full ${isActive ? 'bg-gray-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <Home className='size-8' /> <span className='hidden lg:block'> Home</span>
                  </NavLink>
                  
                  <NavLink to = "/search" className={({isActive}) => `flex items-center justify-start gap-2 p-2 rounded-lg  hover:text-blue-500 cursor-pointer w-full ${isActive ? 'bg-gray-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <Search className='size-8' /> <span className='hidden lg:block'> Search</span>
                  </NavLink>
                  <NavLink to = "/explore" className={({isActive}) => `flex items-center justify-start gap-2 p-2 rounded-lg  hover:text-blue-500 cursor-pointer w-full ${isActive ? 'bg-gray-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <Compass className='size-8' /> <span className='hidden lg:block'> Explore</span>
                  </NavLink>
                  
                  <div className='flex items-center justify-start gap-2 p-2 rounded-lg  hover:text-blue-500 cursor-pointer text-gray-500  w-full hover:bg-gray-100' onClick={() => {setCreatePost(true)}}>
                        <PlusSquare className='size-8' /> <span className='hidden lg:block'> Create </span>
                  </div>
                  
                  <NavLink to = {`/profile/${authUser.userId}`} className={({isActive}) => `flex items-center justify-start gap-2 p-2 rounded-lg  hover:text-blue-500 cursor-pointer w-full ${isActive ? 'bg-gray-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <User2 className='size-8' /> <span className='hidden lg:block'> Profile </span>
                  </NavLink>
                  <div>
                    
                  </div>
                      
                </div>
                <div className='flex text-gray-500 rounded-lg  cursor-pointer w-full relative'>
                  <div className={`flex items-center justify-center w-full gap-3 hover:text-blue-500  rounded-lg p-2 ${hidden === true?"bg-gray-100":"hover:bg-gray-100"}`} onClick={()=>{
                        setHidden(!hidden);
                  }}><Menu className={`size-8 ${hidden === true?"font-semibold text-blue-500 ":""}`}/> <span className={`hidden lg:block w-full ${hidden === true?"text-blue-500 font-semibold ":""}`}> More </span>
                  </div>
                  <div className={`absolute bottom-[100%] left-[100%] sm:left-[0%] rounded-lg flex flex-col items-start p-3 justify-start right-0 w-52 h-44 bg-white shadow-lg ${hidden ? 'block' : 'hidden'}`}>
                        <div className='py-1 border-b-1 border-gray-200 w-full'>
                              <h1 className='text-sm text-black font-semibold hover:bg-gray-200 p-3 rounded-2xl w-[95%] flex items-center gap-1' onClick={()=>{
                                    navigate("/")
                              }}><Heart size={12}/>Liked</h1>
                        </div>
                        <div className='py-1 border-b-1 border-gray-200 w-full'>
                              <h1 className='text-sm text-black font-semibold hover:bg-gray-200 p-3 rounded-2xl w-[95%] flex items-center gap-1' onClick={()=>{
                                    navigate(`/profile/${authUser.userId}/saved`)
                              }}>
                                <Bookmark size={14}/>Saved</h1>
                        </div>
                        <div className='py-1 w-full'>
                              <h1 className='text-sm text-black font-semibold hover:bg-gray-200 p-3 rounded-2xl w-[95%] flex items-center gap-1' onClick={async()=>{
                                    try {
                                          const res = await handleLogout();
                                          console.log(res);
                                          navigate('/login');
                                    } catch (error) {
                                          console.log(error);
                                    }
                              }}><ArrowLeftCircle size={14}/> Log out</h1>
                        </div>
                        
                  </div>
                  
                </div>
            </div>
        </div>
    </>
  )
}

export default Sidebar