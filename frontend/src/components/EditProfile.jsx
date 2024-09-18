import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { setAuthUser } from '@/redux/AuthSlice';
import { Loader2 } from 'lucide-react';

const EditProfile = () => {
    const { user } = useSelector(store => store.auth)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        profilePicture: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    })

    const inputRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleProfile = (e) => {
        const file = e.target.files[0];
        // console.log("file is : ", file)
        if (file) {
            setData({
                ...data,
                profilePicture: file
            })
        }
    }

    const handleGender = (value) => {
        // console.log("gender value is : ", value)
        setData({ ...data, gender: value })
    }

    const handleEditProfile = async () => {

        // upload profile on clodinary
        const cloudinary = new FormData();
        cloudinary.append("file", data.profilePicture);
        cloudinary.append("upload_preset", "reactjs");

        try {
            const res = await axios.post("https://api.cloudinary.com/v1_1/nehra1800/image/upload", cloudinary);
            // console.log("Response of cloudinary:", res);
            const picURL = res.data.secure_url
            // console.log("picURL", picURL);
            data.profilePicture = picURL;
        } catch (error) {
            console.error("Error:", error);
            toast.error('Failed to upload the file on Coudinary.');
        }


        // we direct send the link to the backend of the cloudinary image

        // const formData = new FormData();
        // formData.append('bio', data.bio || '');
        // formData.append('gender', data.gender || null);
        // if (data.profilePicture) {
        //     formData.append('profilePicture', data.profilePicture);
        // }
        // console.log("Form data is: ", formData.bio); // why this don't print **********

        try {
            setLoading(true)
            const res = await axios.post(`https://social-media-web-9lmz.onrender.com/user/profile/edit`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            // console.log("res is : ", res)
            if (res.data.success) {
                const updatedData = {
                    ...user,
                    bio: res.data.user?.bio,
                    gender: res.data.user?.gender,
                    profilePicture: res.data.user?.profilePicture
                }
                dispatch(setAuthUser(updatedData))
                toast.success(res.data.message)
                navigate(`/profile/${user._id}`)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='mx-auto max-w-xl mt-10 flex flex-col gap-10'>
            <div>
                <div className='flex justify-between items-center bg-gray-100 px-6 py-3 rounded-3xl'>
                    <div className='flex gap-5 items-center'>
                        {
                            user.profilePicture ? <img src={user.profilePicture} alt="DP" className="bg-gray-100 w-16 h-16 rounded-full cursor-pointer" />
                                : <img src={profile} alt="DP" className="bg-gray-100 w-8 h-8 rounded-full cursor-pointer" />
                        }

                        <h1 className='font-medium cursor-pointer text-xl'>{user.username}</h1>
                    </div>
                    <div>
                        <input ref={inputRef} type="file" onChange={handleProfile} className='hidden' />
                        <Button onClick={() => inputRef.current.click()} className="bg-[#0095F6] hover:bg-[#318bc7] text-white h-8 w-28">Change photo</Button>

                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <span className='font-medium text-lg'>Bio</span>
                <textarea value={data.bio} onChange={(e) => setData({ ...data, bio: e.target.value })} placeholder='Enter your Bio here...' className='rounded-2xl border-2 border-gray-200 px-3 py-2 font-medium text-sm '></textarea>
            </div>
            <div className='flex flex-col gap-2'>
                <span className='font-medium text-lg'>Gender</span>
                <Select defaultValue={user?.gender} onValueChange={handleGender}>
                    <SelectTrigger className="border-2  rounded-xl outline-none">
                        <SelectValue placeholder="Prefer not to say" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='flex justify-end'>
                {
                    loading ?
                        <Button onClick={handleEditProfile} className="bg-[#0095F6] hover:bg-[#318bc7] text-white w-40"><Loader2 className='animate-spin m-2' />Please wait...</Button>
                        : <Button onClick={handleEditProfile} className="bg-[#0095F6] hover:bg-[#318bc7] text-white w-40">Submit</Button>
                }
            </div>
        </div>
    )
}

export default EditProfile;