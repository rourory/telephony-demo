import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import PersonAutocompleteField from "../../molecules/PersonAutocompleteField/Index";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { Box, ButtonGroup, Menu, Tooltip } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import CommitIcon from "@mui/icons-material/Commit";
import HeadsetIcon from "@mui/icons-material/Headset";
import MicIcon from "@mui/icons-material/Mic";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import StyledParagragp from "../../atoms/StyledParagraph/Index";
import { useDispatch, useSelector } from "react-redux";
import { vncVideoShowSelector } from "../../../redux/slices/vnc-video-show-slice/vnc-video-show-slice";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  setIsAlive,
  deviceAvailableExtraCallPermissionSelector,
  permittedDurationsSelector,
} from "../../../redux/slices/devices-slice/devices-slice";
import startPinging from "./start-pinging";
import { AppCardHeader } from "./subcomponents/CardHeader";
import ContactAutocompleteField from "../../molecules/ContactAutocompleteField";
import RelativeAutocompleteField from "../../molecules/RelativeAutocompleteField";
import ContactsIcon from "@mui/icons-material/Contacts";
import DialpadIcon from "@mui/icons-material/Dialpad";
import { useDeviceButtonsHandlers } from "../../../hooks/useDeviceButtonsHandlers";
import { useEstablishConeection } from "../../../hooks/useEstablishConnection";
import { useMenuPhotoHolder } from "../../../hooks/useMenuPhotoHolder";
import { useRemoteServices } from "../../../hooks/useRemoteServices";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition";
import { serverSettingsSelector } from "../../../redux/slices/server-settings-slice/server-settings-slice";
import DeviceSpeechRecognizerStateBox from "../../molecules/DeviceSpeechRecognizerStateBox";
import { PhotoHolder } from "../../molecules/PhotoHolder";
import UltraLightLoadingIndicator from "../../molecules/UltraLightLoadingIndicator";

const DeviceCard: React.FC<{
  device: DeviceState;
  markedWords: Array<MarkedWordEntity>;
}> = ({ device, markedWords }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { standardCallDuration } = useSelector(serverSettingsSelector);
  const permittedDurations = useSelector(permittedDurationsSelector);

  const availableExtraCallPermissions = useSelector((state: RootState) =>
    deviceAvailableExtraCallPermissionSelector(state, device.ipAddress)
  );

  const {
    menuPhotoHolderAnchorEl,
    menuPhotoHolderOpen,
    handleMenuPhotoHolderClick,
    handleMenuPhotoHolderClose,
  } = useMenuPhotoHolder();

  const { actualVncServiceUrl, openVncVideoFrame } =
    useSelector(vncVideoShowSelector);

  const {
    audioStreamingService,
    speechReceivingService,
    recognitionService,
    recordingService,
  } = useRemoteServices(device.ipAddress);

  React.useEffect(() => {
    const stopPinging = startPinging(device.ipAddress, 8000, (alive: boolean) =>
      dispatch(setIsAlive({ address: device.ipAddress, booleanResult: alive }))
    );
    return () => {
      stopPinging();
    };
  }, []);

  // useEstablishConeection(device, markedWords);
  useSpeechRecognition(device.ipAddress, recordingService, recognitionService);

  const {
    beginCommonSessionButtonClicked,
    beginExtraPermissionCallButtonClicked,
    commitCallButtonClicked,
    audioStreamingButtonClicked,
    videoButtonClicked,
    micButtonClicked,
    reloadContactButtonClicked,
    doCallButtonClicked,
    cancelCallButtonClicked,
  } = useDeviceButtonsHandlers(device.ipAddress);

  return (
    <Card sx={{ width: "100%", height: "335px" }}>
      <AppCardHeader device={device} />
      {device.isTurnedOn && (
        <>
          <CardContent sx={{ padding: "5px 15px", height: "200px" }}>
            <PersonAutocompleteField deviceAddress={device.ipAddress} />
            {recordingService?.isProcessing && (
              <Box className="additional-controls">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <RelativeAutocompleteField deviceAddress={device.ipAddress} />
                  {/* Show relative image button */}
                  <Tooltip title="Посмотреть фото" followCursor>
                    <span>
                      <IconButton
                        id={`show-photo-button${device.ipAddress}`}
                        aria-label="show-photo-button"
                        sx={{ marginBottom: " 10px", marginLeft: "10px" }}
                        onClick={handleMenuPhotoHolderClick}
                        disabled={recordingService?.relative == null}
                      >
                        <ContactsIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Menu
                    aria-labelledby={`show-photo-button${device.ipAddress}`}
                    anchorEl={menuPhotoHolderAnchorEl}
                    open={menuPhotoHolderOpen}
                    onClose={handleMenuPhotoHolderClose}
                  >
                    {menuPhotoHolderOpen && (
                      <PhotoHolder
                        id={recordingService?.relative?.id || 0}
                        entity={"RELATIVE"}
                        margin={"0"}
                        width={450}
                        height={562}
                        showControls={false}
                      />
                    )}
                  </Menu>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ContactAutocompleteField
                    deviceAddress={device.ipAddress}
                    disabled={device.contactValueAutocompleteField.disabled}
                  />
                  {/* Reload contact button */}
                  <Tooltip title="Ввести контакт" followCursor>
                    <span>
                      <IconButton
                        sx={{ marginBottom: " 10px", marginLeft: "10px" }}
                        onClick={reloadContactButtonClicked}
                        disabled={
                          recordingService.contact == null ||
                          device.reloadButtonDisabled ||
                          false
                        }
                      >
                        <DialpadIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                  {/* Do call button */}
                  <LoadingButton
                    loadingIndicator={<UltraLightLoadingIndicator />}
                    disabled={
                      recordingService.contact == null ||
                      device.doCallButtonDisabled
                    }
                    loading={device.doCallButtonLoading}
                    variant={"contained"}
                    color="success"
                    startIcon={<CallIcon />}
                    size="small"
                    onClick={doCallButtonClicked}
                  >
                    <StyledParagragp
                      text={"Звонок"}
                      fontSize="14px"
                      fontWeight={600}
                    />
                  </LoadingButton>
                  {/* Cancel call button */}
                  <LoadingButton
                    loadingIndicator={<UltraLightLoadingIndicator />}
                    disabled={
                      recordingService.contact == null ||
                      device.cancelCallButtonDisabled
                    }
                    loading={device.cancelCallButtonLoading}
                    variant="contained"
                    color="error"
                    startIcon={<CallEndIcon />}
                    size="small"
                    onClick={cancelCallButtonClicked}
                  >
                    <StyledParagragp
                      text={"Сброс"}
                      fontSize="14px"
                      fontWeight={600}
                    />
                  </LoadingButton>
                  {/* Commit session button */}
                  <LoadingButton
                    loadingIndicator={<UltraLightLoadingIndicator />}
                    disabled={device.commitSessionButtonDisabled}
                    loading={device.commitSessionButtonLoading}
                    variant="outlined"
                    color="primary"
                    startIcon={<CommitIcon />}
                    size="small"
                    onClick={commitCallButtonClicked}
                  >
                    <StyledParagragp
                      text={"Завершить сеанс"}
                      fontSize="14px"
                      fontWeight={600}
                    />
                  </LoadingButton>
                </Box>
              </Box>
            )}
            {!recordingService?.isProcessing && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "130px",
                  flexDirection: "column",
                }}
              >
                {/* Begin session button */}
                <LoadingButton
                  loadingIndicator={<UltraLightLoadingIndicator />}
                  key={`${device.ipAddress}.beginSessionButton`}
                  disabled={recordingService?.personData == null}
                  size="medium"
                  onClick={beginCommonSessionButtonClicked}
                  loading={
                    recordingService?.isRecordProcessingStarting ||
                    !recordingService?.isAvailable
                  }
                  variant="outlined"
                >
                  <StyledParagragp
                    text={`Начать сеанс (до ${
                      permittedDurations.find((d) => {
                        if (!d.id) return false;
                        const duration =
                          standardCallDuration as unknown as number;
                        return d.id === duration;
                      })?.duration || "?"
                    } мин.)`}
                    fontSize="14px"
                    fontWeight={600}
                  />
                </LoadingButton>
                {availableExtraCallPermissions?.map((extraPermission) => {
                  return (
                    <LoadingButton
                      loadingIndicator={<UltraLightLoadingIndicator />}
                      key={`${device.ipAddress}.extraPermissionButton.${extraPermission.id}`}
                      variant={"outlined"}
                      color={"success"}
                      sx={{ marginTop: "5px" }}
                      size="large"
                      disabled={recordingService?.personData == null}
                      loading={
                        recordingService?.isRecordProcessingStarting ||
                        !recordingService?.isAvailable
                      }
                      onClick={() =>
                        beginExtraPermissionCallButtonClicked(extraPermission)
                      }
                    >
                      <StyledParagragp
                        text={`Начать сеанс (до ${
                          permittedDurations.find((d) => {
                            if (!d.id) return false;
                            const duration =
                              extraPermission.duration as unknown as number;
                            return d.id === duration;
                          })?.duration || "?"
                        } мин.)`}
                        fontSize="14px"
                        fontWeight={600}
                      />
                    </LoadingButton>
                  );
                })}
              </Box>
            )}
          </CardContent>
          <CardActions sx={{ display: "flex" }}>
            <DeviceSpeechRecognizerStateBox
              audioRecognizerConnectedState={
                device.audioRetranslationSocketConnected
              }
              disabled={!device.speechRecognizingEnabled}
              speechRecognizerConnectedState={
                device.speechRetranslationSocketConnected
              }
            />
            <ButtonGroup
              variant="outlined"
              sx={{ margin: "0 auto", justifyContent: "center", width: "100%" }}
            >
              {/* Audio streaming button */}
              <LoadingButton
                loadingIndicator={<UltraLightLoadingIndicator />}
                loading={
                  !audioStreamingService?.isAvailable ||
                  !speechReceivingService?.isAvailable 
                }
                disabled={
                  !audioStreamingService?.isAvailable &&
                  !speechReceivingService?.isAvailable
                }
                variant={
                  audioStreamingService?.isProcessing ? "contained" : "outlined"
                }
                onClick={audioStreamingButtonClicked}
              >
                <HeadsetIcon />
              </LoadingButton>
              {/* Mic button */}
              <LoadingButton
                loadingIndicator={<UltraLightLoadingIndicator />}
                loading={!speechReceivingService?.isAvailable}
                disabled={
                  !audioStreamingService?.isProcessing ||
                  !speechReceivingService?.isAvailable
                }
                variant={
                  speechReceivingService?.isProcessing
                    ? "contained"
                    : "outlined"
                }
                onClick={micButtonClicked}
              >
                <MicIcon />
              </LoadingButton>
              {/* Video button */}
              <LoadingButton
                loadingIndicator={<UltraLightLoadingIndicator />}
                onClick={videoButtonClicked}
                variant={
                  actualVncServiceUrl == device.ipAddress && openVncVideoFrame
                    ? "contained"
                    : "outlined"
                }
              >
                <PersonalVideoIcon />
              </LoadingButton>
            </ButtonGroup>
          </CardActions>
        </>
      )}
      {!device.isTurnedOn && (
        // <ContentLoader height={210} />
        <Box
          sx={{
            height: "70%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UltraLightLoadingIndicator />
        </Box>
      )}
    </Card>
  );
};

export default DeviceCard;
