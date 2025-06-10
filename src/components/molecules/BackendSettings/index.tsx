import React from "react";
import TextField from "@mui/material/TextField/TextField";
import { useDispatch, useSelector } from "react-redux";
import styles from "./backend-settings.module.scss";
import {
  appSettingsStateSelector,
  setBackendAddress,
  setBackendPort,
  setBackendProtocol,
} from "../../../redux/slices/app-settings-slice/app-settings-slice";
import { AppDispatch } from "../../../redux/store";
import StyledParagragp from "../../atoms/StyledParagraph/Index";

const BackendSettings = () => {
  const { backendAddress, backendProtocol, backendPort } = useSelector(
    appSettingsStateSelector
  );
  const dispatch = useDispatch<AppDispatch>();

  const onBackendProtocolChanged = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch(setBackendProtocol(ev.target.value));
    },
    [backendProtocol]
  );
  const onBackendPortChanged = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch(setBackendPort(ev.target.value));
    },
    [backendPort]
  );
  const onBackendAddressChanged = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch(setBackendAddress(ev.target.value));
    },
    [backendAddress]
  );

  return (
    <div className={styles.settings}>
      <StyledParagragp text="Cервер:" fontWeight={400} fontSize="26px" />
      <div style={{ width: "10px" }} />
      <TextField
        size="small"
        variant="outlined"
        label={<StyledParagragp text="Протокол" fontWeight={400} />}
        sx={{ marginRight: "5px", width: "80px" }}
        value={backendProtocol}
        onChange={onBackendProtocolChanged}
      />
      <StyledParagragp text="://" fontWeight={400} />
      <TextField
        size="small"
        variant="outlined"
        label={<StyledParagragp text="Адрес" fontWeight={400} />}
        sx={{ marginRight: "5px", width: "140px", marginLeft: "5px" }}
        value={backendAddress}
        onChange={onBackendAddressChanged}
      />
      <StyledParagragp text=":" fontWeight={400} />
      <TextField
        size="small"
        variant="outlined"
        label={<StyledParagragp text="Порт" fontWeight={400} />}
        sx={{ marginRight: "5px", width: "80px", marginLeft: "5px" }}
        value={backendPort}
        onChange={onBackendPortChanged}
      />
    </div>
  );
};

export default BackendSettings;
