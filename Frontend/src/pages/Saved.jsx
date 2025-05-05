import React, { use, useEffect } from 'react'
import Profile from '../components/Profile'
import { useUserStore } from '../store/useUserStore'
import { useNavigate } from 'react-router-dom';

function Saved() {
    const {savedPostsArr,loadingSavedPosts,getSavedPosts} = useUserStore();
    const navigate = useNavigate();
    useEffect(()=>{
        getSavedPosts();
    },[])
    if(loadingSavedPosts){
        return (
            <>
            <Profile/>
            <div className='flex flex-col items-center justify-center gap-6 lg:ml-[250px] sm:ml-[80px] p-4'>
                <h1 className='text-2xl font-bold'>Loading...</h1>
            </div>
            </>
        )
    }
  return (
    <>
      <Profile />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:ml-[250px] sm:ml-[80px] p-4'>
        {savedPostsArr.length > 0 ? (
          savedPostsArr.map((post) => (
            <div
              key={post._id}
              className=' overflow-hidden'
            >
              {post.image.length > 0 && (
                <img
                  src={post.image}
                  alt={post.title}
                  className='w-full h-full object-cover aspect-square'
                  onClick={() => {
                    navigate(`/post/${post._id}`);
                    document.body.style.overflow = 'hidden';
                  }}
                />
              )}
              {post.video.length > 0 && (
                <video controls className='size-60 aspect-square'
                  onClick={() => {
                    navigate(`/post/${post._id}`);
                    document.body.style.overflow = 'hidden';
                  }}
                >
                  <source src={post.video} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))
        ) : (
          <h1 className='text-2xl font-bold col-span-full text-center'>No Saved Posts</h1>
        )}
      </div>
    </>
  );
}

export default Saved