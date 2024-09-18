import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import Home from './components/Home'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import EditProfile from './components/EditProfile'
import Messanger from './components/Messanger'
import { io } from 'socket.io-client'
import { useEffect } from 'react'
import { setSocket } from './redux/SocketSlice'
import { setOnlineUsers } from './redux/ChatSlice'
import { setLikeNotification } from './redux/NotificationSlice'
import ProtectedRoutes from './components/ProtectedRoutes'



const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    // these children components renders in mainLayout's outlet...
    children: [
      {
        path: "/",
        element: <ProtectedRoutes><Home /></ProtectedRoutes> 
      },
      {
        path: "/profile/:id",
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>
      },
      {
        path: "/edit",
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: "/messanger",
        element: <ProtectedRoutes><Messanger /></ProtectedRoutes>
      },
    ]
  },
  // signup and signin renders individual without mainpage component...
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/signin",
    element: <SignIn />
  },
])

function App() {

  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio)
  const dispatch = useDispatch();

  useEffect(() => {

    if (user) {
      const socketio = io('https://social-media-web-9lmz.onrender.com', {
        query: {
          userId: user?._id
        },
        transports: ['websocket'] // why???
      });
      dispatch(setSocket(socketio));

      // here we listen all events...
      socketio.on('getOnlineUser', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      })

      // clean up function...
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null));
    }

  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
