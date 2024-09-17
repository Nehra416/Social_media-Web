import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSideBar from './RightSideBar'
import useGetAllPost from '@/hooks/GetAllPost'
import useGetSuggestedUser from '@/hooks/GetSuggestedUser'

const Home = () => {
  console.log("rerender")
  useGetAllPost();
  useGetSuggestedUser();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
      </div>
      <RightSideBar />
    </div>
  )
}

export default Home