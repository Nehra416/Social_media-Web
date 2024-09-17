import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'

const MainLayout = () => {
  return (
    <div>
      <LeftSideBar />
      <Outlet />
      {/* Outlet responsible for render all the childrens... */}
    </div>
  )
}

export default MainLayout