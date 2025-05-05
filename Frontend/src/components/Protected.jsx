import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';
import { Navigate } from 'react-router-dom';

function Protected({children}) {
    const {authUser} = useAuthStore();
    if(!authUser){
        return <Navigate to = "/login" />
    }
    const getUser = async ()=>{
        const user = await axiosInstance.get(`/auth/check`)
        if(authUser.userId !== user.data.user.userId){
            return <Navigate to = {`/profile/${user.data.user.userId}`} />
        }
        return user.data.user.userId;
    }
    getUser();
    return children;
}

export default Protected