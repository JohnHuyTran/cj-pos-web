import { configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';

import authSlice from "./slices/authSlice";
import checkOrderSlice from './slices/check-order-slice';
import navSlice from './slices/navSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    checkOrderList: checkOrderSlice,
    navigator: navSlice,
  },
});

// Types of root state and dispatch
type RootState = ReturnType<typeof store.getState>;
type AppDispath = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispath>();

export default store;
