import React, { useEffect } from 'react'
import Profile from '../components/Profile'
import { useUserStore } from '../store/useUserStore';
import { useParams } from 'react-router-dom';

function UserPosts() {
  const { userPosts,getUserPosts,loadingUserPosts } = useUserStore();
  const { id } = useParams();
  useEffect(()=>{
    getUserPosts(id);
  },[id])
  if(loadingUserPosts){
    return (
      <>
      <Profile/> 
      <div className='flex flex-col items-center justify-center gap-6 lg:ml-[250px] sm:ml-[80px] p-4'>
        <h1 className='text-2xl font-bold'>Loading....</h1>
      </div>
      </>
    )
  }
  return (
    <>
    <Profile/> 
    <div>
      <div className='flex flex-col items-center justify-center gap-6 lg:ml-[250px] sm:ml-[80px] p-4'>
        <div className='grid grid-cols-3 gap-4 w-full max-w-2xl'>
        {
          userPosts.length === 0 ? <h1 className='text-xl'>No Posts</h1> : userPosts.map((post) => (
            post.type === "image" ? (
              <>
              <div>
                <img src={post.image} alt="Post" className='h-35 w-90 rounded-lg' />
              </div>
              </>
            ):(
              <div>
                <video src={post.video} className='h-35 w-90 rounded-lg'>
                  Your browser does not support the video tag.
                </video>
              </div>
            )
          ))
        }
        </div>
      </div>
    </div>
    </>
  )
}

export default UserPosts