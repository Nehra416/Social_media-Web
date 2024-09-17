import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/AuthSlice'
import { setPosts } from '@/redux/PostSlice'

const SignIn = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    })

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(store => store.auth)

    const handleInput = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const handleSignIn = async (e) => {
        e.preventDefault();

        // this is for clear all the persist......
        dispatch(setPosts(null))
        dispatch(setAuthUser(null))


        try {
            setLoading(true);

            const res = await axios.post("http://localhost:8000/user/signin", input, { withCredentials: true })
            // console.log("response is : ", res)

            if (res.data.success) {
                dispatch(setAuthUser(res.data.userData))
                navigate("/")
                toast.success(res.data.message)
            }

        } catch (error) {
            // console.log("Error in the SignUp fetch : ", error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    // so that login user can't go to the signIn page directly 
    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [])

    return (
        <div className='flex justify-center items-center w-screen h-screen px-3'>
            <form onSubmit={handleSignIn} className='shadow-xl flex flex-col gap-5 p-8 rounded-md'>

                <div className='text-center'>
                    <h1 className='font-semibold text-xl'>Logo</h1>
                    <p className='text-sm font-medium my-2'>SignIn to see photos & videos from your friends.</p>
                </div>

                {/* takes the user's data from the client for signin */}
                <div>
                    <h1 className='font-semibold'>Email</h1>
                    <input type="email"
                        className='border-2 w-full rounded-md h-8 pl-2 font-medium my-2'
                        onChange={handleInput} value={input.email} name='email' required />
                </div>
                <div>
                    <h1 className='font-semibold'>Password</h1>
                    <input type="password"
                        className='border-2 w-full rounded-md h-8 pl-2 font-medium my-2'
                        onChange={handleInput} value={input.password} name='password' required />
                </div>

                {/* display loading on the signup */}
                {
                    loading ? (
                        <Button>
                            <Loader2 className='animate-spin mr-3' />
                            Please Wait...
                        </Button>

                    ) : (
                        <Button type='submit'>SignIn</Button>
                    )
                }

                {/* link to send the user to the signup page if he can't created a account */}
                <span className='text-center'>Don't have an Account? <Link to="/signup" className="text-blue-500 hover:underline">SignUp</Link></span>
            </form>

        </div>
    )
}

export default SignIn