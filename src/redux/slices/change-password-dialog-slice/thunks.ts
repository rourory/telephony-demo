import { createAsyncThunk } from '@reduxjs/toolkit';
import { addNotification } from '../notify-slice/notify-slice';
import { AxiosError } from 'axios';
import { setUser } from '../user-slice/user-slice';
import { updateQuery } from '../../../api/queries';
import { ADMINISTRATION } from '../../../api/end-points';

export const changePasswordThunk = createAsyncThunk<
  { data: AdministrationEntity | null },
  { data: AdministrationEntity; backendSettings: BackendSettings }
>('changePasswordDialog/changePasswordThunk', async (args, thunkApi) => {
  let administrationData: AdministrationEntity = args.data;
  await updateQuery<AdministrationEntity>(
    args.backendSettings,
    ADMINISTRATION,
    administrationData,
  )
    .then((res) => {
      if (res.status == 200) {
        administrationData = res.data as AdministrationEntity;
        thunkApi.dispatch(
          addNotification({
            type: 'success',
            message: 'Пароль обновлен успешно',
          }),
        );
        thunkApi.dispatch(setUser(administrationData));
      }
    })
    .catch((err: AxiosError) => {
      thunkApi.dispatch(
        addNotification({
          type: 'error',
          message: `Ошибка при обновлении пароля (${err.message})`,
        }),
      );
    });
  return { data: administrationData };
});
