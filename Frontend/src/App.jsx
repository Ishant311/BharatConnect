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
import Followers from './components/Followers.jsx';
import Edit from './pages/Edit.jsx';
import Following from './components/Following.jsx';
import Protected from './components/Protected.jsx';
import Saved from './pages/Saved.jsx';
import Navbar from './components/Navbar.jsx';
import SinglePost from './pages/singlePost.jsx';
import Explore from './pages/Explore.jsx';

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
    <div className='sm:hidden sm:p-0 pt-15'>
      <Navbar/>
    </div>
    <Routes>
      <Route path="/" element={authUser?<Home/>:<Navigate to = "/login"/>}/>
      <Route path="/search" element={<Search/>} />
      <Route path="/explore" element={authUser?<Explore/>:<Navigate to = "/login"/>} />
      <Route path="/login" element={!authUser?<Signin/>:<Navigate to = "/"/>}/>
      <Route path="/signup" element={!authUser?<Signup/>:<Navigate to = "/"/>}/>
      <Route path="/post/:id" element={<SinglePost/>}/>
      <Route path="/profile/:id" element={<UserPosts/>}/>
      <Route path="/profile/:id/followers" element={authUser?<Followers/>:<Navigate to ="/login"/>}/>
      <Route path="/profile/:id/following" element={authUser?<Following/>:<Navigate to ="/login"/>}/>
      <Route path="/profile/:id/saved" element={
      <ProtectedRoute>
        <Saved/>
      </ProtectedRoute>
      }>
      </Route>
      <Route path="/edit" element={
        <Protected>
          <Edit/>
        </Protected>
      }/>
    </Routes>
    <Toaster/>
    </>
  )
}

export default App