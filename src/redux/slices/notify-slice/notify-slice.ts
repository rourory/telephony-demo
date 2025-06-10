import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';


type NotifySlice = {
  lastId: number;
  notifications: Array<AppNotification>;
  itsTimeToBeEqueued: boolean;
};

const initialState: NotifySlice = {
  lastId: 0,
  notifications: [],
  itsTimeToBeEqueued: true,
};

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<AppNotification>) {
      const notification = action.payload;
      notification.id = state.lastId;
      state.lastId = state.lastId + 1;
      state.notifications.push(action.payload);
    },
    removeEnqueued(state, action: PayloadAction<Array<AppNotification>>) {
      const idsToExclude = new Set(action.payload.map((element) => element.id));
      state.notifications = state.notifications.filter(
        (element) => !idsToExclude.has(element.id),
      );
    },
    itsTimeToEnqueue(state, action: PayloadAction<boolean>) {
      state.itsTimeToBeEqueued = action.payload;
    },
  },
});

export default notifySlice.reducer;
export const notifySelector = (state: RootState) => state.notifySlice;
export const { addNotification, removeEnqueued, itsTimeToEnqueue } =
  notifySlice.actions;
