import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface Recognized {
  text: string;
  recognizedWord: string;
}

interface RecognizedSpeechItem {
  deviceAddress: string;
  recognized: Recognized[];
}
interface RecognizedSpeechState {
  recognizedSpeechItems: Array<RecognizedSpeechItem>;
}

const initialState: RecognizedSpeechState = {
  recognizedSpeechItems: [],
};

const recognizedSpeech = createSlice({
  name: 'recognizedSpeech',
  initialState,
  reducers: {
    setRecognizedSpeechItems(
      state,
      action: PayloadAction<RecognizedSpeechState>,
    ) {
      state.recognizedSpeechItems = action.payload.recognizedSpeechItems;
    },
    putMarkedWordInRecognizedSpeech(
      state,
      action: PayloadAction<{ deviceAddress: string; recognized: Recognized }>,
    ) {
      const deviceIndex = state.recognizedSpeechItems.findIndex(
        (item) => item.deviceAddress == action.payload.deviceAddress,
      );
      if (deviceIndex < 0) {
        state.recognizedSpeechItems.push({
          deviceAddress: action.payload.deviceAddress,
          recognized: [action.payload.recognized],
        });
      } else {
        state.recognizedSpeechItems[deviceIndex].recognized.push(
          action.payload.recognized,
        );
      }
    },
    clearAllMarkedWordsFromRecognizedSpeech(
      state,
      action: PayloadAction<{ deviceAddress: string }>,
    ) {
      const deviceIndex = state.recognizedSpeechItems.findIndex(
        (item) => item.deviceAddress == action.payload.deviceAddress,
      );
      if (deviceIndex >= 0) {
        state.recognizedSpeechItems[deviceIndex].recognized = [];
      }
    },
  },
});

export default recognizedSpeech.reducer;
export const recognizedSpeechItemSelector = (
  state: RootState,
  ipAddess: string,
) =>
  state.recognizedSpeech.recognizedSpeechItems.find(
    (item) => item.deviceAddress == ipAddess,
  );
export const {
  setRecognizedSpeechItems,
  putMarkedWordInRecognizedSpeech,
  clearAllMarkedWordsFromRecognizedSpeech,
} = recognizedSpeech.actions;
