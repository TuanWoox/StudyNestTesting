import { configureStore } from '@reduxjs/toolkit'
import themeReducer from "./themeSlice"
import quizAttemptReducer from "./quizAttemptSlice"
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        quizAttempt: quizAttemptReducer,
        authReducer: authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;