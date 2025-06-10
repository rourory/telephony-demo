import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const initialState: DrawerType = {
  open: false,
  direction: 'rtl',
  items: { actionItems: [], infoItems: [] },
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    setOpen(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },
    setDirection(state, action: PayloadAction<DirectionType>) {
      state.direction = action.payload;
    },
    setDrawerItems(state, action: PayloadAction<DrawerTypeItems>) {
      state.items = action.payload;
    },
  },
});

export default drawerSlice.reducer;
export const drawerSliceSelector = (state: RootState) => state.drawerSlice;
export const { setOpen, setDirection, setDrawerItems } = drawerSlice.actions;
