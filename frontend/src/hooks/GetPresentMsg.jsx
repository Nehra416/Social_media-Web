import { setMessage } from "@/redux/ChatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useGetPresentMsg = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio)
    const { message } = useSelector(store => store.chat)

    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            dispatch(setMessage([...message, newMessage]));
        })

        // ?????
        return(()=>{
            socket?.off('newMessage'); 
        })

    }, [message])
}

export default useGetPresentMsg;