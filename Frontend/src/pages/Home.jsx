import React, {useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import { usePostStore } from '../store/usePostStore.js';
import Suggestions from '../components/Suggestions.jsx';
import Posts from '../components/Posts.jsx';

function Home() {
  const {posts,isLoadingPosts,getPostsForHome,handleLikePost,handleUnlikePost,likedPosts,getLikedPost} = usePostStore();
  useEffect(()=>{
    getLikedPost();
    getPostsForHome();
  },[]);
  if(isLoadingPosts){
    return (
      <div className='flex items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold'>Loading...</h1>
      </div>
    )
  }
  if(!posts || posts.length === 0){
    return (
      <>
      <Sidebar/>  
      <div className='flex flex-col items-center justify-center gap-6 lg:ml-[250px] sm:ml-[80px] p-4'>
      <div className='flex flex-col items-center justify-center text-center gap-4 w-full max-w-2xl'>
        <h1 className='text-3xl lg:text-4xl font-bold text-gray-800'>Suggestions for You</h1>
        <p className='text-md lg:text-lg text-gray-500'>Follow people to see their posts and grow your network.</p>
      </div>
      <div className='w-full max-w-3xl'>
        <Suggestions/>
      </div>
      </div>
      </>
    )
  }
  return (
    <>
    <Sidebar/>
    <Posts/>
    </>
  )
}

export default Home