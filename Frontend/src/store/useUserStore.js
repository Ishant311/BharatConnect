import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { usePostStore } from './usePostStore';

export const useUserStore = create((set,get)=>({
    userSuggestions:[],
    userProfile:null,
    isLoadingSuggestions: true,
    followers:[],
    following:[],
    loadingFollowers: true,
    followersCnt:{},
    userPosts:[],
    loadingUserPosts: true,
    loadingProfile: true,
    getFollowing: async()=>{
        try {
            const res = await axiosInstance.get('/user/following');
            if(res.status === 200){
                set({following: res.data.following})
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
        } finally {
            set({loadingFollowers: false})
        }
    }
}))

