import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X } from 'lucide-react';
import UserPosts from '../pages/UserPosts';
import avatar from '../../public/avatar.png'
import { useUserStore } from '../store/useUserStore';

function Following() {
    const {id} = useParams();
    const {getUserFollowing,loadingFollowing,following} = useUserStore();
    document.body.style.overflow = "hidden";
    const navigate = useNavigate();
    useEffect(()=>{
      getUserFollowing(id);
    },[id])
    if(loadingFollowing){
      return (
        <>
        <div className='flex sm:hidden'>
  
  
        </div>
          <UserPosts/>
        <div className='hidden sm:flex'>
          <div className='fixed top-0 left-0  w-full h-screen bg-black/50 z-10 '>
            <div className='absolute left-[50%] transform -translate-x-1/2 -translate-y-1/2 top-[50%] flex flex-col items-center justify-start pt-2 gap-2 bg-white w-[350px] h-[40%] rounded-xl'>
              <h1 className='text-xl font-bold'>Following</h1>
              <div className='w-full'>
                {[...Array(3)].map((_, index) => (   
                  <>
                  <div className='flex items-center justify-between gap-2 w-full p-2 animate-pulse'>
  
                    <div className="w-15 h-13 rounded-full bg-gray-300"></div>
                    <div className="flex flex-col items-start justify-start w-full gap-2">
                      <div className="h-4 w-1/2 bg-gray-300 rounded"></div> 
                      <div className="h-3 w-1/3 bg-gray-300 rounded"></div> 
                    </div>
                  </div>
                  </>
                ))}
                  <X className='absolute top-1 right-1 w-5 h-5 text-gray-500'/>
              </div>
            </div>
  
          </div>
        </div>
      </>
      )
    }
    return (
      <>
        <div className='flex sm:hidden'>
  
        </div>
          <UserPosts/>
        <div className='hidden sm:flex'>
          <div className='fixed top-0 left-0  w-full h-screen bg-black/50 z-10 '>
            <div className='absolute left-[50%] transform -translate-x-1/2 -translate-y-1/2 top-[50%] flex flex-col items-center justify-start pt-2 gap-2 bg-white w-[350px] h-[40%] rounded-xl'>
            <div className='w-full flex items-center justify-center border-b-1 border-gray-300'>
  
              <h1 className='text-xl font-bold'>Following</h1>
            </div>
            <div className='w-full flex flex-col items-start justify-start gap-2 overflow-y-scroll h-[70%]'>

              {following.length === 0 ? <h1 className='text-xl'>No following</h1> : following.map((follower) => (
                <div className='flex items-center justify-start gap-2 w-full p-2 hover:bg-gray-100 cursor-pointer' onClick={()=>{
                  navigate(`/profile/${follower.userId}`);
                  document.body.style.overflow = "auto";
                }}>
                  <img src={follower.profilePic || avatar} alt="Profile" className='w-15 h-15 rounded-full'/>
                  <div className='flex flex-col items-start justify-start'>
                    <h1 className='text-lg'>{follower.userName}</h1>
                    <h1 className='text-sm text-gray-500'>{follower.userId}</h1>
                  </div>
                  
                </div>
              ))}
            </div>
              <div className='absolute top-0 right-0 p-2 cursor-pointer' onClick={()=>{
                navigate(-1);
                document.body.style.overflow = "auto";
              }}>
                  <X className='w-5 h-5 text-gray-500'/>
              </div>
            </div>
  
          </div>
        </div>
      </>
        
    )
}

export default Following