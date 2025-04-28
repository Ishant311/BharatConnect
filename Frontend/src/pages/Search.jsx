import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { ArrowDownWideNarrow, Loader, SearchIcon } from 'lucide-react'
import { axiosInstance } from '../lib/axios';
import { useUserStore } from '../store/useUserStore';
import avatar from "../../public/avatar.png"
import { useAuthStore } from '../store/useAuthStore';
import Skeleton from '../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
function Search() {
    const {following,followUser,unfollowUser,getFollowing} = useUserStore();
    const {authUser} = useAuthStore();
    const navigate = useNavigate();

    useEffect(()=>{
        getFollowing();
    },[]);
    const [selectedOption, setSelectedOption] = useState("users");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [loadingResults, setLoadingResults] = useState(false);
    const handleSearch = async (val) => {
        if(val.length==0){
            setSearchResult([]);
            return ;
        }
        setLoadingResults(true);
        if (selectedOption === "posts") {
            try {
                const res = await axiosInstance.post(`post/search?title=${val}`);
                setSearchResult(res.data.users);
            } catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                const res = await axiosInstance.post(`user/search?name=${val}`);
                setSearchResult(res.data.users);
            } catch (error) {
                console.log(error);
            }
        }
        setLoadingResults(false);
    }
    useEffect(() => {
        handleSearch(searchTerm);
    }, [following]);
    return (
        <>
        
            <Sidebar />
            <Footer/>
            <div className='flex flex-col items-center justify-center gap-6 lg:ml-[250px] sm:ml-[80px] p-4'>
                <h1 className='text-3xl lg:text-4xl font-bold text-gray-800'>Search</h1>
                <p className='text-md lg:text-lg text-gray-500'>Search for posts, users </p>
                <div className='w-full max-w-2xl flex items-center justify-center'>
                    <div className='relative w-full z-[0]'>
                        <input type="text" value={searchTerm} onChange={(e) => {
                            setSearchTerm(e.target.value)
                            handleSearch(e.target.value);
                        }} placeholder='Search...' className='w-full max-w-2xl p-2 border border-gray-300 rounded-lg' />
                        <SearchIcon className='absolute right-4 top-2 text-gray-500' />
                    </div>
                    <div className="relative inline-block text-left ml-2 z-[1]">
                        <select
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-10 rounded-lg shadow-sm focus:outline-none transition duration-200 ease-in-out"
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                        >
                            <option value="users">👤 Users</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <ArrowDownWideNarrow />
                        </div>
                    </div>
                </div>
            <div className='w-full'>
            {loadingResults && (
                <Skeleton/>
            )}
            {loadingResults === false && searchResult?.map((user) => (
                <div key={user._id} className='flex items-center justify-start sm:justify-center p-4 w-full'>
                    <div className='flex items-center justify-between gap-2  w-full sm:w-[60%]'>
                        <div className='flex items-center justify-between gap-2'>
                            <img src={user.profilePic || avatar} alt={user.userName} className='size-10 sm:size-15 rounded-full cursor-pointer' onClick={()=>{
                                navigate(`/profile/${user.userId}`);
                            }}/>
                            <div >
                                <h1 className='text-sm sm:text-[17px] font-bold'>{user.userId}</h1>
                                <h1 className='text-sm text-gray-500'> {user.userName} • {user.followersCount} followers  </h1>
                            </div>
                        </div>
                        {authUser._id !== user._id?(<button className=' px-2 py-1 sm:px-4 sm:py-2 text-black bg-white border-2 rounded-sm hover:text-white hover:border-gray-400 hover:border-2 hover:bg-black transition-all duration-300 ease-in-out'
                            onClick={() => {
                                if (following?.includes(user._id)) {
                                    unfollowUser(user._id);
                                }
                                else {
                                    followUser(user._id);
                                }
                            }}>{following?.includes(user._id) ? "Unfollow" : "Follow"}</button>):null}
                        
                    </div>
                </div>
            ))}
            </div>
            </div>
        </>
    )
}

export default Search