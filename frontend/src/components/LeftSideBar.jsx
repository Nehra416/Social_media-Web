import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search } from 'lucide-react'
import { FaRegCompass } from "react-icons/fa";
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import profile from "../Img/profile_img2.png"
import { toast } from 'sonner'
import CreatePost from './CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser, setSuggestedUser, setUserProfile } from '@/redux/AuthSlice'
import { setLikeNotification } from '@/redux/NotificationSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { setPosts, setSelectedPost } from '@/redux/PostSlice';
import { setMessage, setOnlineUsers } from '@/redux/ChatSlice';


const LeftSideBar = () => {
    const navigate = useNavigate();
    const path = useLocation();
    const [openCreatePost, setOpenCreatePost] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.notification);
    const dispatch = useDispatch();

    const content = [
        { icon: <Home size={'28px'} />, text: "Home" },
        { icon: <Search size={'28px'} />, text: "Search" },
        { icon: <FaRegCompass size={'28px'} />, text: "Explore" },
        { icon: <MessageCircle size={'28px'} />, text: "Messages" },
        { icon: <Heart size={'28px'} />, text: "Notifications" },
        { icon: <PlusSquare size={'28px'} />, text: "Create" },
        {
            icon:

                user?.profilePicture ?
                    <img src={user?.profilePicture} alt="DP" className="bg-gray-100 w-8 h-8 rounded-full cursor-pointer" />
                    : <img src={profile} alt="DP" className="bg-gray-100 w-8 h-8 rounded-full cursor-pointer" />

            ,
            text: "Profile"
        },
        { icon: <LogOut size={'28px'} />, text: "LogOut" },

    ]

    const handleLogOut = async () => {
        try {
            const res = await axios.get("http://localhost:8000/user/signout")
            if (res.data.success) {
                navigate("/signin")
                toast.success(res.data.message)
                
                // for clear the persist...
                dispatch(setUserProfile(null))
                dispatch(setAuthUser(null))
                dispatch(setSuggestedUser(null))
                dispatch(setPosts(null))
                dispatch(setSelectedPost(null))
                dispatch(setMessage(null))
                dispatch(setOnlineUsers(null))

            }
        } catch (error) {
            toast.error('Unexpected error')
        }
    }

    const handleText = (textType) => {
        if (textType === 'LogOut') handleLogOut();
        else if (textType === 'Create') setOpenCreatePost(true)
        else if (textType === 'Profile') navigate(`/profile/${user._id}`)
        else if (textType === 'Home') navigate(`/`)
        else if (textType === 'Messages') navigate(`/messanger`)
    }


    return (
        <>
            <div className={`fixed xs:top-0 bottom-0 xs:h-screen left-0 lg:w-[18%] xs:w-auto w-full border-t-2 xs:border-r xs:border-t-0 border-gray-200  xs:p-3 bg-white z-10`}>
                <div className='lg:block hidden text-center font-bold text-xl'>
                    LOGO
                </div>
                <div className='flex justify-around items-center h-10  xs:block'>
                    {
                        content.map((item, index) => {
                            return (
                                <div onClick={() => handleText(item.text)} key={index} className={`flex gap-4 xs:mt-3 xs:p-2 xs:  rounded-lg cursor-pointer hover:bg-gray-100 items-center justify-start relative ${item.text === 'Search' && 'hidden xs:flex'} ${item.text === 'Explore' && 'hidden xs:flex'}`} >
                                    {item.icon}
                                    <span className={`text-lg lg:block hidden`}>{item.text}</span>

                                    {/* for show notifications... */}
                                    {
                                        item.text === 'Notifications' && likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className="rounded-full w-4 h-4 absolute bottom-6 left-6 bg-red-600 hover:bg-red-600">{likeNotification.length}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? <p>No new Notification</p>
                                                                : likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-3 my-1'>
                                                                            <Avatar>
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                        </div>
                                                                    )
                                                                })
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>

            </div>

            <CreatePost openCreatePost={openCreatePost} setOpenCreatePost={setOpenCreatePost} />

        </>
    )
}

export default LeftSideBar