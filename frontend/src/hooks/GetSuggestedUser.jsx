import { setSuggestedUser } from "@/redux/AuthSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";


const useGetSuggestedUser = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const getSuggestedUser = async () => {
            try {
                const res = await axios.get("https://social-media-web-9lmz.onrender.com/user/suggested", { withCredentials: true })
                // console.log(res)
                if (res.data.success) {
                    dispatch(setSuggestedUser(res.data.users))
                }
            } catch (error) {
                // console.log(error)
                toast.error(error.response.data.message)
            }
        }
        getSuggestedUser()
    }, [])
}

export default useGetSuggestedUser;