import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./sign-in-page.module.scss";
import AppLogo from "../../components/atoms/Logo";
import { LoadingButton } from "@mui/lab";
import LoadingCurtain from "../../components/molecules/LoadingCurtain";
import { AppDispatch } from "../../redux/store";
import {
  setPassword,
  setUser,
  setUserFetchStatus,
  setUserToAutocompleteField,
  setUsername,
  userSelector,
} from "../../redux/slices/user-slice/user-slice";
import CssBaseline from "@mui/material/CssBaseline/CssBaseline";
import TextField from "@mui/material/TextField/TextField";
import Box from "@mui/material/Box/Box";
import ApplicationBar from "../../components/organisms/AppBar";
import { loadPermissions, signIn } from "../../redux/slices/user-slice/thunks";
import StyledParagragp from "../../components/atoms/StyledParagraph/Index";
import AdministrationAutocompleteField from "../../components/molecules/AdministrationAutocompleteField";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import BackendSettings from "../../components/molecules/BackendSettings";
import UltraLightLoadingIndicator from "../../components/molecules/UltraLightLoadingIndicator";
import { appSettingsStateSelector } from "../../redux/slices/app-settings-slice/app-settings-slice";
import { refreshTokenQuery } from "../../api/queries";
import {
  getTokenFromLocalStorage,
  setTokenToLocalStorage,
} from "../../utils/jwt-utils";
import { loadServerSettingsThunk } from "../../redux/slices/server-settings-slice/thunks";

const SignInPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userFetchStatus, credentials } = useSelector(userSelector);
  const [showPassword, setShowPassword] = useState(false);

  const backendSettings = useSelector(appSettingsStateSelector);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    []
  );

  const handleMouseUpPassword = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    []
  );

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const authCredentials: Credentials = {
        username: credentials.username || "",
        password: data.get("password")?.toString() || "",
      };
      dispatch(
        signIn({
          credentials: authCredentials,
          backendSettings: backendSettings,
        })
      );
    },
    [credentials]
  );

  const onPasswordFieldChange = React.useCallback(
    (event: any) => dispatch(setPassword(event.target.value)),
    []
  );

  const onChangeUsername = React.useCallback(
    (
      _: React.SyntheticEvent<Element, Event>,
      newValue: AdministrationEntity | null
    ) => {
      if (newValue == null) {
        dispatch(setPassword(""));
      }
      dispatch(setUsername(newValue?.username || ""));
      dispatch(setUserToAutocompleteField(newValue));
    },
    []
  );

  React.useEffect(() => {
    if (getTokenFromLocalStorage()) {
      dispatch(setUserFetchStatus("LOADING"));
      refreshTokenQuery(backendSettings)
        .then((res) => {
          if (res.status === 200) {
            const data = res.data as UserDataResponce;
            dispatch(
              loadPermissions({
                roleId: data.user.roleId,
                backendSettings: backendSettings,
              })
            );
            dispatch(loadServerSettingsThunk(backendSettings));
            setTokenToLocalStorage(data.token);
            dispatch(setUser(data.user));
            dispatch(setUserFetchStatus("SUCCESS"));
          }
        })
        .catch((err) => {
          dispatch(setUserFetchStatus("ERROR"));
          console.log(err);
        });
    }
  }, []);

  return (
    <>
      <ApplicationBar />
      <div className={styles.container}>
        <LoadingCurtain show={userFetchStatus === "LOADING"} />
        <div className={styles.form_holder}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mr: "10px",
              ml: "10px",
            }}
          >
            <CssBaseline />
            <AppLogo
              variant={"h4"}
              modal={true}
              iconHeight={64}
              iconWidth={64}
            />
            <StyledParagragp text="Вход" fontSize="26px" />
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ width: "120%", mt: 1 }}
            >
              <AdministrationAutocompleteField onChange={onChangeUsername} />
              <TextField
                value={credentials.password}
                margin="normal"
                required
                fullWidth
                name="password"
                label={<StyledParagragp text="Пароль" fontWeight={600} />}
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                onChange={onPasswordFieldChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ marginRight: "10px" }}>
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <LoadingButton
                loadingIndicator={<UltraLightLoadingIndicator />}
                loading={userFetchStatus == "LOADING"}
                color={userFetchStatus === "ERROR" ? "error" : "info"}
                disabled={
                  credentials.username === "" || credentials.password === ""
                }
                type="submit"
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2, fontFamily: "inherit" }}
              >
                <StyledParagragp text="Войти" fontWeight={900} />
              </LoadingButton>
            </Box>
          </Box>
        </div>
      </div>
      <BackendSettings />
    </>
  );
};

export default SignInPage;
