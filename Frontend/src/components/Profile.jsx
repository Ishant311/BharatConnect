import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import { NavLink, useParams } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import avatar from '../../public/avatar.png'
import { Bookmark, Pen } from 'lucide-react';
import PostSvg from './PostSvg';

function Profile() {
    const {id} = useParams();
    const {authUser} = useAuthStore();
    const {getUserProfile,userProfile,loadingProfile,following} = useUserStore();
    useEffect(()=>{
        getUserProfile(id);
    },[id])
    if(loadingProfile){
        return (
            <div className='flex items-center justify-center h-screen'>
                <h1 className='text-2xl font-bold'>Loading...</h1>
            </div>
        )
    }
    const isSelf = authUser?.userId === userProfile[0]?.userId;
  return (
    <>
    <Sidebar/>
    <div className='w-full flex justify-center items-center flex-col sm:pl-[80px] lg:pl-[250px] pt-10'>
        <div className='flex items-center justify-start w-full sm:w-[600px] lg:w-[800px] h-[200px] bg-white border-b-1 border-gray-200 p-5 gap-5'>
            <div className='flex flex-col items-center justify-center w-105'>
                <div className='relative'>
                <img src={userProfile[0]?.profilePicture || avatar} alt="Profile" className='size-15 sm:size-35 rounded-full border-2 border-gray-300' />
                {
                  isSelf && <div className='absolute bottom-0 p-1 sm:p-2 right-0 sm:right-2 bg-white rounded-full shadow-md'>
                  <Pen className='text-gray-500 size-4 sm:size-6' />
              </div>
                }
                
                </div>
            </div>
            <div className='flex flex-col items-start justify-start h-full w-full'>
              <div className='flex items-center justify-start w-[280px] gap-5'>
                <h1 className='text-lg'>{userProfile[0]?.userId}</h1>
                <div>
                  {isSelf && <button className='bg-gray-200 text-sm text-black px-2 py-1 rounded-lg hover:bg-gray-300 font-semibold'>Edit Profile</button>}
                  {
                    !isSelf && <button className='bg-blue-500 text-sm text-white px-2 py-1 rounded-lg hover:bg-gray-300 '>Follow</button>
                  }
                </div>
              </div>
              <div className='flex items-start justify-start gap-5 mt-2 h-8'>
                <h1 className='text-sm'>{userProfile[0]?.posts.length} <span className='text-gray-500'>posts</span></h1>
                <h1 className='text-sm'>{userProfile[0]?.followers.length} <span className='text-gray-500'>followers</span></h1>
                <h1 className='text-sm'>{userProfile[0]?.following.length} <span className='text-gray-500'>following</span></h1>
              </div>
              <div className='flex items-center justify-start mt-2'>
                <h1 className='text-lg font-semibold'>{userProfile[0]?.userName}</h1>
              </div>  
            </div>
        </div>
        <div className='flex items-center gap-6 justify-center w-full sm:w-[600px] lg:w-[800px] mt-5'>
          <NavLink to={`/profile/${userProfile[0]?.userId}`}end className={({isActive})=> `flex gap-2 items-center ${isActive ? "text-black font-semibold" : "text-gray-500"}`}> <PostSvg/> POSTS</NavLink>
            
            {
              isSelf && <NavLink to={`/profile/${userProfile[0]?.userId}/saved`} className={({isActive})=> `flex gap-2 items-center ${isActive ? "text-black font-semibold" : "text-gray-500"}`}> <Bookmark size={12}/> SAVED</NavLink>
            }
        </div>
    </div>
    </>
  )
}

export default Profile