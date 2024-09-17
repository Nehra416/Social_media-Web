import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {
    const { user } = useSelector(store => store.auth)
    const navigate = useNavigate()
    console.log('user is ', user);
    // if user is not authenticated then navigate to the login page
    useEffect(() => {
        if (!user) {
            navigate('/signin');
        }
    }, [])

    return user && <>{children}</>
}

export default ProtectedRoutes