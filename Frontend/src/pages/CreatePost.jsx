
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { Loader, Upload, X } from 'lucide-react';
import avatar from '../../public/avatar.png';
import { useAuthStore } from '../store/useAuthStore';
import { usePostStore } from '../store/usePostStore';

function CreatePost({ createPost, setCreatePost }) {
  const [image, setImage] = useState(null);
  const [file,setFile] = useState(null);
  const { authUser } = useAuthStore();
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const {handleCreatePost} = usePostStore();
  const contentRef = useRef(null);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileType = selectedFile.type.split('/')[0];
    setFile(selectedFile);
    if (fileType === 'image') {
      setImage(URL.createObjectURL(selectedFile));
      setVideo(null);
    } else if (fileType === 'video') {
      setVideo(URL.createObjectURL(selectedFile));
      setImage(null);
    }
  }
  const handleSubmit = async () => {
    if (!title) {
      toast.error("Please enter a title for your post");
      return;
    }
    if (!image && !video) {
      toast.error("Please select an image or video for your post");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('text', title);
      const res = await handleCreatePost(formData);
      if (res.status === 200) {
        toast.success("Post created successfully");
        setCreatePost(false);
        setImage(null);
        setVideo(null);
        setTitle("");
        if (contentRef.current) {
          contentRef.current.value = null;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    
  }
  if (createPost === false) {
    return <></>;
  }
  return (
    <>
      <div className='w-full fixed h-screen bg-black/50 backdrop-blur-sm z-[100]'>
        <X className='absolute top-4 right-4 size-10 text-white cursor-pointer hover:text-red-500 transition-all duration-200'
          onClick={() => setCreatePost(false)} />
        <input
          type="file"
          accept="image/*,video/*"
          className='hidden'
          ref={contentRef}
          onChange={handleFileChange}
        />
        <div className='flex items-center justify-center w-full h-screen z-100'>
          {image && (
            <div className='relative group z-10'>
              <img
                src={image}
                alt="preview"
                className='w-90 h-80 object-cover rounded-lg shadow-lg transition-transform duration-300 transform group-hover:scale-105'
              />
              <X
                className='absolute bg-black/50 rounded-full top-2 right-2 text-white cursor-pointer hover:bg-red-500 transition-all duration-200 p-1'
                onClick={() => {
                  setImage(null);
                  if (contentRef.current) {
                    contentRef.current.value = null;
                  }
                }}
              />
            </div>
          )}
          {video && (
            <div className='relative group z-10'>
              <video
                src={video}
                controls
                className='w-90 h-80 rounded-lg shadow-lg transition-transform duration-300 transform group-hover:scale-105'
              />
              <X
                className='absolute bg-black/50 rounded-full top-2 right-2 text-white cursor-pointer hover:bg-red-500 transition-all duration-200 p-1'
                onClick={() => {
                  setVideo(null);
                  if (contentRef.current) {
                    contentRef.current.value = null;
                  }
                }}
              />
            </div>
          )}
          {!image && !video && (
            <div
              className='flex flex-col items-center justify-center border-dashed border-2 cursor-pointer border-gray-400 bg-gray-100 w-90 h-80 hover:bg-gray-200 transition-all duration-200 rounded-l-lg shadow-lg border-r-0'
              onClick={() => contentRef.current?.click()}
            >
              <Upload className='text-gray-700 cursor-pointer size-10 mb-2' />
              <h1 className='text-gray-700 font-bold'>Click to Upload</h1>
              <h1 className='text-gray-700'>&nbsp;an image or video</h1>
            </div>
          )}
          <div className='flex flex-col items-center justify-start w-90 h-80 border-2 border-l-0 bg-white rounded-r-lg  shadow-lg p-4 z-100'>
            <div className='flex items-center justify-start w-full gap-3 mb-4'>
              <img
                src={authUser.profilePic || avatar}
                alt="profile"
                className='w-12 h-12 rounded-full shadow-md'
              />
              <h1 className='text-lg font-semibold'>{authUser.userId}</h1>
            </div>
            <textarea
              value={title}
              className="w-full focus:outline-none h-32 border border-gray-300 p-2 mb-4 rounded-lg resize-none shadow-inner"
              maxLength={2000}
              placeholder="Write your post title here..."
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className='flex items-center justify-end w-full text-gray-500 text-sm mb-4'>
              {title.length}/2000
            </div>
            <button
              className="w-full p-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 cursor-pointer"
              onClick={() => {
                handleSubmit(title,image,video);
              }}
            >
              {loading?(<>
              <div className='flex items-center justify-center gap-2'>
              <Loader className='animate-spin text-white size-10' />
              <span className='ml-2'>Creating Post...</span>
              </div>
              </>):"Create Post"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePost