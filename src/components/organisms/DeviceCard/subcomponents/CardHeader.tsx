import React from 'react';
import CardHeader from '@mui/material/CardHeader';
import {
  Avatar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import StyledParagragp from '../../../atoms/StyledParagraph/Index';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  deviceCurrentCallDurationSelector,
  deviceServiceSelector,
  setCallActionButtonsDisabled,
  setContactValueFieldDisabled,
  setReloadContactButtonDisabled,
} from '../../../../redux/slices/devices-slice/devices-slice';
import {
  DeviceServiceEnum,
  PowerManagementCodesEnum,
} from '../../../../@types/enums';
import RecognizedAlertTooltipComponent from '../../RecognizedAlertTooltip';
import { serverSettingsSelector } from '../../../../redux/slices/server-settings-slice/server-settings-slice';

export const AppCardHeader: React.FC<{ device: DeviceState }> = ({
  device,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [timerValue, setTimerValue] = React.useState<string>('00:00');

  const dispatch = useDispatch<AppDispatch>();

  const powerManagementService = useSelector((state: RootState) =>
    deviceServiceSelector(
      state,
      device.ipAddress,
      DeviceServiceEnum.SRVC_POWER_MANAGEMENT,
    ),
  );

  const { beforeTimerEndsWarningMinutes } = useSelector(serverSettingsSelector);

  const deviceCurrentCallDuration = useSelector((state: RootState) =>
    deviceCurrentCallDurationSelector(state, device.ipAddress),
  );

  const startTimer = React.useCallback(
    (startValue: Date) => {
      const interval = setInterval(() => {
        const diff = new Date(new Date().getTime() - startValue.getTime());
        const minutes = diff.getMinutes();
        const seconds = diff.getSeconds();
        const result = `${minutes < 10 ? '0' + minutes : minutes}:${
          seconds < 10 ? '0' + seconds : seconds
        }`;
        setTimerValue(result);
      }, 1000);
      return () => {
        setTimerValue('00:00');
        clearInterval(interval);
      };
    },
    [device, timerValue, setTimerValue],
  );

  const calculatedCallDuration = React.useMemo(() => {
    if (deviceCurrentCallDuration) {
      return deviceCurrentCallDuration - beforeTimerEndsWarningMinutes;
    }
    return 600;
  }, [beforeTimerEndsWarningMinutes, deviceCurrentCallDuration, device]);

  const currentMinutesMoreOrEqualThenPermittedCallDuration =
    React.useMemo(() => {
      return (
        Number.parseInt(timerValue.split(':')[0]) >= calculatedCallDuration
      );
    }, [calculatedCallDuration, timerValue, device]);

  let stopTimer: () => void;

  React.useEffect(() => {
    if (device.recordingService.startTime != null) {
      stopTimer = startTimer(device.recordingService.startTime);
    } else if (device.recordingService.startTime != null) {
      stopTimer?.();
    }
    return () => stopTimer?.();
  }, [device.recordingService.startTime]);

  const extraActionsMenuOpen = React.useMemo(
    () => Boolean(anchorEl),
    [anchorEl],
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const rebootButtonClicked = React.useCallback(() => {
    powerManagementService?.socket?.send(
      JSON.stringify({ code: PowerManagementCodesEnum.REBOOT }),
    );
    handleClose();
  }, [powerManagementService]);

  const powerOffButtonClicked = React.useCallback(() => {
    powerManagementService?.socket?.send(
      JSON.stringify({ code: PowerManagementCodesEnum.SHUTDOWN }),
    );
    handleClose();
  }, [powerManagementService]);

  const restartTelegramButtonClicked = React.useCallback(() => {
    powerManagementService?.socket?.send(
      JSON.stringify({ code: PowerManagementCodesEnum.RESTART_TELEGRAM }),
    );

    dispatch(
      setCallActionButtonsDisabled({
        address: device.ipAddress,
        disabled: true,
      }),
    );
    dispatch(
      setReloadContactButtonDisabled({
        address: device.ipAddress,
        disabled: true,
      }),
    );
    dispatch(
      setContactValueFieldDisabled({
        address: device.ipAddress,
        disabled: true,
      }),
    );
    handleClose();
  }, [powerManagementService]);

  return (
    <CardHeader
      avatar={
        <RecognizedAlertTooltipComponent
          device={device}
          child={
            <Avatar sx={{ bgcolor: device.isTurnedOn ? green[500] : red[500] }}>
              <StyledParagragp
                text={device.number.toString()}
                fontSize="24px"
                fontWeight={600}
              />
            </Avatar>
          }
        />
      }
      sx={{
        backgroundColor: currentMinutesMoreOrEqualThenPermittedCallDuration
          ? '#524301'
          : '',
        transition: '1s ease-in-out',
      }}
      action={
        <div>
          {device.recordingService.isProcessing && (
            <Tooltip
              arrow
              open={currentMinutesMoreOrEqualThenPermittedCallDuration}
              title={`Более ${calculatedCallDuration} минут`}
            >
              <span>
                <TextField
                  size="small"
                  value={timerValue}
                  disabled
                  sx={{ width: '70px', marginRight: '20px' }}
                />
              </span>
            </Tooltip>
          )}
          <Tooltip title="Дополнительные действия" followCursor>
            <span>
              <IconButton
                id={`${device.ipAddress}positioned-button`}
                aria-label="settings"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Menu
            aria-labelledby={`${device.ipAddress}positioned-button`}
            anchorEl={anchorEl}
            open={extraActionsMenuOpen}
            hidden={!device.isTurnedOn}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {device.isTurnedOn && (
              <MenuItem
                onClick={rebootButtonClicked}
                disabled={
                  !powerManagementService?.isAvailable ||
                  device.recordingService.isProcessing
                }
              >
                <ListItemIcon>
                  <RestartAltIcon fontSize="small" />
                </ListItemIcon>
                <StyledParagragp
                  text="Перезагрузить"
                  fontSize="18px"
                  fontWeight={600}
                />
              </MenuItem>
            )}
            {device.isTurnedOn && (
              <MenuItem
                onClick={powerOffButtonClicked}
                disabled={
                  !powerManagementService?.isAvailable ||
                  device.recordingService.isProcessing
                }
              >
                <ListItemIcon>
                  <PowerSettingsNewIcon fontSize="small" />
                </ListItemIcon>
                <StyledParagragp
                  text="Выключить"
                  fontSize="18px"
                  fontWeight={600}
                />
              </MenuItem>
            )}
            {device.isTurnedOn && (
              <MenuItem
                onClick={restartTelegramButtonClicked}
                disabled={!powerManagementService?.isAvailable}
              >
                <ListItemIcon>
                  <RestartAltIcon fontSize="small" />
                </ListItemIcon>
                <StyledParagragp
                  text="Перезапустить Telegram"
                  fontSize="18px"
                  fontWeight={600}
                />
              </MenuItem>
            )}
          </Menu>
        </div>
      }
      title={
        <StyledParagragp
          text={`Устройство №${device.number}`}
          fontSize="16px"
          fontWeight={600}
        />
      }
      subheader={
        <StyledParagragp
          text={
            device.isTurnedOn
              ? 'Соединение установлено'
              : 'Соединение с устройством . . .'
          }
          fontSize="15px"
          fontWeight={600}
        />
      }
    ></CardHeader>
  );
};
