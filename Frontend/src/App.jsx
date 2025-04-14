import {Routes,Route, useNavigate, Navigate, useParams} from 'react-router-dom'
import Signup from './pages/Signup'
import { useAuthStore } from './store/useAuthStore.js'
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Signin from './pages/Signin.jsx';
import Home from './pages/Home.jsx';
import UserPosts from './pages/UserPosts.jsx';
import Search from './pages/Search.jsx';
import Profile from './components/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  const {authUser,setUser,isLoading} = useAuthStore();
  useEffect(()=>{
    setUser();
  },[])
  if(isLoading && !authUser){
    return (<h1>Loading...</h1>)
  }
  return (
    <>
    <Routes>
      <Route path="/" element={authUser?<Home/>:<Navigate to = "/login"/>}/>
      <Route path="/search" element={<Search/>} />
      <Route path="/login" element={!authUser?<Signin/>:<Navigate to = "/"/>}/>
      <Route path="/signup" element={!authUser?<Signup/>:<Navigate to = "/"/>}/>
      <Route path="/explore" element={<h1>Explore</h1>} />
      <Route path="/profile/:id" element={<UserPosts/>}/>
      <Route path="/profile/:id" element={
        <ProtectedRoute>
          <Profile/>
        </ProtectedRoute>
        }>
        <Route path="saved" element={
            <Profile/>
          } />
      </Route>
    </Routes>
    <Toaster/>
    </>
  )
}

export default App
