import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import { useAuthStore } from '../store/useAuthStore';
import Home from './Home';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePostStore } from '../store/usePostStore';
import { Plus, PlusCircle } from 'lucide-react';

function Explore() {
    const {authUser} = useAuthStore();
    const [page,setPage] = useState(0);
    const {allPosts,getAllPosts,loadingAllPosts} = usePostStore();
    if(authUser.following.length==0){
        toast.error("Follow someone to explore");
        return (
            <>
            <Navigate to = "/" />
            </>
        )
    }
    useEffect(()=>{
        getAllPosts(page);
        console.log("page",page)
    },[page])
    if(loadingAllPosts){
        return(
            <>
            <Sidebar/>
            <Footer/>
            <div className='flex flex-col items-center justify-center gap-6 lg:ml-[250px] sm:ml-[80px] p-4'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 w-full animate-pulse'>
                Loading....
            </div>
        </div>
            </>
        )
    }
  return (
    <>
        <Sidebar/>
        <Footer/>
        <div className='flex flex-col items-center justify-center gap-6 lg:ml-[250px] sm:ml-[80px] p-4'>
            <div className='grid grid-cols-3 lg:grid-cols-3 gap-1'>
                {allPosts?.map((post)=>(
                    <>
                        {post.image?.length > 0 && <img src={post.image} className='w-full h-full'/>}
                    </>
                ))}
                <div className='flex justify-center items-center hover:bg-gray-200'>
                <PlusCircle size={50} className='cursor-pointer'
                onClick={()=>{setPage(prev=>prev+1)}}/>
                </div>
            </div>
            
        </div>
    </>
  )
}

export default Explore