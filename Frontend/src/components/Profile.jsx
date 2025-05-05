import React, { useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import avatar from '../../public/avatar.png'
import { Bookmark, Pen } from 'lucide-react';
import PostSvg from './PostSvg';
import Navbar from './Navbar';
import Footer from './Footer';

function Profile() {
  const imgRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { authUser,setUser,updateProfilePic,updatingProfilePic } = useAuthStore();
  const { getUserProfile, userProfile, loadingProfile, following ,followUser,unfollowUser } = useUserStore();

  useEffect(() => {
    getUserProfile(id);
  }, [id]);

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await updateProfilePic(formData);
      getUserProfile(id);
      imgRef.current.value = null;
    }
  }

  const isSelf = authUser?.userId === userProfile[0]?.userId;
  return (
    <>
      <div className='sm:hidden sm:p-0 p-4'>
        <Navbar/>
      </div>
      <Sidebar />
      <Footer />
      <div className="w-full flex justify-center items-center flex-col sm:pl-[80px] lg:pl-[250px] pt-10 px-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start w-full sm:w-[600px] lg:w-[800px] bg-white border-b border-gray-200 p-5 gap-5">
          <div className="flex flex-col items-center justify-center w-24 sm:w-32">
            <div className="relative">
              {updatingProfilePic && (
                <>
                  <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
                  <img
                  src={imgRef.current?.files[0] ? URL.createObjectURL(imgRef.current.files[0]) : userProfile[0]?.profilePic || avatar}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-gray-300"
                />
                </>
              )}
              {!updatingProfilePic && (
                <img
                  src={imgRef.current?.files[0]?URL.createObjectURL(imgRef.current.files[0]):userProfile[0]?.profilePic || avatar}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-gray-300"
                />
              )}
              
              {isSelf && (
                <div className="absolute bottom-0 p-1 sm:p-2 right-0 sm:right-2 bg-white rounded-full shadow-md">
                  <input type="file" accept="image/*" className="hidden" ref={imgRef} 
                  onChange={(e)=>{
                    handleProfilePicChange(e);
                  }}/>
                  <Pen className="text-gray-500 w-4 h-4 sm:w-6 sm:h-6" onClick={()=>{
                    imgRef.current?.click()
                  }} />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start justify-start w-full">
            <div className="flex items-center justify-between w-full gap-5">
              <h1 className="text-lg font-semibold">{userProfile[0]?.userId}</h1>
              <div>
                {isSelf && (
                  <button className="hidden sm:block bg-gray-200 text-sm text-black px-3 py-1 rounded-lg hover:bg-gray-300 font-semibold cursor-pointer" onClick={()=>{
                    navigate("/edit");
                  }}>
                    Edit Profile
                  </button>
                )}

                {!isSelf && !authUser?.following?.includes(userProfile[0]?._id) && (
                  <button className="bg-blue-500 text-sm text-white px-3 py-1 rounded-lg hover:bg-blue-600" onClick={async()=>{
                    await followUser(userProfile[0]?._id);
                    await setUser()
                    getUserProfile(id);
                  }}>
                    Follow
                  </button>
                )}
                {!isSelf && authUser?.following?.includes(userProfile[0]?._id) && (
                  <button className="bg-gray-500 text-sm text-white px-3 py-1 rounded-lg hover:bg-gray-600" onClick={async ()=>{
                    await unfollowUser(userProfile[0]?._id);
                    await setUser();
                    getUserProfile(id);
                  }}>
                    Following
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-start justify-start gap-5 mt-2">
              <h1 className="text-sm">
                {userProfile[0]?.posts.length}{" "}
                <span className="text-gray-500">posts</span>
              </h1>
              <h1 className="text-sm cursor-pointer" onClick={()=>{
                if(userProfile[0]?.followers.length === 0) return;
                navigate(`/profile/${userProfile[0]?.userId}/followers`);
              }}>
                {userProfile[0]?.followers.length}{" "}
                <span className="text-gray-500">followers</span>
              </h1>
              <h1 className="text-sm cursor-pointer" onClick={()=>{
                if(userProfile[0]?.following.length === 0) return;
                navigate(`/profile/${userProfile[0]?.userId}/following`);
              }}>
                {userProfile[0]?.following.length}{" "}
                <span className="text-gray-500">following</span>
              </h1>
            </div>
            <div className="flex flex-col items-start justify-center mt-2 gap-4">
              <h1 className="text-lg">{userProfile[0]?.userName}</h1>
              <h1 className='text-sm font-bold font-mono'>{userProfile[0]?.Bio}</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 justify-center w-full sm:w-[600px] lg:w-[800px] mt-5">
          <NavLink
            to={`/profile/${userProfile[0]?.userId}`}
            end
            className={({ isActive }) =>
              `flex gap-2 items-center ${
                isActive ? "text-black font-semibold" : "text-gray-500"
              }`
            }
          >
            <PostSvg /> POSTS
          </NavLink>
          {isSelf && (
            <NavLink
              to={`/profile/${userProfile[0]?.userId}/saved`}
              className={({ isActive }) =>
                `flex gap-2 items-center ${
                  isActive ? "text-black font-semibold" : "text-gray-500"
                }`
              }
            >
              <Bookmark size={12} /> SAVED
            </NavLink>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile