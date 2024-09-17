import { combineReducers, configureStore } from "@reduxjs/toolkit"
import authSlice from "./AuthSlice"
import postSlice from "./PostSlice"
import SocketSlice from "./SocketSlice"
import ChatSlice from "./ChatSlice"
import NotificationSlice from "./NotificationSlice"

// for redux persist
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

// ye hame create kerna hota...
const rootReducer = combineReducers({
    auth: authSlice,
    post: postSlice,
    socketio: SocketSlice,
    chat: ChatSlice,
    notification: NotificationSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export default store;








// This is simple store ...

// import { configureStore } from "@reduxjs/toolkit"
// import authSlice from "./AuthSlice"

// const store = configureStore({
//     reducer: {
//         auth: authSlice
//     }
// })

// export default store;