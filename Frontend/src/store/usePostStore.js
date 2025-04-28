import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
export const usePostStore = create((set,get) => ({
    posts: [],
    likedPosts:[],
    savedPosts:[],
    likeCount: new Map(),
    isLoadingPosts: true,
    isCreatingPost: false,
    getPostsForHome: async () =>{
        if(!useAuthStore.getState().authUser) return;
        try {
            const res = await axiosInstance.get('/post/followed-posts');
            if(res.status === 200){
                set({posts: res.data.posts})
                let mp = new Map();
                for (let i = 0; i < res.data.posts.length; i++) {
                    const postId = res.data.posts[i]._id;
                    const likes = res.data.posts[i].likes.length;
                    mp.set(postId, likes);
                }
                set({likeCount: mp});
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            set({isLoadingPosts: false})
        }
    },
    handleCreatePost: async (formData)=>{

        try {
            const user = useAuthStore.getState().authUser;
            const res = await axiosInstance.post(`/post/create-post?id=${user._id}`, formData);
            return res;
        }
        catch (error) {
            console.log(error)
        }
        finally {
            set({isCreatingPost: false})
        }
    },
    handleLikePost: async (postId)=>{
        try {
            const res = await axiosInstance.post('/post/likePost', {postId});
            if(res.status === 200){
                set({likedPosts: [...get().likedPosts, postId]})
                const mp = new Map(get().likeCount);
                mp.set(postId, (mp.get(postId) || 0) + 1);
                set({likeCount: mp})
            }
        } catch (error) {
            console.log(error)
        }
    },
    handleUnlikePost: async (postId)=>{
        try {
            const res = await axiosInstance.post('/post/unlikePost', {postId});
            const likedPosts = get().likedPosts.filter((post) => post !== postId);
            if(res.status === 200){
                set({likedPosts: likedPosts})
                const mp = new Map(get().likeCount);
                mp.set(postId, (mp.get(postId) || 0) - 1);
                set({likeCount: mp})
            }
        } catch (error) {
            console.log(error)
        }
    },
    getLikedPost:async ()=>{
        try {
            if(!useAuthStore.getState().authUser) return;
            const res = await axiosInstance.get(`/post/likedPosts/?id=${useAuthStore.getState().authUser._id}`);
            if(res.status === 200){
                set({likedPosts: res.data.likedPosts})
            }
        } catch (error) {
            console.log(error)
        }
    },
    getLikesOnPost: async (postId)=>{
        try {
            const res = await axiosInstance.get(`/post/get-likes/count?postId=${postId}`);
            if(res.status === 200){
                set({postLikes: res.data.likes})
            }
        } catch (error) {
            console.log(error)
        }
    }
}))

