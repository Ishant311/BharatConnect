import {create}  from 'zustand';
import { axiosInstance } from '../lib/axios';
export const useAuthStore = create((set)=> ({
    authUser: null,
    UserProfilePic: null,
    isLoading: true,
    setUser: async ()=>{
        try {
           const res = await axiosInstance.get('/auth/check');
           if(res.status === 200){
                set({authUser: res.data.user})
           } 
        } catch (error) {
            console.log(error)
            set({authUser: null})
        }
        finally {
            set({isLoading: false})
        }
    },
    handleSignup: async (name,email,password,userId) => {
        try {
            const res = await axiosInstance.post('/auth/signup-send', {name,email,password,userId});
            return res;
        } catch (error) {
            return error;
        }
    },
    handleVerify: async (email,password,otp,name,userId) => {
        try {
            const res = await axiosInstance.post('/auth/signup-verify', {email,password,otp,name,userId});
            console.log(res.data)
            set({authUser: res.data.user})
            return res;
        } catch (error) {
            return error;
        }
    },
    handleLogin: async (email,password,userId) => {
        try {
            const res = await axiosInstance.post('/auth/signin', {email,password,userId});
            console.log(res.data)
            set({authUser: res.data.user})
            return res;
        } catch (error) {
            return error;
        }
    },
    handleLogout: async () => {
        try {
            const res = await axiosInstance.get('/auth/logout');
            set({authUser: null})
            return res;
        } catch (error) {
            return error;
        }
    }
}))