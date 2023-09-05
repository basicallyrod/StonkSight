import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

import authReducer from '../features/auth/authSlice'
import listReducer from '../features/lists/listSlice'
import latestPriceReducer from '../features/iex/core/latestPriceSlice'
import historicalPriceReducer from '../features/iex/core/historicalPriceSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    lists: listReducer,
    latestPrice: latestPriceReducer,
    historicalPrice: historicalPriceReducer
  },
});
