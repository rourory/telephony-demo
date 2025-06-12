import { Logout, Password } from "@mui/icons-material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  applicationThemeSelector,
  toggleMode,
} from "../../../redux/slices/theme-slice/theme-slice";
import { AppDispatch } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import ColorModeSwitcher from "../../atoms/ColorModeSwitcher";
import Box from "@mui/material/Box/Box";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import IconButton from "@mui/material/IconButton/IconButton";
import Avatar from "@mui/material/Avatar/Avatar";
import Menu from "@mui/material/Menu/Menu";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Divider from "@mui/material/Divider/Divider";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import Typography from "@mui/material/Typography/Typography";
import StyledParagragp from "../../atoms/StyledParagraph/Index";
import {
  removeUser,
  userSelector,
} from "../../../redux/slices/user-slice/user-slice";
import { APP_TOKEN_ISSUED_KEY, APP_TOKEN_KEY } from "../../../api/constants";
import { setOpen } from "../../../redux/slices/drawer-slice/drawer-slice";
import {
  setChangePasswordDialogOpenState,
  setChangePasswordDialogText,
} from "../../../redux/slices/change-password-dialog-slice/change-password-dialog-slice";

const AppBarMenu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector(userSelector);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const theme = useSelector(applicationThemeSelector);

  const open = React.useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const changePassword = React.useCallback(() => {
    handleClose();
    // dispatch(
    //   setChangePasswordDialogText("Пожалуйста, установите новый пароль.")
    // );
    // dispatch(setChangePasswordDialogOpenState(true));
  }, []);

  const logout = React.useCallback(() => {
    handleClose();
    localStorage.removeItem(APP_TOKEN_KEY);
    localStorage.removeItem(APP_TOKEN_ISSUED_KEY);
    dispatch(removeUser());
    dispatch(setOpen(false));
    navigate("/");
  }, [handleClose]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexGrow: "1",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
          justifyContent: "start",
        }}
      >
        <Tooltip
          title={
            <StyledParagragp text={"Настройки аккаунта"} fontSize="15px" />
          }
          placement="right"
        >
          <IconButton
            onClick={handleClick}
            size="medium"
            sx={{ ml: "4px" }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              <StyledParagragp
                text={`${user?.squadNumber || "*"}`}
                fontSize="25px"
                fontWeight={600}
              />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <StyledParagragp
              text={user?.username || "Неизвестный пользователь"}
              fontWeight={900}
              fontSize="28px"
            />
          </div>
        </MenuItem>
        <Divider />
        <MenuItem onClick={changePassword}>
          <ListItemIcon>
            <Password fontSize="small" />
          </ListItemIcon>
          <StyledParagragp text={"Изменить пароль"} />
        </MenuItem>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <StyledParagragp text={"Выйти"} />
        </MenuItem>
        <Divider />
        <MenuItem>
          <ColorModeSwitcher
            checked={theme.palette.mode === "dark" ? true : false}
            onChange={() => {
              dispatch(toggleMode());
            }}
            aria-label="login switch"
          />
          <Typography sx={{ marginRight: "15px" }}>
            <StyledParagragp text={"Изменить цветовую схему"} fontSize="16px" />
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AppBarMenu;
