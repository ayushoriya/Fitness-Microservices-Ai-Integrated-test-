import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'  // ✅ default import

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
