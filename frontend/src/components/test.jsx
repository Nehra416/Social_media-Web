import React, { useRef, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Button } from './ui/button'
import post_logo from "../Img/post_logo.png"
import axios from 'axios';
import { toast } from 'sonner';
import { IoArrowBack } from "react-icons/io5";
import profile from "../Img/profile_img2.png"


const CreatePost = ({ openCreatePost, setOpenCreatePost }) => {
    const inputRef = useRef()
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false)
    const [upload_img_url, setUpload_img_url] = useState('')
    const [large, setLarge] = useState(false)

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = (event.target.files[0]);
            if (file) {
                setSelectedFile(event.target.files[0]);
                // Create a preview URL for the selected file
                const url = URL.createObjectURL(file);
                setUpload_img_url(url);
            }
        }
    };

    const handlePost = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first.');
            return;
        }


        setLarge(true)
        toast("large")
        return;


        const formData = new FormData();
        formData.append('image', selectedFile);
        setLoading(true)

        try {
            const res = await axios.post("http://localhost:8000/post/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // console.log("Response: ", res.data);
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            // console.error("Error: ", error);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    };

    return (
        <Dialog open={openCreatePost}>
            <DialogContent onInteractOutside={() => setOpenCreatePost(false)} className={`p-0 py-3 h-96 overflow-hidden ${large ? "w-full" : 'w-72'}`}>

                {
                    selectedFile ?
                        <div className=''>
                            <div>
                                <div className='flex justify-between items-center px-2 w-full'>
                                    <IoArrowBack size={"20px"} className='cursor-pointer' />
                                    <span className='font-medium'>Upload</span>
                                    {
                                        large ?
                                            <span onClick={handlePost} className='font-medium cursor-pointer text-[#0094f6] hover:text-[#00376B] mr-5'>Share</span>
                                            :
                                            <span onClick={handlePost} className='font-medium cursor-pointer text-[#0094f6] hover:text-[#00376B] '>Next</span>
                                    }
                                </div>
                                <hr className='mt-2' />
                            </div>

                            <div className='flex'>
                                <div>
                                    <div className='w-72 h-[340px]'>
                                        <img src={upload_img_url} alt="uploaded_img" className='w-full h-full object-contain' />
                                    </div>
                                </div>

                                <div>
                                    {
                                        large &&
                                        <div className='border-l border-gray-300 h-full w-60'>
                                            <div className='flex gap-3 items-center mt-2 mx-3'>
                                                <img src={profile} alt="P" className="bg-gray-100 w-8 h-8 rounded-full" />
                                                <h1 className='font-medium'>Username</h1>
                                            </div>
                                            <textarea name="caption" id="" placeholder='Write your Caption here...' rows={10} className='w-[92%] pl-2 mt-3 text-sm outline-none font-medium'></textarea>
                                        </div>
                                    }

                                </div>
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
                                    <Button onClick={() => inputRef.current.click()} className="bg-[#0094f6] hover:bg-[#1877F2] text-center mt-10">Select from computer</Button>
                                </div>
                            </div>
                        </div>
                }

            </DialogContent>
        </Dialog >
    )
}

export default CreatePost
