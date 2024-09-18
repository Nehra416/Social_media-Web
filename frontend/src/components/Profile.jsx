import React, { useState } from 'react'
import profile from "../Img/profile_img2.png"
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useSelector } from 'react-redux'
import { Badge } from './ui/badge'
import { Link, useParams } from 'react-router-dom'
import useGetUserProfile from '@/hooks/GetUsersProfile'
import { Button } from './ui/button'
import testing from "./testing.jpg"
import { AtSign, Heart, MessageCircle } from 'lucide-react'

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId)
  const [activeTab, setActiveTab] = useState('posts')

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  }

  const { userProfile, user } = useSelector(store => store.auth);
  // console.log("userProfile data : ", userProfile)
  const dataDisplay = activeTab === 'posts' ? userProfile?.post : userProfile?.bookmark
  console.log("dataDisplay is : ", dataDisplay)

  const isLogedIn = userProfile?._id === user?._id;
  const isFollow = true;

  return (
    <div>
      <div className='lg:ml-[25vw] xs:ml-[18vw] mt-[10vh] flex md:gap-12 gap-5 items-center mx-3' >

        {/* profile photo */}
        <div className='flex-shrink-0'>
          <Avatar >
            {
              userProfile?.profilePicture ?
                // <AvatarImage src={`https://social-media-web-9lmz.onrender.com/uploads/${userProfile?.profilePicture}`} alt='ProfilePicture' className='md:w-36 w-24 md:h-36 h-24 rounded-full  border-4' />
                <AvatarImage src={userProfile?.profilePicture} alt='ProfilePicture' className='md:w-36 w-24 md:h-36 h-24 rounded-full  border-4' />
                :
                <AvatarImage src={profile} alt='ProfilePicture' className='md:w-36 w-20  md:h-36 h-20 rounded-full  border-4' />
            }
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        {/* side div of details of profile */}
        <div>
          <div className='flex gap-4 items-center'>
            <span className='text-3xl '>{userProfile?.username}</span>
            {
              isLogedIn ?
                // hide this style of show details like edit when screen is smaller than md;
                <div className='gap-2 md:flex hidden'>
                  <Button variant={"secondary"} className={"cursor-pointer px-2 py-1 h-8 hover:bg-gray-100"}><Link to={`/edit`}>Edit profile</Link></Button>
                  <Button variant={"secondary"} className={"cursor-pointer px-2 py-1 h-8 hover:bg-gray-100"}>View Archieve</Button>
                  <Button variant={"secondary"} className={"cursor-pointer px-2 py-1 h-8 hover:bg-gray-100"}>Ad tools</Button>
                </div>

                :
                <>
                  {
                    isFollow ? <Button variant={"secondary"} className={"cursor-pointer bg-[#41b2fd] text-white px-5 hover:bg-[#2595ff]"}>Unfollow</Button>
                      : <Button variant={"secondary"} className={"cursor-pointer bg-[#41b2fd] text-white px-5 hover:bg-[#2595ff]"}>Follow</Button>
                  }

                  <Button variant={"secondary"} className={"cursor-pointer px-5 hover:bg-gray-100"}>Message</Button>
                </>
            }

          </div>

          {/* this will show details when screen is below md */}
          {
            isLogedIn &&
            <div className='gap-2 md:hidden flex flex-col max-w-52 mt-3'>
              <div className='flex gap-1 xs:gap-3'>
                <Button variant={"secondary"} className={"cursor-pointer text-sm xs:text-base px-2 py-1 h-8 hover:bg-gray-100"}><Link to={`/edit`}>Edit profile</Link></Button>
                <Button variant={"secondary"} className={"cursor-pointer px-2 py-1 h-8 hover:bg-gray-100"}>View Archieve</Button>
              </div>
              <Button variant={"secondary"} className={"cursor-pointer px-2 py-1 h-8 hover:bg-gray-100"}>Ad tools</Button>
            </div>
          }
          {/* this followers details show above the md screen */}
          <div className='mt-4 mb-3 gap-12 md:flex hidden'>
            <p className='text-lg'><span className='font-medium'>{userProfile?.followers.length}</span> posts</p>
            <p className='text-lg'><span className='font-medium'>{userProfile?.followers.length}</span> followers</p>
            <p className='text-lg'><span className='font-medium'>{userProfile?.following.length}</span> following</p>
          </div>

          <p className='max-w-60 text-sm md:flex hidden'>{userProfile?.bio || 'bio here...'}</p>

        </div >
      </div>

      <p className='max-w-60 text-sm md:hidden block xs:ml-[18vw] ml-5 mt-5'>{userProfile?.bio || 'bio here...'}</p>

      {/* hr seen only in below md screen */}
      <hr className='md:hidden block mt-4' />

      {/* this followers details show below the md screen */}
      <div className='gap-[15vw] mx-10 md:hidden flex justify-center'>
        <p className=' flex flex-col items-center text-gray-500'>
          <span className='font-medium text-lg text-black'>{userProfile?.post.length}</span>
          posts
        </p>
        <p className=' flex flex-col items-center text-gray-500'>
          <span className='font-medium text-lg text-black'>{userProfile?.followers.length}</span>
          followers
        </p>
        <p className=' flex flex-col items-center text-gray-500'>
          <span className='font-medium text-lg text-black'>{userProfile?.following.length}</span>
          following
        </p>
      </div>

      {/* horizontal bar  */}
      <hr className='md:mt-8 mt-2' />

      {/* tags like post,savwd... */}
      <div className='flex justify-center xs:gap-20 gap-10 text-lg font-medium mt-3 xs:ml-[17vw]'>
        <span className={`hover:text-gray-400 cursor-pointer ${activeTab === 'posts' ? 'font-bold hover:text-black' : null}`} onClick={() => handleActiveTab('posts')}>Posts</span>
        <span className={`hover:text-gray-400 cursor-pointer ${activeTab === 'saved' ? 'font-bold hover:text-black' : null}`} onClick={() => handleActiveTab('saved')}>Saved</span>
        <span className='hover:text-gray-400 cursor-pointer'>Reels</span>
        <span className='hover:text-gray-400 cursor-pointer'>Tags</span>
      </div>

      {/* show the posts of profile.. */}
      <div className='grid grid-cols-3 lg:ml-[20vw] xs:ml-[14vw] gap-2 max-w-4xl my-6 mb-16 mx-2 '>
        {
          dataDisplay?.map((items, index) => {
            return (
              <div key={index} className='relative cursor-pointer group'>
                <img src={items.image} alt="posts" className='rounded-sm aspect-square object-cover cursor-pointer' />
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='flex items-center text-white space-x-4'>
                    <button className="flex items-center gap-2 hover:text-gray-300 ">
                      <Heart />
                      <span>{items.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300 ">
                      <MessageCircle />
                      <span>{items.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Profile
