import { configureStore } from '@reduxjs/toolkit';
import voucherReducer from './voucherSlice';

export const store = configureStore({
  reducer: {
    voucher: voucherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
