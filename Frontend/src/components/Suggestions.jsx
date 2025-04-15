import React, { useEffect } from 'react'
import { useUserStore } from '../store/useUserStore'
import avatar from '../../public/avatar.png'
import { toast } from 'react-hot-toast'

function Suggestions() {
  const {userSuggestions,suggestions,isLoadingSuggestions,followUser,following,getFollowing,unfollowUser} = useUserStore()
  useEffect(()=>{
    suggestions()
    getFollowing()
  },[])
  const handleFollow = async(userId)=>{
    const res = await followUser(userId);
    if(res.status === 200){
      toast.success(res.data.message)
    }else{
      toast.error(res.data.message)
    }
  }
  const handleUnfollow = async(userId)=>{
    const res = await unfollowUser(userId);
    if(res.status === 200){
      toast.success(res.data.message)
    }else{
      toast.error(res.data.message)
    }
  }
  if(isLoadingSuggestions === true){
    return (
      <div className='flex items-center justify-center w-full h-full'>
        <h1 className='text-2xl font-bold text-gray-500'>Loading...</h1>
      </div>
    )
  }
  return (
    <div className='w-full'>
      <div className='flex flex-col items-center justify-center w-full h-full gap-4 mt-4'>

      {userSuggestions?.map((user) =>(
        <div key={user._id} className='flex items-center justify-center p-4 w-full'>
          <div className='flex items-center justify-between gap-2 w-[80%] sm:w-[60%]'>
            <div className='flex items-center justify-between gap-2'>
            <img src={user.profilePic || avatar} alt={user.username} className='size-10 sm:size-15 rounded-full' />
              <div>
                <h1 className='text-sm sm:text-[17px] font-bold'>{user.userId}</h1>
                <h1 className='text-sm'> {user.followersCount} followers </h1>
              </div>
            </div>
            
            <button className='px-4 py-2 text-black bg-white border-2 rounded-sm hover:text-white hover:border-gray-400 hover:border-2 hover:bg-black transition-all duration-300 ease-in-out'
            onClick={()=>{
              if(following?.includes(user._id)){
                handleUnfollow(user._id);
              }
              else{
                handleFollow(user._id);
              }
            }}>{following?.includes(user._id)?"Unfollow":"Follow"}</button>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}

export default Suggestions