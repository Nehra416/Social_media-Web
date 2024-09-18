import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from './ui/button'
import { MoreHorizontal } from 'lucide-react'
import testing from "./testing.jpg"
import profile from "../Img/profile_img2.png"
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { LuMessageCircle, LuSend } from "react-icons/lu";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/PostSlice'
import { Badge } from './ui/badge'
import { setAuthUser, setUserProfile } from '@/redux/AuthSlice'
import { Link } from 'react-router-dom'


const Post = ({ post }) => {
    const [text, setText] = useState('')
    const [openComment, setOpenComment] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const { user, userProfile } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.post)
    const dispatch = useDispatch()
    const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false)
    const [book, setBook] = useState(user?.bookmark.includes(post?._id) || false)
    // const [book, setBook] = useState(false)

    const handleCommentText = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText)
        } else {
            setText("")
        }
    }


    const handleLikeOrDislike = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`https://social-media-web-9lmz.onrender.com/post/${action}/${post._id}`, { withCredentials: true })

            if (res.data.success) {
                // *********
                const updatedPostData = posts.map((p) => p._id === post._id
                    ? {
                        ...p,
                        likes: liked ?
                            p.likes.filter((id) => id !== user._id) // for dislike
                            : [...p.likes, user._id] // for like
                    } : p
                )

                // console.log("Updated post data:", updatedPostData);
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
                setLiked(!liked)
            }
        } catch (error) {
            console.log("Error in error handleLikeOrDislike : ", error)
            toast.error(error.response.data.message)
        }
    }

    const PostComment = async () => {
        try {
            console.log(text)
            const res = await axios.post(`https://social-media-web-9lmz.onrender.com/post/comment/${post._id}`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            if (res.data.success) {
                const updatedPostData = posts.map((p) => p._id === post._id
                    ? { ...p, comments: [res.data.comment, ...p.comments] } : p
                )
                // console.log("PostComment: ", updatedPostData);

                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
                setText("")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }


    const deltePostHandle = async () => {
        
        try {
            const res = await axios.delete(`https://social-media-web-9lmz.onrender.com/post/deletePost/${post?._id}`, { withCredentials: true })
            if (res.data.message) {
                const updatedPost = posts.filter((postItem) => postItem._id !== post._id)
                dispatch(setPosts(updatedPost))
                setOpenInfo(false)
                toast.success("Post is Deleted")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const bookMarkHandler = async () => {
        try {
            // {console.log(user?.bookmark.includes(post._id))}
            console.log("like value is ", book)

            const res = await axios.get(`https://social-media-web-9lmz.onrender.com/post//bookmarkPost/${post._id}`, { withCredentials: true })
            if (res.data.success) {
                toast.success(res.data.message);
                console.log("user is : ", user)
                const updateData = {
                    ...user,
                    bookmark:
                        book ?
                            user?.bookmark.filter((id) => id !== post._id)
                            : [...user?.bookmark, post._id]
                }

                console.log("updateData is : ", updateData)
                dispatch(setAuthUser(updateData));
                setBook(!book)
            }
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <>
            <div className='max-w-sm w-full my-5'>
                <div className='flex items-center justify-between w-96'>
                    <Link to={`/profile/${post.author._id}`}>
                        <div className='flex gap-3 items-center'>
                            <Avatar>
                                <AvatarImage src={post?.author?.profilePicture} className='' />
                                <AvatarImage src={profile} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h1 className='font-medium'>{post.author?.username}</h1>
                            {
                                user._id === post.author._id && <Badge variant="outline" >author</Badge>
                            }
                        </div>
                    </Link>
                    <div>
                        <Dialog open={openInfo}>
                            <DialogTrigger>
                                <MoreHorizontal className='hover:text-gray-500' onClick={() => setOpenInfo(true)} />
                            </DialogTrigger>
                            <DialogContent onInteractOutside={() => setOpenInfo(false)}>
                                {
                                    user._id === post.author._id ?
                                        <Button onClick={deltePostHandle} variant="ghost" className="text-red-700">Delete</Button>
                                        : <Button variant="ghost" className="text-red-700" >Unfollow</Button>
                                }
                                <Button variant="ghost">Add to Fav</Button>

                                <Button variant="ghost" onClick={() => setOpenInfo(false)}>Cancel</Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <img
                    className='rounded-md aspect-square object-cover my-2 w-full'
                    src={post.image}
                    alt="Post_Img"
                />

                <div className='flex justify-between items-center'>
                    <div className='flex gap-3 items-center'>
                        {
                            liked ?
                                <FaHeart onClick={handleLikeOrDislike} size={"22px"} className=' cursor-pointer text-red-600' />
                                :
                                <FaRegHeart onClick={handleLikeOrDislike} size={"22px"} className='hover:text-gray-600 cursor-pointer' />
                        }

                        <LuMessageCircle size={"24px"} className='hover:text-gray-600 cursor-pointer'
                            onClick={() => {
                                dispatch(setSelectedPost(post)),
                                    setOpenComment(true)
                            }} />

                        <LuSend size={"22px"} className='hover:text-gray-600 cursor-pointer' />
                    </div>
                    <div>
                        {
                            // user?.bookmark.includes(user._id) ?
                            book ?
                                <FaBookmark onClick={bookMarkHandler} size={"22px"} className='cursor-pointer' />
                                : <FaRegBookmark onClick={bookMarkHandler} size={"22px"} className='cursor-pointer hover:text-gray-600' />
                        }

                    </div>
                </div>

                <span className='font-medium mt-2 block cursor-pointer text-sm'>{`${post.likes.length} likes`}</span>

                <div>
                    <span className='mr-2 font-medium'>{post.author.username}</span>
                    <span className='text-sm'>{post.caption}</span>
                </div>

                <span className='text-sm text-gray-500 cursor-pointer'
                    onClick={() => {
                        dispatch(setSelectedPost(post)),
                            setOpenComment(true)
                    }} >
                    View all {post.comments.length} Comments</span>

                <CommentDialog openComment={openComment} setOpenComment={setOpenComment} />

                <div className='flex gap-2'>
                    <input type="text"
                        placeholder='Add a comment...'
                        onChange={handleCommentText}
                        value={text}
                        className='text-sm outline-none font-medium w-full wrap my-2 placeholder:font-normal placeholder:text-gray-500'
                    />
                    {
                        text && <span className='text-blue-500 font-medium mr-1 text-sm cursor-pointer' onClick={PostComment}>Post</span>
                    }
                </div>
                <hr />
            </div>
        </>
    )
}

export default Post