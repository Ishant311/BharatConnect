import { useRef, useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Footer from '../components/Footer.jsx';
import { ArrowLeft, Pencil } from 'lucide-react';
import avatar from '../../public/avatar.png';
import { useAuthStore } from '../store/useAuthStore.js';
import toast from 'react-hot-toast';
import {  useNavigate } from 'react-router-dom';

export default function Edit() {
  const {authUser,updateProfilePic,updateProfile} = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    bio: authUser.Bio,
    gender: authUser.gender,
  });
  const imgRef = useRef(null);
  const [image, setImage] = useState(null);
  const handleProfilePicChange = async(e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    if(file){
      setImage(URL.createObjectURL(file));
      formData.append('file', file);
      const res = await updateProfilePic(formData);
      if(imgRef.current){
        imgRef.current.value = null;
      }
      toast.success("Profile picture updated successfully");
    }
  }
  const handleChange = (e) => {
    const {name,value} = e.target;
    if(name === "bio"){
      if(value.length > 150){
        toast.error("Bio cannot exceed 150 characters");
        return;
      }
    }
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await updateProfile(profile);
      if(res.status === 200){
        toast.success("Profile updated successfully");
        navigate(`/profile/${authUser.userId}`);
      }

    } catch (error) {
      console.error(error);
      
    }
  };

  return (
    <>
      <Sidebar/>
      <Footer/>
      <div className="max-w-2xl mx-auto p-6 text-gray-900 bg-white min-h-screen sm:pl-[84px] lg:pl-[250px] pb-22">
  {/* Header with back arrow for small screens */}
  <div className="flex items-center justify-start sm:justify-between mb-6">
    <ArrowLeft
      className="size-6 text-gray-500 cursor-pointer sm:hidden"
      onClick={() => window.history.back()}
    />
    <h1 className="text-2xl font-bold text-center sm:text-left w-full">
      Edit Profile
    </h1>
  </div>

  <div className="bg-gray-100 rounded-2xl mb-6 p-4 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
    <div className="relative">
      <img
        src={image || authUser.profilePic || avatar}
        alt="Profile"
        className="w-24 h-24 sm:w-20 sm:h-20 rounded-full"
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={imgRef}
        onChange={handleProfilePicChange}
      />
      <div
        className="absolute bottom-0 right-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer sm:hidden"
        onClick={() => imgRef.current?.click()}
      >
        <Pencil className="w-4 h-4 text-gray-700" />
      </div>
    </div>
    <div className='w-[80%] flex items-center justify-center m-auto sm:justify-between'>

      <div className="flex flex-col items-center sm:items-start text-center">
        <p className="text-gray-900 font-semibold">{authUser.userName}</p>
        <p className="text-gray-600 text-sm">{authUser.userId}</p>
      </div>

      <button
        type="button"
        className="hidden sm:block px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
        onClick={() => imgRef.current?.click()}
      >
        Change photo
      </button>
    </div>
  </div>

  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label className="text-lg font-medium block mb-1">Bio</label>
      <textarea
        name="bio"
        value={profile.bio}
        onChange={handleChange}
        placeholder="Write a short bio (max 150 characters)..."
        maxLength={150}
        className="w-full h-32 p-4 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200 resize-none text-gray-800 placeholder-gray-400"
      />
      <p className="text-xs text-gray-500 mt-1">{profile.bio.length || 0} / 150</p>
    </div>

    <div>
      <label className="text-sm font-semibold text-gray-700 block mb-2">Gender</label>
      <div className="relative">
        <select
          name="gender"
          value={profile.gender}
          onChange={handleChange}
          className="w-full appearance-none p-3 rounded-lg bg-white border border-gray-300 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out"
        >
          <option>Male</option>
          <option>Female</option>
          <option>Prefer not to say</option>
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">This won't be part of your public profile.</p>
    </div>

    {/* Submit Button */}
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>

    </>
  );
}