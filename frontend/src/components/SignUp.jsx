import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const SignUp = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    })

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth)


    const handleInput = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const handleSignUp = async (e) => {
        e.preventDefault(); // prevent page from the refresh...

        try {
            setLoading(true);

            const res = await axios.post("http://localhost:8000/user/signup", input, { withCredentials: true })
            // console.log("response is : ", res)

            if (res.data.success) {
                navigate("/signin")
                toast.success(res.data.message)
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
            }

        } catch (error) {
            // console.log("Error in the SignUp fetch : ", error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    // so that login user can't go to the signUp page directly 
    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [])

    return (
        <div className='flex justify-center items-center w-screen h-screen px-3'>
            <form onSubmit={handleSignUp} className='shadow-xl flex flex-col gap-5 p-8 rounded-md'>

                {/* form to take the user details from the client */}
                <div className='text-center'>
                    <h1 className='font-bold text-xl'>LOGO</h1>
                    <p className='text-sm font-medium my-2'>SignUp to see photos & videos from your friends.</p>
                </div>
                <div>
                    <h1 className='font-semibold'>Username</h1>
                    <input type="text"
                        className='border-2 w-full rounded-md h-8 pl-2 font-medium my-2'
                        onChange={handleInput} value={input.username} name='username' required />
                </div>
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
                        <Button type='submit'>SignUp</Button>
                    )
                }

                {/* link to send the user to the signin page if he already created a account */}
                <span className='text-center'>Already have an Account? <Link to="/signin" className="text-blue-500 hover:underline">SignIn</Link></span>
            </form>

        </div>
    )
}

export default SignUp