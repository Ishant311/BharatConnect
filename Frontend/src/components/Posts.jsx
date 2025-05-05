import React, { useEffect } from 'react'
import { usePostStore } from '../store/usePostStore';
import avatar from '../../public/avatar.png'
import { Bookmark, Heart, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function Posts() {

    const { posts, likedPosts, handleLikePost, handleUnlikePost,likeCount,getRecommendedPosts,recommendedPosts } = usePostStore();
    const {savePost,unsavePost,savedPosts,getSavedPosts,following}= useUserStore();
    const {authUser} = useAuthStore();
    const likeMap = likeCount instanceof Map ? likeCount : new Map(Object.entries(likeCount));
    const showPosts = [...posts,...recommendedPosts];
    shuffleArray(showPosts);
    useEffect(()=>{
        getSavedPosts();
        getRecommendedPosts();
    },[]);
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center gap-8 p-4 sm:p-6 md:pl-[100px] lg:pl-[250px] sm:pl-[90px] w-full bg-gray-50 min-h-screen pb-25">
            {showPosts?.map((post) => (
                
                <div
                    key={post._id}
                    className="flex flex-col gap-3 p-5 rounded-2xl shadow-md bg-white w-full max-w-2xl transition hover:shadow-xl"
                >
                    {!authUser.following.includes(post.createdBy._id)?<>
                    <div>
                        Suggested
                    </div>
                    </>:<>
                    </>}
                    <div className="flex items-center w-full">
                        <img
                            src={post.createdBy.profilePic || avatar}
                            alt={post.createdBy.userId}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gray-300 object-cover cursor-pointer"
                            onClick={()=>{
                                navigate(`/profile/${post.createdBy.userId}`)
                            }}
                        />
                        <div className="ml-4 flex items-center justify-start gap-2 w-full">
                            <h1 className="text-sm sm:text-lg font-semibold text-gray-900">
                                {post.createdBy.userId}
                            </h1>
                            <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                    </div>

                    <div className="w-full rounded-lg overflow-hidden">
                        {post.type === "image" && (
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full max-h-[400px] object-cover rounded-xl shadow-sm hover:opacity-90 transition duration-300"
                            />
                        )}
                        {post.type === "video" && (
                            <video
                                src={post.video}
                                autoPlay
                                loop
                                controls
                                className="w-full max-h-[400px] rounded-xl shadow-sm"
                            />
                        )}
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-6">
                            <div className='flex items-center gap-2'>
                                <Heart
                                    className={`${
                                        likedPosts?.includes(post._id)
                                            ? "fill-red-600 text-red-600"
                                            : "text-gray-700"
                                    } w-6 h-6 cursor-pointer transition-transform hover:scale-125`}
                                    onClick={() => {
                                        if (likedPosts?.includes(post._id)) {
                                            handleUnlikePost(post._id);
                                        } else {
                                            handleLikePost(post._id);
                                        }
                                    }}
                                />
                            </div>
                            <MessageSquare className="text-gray-700 w-6 h-6 cursor-pointer transition-transform hover:scale-125" onClick={()=>{
                                navigate(`/post/${post._id}`)
                            }} />
                        </div>
                        <Bookmark className={` w-6 h-6 cursor-pointer transition-transform hover:scale-125 ${savedPosts?.includes(post._id)?"fill-black text-black":"text-gray-700"}`} onClick={()=>{
                            if(savedPosts?.includes(post._id)){
                                unsavePost(post._id);
                            }else{
                                savePost(post._id);
                            }
                        }}/>
                    </div>
                    

                    <span className="text-sm text-gray-700 pl-1">{likeMap.has(post._id)?likeMap.get(post._id):0} likes </span>
                    <div className="flex gap-2 items-center justify-start w-full pl-1">
                        <span className="font-bold text-black mr-1">{post.createdBy.userId}</span>
                        <span className="text-gray-900">{post.text}</span>
                    </div>
                    <div className='flex items-center gap-2 pl-1 text-sm text-gray-500' onClick={()=>{
                        navigate(`/post/${post._id}`)
                    }}>
                        View all {post.comments.length} comments
                    </div>
                    <div className="border-t border-gray-200 w-full"></div>
                </div>
            ))}
        </div>
    );
}

export default Posts;