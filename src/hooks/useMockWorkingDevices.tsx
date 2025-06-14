import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  setCurrentCallDuration,
  setEstablishingConnection,
  setIsAlive,
  setIsRecordingProcessing,
  setIsServiceAvailable,
  setPersonData,
  setRecordingServiceStartTime,
} from "../redux/slices/devices-slice/devices-slice";
import React from "react";
import { DeviceServiceEnum } from "../@types/enums";

export const useMockWorkingDevices = (devices: Array<DeviceState>) => {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    if (devices.length > 0) {
      //Just alive. Service is shut down
      dispatch(
        setIsAlive({ address: devices[0].ipAddress, booleanResult: true })
      );
      //Alive. Services are connected
      dispatch(
        setIsAlive({ address: devices[1].ipAddress, booleanResult: true })
      );
      dispatch(
        setEstablishingConnection({
          address: devices[1].ipAddress,
          booleanResult: false,
          serviceName: DeviceServiceEnum.SRVC_RECORDING,
        })
      );
      dispatch(
        setIsServiceAvailable({
          ipAddress: devices[1].ipAddress,
          port: devices[1].recognitionService.port,
          isAvailable: true,
          serviceName: DeviceServiceEnum.SRVC_RECORDING,
        })
      );
      //Recording is in processing
      dispatch(
        setIsAlive({ address: devices[2].ipAddress, booleanResult: true })
      );
      dispatch(
        setEstablishingConnection({
          address: devices[2].ipAddress,
          booleanResult: false,
          serviceName: DeviceServiceEnum.SRVC_RECORDING,
        })
      );
      dispatch(
        setIsServiceAvailable({
          ipAddress: devices[2].ipAddress,
          port: devices[2].recognitionService.port,
          isAvailable: true,
          serviceName: DeviceServiceEnum.SRVC_RECORDING,
        })
      );
      dispatch(
        setIsServiceAvailable({
          ipAddress: devices[2].ipAddress,
          port: devices[2].services.find(
            (s) => s.serviceName === DeviceServiceEnum.SRVC_AUDIO_STREAMING
          )!.port,
          isAvailable: true,
          serviceName: DeviceServiceEnum.SRVC_AUDIO_STREAMING,
        })
      );
      dispatch(
        setIsServiceAvailable({
          ipAddress: devices[2].ipAddress,
          port: devices[2].services.find(
            (s) => s.serviceName === DeviceServiceEnum.SRVC_SPEECH_RECEIVING
          )!.port,
          isAvailable: true,
          serviceName: DeviceServiceEnum.SRVC_SPEECH_RECEIVING,
        })
      );
      const person: PersonEntity = {
        id: 153,
        firstName: "Иван",
        secondName: "Васильев",
        middleName: "Юрьевич",
        squadNumber: 6,
        isUnderControl: false,
        archived: false,
        personalFileNumber: 464,
      };
      dispatch(
        setPersonData({
          ipAddress: devices[2].ipAddress,
          personData: person,
        })
      );
      dispatch(
        setIsRecordingProcessing({
          address: devices[2].ipAddress,
          booleanResult: true,
        })
      );
      dispatch(
        setCurrentCallDuration({
          ipAddress: devices[2].ipAddress,
          duration: 15,
        })
      );
      dispatch(
        setRecordingServiceStartTime({
          ipAddress: devices[2].ipAddress,
          startTime: new Date(),
        })
      );
    }
  }, [devices.length]);
};
