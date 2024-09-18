import React, { useRef, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Button } from './ui/button'
import post_logo from "../Img/post_logo.png"
import axios from 'axios';
import { toast } from 'sonner';
import { IoArrowBack } from "react-icons/io5";
import profile from "../Img/profile_img2.png"
import { Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/PostSlice';


const CreatePost = ({ openCreatePost, setOpenCreatePost }) => {
    const inputRef = useRef()
    const [selectedFile, setSelectedFile] = useState(null);
    const [upload_img_url, setUpload_img_url] = useState('')
    const [caption, setcaption] = useState('')
    const [loading, setLoading] = useState(false)
    const { posts } = useSelector(store => store.post)
    const dispatch = useDispatch()

    const handleCaption = (e) => {
        const value = e.target.value;
        setcaption(value);
    }

    const handleFileChange = async (event) => {
        if (event.target.files[0]) {
            setLoading(true);
            const file = event.target.files[0]

            // upload profile on clodinary
            const cloudinary = new FormData();
            cloudinary.append("file", file);
            cloudinary.append("upload_preset", "reactjs");

            try {
                const res = await axios.post("https://api.cloudinary.com/v1_1/nehra1800/image/upload", cloudinary);
                console.log("Response of cloudinary:", res);
                const picURL = res.data.secure_url
                // console.log("picURL", picURL);
                setSelectedFile(picURL);
            } catch (error) {
                console.error("Error:", error);
                toast.error('Failed to Upload Check your Network.');
            } finally {
                setLoading(false)
            }

            // Create a preview URL for the selected file
            const url = URL.createObjectURL(file);
            console.log("img url is : ", url)
            setUpload_img_url(url);
        }
    };

    const handlePost = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('caption', caption);
        setLoading(true)

        try {
            const res = await axios.post("https://social-media-web-9lmz.onrender.com/post/add", formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            // console.log("Response: ", res.data);
            if (res.data.success) {
                toast.success(res.data.message);
                setUpload_img_url('')
                dispatch(setPosts([res.data.post, ...posts]))
            }
        } catch (error) {
            // console.error("Error: ", error);
            toast.error(error.response.data.message)
            toast.error('Failed to upload the file on backend.');
        } finally {
            setLoading(false)
            setOpenCreatePost(false)
        }
    };

    return (
        // this dialog box is open when openCreatePost value is true from the leftSideBar
        <Dialog open={openCreatePost}>
            <DialogContent onInteractOutside={() => setOpenCreatePost(false)} className="p-0 h-96 overflow-hidden pt-3">
                {
                    upload_img_url ?
                        <div>
                            <div className='flex justify-between items-center px-2 w-full'>
                                <IoArrowBack size={"20px"} className='cursor-pointer' onClick={() => setUpload_img_url('')} />
                                <span className='font-medium'>Upload</span>
                                {
                                    loading ?
                                        <Loader className='animate-spin mr-3 text-[#0094f6]' />
                                        :
                                        <span onClick={handlePost} className='font-medium cursor-pointer text-[#0094f6] hover:text-[#00376B]'>Share</span>
                                }
                            </div>
                            <hr className='mt-2' />
                            <div className='h-64 w-full'>
                                <textarea onChange={handleCaption} name='caption' value={caption} className='w-full overflow-auto text-sm outline-none p-2' rows={3} placeholder='Write your caption here . . .' />
                                <img src={upload_img_url} alt="Upload_img" className='w-full h-full object-contain rounded-lg' />
                            </div>
                        </div>
                        :
                        <div>
                            <div>
                                <span className='text-center block font-medium'>Create new post</span>
                                <hr className='my-2' />
                            </div>
                            <div className='flex flex-col items-center justify-end my-16'>
                                <div className='flex flex-grow flex-col items-center'>
                                    <img src={post_logo} alt="Media_Logo" className='w-32' />
                                    <p className='font-medium text-xl'>Drag photos and videos here</p>
                                </div>
                                <div>
                                    <input ref={inputRef} type="file" className='hidden' name='image' onChange={handleFileChange} />
                                    {
                                        loading ?
                                            <Button className="bg-[#0094f6] hover:bg-[#1877F2] text-center mt-10"><Loader className='animate-spin mr-3' />Loading . . .</Button>
                                            :
                                            <Button onClick={() => inputRef.current.click()} className="bg-[#0094f6] hover:bg-[#1877F2] text-center mt-10">Select from computer</Button>
                                    }
                                    {/* <Button onClick={() => inputRef.current.click()} className="bg-[#0094f6] hover:bg-[#1877F2] text-center mt-10">Select from computer</Button> */}
                                </div>
                            </div>
                        </div>
                }

            </DialogContent>
        </Dialog >
    )
}

export default CreatePost
