import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box/Box";
import styles from "./main-layout.module.scss";
import ApplicationBar from "../../components/organisms/AppBar";
import ApplicationDrawer from "../../components/organisms/Drawer";
import React from "react";
import { AppDispatch } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import ChangePasswordDialog from "../../components/molecules/ChangePasswordDialog";
import { appSettingsStateSelector } from "../../redux/slices/app-settings-slice/app-settings-slice";
import { loadContactTypeValuesThunk } from "../../redux/slices/devices-slice/subthunks/load-contact-type-values-thunk";
import { loadMarkedWordsThunk } from "../../redux/slices/devices-slice/subthunks/load-marked-words";
import { loadRelationTypeValuesThunk } from "../../redux/slices/devices-slice/subthunks/load-relation-type-values-thunk";
import { CssBaseline } from "@mui/material";
const MainLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const backendSettings = useSelector(appSettingsStateSelector);

  React.useEffect(() => {
    dispatch(loadContactTypeValuesThunk(backendSettings));
    dispatch(loadRelationTypeValuesThunk(backendSettings));
    dispatch(loadMarkedWordsThunk(backendSettings));
  }, [backendSettings]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ApplicationBar withDrawer />
      <ApplicationDrawer />
      <Box
        component="main"
        sx={{
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div className={styles.container}>
          {/* <ChangePasswordDialog /> */}
          <Outlet />
        </div>
      </Box>
    </Box>
  );
};

export default MainLayout;
