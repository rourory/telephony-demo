import React from "react";
import { useDispatch } from "react-redux";
import { RecognitionServiceRequestCodes } from "../@types/enums";
import { setIsRecognitionProcessing } from "../redux/slices/devices-slice/devices-slice";
import { AppDispatch } from "../redux/store";


export const useSpeechRecognition = (ipAddress:string, recordingService?: RecordingService, recognitionService?: RemoteServiceState) => {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    if (recordingService?.isProcessing) {
      if (
        recognitionService?.socket &&
        recognitionService.socket.readyState == 1 &&
        !recognitionService.isProcessing
      ) {
        recognitionService.socket.send(
          JSON.stringify({
            command: RecognitionServiceRequestCodes.START_RECOGNITION,
            callId: recordingService.callId,
          }),
        );
        dispatch(
          setIsRecognitionProcessing({
            address: ipAddress,
            booleanResult: true,
          }),
        );
      }
    } else {
      if (
        recognitionService?.socket &&
        recognitionService.socket.readyState == 1 &&
        recognitionService.isProcessing
      ) {
        recognitionService.socket.send(
          JSON.stringify({
            command: RecognitionServiceRequestCodes.END_RECOGNITION,
          }),
        );
        dispatch(
          setIsRecognitionProcessing({
            address: ipAddress,
            booleanResult: false,
          }),
        );
      }
    }
  }, [recordingService?.isProcessing, recognitionService]);
}
