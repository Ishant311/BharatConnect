import React, { useEffect } from 'react'
import Profile from '../components/Profile'
import { useUserStore } from '../store/useUserStore';
import { useParams } from 'react-router-dom';

function UserPosts() {
  const { userPosts, getUserPosts, loadingUserPosts } = useUserStore();
  const { id } = useParams();
  useEffect(() => {
    getUserPosts(id);
  }, [id])
  if (loadingUserPosts) {
    return (
      <>
        <Profile />
        <div className='flex flex-col items-center justify-center gap-6 lg:ml-[250px] sm:ml-[80px] p-4'>
          <h1 className='text-2xl font-bold'>Loading....</h1>
        </div>
      </>
    )
  }
  return (
    <>
      <Profile />
      <div>
        <div className='flex flex-col items-center justify-center gap-6 lg:ml-[250px] sm:ml-[80px] p-4'>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-6xl'>
            {
              userPosts.length === 0 ? <h1 className='text-xl'>No Posts</h1> : userPosts.map((post) => (
                <div className="w-full h-0 pb-[100%] relative bg-black flex items-center justify-center overflow-hidden">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt="Post"
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-in-out hover:scale-110"
                    />
                  ) : (
                    <video
                      src={post.video}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-in-out hover:scale-110"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default UserPosts