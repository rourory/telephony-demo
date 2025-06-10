import React from 'react';
import Grid from '@mui/material/Grid';
import DeviceCard from '../../components/organisms/DeviceCard';
import VideoShowCard from '../../components/organisms/VideoShowCard';
import { useDispatch, useSelector } from 'react-redux';
import { devicesSliceSelector } from '../../redux/slices/devices-slice/devices-slice';
import { AppDispatch } from '../../redux/store';
import { Backdrop } from '@mui/material';
import StyledParagragp from '../../components/atoms/StyledParagraph/Index';
import CommitSessionDialog from '../../components/organisms/CommitSessionDialog';
import UltraLightLoadingIndicator from '../../components/molecules/UltraLightLoadingIndicator';
import { appSettingsStateSelector } from '../../redux/slices/app-settings-slice/app-settings-slice';
import { loadDevicesThunk } from '../../redux/slices/devices-slice/subthunks/load-devices-thunk';


const MainPage: React.FC = () => {
  const { devices, fetching, markedWords } = useSelector(devicesSliceSelector);
  const dispatch = useDispatch<AppDispatch>();
  const backendSettings = useSelector(appSettingsStateSelector);

  React.useEffect(() => {
    if (devices.length == 0 && markedWords != undefined)
      dispatch(loadDevicesThunk(backendSettings));
  }, [markedWords]);

  React.useEffect(() => {
    window.electron.ipcRenderer.removeAllListeners('window.devices.get');
    window.electron.ipcRenderer.on('window.devices.get', () => {
      window.electron.ipcRenderer.sendMessage(
        'main.vnc.window.devices.set',
        devices,
      );
    });
  }, [devices]);

  return (
    <>
      {fetching == 'LOADING' && (
        <Backdrop
          sx={{
            color: 'white',
            zIndex: '50',
            position: 'absolute',
          }}
          open
        >
          <UltraLightLoadingIndicator />
        </Backdrop>
      )}
      {fetching == 'SUCCESS' && markedWords != undefined && (
        <Grid container spacing={2} padding={2} minHeight={'80vh'}>
          {devices.map((device) => (
            <Grid
              item
              md={6}
              lg={4}
              xl={3}
              minHeight={'50%'}
              key={device.number}
            >
              <DeviceCard
                device={device}
                key={device.number}
                markedWords={markedWords}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {fetching == 'ERROR' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: '70%',
            alignItems: 'center',
          }}
        >
          <StyledParagragp
            fontWeight={800}
            fontSize="40px"
            text="Ошибка при загрузке данных"
          />
        </div>
      )}
      <VideoShowCard />
      <CommitSessionDialog />
    </>
  );
};

export default MainPage;
