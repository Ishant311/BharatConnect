
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { Bookmark, Heart, MessageSquare, X } from 'lucide-react';
import { usePostStore } from '../store/usePostStore';
import avatar from '../../public/avatar.png';
import { formatDistanceToNow } from 'date-fns';
import { useUserStore } from '../store/useUserStore';
import { axiosInstance } from '../lib/axios';
function SinglePost() {
    const { id } = useParams();
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    document.body.style.overflow = "hidden";
    const navigate = useNavigate();
    const { postDetail, getSinglePost, loadingPostDetail, likedPosts, likeCount, handleLikePost, handleUnlikePost,getLikedPost } = usePostStore();
    const { savedPosts, savePost, unsavePost } = useUserStore();
    const handleCommentPost = async () => {
        if (comment.length === 0) return;
        setLoading(true);
        try {
            const res = await axiosInstance.post(`/post/comment`, {
                comment, postId: id
            });
        } catch (error) {

        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        getSinglePost(id);
        getLikedPost();
    }, [])
    const likeMap = likeCount instanceof Map ? likeCount : new Map(Object.entries(likeCount));
    if (loadingPostDetail) return <h1 className='text-3xl text-center'>Loading...</h1>
    return (
        <>
            <Sidebar />
            <div className='h-screen w-full bg-black/30 fixed top-0 left-0 '>
                <div className='sm:flex h-screen w-full justify-center items-center'>
                    <div className='h-5/6 sm:w-150 lg:w-250 bg-white rounded-lg shadow-lg flex justify-start items-center relative'>
                        <X className='absolute top-2 right-2' onClick={() => {
                            navigate(-1);
                            document.body.style.overflow = "auto";
                        }} />
                        <div className='hidden md:w-200 w-4/3 sm:flex items-start justify-start h-full'>

                            {postDetail.image && <img src={postDetail.image} alt="Post" className='h-full w-full lg:object-contain sm:object-cover bg-gray-200 rounded-lg' />}
                            {postDetail.video && <video src={postDetail.video}
                                autoPlay
                                loop
                                controls
                                className='h-full w-full lg:object-contain sm:object-cover bg-gray-200 rounded-lg' />}
                        </div>
                        <div className='sm:w-200 lg:w-[400px] h-full flex flex-col justify-start items-start'>
                            <div className='w-full flex justify-start items-center py-3 px-2'>
                                <img src={postDetail.createdBy?.profilePic || avatar} alt="Profile" className='h-10 w-10 rounded-full object-cover' />
                                <h1 className='text-sm ml-2 font-bold'>{postDetail.createdBy?.userId}</h1>
                            </div>
                            <div className='border-b-1 border-gray-200 w-full'>

                            </div>

                            <div className='w-full h-100 flex flex-col justify-start items-start p-2 overflow-y-scroll scrollbar-none'>
                                <div className='flex flex-col justify-start items-start'>

                                    <div className='flex justify-start items-center gap-3 '>
                                        <div className='flex justify-start items-center'>
                                            <img src={postDetail.createdBy?.profilePic || avatar} alt="Profile" className='h-10 w-10 rounded-full object-cover' />
                                            <h1 className='text-sm ml-2 font-semibold'>{postDetail.createdBy?.userId}</h1>
                                        </div>
                                        <p className='text-sm'>{postDetail.text}</p>
                                    </div>
                                    <h1 className='text-sm text-gray-500 mt-2'>
                                        {formatDistanceToNow(new Date(postDetail.createdAt))}
                                    </h1>
                                </div>
                                <div className='w-full flex justify-center items-center'>
                                    <div className='flex flex-col justify-start items-start w-full'>
                                        {postDetail.comments.length > 0 ? postDetail.comments.map((comment, index) => (
                                            <>
                                            <div key={index} className='flex justify-start items-center gap-3 mt-2'>
                                                <div className='flex gap-2 justify-start items-center'>
                                                <img src={comment.commentBy?.profilePic || avatar} alt="Profile" className='size-8 rounded-full object-cover' />
                                                <h1 className='text-sm font-semibold'>{comment.commentBy?.userId}</h1>
                                                </div>

                                                <p className='text-sm'>{comment.text}</p>
                                            </div>
                                            <h1 className='text-[10px] text-gray-500 mt-2'>
                                                {formatDistanceToNow(new Date(comment.commentOn))}
                                            </h1>
                                            </>
                                        )) : (
                                            <h1 className='text-sm text-gray-500'>No Comments</h1>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-between items-center w-full p-2 border-t-1 border-gray-200'>
                                <div className='flex justify-start items-center gap-3'>
                                    <Heart className={`${likedPosts.includes(id) ? "fill-red-600 text-red-600" : "text-black"} text-sm`} onClick={
                                        () => {
                                            if (likedPosts.includes(id)) {
                                                handleUnlikePost(id);
                                            } else {
                                                handleLikePost(id);
                                            }
                                        }
                                    } />
                                    <MessageSquare className="text-sm" />
                                </div>
                                <Bookmark className={`${savedPosts.includes(id) ? "fill-black" : "text-black"}`}
                                    onClick={() => {
                                        if (savedPosts.includes(id)) {
                                            unsavePost(id);
                                        } else {
                                            savePost(id);
                                        }
                                    }} />
                            </div>
                            <div className='flex justify-between items-center w-full pl-3'>
                                <h1 className='text-sm text-gray-500'>{likeMap.get(id) || 0} Likes</h1>
                            </div>
                            <div className='border-b-1 w-full border-gray-200'>
                                <h4 className='text-[11px] text-gray-500 pl-3 py-1'>
                                    {formatDistanceToNow(new Date(postDetail.createdAt), { addSuffix: true })}
                                </h4>
                            </div>
                            {loading && <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center'>
                                <h1 className='text-2xl font-bold text-white'>Posting...</h1>
                            </div>
                            }

                            {!loading && <div className='relative w-full flex justify-start items-center gap-3 p-2'>

                                <input type="text" value={comment} placeholder='Add a comment...' className='w-full h-10 pl-2 rounded-lg focus:outline-none placeholder:font-sans' onChange={(e) => {
                                    setComment(e.target.value)
                                }} />
                                <button className={`absolute right-2 text-sm font-semibold ${comment.length > 0 ? "text-blue-500" : "text-blue-100"} `} onClick={() => {
                                    handleCommentPost();
                                    setComment("");
                                }}>Post</button>
                            </div>}

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SinglePost
