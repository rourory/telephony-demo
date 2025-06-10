import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { addNotification } from "../../notify-slice/notify-slice";
import { fetchAllQuery } from "../../../../api/queries";
import { EXTRA_CALL_PERMISSIONS } from "../../../../api/end-points";

export const loadAvailableExtraCallPermissionsThunk = createAsyncThunk<
  { ipAddress: string; data: Array<ExtraCallPermissionEntity> },
  { ipAddress: string; convictedId: number; backendSettings: BackendSettings }
>('devices/loadAvailableExtraCallPermissionsThunk', async (args, thunkApi) => {
  const extraCallPermissions: Array<ExtraCallPermissionEntity> = [];
  let error: any;
  await fetchAllQuery<ExtraCallPermissionEntity>(
    args.backendSettings,
    `${EXTRA_CALL_PERMISSIONS}/${args.convictedId}/available`,
  )
    .then((res) => {
      extraCallPermissions.push(...res.data);
    })
    .catch((err: AxiosError) => {
      thunkApi.dispatch(
        addNotification({
          type: 'error',
          message: `Не удалось загрузить список дополнительных звонков (${err.message})`,
        }),
      );
      error = thunkApi.rejectWithValue(err);
    });
  if (error != undefined) {
    return thunkApi.rejectWithValue(error);
  }
  return { ipAddress: args.ipAddress, data: extraCallPermissions };
});
