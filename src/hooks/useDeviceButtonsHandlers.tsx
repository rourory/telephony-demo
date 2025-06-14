import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRemoteServices } from "./useRemoteServices";
import {
  RecordingRequestCodes,
  CallResultConstant,
  InternalCallTypes,
  UIControllingRequestActionCodes,
} from "../@types/enums";
import { setCommitSessionDialogState } from "../redux/slices/commit-session-slice/commit-session-slice";
import {
  setIsRecordProcessingStarting,
  setCommitSessionButtonLoading,
  setContactValueFieldDisabled,
  setIsAudioStreamingProcessing,
  setIsMicRecordingProcessing,
  setCallActionButtonsDisabled,
  setReloadContactButtonDisabled,
  setDoCallButtonLoading,
  setCommitSessionButtonDisabled,
  setCancelCallButtonLoading,
  setIsRecordingProcessing,
  setDoCallButtonDisabled,
  setCancelCallButtonDisabled,
} from "../redux/slices/devices-slice/devices-slice";
import { serverSettingsSelector } from "../redux/slices/server-settings-slice/server-settings-slice";
import { userSelector } from "../redux/slices/user-slice/user-slice";
import {
  vncVideoShowSelector,
  setOpenVideoFrame,
  setActualVncServiceUrl,
} from "../redux/slices/vnc-video-show-slice/vnc-video-show-slice";
import { AppDispatch } from "../redux/store";
import { sleep } from "../utils/sleep";
import { addNotification } from "../redux/slices/notify-slice/notify-slice";

export const useDeviceButtonsHandlers = (ipAddress: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(userSelector);
  const { standardCallDuration, beforeTimerEndsWarningMinutes } = useSelector(
    serverSettingsSelector
  );

  const {
    audioStreamingService,
    speechReceivingService,
    uiControllingService,
    recognitionService,
    recordingService,
  } = useRemoteServices(ipAddress);

  const { actualVncServiceUrl, openVncVideoFrame } =
    useSelector(vncVideoShowSelector);

  const beginCommonSessionButtonClicked = React.useCallback(async () => {
    dispatch(
      setIsRecordProcessingStarting({
        address: ipAddress,
        booleanResult: true,
      })
    );
    await sleep(2000);
    dispatch(
      addNotification({
        type: "success",
        message: "Сеанс открыт. Демонстрация закончена.",
      })
    );
    dispatch(
      setIsRecordProcessingStarting({
        address: ipAddress,
        booleanResult: false,
      })
    );
    // recordingService?.socket?.send(
    //   JSON.stringify({
    //     code: RecordingRequestCodes.CREATE_RECORDING,
    //     settings: {
    //       userName: recordingService.personData?.firstName,
    //       userSurName: recordingService.personData?.secondName,
    //       userMiddleName: recordingService.personData?.middleName,
    //       userId: recordingService.personData?.id,
    //       videoPath: recordingService.videoPath,
    //       resultId: CallResultConstant.CALL_PROCESSING,
    //       administrationId: user?.id,
    //       durationMinutes: standardCallDuration?.duration,
    //       beforeTimerEndsWarningMinutes: beforeTimerEndsWarningMinutes,
    //       type: InternalCallTypes.COMMON,
    //       internalCallType: InternalCallTypes.EXTRA,
    //     },
    //   }),
    // );
  }, [recordingService, standardCallDuration, beforeTimerEndsWarningMinutes]);

  const beginExtraPermissionCallButtonClicked = React.useCallback(
    async (extraCallPermission: ExtraCallPermissionEntity) => {
      dispatch(
        setIsRecordProcessingStarting({
          address: ipAddress,
          booleanResult: true,
        })
      );
      await sleep(2000);
      dispatch(
        addNotification({
          type: "success",
          message: "Дополнительынй сеанс открыт. Демонстрация закончена.",
        })
      );
      dispatch(
        setIsRecordProcessingStarting({
          address: ipAddress,
          booleanResult: false,
        })
      );
      // recordingService?.socket?.send(
      //   JSON.stringify({
      //     code: RecordingRequestCodes.CREATE_RECORDING,
      //     settings: {
      //       userName: recordingService.personData?.firstName,
      //       userSurName: recordingService.personData?.secondName,
      //       userMiddleName: recordingService.personData?.middleName,
      //       userId: recordingService.personData?.id,
      //       videoPath: recordingService.videoPath,
      //       resultId: CallResultConstant.CALL_PROCESSING,
      //       administrationId: user?.id,
      //       durationMinutes: extraCallPermission.duration.duration,
      //       beforeTimerEndsWarningMinutes: beforeTimerEndsWarningMinutes,
      //       internalCallType: InternalCallTypes.EXTRA,
      //       extraCallPermissionId: extraCallPermission.id,
      //     },
      //   })
      // );
    },
    [recordingService, standardCallDuration, beforeTimerEndsWarningMinutes]
  );

  const commitCallButtonClicked = React.useCallback(() => {
    dispatch(
      setCommitSessionButtonLoading({
        address: ipAddress,
        loading: true,
      })
    );
    dispatch(
      setCommitSessionDialogState({
        ipAddress: ipAddress,
        open: true,
        person: recordingService?.personData || null,
        successAction: () => {
          // recordingService?.socket?.send(
          //   JSON.stringify({
          //     code: RecordingRequestCodes.END_RECORDING,
          //     settings: { resultId: CallResultConstant.CALL_SUCCEEDED },
          //   })
          // );
          // dispatch(
          //   setContactValueFieldDisabled({
          //     address: ipAddress,
          //     disabled: false,
          //   })
          // );
          dispatch(
            addNotification({
              type: "success",
              message:
                "Сессия завершена и помечена как 'Дозвонился'. Демонстрация закончена",
            })
          );
          dispatch(
            setCommitSessionButtonLoading({
              address: ipAddress,
              loading: false,
            })
          );
        },
        failedAction: () => {
          // recordingService?.socket?.send(
          //   JSON.stringify({
          //     code: RecordingRequestCodes.END_RECORDING,
          //     settings: { resultId: CallResultConstant.CALL_FAILED },
          //   })
          // );
          // dispatch(
          //   setContactValueFieldDisabled({
          //     address: ipAddress,
          //     disabled: false,
          //   })
          // );
          dispatch(
            addNotification({
              type: "success",
              message:
                "Сессия завершена и помечена как 'Недозвонился'. Демонстрация закончена",
            })
          );
          dispatch(
            setCommitSessionButtonLoading({
              address: ipAddress,
              loading: false,
            })
          );
        },
        errorAction: () => {
          // recordingService?.socket?.send(
          //   JSON.stringify({
          //     code: RecordingRequestCodes.END_RECORDING,
          //     settings: { resultId: CallResultConstant.CALL_ERROR },
          //   })
          // );
          // dispatch(
          //   setContactValueFieldDisabled({
          //     address: ipAddress,
          //     disabled: false,
          //   })
          // );
          dispatch(
            addNotification({
              type: "success",
              message:
                "Сессия завершена и помечена как 'Ошибочный'. Демонстрация закончена",
            })
          );
          dispatch(
            setCommitSessionButtonLoading({
              address: ipAddress,
              loading: false,
            })
          );
        },
      })
    );
  }, [recordingService]);

  const audioStreamingButtonClicked = React.useCallback(() => {
    dispatch(
      setIsAudioStreamingProcessing({
        address: ipAddress,
        booleanResult: !audioStreamingService?.isProcessing,
        closeAll: true,
      })
    );
  }, [audioStreamingService, ipAddress]);

  const videoButtonClicked = React.useCallback(() => {
    if (!openVncVideoFrame) {
      dispatch(setOpenVideoFrame(true));
      dispatch(setActualVncServiceUrl(ipAddress));
    } else if (openVncVideoFrame && ipAddress == actualVncServiceUrl) {
      dispatch(setOpenVideoFrame(false));
      dispatch(setActualVncServiceUrl(undefined));
    } else {
      dispatch(setOpenVideoFrame(false));
      dispatch(setActualVncServiceUrl(undefined));
      setTimeout(() => {
        dispatch(setOpenVideoFrame(true));
        dispatch(setActualVncServiceUrl(ipAddress));
      }, 600);
    }
  }, [openVncVideoFrame, ipAddress, actualVncServiceUrl]);

  const micButtonClicked = React.useCallback(() => {
    dispatch(
      setIsMicRecordingProcessing({
        address: ipAddress,
        booleanResult: !speechReceivingService?.isProcessing,
      })
    );
  }, [speechReceivingService, ipAddress]);

  const reloadContactButtonClicked = React.useCallback(async () => {
    // if (uiControllingService) {
    //   uiControllingService.socket?.send(
    //     JSON.stringify({
    //       actionCode: UIControllingRequestActionCodes.FIND_RELATIVE,
    //       contactTypeId: recordingService?.contact?.contactTypeId,
    //       settings: {
    //         login: recordingService?.contact?.contactValue,
    //       },
    //     })
    //   );
    dispatch(
      setCallActionButtonsDisabled({
        address: ipAddress,
        disabled: true,
      })
    );
    dispatch(
      setReloadContactButtonDisabled({
        address: ipAddress,
        disabled: true,
      })
    );
    dispatch(
      setContactValueFieldDisabled({
        address: ipAddress,
        disabled: true,
      })
    );
    await sleep(2000);
    const rand = Math.random();
    if (rand > 0.3) {
      dispatch(
        addNotification({
          type: "success",
          message: "Набор контакта осуществлен. Демонстрация закончена",
        })
      );
      dispatch(
        setCallActionButtonsDisabled({
          address: ipAddress,
          disabled: false,
        })
      );
      dispatch(
        setCancelCallButtonDisabled({ address: ipAddress, disabled: true })
      );
    } else {
      dispatch(
        addNotification({
          type: "error",
          message: "Ошибка в процессе набора контакта. Демонстрация закончена",
        })
      );
    }
    dispatch(
      setReloadContactButtonDisabled({
        address: ipAddress,
        disabled: false,
      })
    );
    dispatch(
      setContactValueFieldDisabled({
        address: ipAddress,
        disabled: false,
      })
    );
  }, [uiControllingService, ipAddress, recordingService]);

  const doCallButtonClicked = React.useCallback(async () => {
    if (uiControllingService) {
      dispatch(
        setContactValueFieldDisabled({
          address: ipAddress,
          disabled: true,
        })
      );
      dispatch(setDoCallButtonLoading({ address: ipAddress, loading: true }));
      dispatch(
        setReloadContactButtonDisabled({
          address: ipAddress,
          disabled: true,
        })
      );
      dispatch(
        setCommitSessionButtonDisabled({
          address: ipAddress,
          disabled: true,
        })
      );
      await sleep(2000);
      const rand = Math.random();
      if (rand > 0.3) {
        dispatch(
          addNotification({
            type: "success",
            message: "Вызов осуществлен. Демонстрация закончена",
          })
        );
        dispatch(
          setDoCallButtonDisabled({ address: ipAddress, disabled: true })
        );
        dispatch(
          setCancelCallButtonDisabled({ address: ipAddress, disabled: false })
        );
      } else {
        dispatch(
          addNotification({
            type: "error",
            message: "Ошибка в процессе вызова. Демонстрация закончена",
          })
        );
      }
      dispatch(
        setContactValueFieldDisabled({
          address: ipAddress,
          disabled: false,
        })
      );
      dispatch(setDoCallButtonLoading({ address: ipAddress, loading: false }));
      dispatch(
        setReloadContactButtonDisabled({
          address: ipAddress,
          disabled: false,
        })
      );
      dispatch(
        setCommitSessionButtonDisabled({
          address: ipAddress,
          disabled: false,
        })
      );
      // uiControllingService.socket?.send(
      //   JSON.stringify({
      //     actionCode: UIControllingRequestActionCodes.DO_VIDEO_CALL,
      //     contactTypeId: recordingService?.contact?.contactTypeId,
      //     callId: recordingService?.callId,
      //     contactId: recordingService?.contact?.id,
      //     settings: {
      //       login: recordingService?.contact?.contactValue,
      //     },
      //   })
      // );
    }
  }, [uiControllingService, recordingService]);

  const cancelCallButtonClicked = React.useCallback(async () => {
    dispatch(setCancelCallButtonLoading({ address: ipAddress, loading: true }));
    // if (uiControllingService) {
    //   uiControllingService.socket?.send(
    //     JSON.stringify({
    //       actionCode: UIControllingRequestActionCodes.DECLINE_CALL,
    //       contactTypeId: recordingService?.contact?.contactTypeId,
    //       settings: {
    //         login: recordingService?.contact?.contactValue,
    //       },
    //     })
    //   );
    // }
    dispatch(
      setCancelCallButtonDisabled({ address: ipAddress, disabled: true })
    );
    await sleep(1500);
    const rand = Math.random();
    if (rand > 0.3) {
      dispatch(
        addNotification({
          type: "success",
          message: "Вызов отменен. Демонстрация закончена",
        })
      );
      dispatch(
        setDoCallButtonDisabled({ address: ipAddress, disabled: false })
      );
      dispatch(
        setCancelCallButtonDisabled({ address: ipAddress, disabled: true })
      );
    } else {
      dispatch(
        addNotification({
          type: "error",
          message:
            "Ошибка в процессе отмены вызова. Попробуйте еще раз. Демонстрация закончена",
        })
      );
      dispatch(
        setCancelCallButtonDisabled({ address: ipAddress, disabled: false })
      );
    }
    dispatch(
      setCancelCallButtonLoading({ address: ipAddress, loading: false })
    );
  }, [uiControllingService, recordingService]);

  return {
    beginCommonSessionButtonClicked,
    beginExtraPermissionCallButtonClicked,
    commitCallButtonClicked,
    audioStreamingButtonClicked,
    videoButtonClicked,
    micButtonClicked,
    reloadContactButtonClicked,
    doCallButtonClicked,
    cancelCallButtonClicked,
  };
};
