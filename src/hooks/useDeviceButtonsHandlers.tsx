import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRemoteServices } from './useRemoteServices';
import { RecordingRequestCodes, CallResultConstant, InternalCallTypes, UIControllingRequestActionCodes } from '../@types/enums';
import { setCommitSessionDialogState } from '../redux/slices/commit-session-slice/commit-session-slice';
import { setIsRecordProcessingStarting, setCommitSessionButtonLoading, setContactValueFieldDisabled, setIsAudioStreamingProcessing, setIsMicRecordingProcessing, setCallActionButtonsDisabled, setReloadContactButtonDisabled, setDoCallButtonLoading, setCommitSessionButtonDisabled, setCancelCallButtonLoading } from '../redux/slices/devices-slice/devices-slice';
import { serverSettingsSelector } from '../redux/slices/server-settings-slice/server-settings-slice';
import { userSelector } from '../redux/slices/user-slice/user-slice';
import { vncVideoShowSelector, setOpenVideoFrame, setActualVncServiceUrl } from '../redux/slices/vnc-video-show-slice/vnc-video-show-slice';
import { AppDispatch } from '../redux/store';


export const useDeviceButtonsHandlers = (ipAddress: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(userSelector);
  const { standardCallDuration, beforeTimerEndsWarningMinutes } = useSelector(
    serverSettingsSelector,
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

  const beginCommonSessionButtonClicked = React.useCallback(() => {
    dispatch(
      setIsRecordProcessingStarting({
        address: ipAddress,
        booleanResult: true,
      }),
    );
    recordingService?.socket?.send(
      JSON.stringify({
        code: RecordingRequestCodes.CREATE_RECORDING,
        settings: {
          userName: recordingService.personData?.firstName,
          userSurName: recordingService.personData?.secondName,
          userMiddleName: recordingService.personData?.middleName,
          userId: recordingService.personData?.id,
          videoPath: recordingService.videoPath,
          resultId: CallResultConstant.CALL_PROCESSING,
          administrationId: user?.id,
          durationMinutes: standardCallDuration?.duration,
          beforeTimerEndsWarningMinutes: beforeTimerEndsWarningMinutes,
          type: InternalCallTypes.COMMON,
          internalCallType: InternalCallTypes.EXTRA,
        },
      }),
    );
  }, [recordingService, standardCallDuration, beforeTimerEndsWarningMinutes]);

  const beginExtraPermissionCallButtonClicked = React.useCallback(
    (extraCallPermission: ExtraCallPermissionEntity) => {
      dispatch(
        setIsRecordProcessingStarting({
          address: ipAddress,
          booleanResult: true,
        }),
      );
      recordingService?.socket?.send(
        JSON.stringify({
          code: RecordingRequestCodes.CREATE_RECORDING,
          settings: {
            userName: recordingService.personData?.firstName,
            userSurName: recordingService.personData?.secondName,
            userMiddleName: recordingService.personData?.middleName,
            userId: recordingService.personData?.id,
            videoPath: recordingService.videoPath,
            resultId: CallResultConstant.CALL_PROCESSING,
            administrationId: user?.id,
            durationMinutes: extraCallPermission.duration.duration,
            beforeTimerEndsWarningMinutes: beforeTimerEndsWarningMinutes,
            internalCallType: InternalCallTypes.EXTRA,
            extraCallPermissionId: extraCallPermission.id,
          },
        }),
      );
    },
    [recordingService, standardCallDuration, beforeTimerEndsWarningMinutes],
  );

  const commitCallButtonClicked = React.useCallback(() => {
    dispatch(
      setCommitSessionButtonLoading({
        address: ipAddress,
        loading: true,
      }),
    );
    dispatch(
      setCommitSessionDialogState({
        ipAddress: ipAddress,
        open: true,
        person: recordingService?.personData || null,
        successAction: () => {
          recordingService?.socket?.send(
            JSON.stringify({
              code: RecordingRequestCodes.END_RECORDING,
              settings: { resultId: CallResultConstant.CALL_SUCCEEDED },
            }),
          );
          dispatch(
            setContactValueFieldDisabled({
              address: ipAddress,
              disabled: false,
            }),
          );
        },
        failedAction: () => {
          recordingService?.socket?.send(
            JSON.stringify({
              code: RecordingRequestCodes.END_RECORDING,
              settings: { resultId: CallResultConstant.CALL_FAILED },
            }),
          );
          dispatch(
            setContactValueFieldDisabled({
              address: ipAddress,
              disabled: false,
            }),
          );
        },
        errorAction: () => {
          recordingService?.socket?.send(
            JSON.stringify({
              code: RecordingRequestCodes.END_RECORDING,
              settings: { resultId: CallResultConstant.CALL_ERROR },
            }),
          );
          dispatch(
            setContactValueFieldDisabled({
              address: ipAddress,
              disabled: false,
            }),
          );
        },
      }),
    );
  }, [recordingService]);

  const audioStreamingButtonClicked = React.useCallback(() => {
    dispatch(
      setIsAudioStreamingProcessing({
        address: ipAddress,
        booleanResult: !audioStreamingService?.isProcessing,
        closeAll: true,
      }),
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
      }),
    );
  }, [speechReceivingService, ipAddress]);

  const reloadContactButtonClicked = React.useCallback(() => {
    if (uiControllingService) {
      uiControllingService.socket?.send(
        JSON.stringify({
          actionCode: UIControllingRequestActionCodes.FIND_RELATIVE,
          contactTypeId: recordingService?.contact?.contactTypeId,
          settings: {
            login: recordingService?.contact?.contactValue,
          },
        }),
      );
      dispatch(
        setCallActionButtonsDisabled({
          address: ipAddress,
          disabled: true,
        }),
      );
      dispatch(
        setReloadContactButtonDisabled({
          address: ipAddress,
          disabled: true,
        }),
      );
      dispatch(
        setContactValueFieldDisabled({
          address: ipAddress,
          disabled: true,
        }),
      );
    }
  }, [uiControllingService, ipAddress, recordingService]);

  const doCallButtonClicked = React.useCallback(() => {
    if (uiControllingService) {
      dispatch(
        setContactValueFieldDisabled({
          address: ipAddress,
          disabled: true,
        }),
      );
      dispatch(setDoCallButtonLoading({ address: ipAddress, loading: true }));
      dispatch(
        setReloadContactButtonDisabled({
          address: ipAddress,
          disabled: true,
        }),
      );
      dispatch(
        setCommitSessionButtonDisabled({
          address: ipAddress,
          disabled: true,
        }),
      );
      uiControllingService.socket?.send(
        JSON.stringify({
          actionCode: UIControllingRequestActionCodes.DO_VIDEO_CALL,
          contactTypeId: recordingService?.contact?.contactTypeId,
          callId: recordingService?.callId,
          contactId: recordingService?.contact?.id,
          settings: {
            login: recordingService?.contact?.contactValue,
          },
        }),
      );
    }
  }, [uiControllingService, recordingService]);

  const cancelCallButtonClicked = React.useCallback(() => {
    dispatch(setCancelCallButtonLoading({ address: ipAddress, loading: true }));
    if (uiControllingService) {
      uiControllingService.socket?.send(
        JSON.stringify({
          actionCode: UIControllingRequestActionCodes.DECLINE_CALL,
          contactTypeId: recordingService?.contact?.contactTypeId,
          settings: {
            login: recordingService?.contact?.contactValue,
          },
        }),
      );
    }
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
