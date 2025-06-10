import React, { memo, useCallback } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import {
  drawerSliceSelector,
  setDirection,
  setOpen,
} from "../../../redux/slices/drawer-slice/drawer-slice";
import AppLogo from "../../atoms/Logo";
import Box from "@mui/material/Box/Box";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import styles from "./app-bar.module.scss";
import AppBar from "../../atoms/AppBar";
import { setCloseDialogState } from "../../../redux/slices/close-dialog-slice/close-dialog-slice";
import { devicesSliceSelector } from "../../../redux/slices/devices-slice/devices-slice";

type Props = {
  withDrawer?: boolean;
};

const ApplicationBar: React.FC<Props> = memo(
  ({ withDrawer = false }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { direction, open } = useSelector(drawerSliceSelector);
    const { devices } = useSelector(devicesSliceSelector);
    const [closeButtonHovered, setCloseButtonHovered] = React.useState(false);

    const atLeastOneSessionIsProcessing = React.useMemo<boolean>(
      () => devices.some((d) => d.recordingService.isProcessing),
      [devices]
    );

    const handleDrawer = React.useCallback(() => {
      dispatch(setOpen(!open));
      dispatch(setDirection(direction === "rtl" ? "ltr" : "rtl"));
    }, [open, direction]);

    const hideButtonClicked = useCallback(
      () => window.electron.ipcRenderer.sendMessage("window.hide"),
      []
    );
    const fullScreenButtonClicked = useCallback(
      () => window.electron.ipcRenderer.sendMessage("window.maximize"),
      []
    );

    const closeButtonClicked = useCallback(
      () => dispatch(setCloseDialogState(true)),
      []
    );
    const onMouseEnterCloseIcon = useCallback(
      () => setCloseButtonHovered(true),
      []
    );
    const onMouseLeaveCloseIcon = useCallback(
      () => setCloseButtonHovered(false),
      []
    );

    return (
      <AppBar
        position="fixed"
        open={open}
        sx={{ paddingRight: 0, zIndex: 1000 }}
      >
        <Toolbar variant="dense">
          {withDrawer && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawer}
              edge="start"
              sx={{
                marginRight: 2,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          {!open && <AppLogo variant="h4" />}
          <div className={styles.draggable} />
          <Box sx={{ display: "flex" }}>
            <IconButton size={"small"} onClick={hideButtonClicked}>
              <MinimizeIcon />
            </IconButton>
            <IconButton size={"small"} onClick={fullScreenButtonClicked}>
              <FullscreenIcon />
            </IconButton>
            <IconButton
              size={"small"}
              color={closeButtonHovered ? "error" : "default"}
              onMouseEnter={onMouseEnterCloseIcon}
              onMouseLeave={onMouseLeaveCloseIcon}
              onClick={closeButtonClicked}
              disabled={atLeastOneSessionIsProcessing}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    );
  },
  (prev, next) => prev.withDrawer == next.withDrawer
);

export default ApplicationBar;
