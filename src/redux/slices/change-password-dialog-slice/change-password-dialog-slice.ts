import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { changePasswordThunk } from './thunks';

const initialState: ChangePasswordDialogSlice = {
  open: false,
  password: '',
  confirmation: '',
  fetchingStatus: 'SUCCESS',
};

const changePasswordDialogSlice = createSlice({
  name: 'changePasswordDialog',
  initialState,
  reducers: {
    setChangePasswordDialogOpenState(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },
    setChangePasswordDialogPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setChangePasswordDialogConfirmation(state, action: PayloadAction<string>) {
      state.confirmation = action.payload;
    },
    setChangePasswordDialogFetchingStatus(
      state,
      action: PayloadAction<FetchingStatus>,
    ) {
      state.fetchingStatus = action.payload;
    },
    setChangePasswordDialogText(
      state,
      action: PayloadAction<string | undefined>,
    ) {
      state.text = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(changePasswordThunk.pending, (state, _) => {
      state.fetchingStatus = 'LOADING';
    });
    builder.addCase(changePasswordThunk.fulfilled, (state, _) => {
      state.fetchingStatus = 'SUCCESS';
      state.open = false;
      state.password = '';
      state.confirmation = '';
    });
  },
});

export default changePasswordDialogSlice.reducer;
export const changePasswordDialogStateSelector = (state: RootState) =>
  state.changePasswordDialogSlice;
export const {
  setChangePasswordDialogOpenState,
  setChangePasswordDialogPassword,
  setChangePasswordDialogConfirmation,
  setChangePasswordDialogFetchingStatus,
  setChangePasswordDialogText,
} = changePasswordDialogSlice.actions;
