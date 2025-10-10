import { configureStore } from '@reduxjs/toolkit'
import themeReducer from "./themeSlice"
import quizAttemptReducer from "./quizAttemptSlice"

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        quizAttempt: quizAttemptReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;