import { DotIcon, Edit } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import profile from '../Img/profile_img2.png'
import { GoDotFill } from "react-icons/go";
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setMessage } from '@/redux/ChatSlice';
import { setSelectedUser } from '@/redux/AuthSlice';
import useGetAllMessage from '@/hooks/GetAllMessages';
import MSG from './MSG';

const Messanger = () => {
    const { user, suggestedUser, selectedUser } = useSelector(store => store.auth)
    const { onlineUsers, message } = useSelector(store => store.chat)
    const [textMessage, setTextMessage] = useState('')
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        console.log("send msj is : ", textMessage)
        try {
            const res = await axios.post(`https://social-media-web-9lmz.onrender.com/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            if (res.data.success) {
                setTextMessage('');
                dispatch(setMessage([...message, res.data.newMessage]))
            }

        } catch (error) {
            console.log(error);
        }
    }

    // cleaning function.... agar vapis message page per aaynge to pre selected user ko null ker dega
    useEffect(() => {
        dispatch(setSelectedUser(null))
    }, [])

    return (
        <>
            <div className='lg:ml-[18vw] xs:ml-[70px] ml-0 w-[25vw] border-r h-screen fixed overflow-auto'>
                <div>
                    <div className='fixed top-0 w-[25vw] bg-white border-r'>
                        <div className='p-3 pt-6 flex justify-between items-center '>
                            <span className='font-medium text-xl'>{user?.username}</span>
                            <Edit size={'20px'} cursor={'pointer'} />
                        </div>
                        <hr />
                    </div>
                    <div className='mt-16'>
                        {
                            // console.log("suggested users : ", suggestedUser)
                            suggestedUser.map((user, index) => {
                                const isOnline = onlineUsers.includes(user?._id)
                                return (
                                    <div onClick={() => dispatch(setSelectedUser(user))} className='flex justify-between items-center px-3 py-3 hover:bg-gray-50 cursor-pointer'>
                                        <div className='flex gap-3 items-center'>
                                            {
                                                // user.profilePicture ? <img src={`https://social-media-web-9lmz.onrender.com/uploads/${user.profilePicture}`} alt="DP" className="bg-gray-100 w-8 h-8 rounded-full cursor-pointer" />
                                                // :
                                                <img src={profile} alt="DP" className="bg-gray-100 w-11 h-11 rounded-full cursor-pointer" />
                                            }

                                            <div className='flex flex-col leading-tight'>
                                                <h1 className='font-medium cursor-pointer'>{user?.username}</h1>
                                                {
                                                    isOnline ? <span className='text-xs text-green-600'>online</span>
                                                        : <span className='text-xs text-red-600'>offline</span>
                                                }

                                            </div>
                                        </div>
                                        <GoDotFill color='skyblue' />
                                    </div>
                                )
                            })

                        }
                    </div>
                </div>
            </div>
            {
                selectedUser ?
                    <div className='lg:ml-[44vw] ml-[33vw]'>
                        <div className='flex flex-col gap-3 items-center justify-center pt-10'>
                            {
                                <img src={profile} alt="DP" className="bg-gray-100 w-36 h-36 rounded-full cursor-pointer" />
                            }

                            <div className='flex flex-col leading-tight items-center'>
                                <h1 className='font-medium cursor-pointer text-3xl'>{selectedUser?.username}</h1>
                                {/* <span className='text-sm text-green-600'>online</span> */}
                                {/* <Button variant={"secondary"} className="px-2">View Profile</Button> */}
                                <button className='bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm mt-2'>View Profile</button>
                            </div>
                        </div>
                        <div className='mb-16'>

                            <MSG />

                            <div className='flex group gap-2 py-2 fixed bottom-0 lg:w-[56vw] w-[67vw] px-2 bg-white'>
                                <input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type="text" className='border-2  rounded-lg py-1 px-2 outline-none w-full' />
                                <Button onClick={() => sendMessageHandler(selectedUser?._id)} className="bg-gray-400 w-20">Send</Button>
                            </div>
                        </div>
                    </div>
                    : null
            }


        </>
    )
}

export default Messanger