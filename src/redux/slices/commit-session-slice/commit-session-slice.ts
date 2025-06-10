import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const initialState: CommitSessionType = {
  ipAddress: '',
  open: false,
  person: null,
  successAction: undefined,
  failedAction: undefined,
  errorAction: undefined,
};

const commitSessionDialogSlice = createSlice({
  name: 'commitSessionDialog',
  initialState,
  reducers: {
    setOpenState(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },
    closeCommitSessionDialogAndClearState(
      state,
      action: PayloadAction<{ address: string }>,
    ) {
      if (action.payload.address == state.ipAddress) {
        state.open = false;
        state.person = null;
        state.successAction = undefined;
        state.failedAction = undefined;
        state.errorAction = undefined;
      }
    },
    setPerson(state, action: PayloadAction<PersonEntity | null>) {
      state.person = action.payload;
    },
    setSuccessAction(state, action: PayloadAction<() => void | undefined>) {
      state.successAction = action.payload;
    },
    setFailedAction(state, action: PayloadAction<() => void | undefined>) {
      state.failedAction = action.payload;
    },
    setErrorAction(state, action: PayloadAction<() => void | undefined>) {
      state.errorAction = action.payload;
    },
    setCommitSessionDialogState(
      state,
      action: PayloadAction<CommitSessionType>,
    ) {
      state.ipAddress = action.payload.ipAddress;
      state.open = action.payload.open;
      state.person = action.payload.person;
      state.successAction = action.payload.successAction;
      state.failedAction = action.payload.failedAction;
      state.errorAction = action.payload.errorAction;
    },
  },
});

export default commitSessionDialogSlice.reducer;
export const commitSessionStateSelector = (state: RootState) =>
  state.commitSessionSlice;
export const {
  setOpenState,
  closeCommitSessionDialogAndClearState,
  setSuccessAction,
  setFailedAction,
  setErrorAction,
  setCommitSessionDialogState,
} = commitSessionDialogSlice.actions;
