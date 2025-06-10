import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { Popup, TextBox, Validator } from 'devextreme-react';
import { CompareRule, PatternRule } from 'devextreme-react/validator';
import { ValidatedEvent } from 'devextreme/ui/validator';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import KeyIcon from '@mui/icons-material/Key';
import { dir } from 'console';
import { AppDispatch } from '../../../redux/store';
import { changePasswordDialogStateSelector, setChangePasswordDialogConfirmation, setChangePasswordDialogOpenState, setChangePasswordDialogPassword, setChangePasswordDialogText } from '../../../redux/slices/change-password-dialog-slice/change-password-dialog-slice';
import { userSelector } from '../../../redux/slices/user-slice/user-slice';
import { serverSettingsSelector } from '../../../redux/slices/server-settings-slice/server-settings-slice';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { plusHours } from '../../../utils/datetimeutils';
import { changePasswordThunk } from '../../../redux/slices/change-password-dialog-slice/thunks';
import StyledParagragp from '../../atoms/StyledParagraph/Index';

const ChangePasswordDialog = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [passwordFieldErrors, setPasswordFieldErrors] =
    React.useState<boolean>(false);
  const [confirmationFieldErrors, setConfirmationFieldErrors] =
    React.useState<boolean>(false);

  const {
    open,
    password,
    confirmation,
    fetchingStatus,
    text: changePasswordDialogText,
  } = useSelector(changePasswordDialogStateSelector);
  const { user } = useSelector(userSelector);
  const { changePasswordRequiredIntervalMonths } = useSelector(
    serverSettingsSelector,
  );
  const { backendAddress, backendPort, backendProtocol } = useSelector(
    appSettingsStateSelector,
  );

  React.useEffect(() => {
    if (
      user?.passwordChangeDate == null ||
      new Date() >
        plusHours(
          new Date(user?.passwordChangeDate),
          changePasswordRequiredIntervalMonths * 30 * 24,
        )
    ) {
      dispatch(setChangePasswordDialogOpenState(true));
    }
  }, []);

  const passwordComparison = React.useCallback<any>(() => password, [password]);

  const handleSubmit = React.useCallback(() => {
    const newUser: AdministrationEntity = {
      id: user?.id,
      roleId: user?.roleId!,
      username: user?.username!,
      squadNumber: user?.squadNumber!,
      password: password,
      passwordChangeDate: user?.passwordChangeDate,
      archived: user?.archived,
    };
    dispatch(
      changePasswordThunk({
        data: newUser,
        backendSettings: {
          backendProtocol: backendProtocol,
          backendAddress: backendAddress,
          backendPort: backendPort,
        },
      }),
    );
  }, [password, confirmation]);

  const handleClose = React.useCallback(() => {
    dispatch(setChangePasswordDialogOpenState(false));
    dispatch(setChangePasswordDialogText(undefined));
  }, [open]);

  const renderPopup = React.useCallback(
    () => (
      <div
        className="popup-property-details"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <div>
          <StyledParagragp
            text={
              !changePasswordDialogText
                ? `Вы зашли в учетную запись первый раз или срок действия пароля истек (пароль необходимо менять каждые ${changePasswordRequiredIntervalMonths} мес.). Пожалуйста, установите новый пароль.`
                : changePasswordDialogText
            }
            fontSize="22px"
            fontWeight={500}
          />
          <TextBox
            mode={'password'}
            value={password}
            style={{ marginTop: 30 }}
            inputAttr={{ 'aria-label': 'Password' }}
            placeholder="Введите новый пароль"
            valueChangeEvent="keyup"
            onValueChanged={(e) => {
              dispatch(setChangePasswordDialogPassword(e.value));
            }}
            disabled={confirmation.length > 0}
          >
            <Validator
              onValidated={(e: ValidatedEvent) =>
                setPasswordFieldErrors(!e.isValid || false)
              }
            >
              <PatternRule
                pattern={/(?=.*\d)(?=.*[a-zA-Zа-яА-Я]).{6,}/}
                message={
                  'Пароль должен быть не менее 6 символов и состоять из букв любого алфавита и цифр'
                }
              />
            </Validator>
          </TextBox>
          <TextBox
            mode={'password'}
            valueChangeEvent="keyup"
            value={confirmation}
            onValueChanged={(e) =>
              dispatch(setChangePasswordDialogConfirmation(e.value))
            }
            style={{ marginTop: 20, marginBottom: 20 }}
            inputAttr={{ 'aria-label': 'Password' }}
            placeholder="Подтвердите пароль"
            disabled={
              passwordFieldErrors ||
              password.length < 6 ||
              fetchingStatus == 'LOADING'
            }
          >
            <Validator
              onValidated={(e: ValidatedEvent) => {
                setConfirmationFieldErrors(!e.isValid || false);
              }}
            >
              <CompareRule
                message="Не совпадает с паролем"
                comparisonTarget={passwordComparison}
              />
            </Validator>
          </TextBox>
        </div>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <LoadingButton
            loading={fetchingStatus == 'LOADING'}
            variant={'outlined'}
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={
              passwordFieldErrors ||
              confirmationFieldErrors ||
              password.length < 6 ||
              confirmation.length < 6
            }
          >
            <StyledParagragp
              text={'Изменить'}
              fontSize="16px"
              fontWeight={600}
            />
          </LoadingButton>

          <Button
            variant={'outlined'}
            color="warning"
            size="large"
            sx={{ marginLeft: 2 }}
            onClick={handleClose}
            disabled={fetchingStatus == 'LOADING'}
          >
            <StyledParagragp text={'Позже'} fontSize="16px" fontWeight={600} />
          </Button>
        </div>
      </div>
    ),
    [open, password, confirmation, fetchingStatus],
  );

  return (
    <React.Fragment>
      <Popup
        width={500}
        height={420}
        showTitle={true}
        titleRender={() => (
          <div
            style={{ marginLeft: 10, display: 'flex', alignItems: 'self-end' }}
          >
            <StyledParagragp
              text={'Изменение пароля'}
              fontSize="22px"
              fontWeight={600}
            />
            <KeyIcon sx={{ marginLeft: 2 }} />
          </div>
        )}
        visible={open}
        dragEnabled={true}
        contentRender={renderPopup}
        showCloseButton={false}
      />
    </React.Fragment>
  );
};

export default ChangePasswordDialog;
