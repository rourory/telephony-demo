import { useSelector } from 'react-redux';
import { DeviceServiceEnum } from '../@types/enums';
import { deviceServiceSelector, recognitionServiceSelector, deviceRecordingServiceSelector } from '../redux/slices/devices-slice/devices-slice';
import { RootState } from '../redux/store';


export const useRemoteServices = (ipAddress: string) => {
  const audioStreamingService = useSelector((state: RootState) =>
    deviceServiceSelector(
      state,
      ipAddress,
      DeviceServiceEnum.SRVC_AUDIO_STREAMING,
    ),
  );
  const speechReceivingService = useSelector((state: RootState) =>
    deviceServiceSelector(
      state,
      ipAddress,
      DeviceServiceEnum.SRVC_SPEECH_RECEIVING,
    ),
  );
  const uiControllingService = useSelector((state: RootState) =>
    deviceServiceSelector(
      state,
      ipAddress,
      DeviceServiceEnum.SRVC_UI_CONTROLLING,
    ),
  );
  const recognitionService = useSelector((state: RootState) =>
    recognitionServiceSelector(state, ipAddress),
  );

  const recordingService = useSelector((state: RootState) =>
    deviceRecordingServiceSelector(state, ipAddress),
  );

  return {
    audioStreamingService,
    speechReceivingService,
    uiControllingService,
    recognitionService,
    recordingService,
  };
};
