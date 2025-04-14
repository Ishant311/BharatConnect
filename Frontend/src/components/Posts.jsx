import React, { useEffect } from 'react'
import { usePostStore } from '../store/usePostStore';
import avatar from '../../public/avatar.png'
import { Bookmark, Heart, MessageSquare } from 'lucide-react';


function Posts() {
    const {posts,likedPosts,handleLikePost,handleUnlikePost} = usePostStore();
  return (
    <div className='flex flex-col items-center justify-center gap-6 lg:pl-[250px] sm:pl-[80px] p-4 w-full'>
    {posts?.map(post => (
      <>
      <div key={post._id} className='flex flex-col items-center justify-center gap-2 p-5 m-2 rounded-lg cursor-pointer w-150'>
        <div className='flex items-center justify-start w-full'>
          
          
          <img src={post.createdBy.profilePic || avatar} alt={post.createdBy.userId} className='size-7 sm:size-10 rounded-full' />
          <div className='flex flex-col items-start justify-start gap-1 ml-2'>
            <h1 className='text-sm sm:text-[17px] font-bold'>{post.createdBy.userId}</h1>
          </div>
        </div>
        <div className='flex items-center justify-start w-full'>
        {post.type === 'image' ? (
            <img src={post.image} alt={post.title} className='w-full h-auto rounded-lg' />
          ) : null}
          {post.type === 'video' ? (
            <video src={post.video} autoPlay={true} loop controls className='w-full h-auto rounded-lg' />
          ) : null}
        </div>
        <div className='flex items-center justify-between w-full pl-3 gap-2'>
          <div className='flex items-center justify-start gap-2'>
          <Heart className={`${likedPosts?.includes(post._id)?"fill-red-600 text-red-600":"text-gray-700"} size-8`} onClick={()=>{
            if(likedPosts?.includes(post._id)){
              handleUnlikePost(post._id);
            }else{
              handleLikePost(post._id);
            }
          }} />
          <MessageSquare className='text-gray-700 size-8' />
          </div>
          <div>
            <Bookmark className='text-gray-700 size-8' />
          </div>
        </div>
        <div className='flex items-center justify-start w-full pl-3 gap-2'>
          <h1 className='text-lg'>{post.text}</h1>
        </div>
      <div className='mt-10 border-b-1 border-gray-200 w-full' > </div>
      </div>
        </>
    ))}
    </div>
  )
}

export default Posts