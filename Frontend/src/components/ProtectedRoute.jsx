import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Navigate, useParams } from 'react-router-dom';

function ProtectedRoute({children}) {
    const {authUser} = useAuthStore();
    const {id} = useParams();
    if(!authUser){
        return <Navigate to = "/login" />
    }
    
    if(authUser.userId !== id){
        return <Navigate to = {`/profile/${id}`} />
    }
    return children;
}

export default ProtectedRoute