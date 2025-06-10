import React from 'react';
import styles from './video-show-card.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { applicationThemeSelector } from '../../../redux/slices/theme-slice/theme-slice';
import { Backdrop, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  setVncScreens,
  setFetchStatusVideoFrame,
  setFullscreenStatusVideoFrame,
  setOpenVideoFrame,
  vncVideoShowSelector,
  setActualVncServiceUrl,
} from '../../../redux/slices/vnc-video-show-slice/vnc-video-show-slice';
import { AppDispatch } from '../../../redux/store';
import { VncScreen } from 'react-vnc';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { devicesSliceSelector } from '../../../redux/slices/devices-slice/devices-slice';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import RFB from 'react-vnc/dist/types/noVNC/core/rfb';
import { ViewOnlyPanel } from './sub/ViewOnlyPanel';
import { userPermissions } from '../../../redux/slices/user-slice/user-slice';
import UltraLightLoadingIndicator from '../../molecules/UltraLightLoadingIndicator';

const VideoShowCard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { palette } = useSelector(applicationThemeSelector);
  const {
    openVncVideoFrame,
    fullscreenVncVideoFrame,
    actualVncServiceUrl,
    vncScreens,
  } = useSelector(vncVideoShowSelector);
  const { devices } = useSelector(devicesSliceSelector);
  const { vncControllingPermitted } = useSelector(userPermissions);
  const [activeRfb, setActiveRfb] = React.useState<
    { password: string; rfb: RFB | undefined } | undefined
  >();

  const onConnect = React.useCallback((rfb?: RFB) => {
    dispatch(setFetchStatusVideoFrame('SUCCESS'));
    dispatch(
      addNotification({
        type: 'success',
        message: `Соединение с ${rfb?._fbName} установлено`,
      }),
    );
    const url = rfb?._url?.split(':');
    let password = '';
    if (url?.length == 3) {
      const port = Number.parseInt(url[2]);
      password =
        devices.find((device) => device.vncService.port == port)
          ?.devicePassword || '';
    }
    setActiveRfb({ password: password, rfb: rfb });
  }, []);
  const onSecurityFailure = React.useCallback((e: any) => {
    dispatch(setFetchStatusVideoFrame('ERROR'));
    dispatch(setOpenVideoFrame(false));
    dispatch(
      addNotification({
        type: 'error',
        message: `Ошибка в имени пользователя или пароле (${e?.detail.reason})`,
      }),
    );
  }, []);
  const onDisconnect = React.useCallback(() => {
    dispatch(setFetchStatusVideoFrame('LOADING'));
    dispatch(
      addNotification({
        type: 'info',
        message: `Соединение разорвано`,
      }),
    );
  }, []);

  React.useEffect(() => {
    const screens: Array<VncScreenStateType> = [];
    devices.forEach((device) => {
      screens.push({
        address: device.ipAddress,
        screen: () => {
          return (
            <>
              {device.vncService.viewOnly == true &&
                vncControllingPermitted == false && <ViewOnlyPanel />}
              <VncScreen
                url={`ws://${device.vncService.address}:${device.vncService.port}`}
                scaleViewport
                autoConnect={true}
                qualityLevel={4}
                compressionLevel={5}
                showDotCursor
                rfbOptions={{
                  credentials: {
                    username: device.vncService.username,
                    password: device.vncService.password,
                  },
                }}
                loadingUI={
                  <Backdrop
                    sx={{
                      color: 'white',
                      zIndex: '50',
                      position: 'absolute',
                      borderRadius: '10px',
                    }}
                    open
                  >
                    <UltraLightLoadingIndicator />
                  </Backdrop>
                }
                background="#000000"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '10px',
                }}
                onConnect={onConnect}
                onSecurityFailure={onSecurityFailure}
                onDisconnect={onDisconnect}
              />
            </>
          );
        },
      });
    });
    dispatch(setVncScreens(screens));
  }, [devices, vncControllingPermitted]);

  const fullscreenButtonClicked = React.useCallback(() => {
    dispatch(setFullscreenStatusVideoFrame(!fullscreenVncVideoFrame));
  }, [fullscreenVncVideoFrame]);

  const closeButtonClicked = React.useCallback(() => {
    dispatch(setFullscreenStatusVideoFrame(false));
    dispatch(setActualVncServiceUrl(undefined));
    dispatch(setOpenVideoFrame(false));
  }, []);

  return (
    <div
      className={styles.card}
      style={{
        backgroundColor: palette.mode == 'dark' ? '#121212' : 'white',
        transform: openVncVideoFrame ? '' : 'translateX(200%)',
        height: fullscreenVncVideoFrame ? '100%' : '20vw',
        width: fullscreenVncVideoFrame ? '100%' : '35.5vw',
        left: fullscreenVncVideoFrame ? '' : '62%',
        opacity: fullscreenVncVideoFrame ? '1' : '0.85',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: fullscreenVncVideoFrame ? '5px' : 0,
          top: fullscreenVncVideoFrame ? '5px' : 0,
          zIndex: '151',
          scale: fullscreenVncVideoFrame ? '1' : '0.6',
        }}
      >
        {/* Unlocking functionality
        <IconButton
          sx={{
            background: '#c3c6c432',
            marginRight: '5px',
          }}
          disabled={activeRfb?.rfb?._rfbConnectionState != 'connected'}
          onClick={unlockButtonClicked}
        >
          <KeyIcon />
        </IconButton> */}
        <IconButton
          sx={{
            background: '#c3c6c432',
            marginRight: '5px',
          }}
          onClick={fullscreenButtonClicked}
        >
          {fullscreenVncVideoFrame ? (
            <CloseFullscreenIcon />
          ) : (
            <OpenInFullIcon />
          )}
        </IconButton>
        <IconButton
          sx={{
            background: '#c3c6c432',
          }}
          onClick={closeButtonClicked}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {vncScreens
        .find((screen) => screen.address == actualVncServiceUrl)
        ?.screen?.()}
    </div>
  );
};

export default VideoShowCard;
