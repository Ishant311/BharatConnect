import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { usePostStore } from './usePostStore';
import { useAuthStore } from './useAuthStore';

export const useUserStore = create((set,get)=>({
    userSuggestions:[],
    userProfile:null,
    isLoadingSuggestions: true,
    followers:[],
    following:[],
    savedPosts:[],
    savedPostsArr:[],
    loadingSavedPosts: true,
    loadingFollowers: true,
    loadingFollowing:true,
    followersCnt:{},
    userPosts:[],
    loadingUserPosts: true,
    loadingProfile: true,
    getFollowing: async(userId)=>{
        try {
            const res = await axiosInstance.get(`/user/following/${userId}`);
            console.log(res);
            if(res.status === 200){
                set({following: res.data.following.map((user)=>user._id)})
            }
        } catch (error) {
            console.log(error)
        }
    },
    suggestions:async()=>{
        try {
            const res = await axiosInstance.get('/user/suggestion');
            if(res.status === 200){
                set({userSuggestions: res.data.suggestions})
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            set({isLoadingSuggestions: false})
        }
    },
    followUser: async (userId)=>{
        try {
            const res = await axiosInstance.post('/user/follow', {followId: userId});
            if(res.status === 200){
                get().getFollowing();
            }
            get().suggestions();
            usePostStore.getState().getPostsForHome();
            return res;
        } catch (error) {
            console.log(error)
        }
    },
    unfollowUser: async (userId)=>{
        try {
            const res = await axiosInstance.post('/user/unfollow', {unfollowId: userId});
            if(res.status === 200){
                get().getFollowing();
            }
            return res;
        } catch (error) {
            console.log(error)
        }
    },
    getUserProfile: async (userId)=>{
        try {
            const res = await axiosInstance.get(`/user/profile/${userId}`);
            if(res.status === 200){
                set({userProfile: res.data.user})
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            set({loadingProfile: false})
        }
    },
    getUserPosts: async (userId)=>{
        try {
            const res = await axiosInstance.get(`/post/get-posts?id=${userId}`);
            if(res.status === 200){
                set({userPosts: res.data.posts})
            }
        } catch (error) {
            console.log(error)
        }finally {
            set({loadingUserPosts: false})
        }
    },
    getUserFollowers: async(userId)=>{
        try {
            const res = await axiosInstance.get(`/user/followers/${userId}`);
            if(res.status === 200){
                set({followers: res.data.followers})
            }
        } catch (error) {
            console.log(error)
        } 
        finally {
            set({loadingFollowers: false})
        }
    },
    getUserFollowing: async(userId)=>{
        try {
            const res = await axiosInstance.get(`/user/following/${userId}`);
            if(res.status === 200){
                set({following: res.data.following});
            }
        } catch (error) {
            console.log(error)
        } 
        finally {
            set({loadingFollowing: false})
        }
    },
    getSavedPosts: async()=>{
        try {
            const res = await axiosInstance.get(`/post/savedPosts?id=${useAuthStore.getState().authUser._id}`);
            if(res.status === 200){
                set({savedPostsArr: res.data.savedPosts});
                let saved = [];
                for(let i=0; i<res.data.savedPosts.length; i++){
                    saved.push(res.data.savedPosts[i]._id);
                }
                set({savedPosts: saved});
            }
            return res;
        } catch (error) {
            console.log(error)
        } 
        finally {
            set({loadingSavedPosts: false})
        }
    },
    savePost:async(postId)=>{
        try {
            set({savedPosts: [...get().savedPosts, postId]})
            await axiosInstance.post(`/user/savePost?id=${postId}`);

        } catch (error) {
            console.log(error)
            set({savedPosts: get().savedPost.filter((post) => post !== postId)})
        }
    },
    unsavePost:async(postId)=>{
        try {
            set({savedPosts: get().savedPosts.filter((post) => post !== postId)})
            await axiosInstance.post(`/user/unsavePost?id=${postId}`);
        } catch (error) {
            console.log(error)
            set({savedPosts: [...get().savedPost, postId]})
        }
    },
    setAllStatesToFalse:()=>{
        set({loadingUserPosts: true, loadingProfile: true, loadingFollowers: true, loadingFollowing:true, loadingSavedPosts: true});
        set({userPosts: [], userProfile: null, followers: [], following: [], savedPostsArr: []});
    }
}))

