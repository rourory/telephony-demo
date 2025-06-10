import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  CallResultConstant,
  DeviceServiceEnum,
  InternalCallTypes,
  RecordingRequestCodes,
  RecordingServiceResponceCodesEnum,
} from '../../../../@types/enums';
import {
  setIsRecordingProcessing,
  setIsServiceAvailable,
  setRecordingServiceStartTime,
  setCallId,
  setIsRecordProcessingStarting,
  setCurrentCallDuration,
  setCommitSessionButtonLoading,
  setEstablishingConnection,
} from '../devices-slice';
import {
  fetchOneQuery,
  insertQuery,
  updateQuery,
} from '../../../../api/queries';
import { updateValuesOfEntityDataTypeObject } from '../../../../devextreme/util';
import { restoreDeviceCardInitialState } from '../subthunks/restore-device-card-initial-state-thunk';
import { setDeviceCardClosedState } from '../subthunks/set-device-card-closed-state-thunk';
import { loadContactByIdThunk } from '../subthunks/load-contact-by-id-thunk';
import { loadPersonByIdThunk } from '../subthunks/load-person-by-id-thunk';
import { loadRelativeByIdThunk } from '../subthunks/load-relative-by-id-thunk';
import { setDeviceCardcallingFinishedState } from '../subthunks/set-device-card-calling-finished-state';
import { closeCommitSessionDialogAndClearState } from '../../commit-session-slice/commit-session-slice';
import { addNotification } from '../../notify-slice/notify-slice';
import { CALLS, EXTRA_CALL_PERMISSIONS } from '../../../../api/end-points';

export const establishRecordingServiceConnection = createAsyncThunk<
  ServiceSocketConnection,
  {
    connection: ServiceSocketConnection;
    backendSettings: BackendSettings;
    markedWords?: Array<MarkedWordEntity>;
  }
>(
  'devices/establishRecordingServiceConnection',
  async ({ connection, backendSettings, markedWords }, thunkApi) => {
    connection.socket = new WebSocket(
      `ws://${connection.ipAddress}:${connection.port}`,
    );
    connection.socket.onopen = () => {
      thunkApi.dispatch(
        setEstablishingConnection({
          address: connection.ipAddress,
          booleanResult: false,
          serviceName: DeviceServiceEnum.SRVC_RECORDING,
        }),
      );
      thunkApi.dispatch(
        setIsServiceAvailable({
          ipAddress: connection.ipAddress,
          port: connection.port,
          isAvailable: true,
          serviceName: DeviceServiceEnum.SRVC_RECORDING,
        }),
      );
      thunkApi.dispatch(
        restoreDeviceCardInitialState({ ipAddress: connection.ipAddress }),
      );
    };
    connection.socket.onclose = () => {
      thunkApi.dispatch(
        setIsServiceAvailable({
          ipAddress: connection.ipAddress,
          port: connection.port,
          isAvailable: false,
          serviceName: DeviceServiceEnum.SRVC_RECORDING,
        }),
      );
      thunkApi.dispatch(
        setDeviceCardClosedState({
          ipAddress: connection.ipAddress,
          port: connection.port,
          serviceName: DeviceServiceEnum.SRVC_RECORDING,
          socket: connection.socket,
          backendSettings: backendSettings,
          markedWords: markedWords,
        }),
      );
    };
    // socket.onerror = () => {
    // };
    connection.socket.onmessage = async (ev) => {
      const response = JSON.parse(ev.data) as RecordingServiceResponce;
      if (response.Code == RecordingServiceResponceCodesEnum.CURRENT_SESSION) {
        const currentSessionResponse = response as CurrentSessionResponce;
        const currentSession = currentSessionResponse.session;
        thunkApi.dispatch(
          addNotification({
            type: 'info',
            message: `Подключение к существующему сеансу завершено успешно`,
          }),
        );

        thunkApi.dispatch(
          setIsRecordingProcessing({
            address: connection.ipAddress,
            booleanResult: true,
          }),
        );
        thunkApi.dispatch(
          setIsRecordProcessingStarting({
            address: connection.ipAddress,
            booleanResult: false,
          }),
        );
        if (currentSession.CallId)
          thunkApi.dispatch(
            setCallId({
              ipAddress: connection.ipAddress,
              id: currentSession.CallId,
            }),
          );
        if (currentSession.SessionStarted)
          thunkApi.dispatch(
            setRecordingServiceStartTime({
              ipAddress: connection.ipAddress,
              startTime: new Date(currentSession.SessionStarted),
            }),
          );
        if (currentSession.UserId)
          thunkApi.dispatch(
            loadPersonByIdThunk({
              ipAddress: connection.ipAddress,
              personId: currentSession.UserId,
              backendSettings: backendSettings,
            }),
          );
        if (currentSession.RelativeId)
          thunkApi.dispatch(
            loadRelativeByIdThunk({
              ipAddress: connection.ipAddress,
              relativeId: currentSession.RelativeId,
              backendSettings: backendSettings,
            }),
          );
        if (currentSession.ContactId)
          thunkApi.dispatch(
            loadContactByIdThunk({
              ipAddress: connection.ipAddress,
              contactId: currentSession.ContactId,
              backendSettings: backendSettings,
            }),
          );
        //Try to take buttons states from remote service
        setTimeout(() => {
          connection.socket?.send(
            JSON.stringify({
              code: RecordingRequestCodes.ATTACH_CALL,
            }),
          );
        }, 200);
      } else if (
        response.Code == RecordingServiceResponceCodesEnum.RECORDING_STARTED
      ) {
        const currectSessionResponse = response as CurrentSessionResponce;
        thunkApi.dispatch(
          setCurrentCallDuration({
            ipAddress: connection.ipAddress,
            duration: currectSessionResponse.session.DurationMinutes,
          }),
        );
        const startTime = new Date();
        await insertQuery<CallEntity>(backendSettings, CALLS, {
          convictedId: currectSessionResponse.session.UserId || 0,
          administrationId:
            currectSessionResponse.session.AdministrationId || 0,
          callStartTime: startTime,
          videoPath: currectSessionResponse.session.VideoPath,
          resultId: CallResultConstant.CALL_PROCESSING,
        })
          .then((res) => {
            const data = res.data as CallEntity;
            thunkApi.dispatch(
              addNotification({
                type: 'success',
                message: `Сеанс разговора начат. Запись разговора запущена.`,
              }),
            );
            thunkApi.dispatch(
              setIsRecordingProcessing({
                address: connection.ipAddress,
                booleanResult: true,
              }),
            );
            thunkApi.dispatch(
              setIsRecordProcessingStarting({
                address: connection.ipAddress,
                booleanResult: false,
              }),
            );
            thunkApi.dispatch(
              setRecordingServiceStartTime({
                ipAddress: connection.ipAddress,
                startTime: startTime,
              }),
            );
            thunkApi.dispatch(
              setCallId({
                ipAddress: connection.ipAddress,
                id: data.id || null,
              }),
            );
          })
          .catch(() =>
            thunkApi.dispatch(
              addNotification({
                type: 'error',
                message: `Ошибка запуска сеанса.`,
              }),
            ),
          );
        // Case when session finished successfully
      } else if (
        response.Code == RecordingServiceResponceCodesEnum.RECORDING_FINISHED
      ) {
        const currectSessionResponse = response as CurrentSessionResponce;
        if (currectSessionResponse.session.CallId) {
          const values = {
            relativeId: currectSessionResponse.session.RelativeId,
            contactId: currectSessionResponse.session.ContactId,
            callFinishTime: new Date(),
            resultId: currectSessionResponse.session.ResultId,
          };
          //Update current call entity. Fetch current call.
          await fetchOneQuery<CallEntity>(
            backendSettings,
            CALLS,
            currectSessionResponse.session.CallId,
          )
            .then(async (res) => {
              // Then we should update changed values in fetched call entity.
              const returnedData: CallEntity =
                updateValuesOfEntityDataTypeObject(res, values);
              // Then just update entity
              await updateQuery<CallEntity>(
                backendSettings,
                CALLS,
                returnedData,
              )
                .then((res) => {
                  thunkApi.dispatch(
                    restoreDeviceCardInitialState({
                      ipAddress: connection.ipAddress,
                    }),
                  );
                  thunkApi.dispatch(
                    closeCommitSessionDialogAndClearState({
                      address: connection.ipAddress,
                    }),
                  );
                  thunkApi.dispatch(
                    addNotification({
                      type: 'success',
                      message: `Сеанс завершен успешно`,
                    }),
                  );
                  return res.data as CallEntity;
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err: Error) => {
              thunkApi.dispatch(
                setCommitSessionButtonLoading({
                  address: connection.ipAddress,
                  loading: false,
                }),
              );
              thunkApi.dispatch(
                addNotification({
                  type: 'error',
                  message: `Ошибка завершения сеанса`,
                }),
              );
              console.log(err);
            });
          //Is it an extra permitted call?
          if (
            currectSessionResponse.session.InternalCallType ==
              InternalCallTypes.EXTRA &&
            currectSessionResponse.session.ExtraCallPermissionId &&
            currectSessionResponse.session.ResultId ==
              CallResultConstant.CALL_SUCCEEDED
          ) {
            const values = {
              commitingDate: new Date(),
            };
            await fetchOneQuery<ExtraCallPermissionEntity>(
              backendSettings,
              EXTRA_CALL_PERMISSIONS,
              currectSessionResponse.session.ExtraCallPermissionId,
            )
              .then(async (res) => {
                // Then we should update changed values in fetched entity
                const returnedData: ExtraCallPermissionEntity =
                  updateValuesOfEntityDataTypeObject(res, values);
                await updateQuery<ExtraCallPermissionEntity>(
                  backendSettings,
                  EXTRA_CALL_PERMISSIONS,
                  returnedData,
                )
                  .then((res) => {
                    thunkApi.dispatch(
                      addNotification({
                        type: 'success',
                        message: `Отметка о предоставлении дополнительного звонка произведена успешно`,
                      }),
                    );
                    return res.data as ExtraCallPermissionEntity;
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                thunkApi.dispatch(
                  addNotification({
                    type: 'error',
                    message: `Ошибка в процессе отметки о предоставлении дополнительно звонка`,
                  }),
                );
                console.log(err);
              });
          }
        }

        thunkApi.dispatch(
          setDeviceCardcallingFinishedState({
            ipAddress: connection.ipAddress,
          }),
        );
      } else if (
        response.Code == RecordingServiceResponceCodesEnum.CLIENT_NOTIFIED
      ) {
        const currectSessionResponse = response as CurrentSessionResponce;
        thunkApi.dispatch(
          addNotification({
            type: 'warning',
            message: `Сеанс для ос.${currectSessionResponse.session.UserSurName} подходит к концу.`,
          }),
        );
      } else if (
        response.Code ==
        RecordingServiceResponceCodesEnum.RECORDING_INTERRUPTED_FORCEFULLY
      ) {
        const currectSessionResponse = response as CurrentSessionResponce;
        thunkApi.dispatch(
          addNotification({
            type: 'warning',
            message: `Сеанс для ос.${currectSessionResponse.session.UserSurName} прерван принудительно. Время сенса истекло`,
          }),
        );
        //TODO(rrr): Если обновление идет в блоке FINISHED_SUCCESFULLY, то зачем его обновлять здесь?
        // if (currectSessionResponse.session.CallId) {
        //   const values = {
        //     resultId: currectSessionResponse.session.ResultId,
        //   };
        //   await fetchOneQuery<CallEntity>(
        //     backendSettings,
        //     CALLS,
        //     currectSessionResponse.session.CallId,
        //   )
        //     .then(async (res) => {
        //       // Then we should update changed values in fetched entity
        //       const returnedData: CallEntity =
        //         updateValuesOfEntityDataTypeObject(res, values);
        //       // Then just update entity
        //       await updateQuery<CallEntity>(
        //         backendSettings,
        //         CALLS,
        //         returnedData,
        //       )
        //         .then((res) => {
        //           return res.data as CallEntity;
        //         })
        //         .catch((err) => {
        //           throw err;
        //         });
        //     })
        //     .catch((err: Error) => {
        //       thunkApi.dispatch(
        //         addNotification({
        //           type: 'error',
        //           message: `Ошибка принудительного завершения сеанса`,
        //         }),
        //       );
        //       throw err;
        //     });
        // }
      } else if (response.Code == RecordingServiceResponceCodesEnum.ERROR) {
        thunkApi.dispatch(
          addNotification({ type: 'error', message: response.Message }),
        );
        thunkApi.dispatch(
          setIsRecordProcessingStarting({
            address: connection.ipAddress,
            booleanResult: false,
          }),
        );
        thunkApi.dispatch(
          setIsRecordingProcessing({
            address: connection.ipAddress,
            booleanResult: false,
          }),
        );
      }
    };
    return {
      socket: connection.socket,
      ipAddress: connection.ipAddress,
      port: connection.port,
      serviceName: DeviceServiceEnum.SRVC_RECORDING,
    };
  },
);
