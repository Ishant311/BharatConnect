
import React, { useEffect } from 'react'
import { usePostStore } from '../store/usePostStore';
import avatar from '../../public/avatar.png'
import { Bookmark, Heart, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';


function Posts() {
  
    const { posts, likedPosts, handleLikePost, handleUnlikePost } = usePostStore();
    return (
      <div className='flex flex-col items-center justify-center gap-6 lg:pl-[250px] sm:pl-[80px] p-4 w-full'>
        {posts?.map(post => (
          <div
            key={post._id}
            className='flex flex-col items-center justify-center gap-4 p-5 m-2 rounded-lg shadow-lg bg-white w-[550px] max-w-2xl'
          >
            {/* Post Header */}
            <div className='flex items-center justify-start w-full'>
              <img
                src={post.createdBy.profilePic || avatar}
                alt={post.createdBy.userId}
                className='w-10 h-10 sm:w-12 sm:h-12 rounded-full'
              />
              <div className='flex flex-col items-start justify-start gap-1 ml-3'>
                <h1 className='text-sm sm:text-lg font-bold text-gray-800'>
                  {post.createdBy.userId}
                </h1>
                <span className='text-xs text-gray-500'>
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className='flex items-center justify-center w-full'>
              {post.type === 'image' && (
                <img
                  src={post.image}
                  alt={post.title}
                  className='w-auto max-h-100 rounded-lg'
                />
              )}
              {post.type === 'video' && (
                <video
                  src={post.video}
                  autoPlay
                  loop
                  controls
                  className='w-full h-auto rounded-lg'
                />
              )}
            </div>

            {/* Post Actions */}
            <div className='flex items-center justify-between w-full gap-4'>
              <div className='flex items-center gap-4'>
                <Heart
                  className={`${
                    likedPosts?.includes(post._id)
                      ? 'fill-red-600 text-red-600'
                      : 'text-gray-700'
                  } w-6 h-6 cursor-pointer`}
                  onClick={() => {
                    if (likedPosts?.includes(post._id)) {
                      handleUnlikePost(post._id);
                    } else {
                      handleLikePost(post._id);
                    }
                  }}
                />
                <MessageSquare className='text-gray-700 w-6 h-6 cursor-pointer' />
              </div>
              <Bookmark className='text-gray-700 w-6 h-6 cursor-pointer' />
            </div>

            {/* Post Text */}
            <div className='flex items-start w-full'>
              <p className='text-gray-800 text-sm sm:text-base'>{post.text}</p>
            </div>

            {/* Divider */}
            <div className='mt-4 border-t border-gray-200 w-full'></div>
          </div>
        ))}
      </div>
    );
  }

export default Posts