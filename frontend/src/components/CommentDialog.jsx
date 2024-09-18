import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import React, { useEffect, useState } from 'react'
import testing from "./testing.jpg"
import profile from "../Img/profile_img2.png"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { MoreHorizontal } from "lucide-react"
import { Button } from "./ui/button"
import { FaRegBookmark, FaRegHeart } from "react-icons/fa"
import { LuMessageCircle, LuSend } from "react-icons/lu"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { toast } from "sonner"
import { setPosts } from "@/redux/PostSlice"


const CommentDialog = ({ openComment, setOpenComment }) => {
    const [text, setText] = useState("")
    const { selectedPost, posts } = useSelector(store => store.post)
    const dispatch = useDispatch()
    const [comment, setComment] = useState([])

    // why this useeffect is neccessary here...
    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost?.comments)
        }
    }, [selectedPost])


    const handleCommentText = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText)
        } else {
            setText("")
        }
    }

    const PostComment = async () => {
        try {
            const res = await axios.post(`https://social-media-web-9lmz.onrender.com/post/comment/${selectedPost._id}`, { text }, {
                headers: {
                    "Content-Type": "application/json" // not neccessary...
                },
                withCredentials: true
            })
            // console.log('res is :', res)

            if (res.data.success) {

                const updatedComment = [...comment, res.data.comment]
                setComment(updatedComment)

                const updatedPostData = posts.map((p) => p._id === selectedPost._id
                    ? { ...p, comments: updatedComment } : p
                    // ? { ...p, comments: [res.data.comment, ...p.comments] } : p
                )
                console.log("PostComment: ", updatedPostData);

                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
                setText("")
            }
        } catch (error) {
            console.log(error)
            // toast.error(error.response.data.message)
        }
    }

    return (
        <Dialog open={openComment}>
            <DialogContent onInteractOutside={() => setOpenComment(false)} className="p-0 max-w-4xl border-none">
                <div className="flex gap-3">
                    <div className="w-1/2">
                        <img
                            className='aspect-square object-cover w-full h-full rounded-s-lg'
                            src={selectedPost?.image}
                            alt="Post_Img"
                        />
                    </div>
                    <div className="w-1/2 flex flex-col justify-between">

                        <div className='flex items-center justify-between '>
                            <div className='flex gap-3 items-center mt-2'>
                                {/* <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" className='' />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar> */}
                                {
                                    selectedPost?.author?.profilePicture ?
                                        <img src={selectedPost?.author?.profilePicture} alt="DP" className="bg-gray-100 w-8 h-8 rounded-full" />
                                        : <img src={profile} alt="DP" className="bg-gray-100 w-8 h-8 rounded-full" />
                                }

                                <h1>{selectedPost?.author.username}</h1>
                            </div>
                            <div className="mr-3 pt-3">
                                <Dialog>
                                    <DialogTrigger>
                                        <MoreHorizontal />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <Button variant="ghost" className="text-red-700" >Unfollow</Button>
                                        <Button variant="ghost">Follow</Button>
                                        <Button variant="ghost">Cancel</Button>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <hr className="my-2" />

                        <div className="flex-grow overflow-y-auto max-h-64">

                            {
                                comment.map((comment, index) => {
                                    return (
                                        <div className="flex justify-between " key={index}>
                                            <div>
                                                <div className='flex gap-3  mt-2'>
                                                    {
                                                        comment.author?.profilePicture ?
                                                            <img src={comment.author?.profilePicture} alt="P" className="bg-gray-100 w-7 h-7 rounded-full cursor-pointer" />
                                                            : <img src={profile} alt="P" className="bg-gray-100 w-7 h-7 rounded-full cursor-pointer" />
                                                    }

                                                    <p className="text-sm pt-[2px]"><span className="font-medium mr-1 text-base cursor-pointer hover:text-gray-600">{comment.author?.username}</span>{comment?.text}</p>

                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 ml-12 p-1">
                                                    <span className="cursor-pointer">10 likes</span>
                                                    <span className="cursor-pointer">Reply</span>
                                                    <MoreHorizontal size={"16px"} className="cursor-pointer" />
                                                </div>
                                            </div>
                                            <FaRegHeart size={"15px"} className="text-gray-600 cursor-pointer mx-2 mt-5 w-12" />
                                        </div>
                                    )
                                })
                            }

                        </div>

                        <hr className="block mb-3" />
                        <div>
                            <div className='flex justify-between items-center'>
                                <div className='flex gap-3 items-center'>
                                    <FaRegHeart size={"22px"} className='hover:text-gray-600 cursor-pointer' />
                                    <LuMessageCircle size={"24px"} onClick={() => setOpenComment(true)} className='hover:text-gray-600 cursor-pointer' />
                                    <LuSend size={"22px"} className='hover:text-gray-600 cursor-pointer' />
                                </div>
                                <div>
                                    <FaRegBookmark size={"22px"} className='hover:text-gray-600 cursor-pointer mr-2' />
                                </div>
                            </div>

                            <span className='font-medium mt-2 block cursor-pointer text-xs'>1800 likes</span>
                        </div>
                        <hr className="block mb-1 mt-2" />

                        <div className='flex gap-2'>
                            <input type="text"
                                placeholder='Add a Comment...'
                                onChange={handleCommentText}
                                value={text}
                                className='text-sm outline-none font-medium w-full wrap my-2 placeholder:font-normal placeholder:text-gray-500'
                            />
                            {
                                text ?
                                    <span className='text-blue-500 font-medium mr-2 mt-2 text-sm cursor-pointer' onClick={PostComment}>Post</span>
                                    :
                                    <span className='text-gray-400 font-medium mr-2 mt-2 text-sm cursor-default'>Post</span>
                            }
                        </div>

                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog