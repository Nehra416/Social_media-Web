import { setUserProfile } from "@/redux/AuthSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";


const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    // console.log("id is : ", userId)

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/user/profile/${userId}`, { withCredentials: true })
                // console.log("res is : ", res)
                if (res.data.success) {
                    dispatch(setUserProfile(res.data.userProfile))
                }
            } catch (error) {
                console.log(error)
                toast.error(error.response.data.message)
            }
        }
        getUserProfile();
    }, [userId])
}

export default useGetUserProfile;