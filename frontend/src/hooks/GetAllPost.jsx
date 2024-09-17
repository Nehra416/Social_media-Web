import { setPosts } from "@/redux/PostSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";


const useGetAllPost = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const GetAllPost = async () => {
            try {
                const res = await axios.get("http://localhost:8000/post/all", { withCredentials: true })
                // console.log(res)
                if (res.data.success) {
                    console.log("data is", res.data.posts)
                    dispatch(setPosts(res.data.posts))
                }
            } catch (error) {
                // console.log(error)
                toast.error(error.response.data.message)
            }
        }
        GetAllPost()
    }, [])
}

export default useGetAllPost;