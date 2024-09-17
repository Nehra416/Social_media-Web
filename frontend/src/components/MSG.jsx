import useGetAllMessage from '@/hooks/GetAllMessages'
import React from 'react'
import profile from '../Img/profile_img2.png'
import { useSelector } from 'react-redux'
import useGetPresentMsg from '@/hooks/GetPresentMsg'

const MSG = () => {
    const { onlineUsers, message } = useSelector(store => store.chat)
    const { user } = useSelector(store => store.auth)

    useGetPresentMsg()
    useGetAllMessage()
    return (
        <>
            {
                message && message?.map((msj, index) => {
                    return (
                        <div className={`flex gap-3 my-3 px-3 ${user._id === msj.senderId ? 'justify-end' : 'justify-start'} w-full`}>
                            {
                                user._id === msj.senderId ?
                                    <>
                                        <p className={`font-medium px-3 py-1 rounded-lg ${user._id === msj.senderId ? 'bg-gray-100' : 'bg-blue-400 text-white'}`}>{msj.message}</p>
                                        <img src={profile} alt="DP" className="bg-gray-100 w-7 h-7 rounded-full cursor-pointer" />
                                    </> :
                                    <>
                                        <img src={profile} alt="DP" className="bg-gray-100 w-7 h-7 rounded-full cursor-pointer" />
                                        <p className={`font-medium px-3 py-1 rounded-lg ${user._id === msj.senderId ? 'bg-gray-100' : 'bg-blue-400 text-white'}`}>{msj.message}</p>
                                    </>
                            }
                        </div>
                    )
                })
            }
        </>
    )
}

export default MSG