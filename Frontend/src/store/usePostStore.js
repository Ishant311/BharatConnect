import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import { all } from 'axios';
export const usePostStore = create((set,get) => ({
    posts: [],
    shuffledArr:[],
    allPosts:[],
    loadingAllPosts:true,
    recommendedPosts: [],
    postDetail: {},
    loadingPostDetail:true,
    likedPosts:[],
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
    getSinglePost:async(postId)=>{
        try {

            const res = await axiosInstance.get(`/post/get-posts/${postId}`);
            console.log(res);
            if(res.status === 200){
                set({postDetail: res.data})
                let mp = new Map();
                mp.set(postId, res.data.likes.length);
                set({likeCount: mp});
            }
        } catch (error) {
            console.log(error)
        } finally{
            set({loadingPostDetail:false});
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
            set({likedPosts: [...get().likedPosts, postId]})
            const mp = new Map(get().likeCount);
            mp.set(postId, (mp.get(postId) || 0) + 1);
            set({likeCount: mp})
            const res = await axiosInstance.post('/post/likePost', {postId});
        } catch (error) {
            console.log(error)
            set({likedPosts: get().likedPosts.filter((post) => post !== postId)})
            const mp = new Map(get().likeCount);
            mp.set(postId, (mp.get(postId) || 0) - 1);
            set({likeCount: mp})
        }
    },
    handleUnlikePost: async (postId)=>{
        try {
            const likedPosts = get().likedPosts.filter((post) => post !== postId);
            set({likedPosts: likedPosts})
            const mp = new Map(get().likeCount);
            mp.set(postId, (mp.get(postId) || 0) - 1);
            set({likeCount: mp})
            const res = await axiosInstance.post('/post/unlikePost', {postId});
        } catch (error) {
            console.log(error)
            set({likedPosts: [...get().likedPosts, postId]})
            const mp = new Map(get().likeCount);
            mp.set(postId, (mp.get(postId) || 0) + 1);
            set({likeCount: mp})
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
    getRecommendedPosts: async ()=>{
        try {
            if(!useAuthStore.getState().authUser) return;
            const res = await axiosInstance.get(`/post/explore`);
            if(res.status === 200){
                set({recommendedPosts: res.data.recommendedPosts})
            }
        } catch (error) {
            console.log(error)
        }
    },
    getAllPosts:async(page)=>{
        try {
            const res = await axiosInstance.get(`/post/explore-all?page=${page}`);
           
            set({allPosts:[...get().allPosts,...res.data]});
            console.log(get().allPosts);
        } catch (error) {
            console.log(error)
        } finally{
            set({loadingAllPosts:false});
        }
    }

}))

