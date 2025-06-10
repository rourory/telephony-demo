import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const initialState: PhotoHolderState = { photoHolders: [] };

const photoHolderSlice = createSlice({
  name: 'photoHolder',
  initialState,
  reducers: {
    setPhotoHolderFetchingStatus(
      state,
      action: PayloadAction<PhotoHolderUnit>,
    ) {
      const index = state.photoHolders.findIndex(
        (obj) =>
          obj.id == action.payload.id && obj.entity == action.payload.entity,
      );
      if (index >= 0) {
        state.photoHolders[index].state = action.payload.state;
      } else {
        state.photoHolders = [...state.photoHolders, action.payload];
      }
    },
  },
});

export default photoHolderSlice.reducer;
export const photoHolderStateSelector = (state: RootState) =>
  state.photoHolderSlice;
export const photoHolderUnitSelector = (
  state: RootState,
  id: number,
  entity: PhotoHolderEntity,
) =>
  state.photoHolderSlice.photoHolders.find(
    (obj) => obj.id == id && obj.entity == entity,
  );
export const { setPhotoHolderFetchingStatus } = photoHolderSlice.actions;
