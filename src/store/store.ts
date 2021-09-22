import { configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';

import authSlice from './slices/authSlice';
import navSlice from './slices/navSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    navigator: navSlice,
  },
});

// Types of root state and dispatch
type RootState = ReturnType<typeof store.getState>;
type AppDispath = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispath>();

export default store;
