import React, { useEffect } from 'react'
import { usePostStore } from '../store/usePostStore';
import avatar from '../../public/avatar.png'
import { Bookmark, Heart, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

function Posts() {

    const { posts, likedPosts, handleLikePost, handleUnlikePost,likeCount } = usePostStore();
    const likeMap = likeCount instanceof Map ? likeCount : new Map(Object.entries(likeCount));
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center gap-8 p-4 sm:p-6 md:p-10 lg:pl-[250px] sm:pl-[80px] w-full bg-gray-50 min-h-screen">
            {posts?.map((post) => (
                <div
                    key={post._id}
                    className="flex flex-col gap-6 p-5 rounded-2xl shadow-md bg-white w-full max-w-2xl transition hover:shadow-xl"
                >
                    <div className="flex items-center w-full">
                        <img
                            src={post.createdBy.profilePic || avatar}
                            alt={post.createdBy.userId}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gray-300 object-cover cursor-pointer"
                            onClick={()=>{
                                navigate(`/profile/${post.createdBy.userId}`)
                            }}
                        />
                        <div className="ml-4">
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

                    {/* Post Actions */}
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
                                <span className="text-sm text-gray-700">{likeMap.has(post._id)?likeMap.get(post._id):0}</span>
                            </div>
                            <MessageSquare className="text-gray-700 w-6 h-6 cursor-pointer transition-transform hover:scale-125" />
                        </div>
                        <Bookmark className="text-gray-700 w-6 h-6 cursor-pointer transition-transform hover:scale-125" />
                    </div>

                    {/* Post Text */}
                    <div className="text-left w-full">
                        <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                            <span className="font-bold text-black mr-1">{post.createdBy.userId}</span>
                            {post.text}
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 w-full"></div>
                </div>
            ))}
        </div>
    );
}

export default Posts;