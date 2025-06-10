import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const initialState: CloseDialogType = {
  open: false,
};

const closeDialogSlice = createSlice({
  name: 'closeDialog',
  initialState,
  reducers: {
    setCloseDialogState(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },
  },
});

export default closeDialogSlice.reducer;
export const closeDialogStateSelector = (state: RootState) =>
  state.closeDialogSlice.open;
export const { setCloseDialogState } = closeDialogSlice.actions;
