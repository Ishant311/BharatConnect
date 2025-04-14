import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
export const usePostStore = create((set,get) => ({
    posts: [],
    likedPosts:[],
    savedPosts:[],
    likeCount: 0,
    isLoadingPosts: true,
    isCreatingPost: false,
    getPostsForHome: async () =>{
        if(!useAuthStore.getState().authUser) return;
        try {
            const res = await axiosInstance.get('/post/followed-posts');
            if(res.status === 200){
                set({posts: res.data.posts})
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
            console.log(formData);
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
                set({likedPosts: likedPosts,likeCount: get().likeCount - 1})
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

