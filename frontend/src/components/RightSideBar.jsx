import React from 'react'
import profile from "../Img/profile_img2.png"
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const RightSideBar = () => {
  const { user } = useSelector(store => store.auth)
  const { suggestedUser } = useSelector(store => store.auth)

  return (
    <div className='lg:w-[25%] md:block hidden border-l border-gray-200'>

      <>
        {/* display the user */}
        <div className='flex justify-between items-center m-5'>
          <div className='flex gap-3 items-center'>
            {
              user.profilePicture ? <img src={user.profilePicture} alt="DP" className="bg-gray-100 w-10 h-10 rounded-full cursor-pointer" />
                : <img src={profile} alt="DP" className="bg-gray-100 w-10 h-10 rounded-full cursor-pointer" />
            }

            <Link to={`/profile/${user._id}`}><h1 className='font-medium cursor-pointer'>{user.username}</h1></Link>
          </div>
          <div>
            <span className='text-[#0094f6] text-sm font-medium cursor-pointer hover:text-[#00376B]'>Switch</span>
          </div>
        </div>

        <div className='flex items-center justify-between m-5'>
          <span className='text-gray-500 text-sm font-semibold'>Suggested for you</span>
          <span className='text-sm font-medium cursor-pointer hover:text-gray-500'>See All</span>
        </div>

        {/* display the suggested user */}
        <div>
          {
            suggestedUser?.map((user, index) => {
              return (
                <div className='flex justify-between items-center m-5' key={index}>
                  {/* link to send user to the suggested user's profile */}
                  <Link to={`/profile/${user._id}`}>
                    <div className='flex gap-3 items-center'>
                      {
                        user?.profilePicture ? <img src={user?.profilePicture} alt="DP" className="bg-gray-100 w-10 h-10 rounded-full cursor-pointer" />
                          : <img src={profile} alt="DP" className="bg-gray-100 w-10 h-10 rounded-full cursor-pointer" />
                      }

                      <h1 className='font-medium cursor-pointer'>{user.username}</h1>
                    </div>
                  </Link>
                  <div>
                    <span className='text-[#0094f6] text-sm font-medium cursor-pointer hover:text-[#00376B]'>Follow</span>
                  </div>
                </div>
              )
            })
          }
        </div>
        {/* text about the project */}
        <span className='text-sm text-gray-500 block mt-10 mx-8'>@2024 clone project . . .</span>
      </>
    </div>
  )
}

export default RightSideBar