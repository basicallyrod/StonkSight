import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

import authReducer from '../features/auth/authSlice'
import listReducer from '../features/lists/listSlice'
import coreReducer from '../features/iex/core/coreSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    lists: listReducer,
    core: coreReducer
  },
});
