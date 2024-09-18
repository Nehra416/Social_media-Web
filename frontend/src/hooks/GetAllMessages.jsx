import { setMessage } from "@/redux/ChatSlice";
import { setPosts } from "@/redux/PostSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";


const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.auth)

    useEffect(() => {
        const GetAllMessage = async () => {
            try {
                const res = await axios.get(`https://social-media-web-9lmz.onrender.com/message/all/${selectedUser._id}`, { withCredentials: true })
                console.log("res of get all message is ", res)
                if (res.data.success) {
                    console.log("message from server:", res.data.message)
                    dispatch(setMessage(res.data.message))
                }
            } catch (error) {
                console.log(error)
                toast.error(error.response.data.message)
            }
        }
        GetAllMessage()
    }, [selectedUser])
}

export default useGetAllMessage;