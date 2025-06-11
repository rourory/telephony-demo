import * as React from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import { Box, Icon, Tooltip } from "@mui/material";

import { Link, useLocation } from "react-router-dom";
import {
  drawerSliceSelector,
  setDirection,
  setDrawerItems,
  setOpen,
} from "../../../redux/slices/drawer-slice/drawer-slice";
import { AppDispatch } from "../../../redux/store";
import AppLogo from "../../atoms/Logo";
import DrawerHeader from "../../atoms/DrawerHeader";
import Drawer from "../../atoms/Drawer";
import AppBarMenu from "../../molecules/AppBarMenu";
import StyledParagragp from "../../atoms/StyledParagraph/Index";
import { userPermissions } from "../../../redux/slices/user-slice/user-slice";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import HistoryIcon from "@mui/icons-material/History";
import ComputerIcon from "@mui/icons-material/Computer";
import DialerSipIcon from "@mui/icons-material/DialerSip";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalPolice from "@mui/icons-material/LocalPolice";
import TimelineIcon from "@mui/icons-material/Timeline";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import StorageIcon from "@mui/icons-material/Storage";
import VoiceChatIcon from "@mui/icons-material/VoiceChat";
import PieChartIcon from "@mui/icons-material/PieChart";

const ApplicationDrawer: React.FC = () => {
  const { direction, open, items } = useSelector(drawerSliceSelector);
  const dispatch = useDispatch<AppDispatch>();
  const permissions = useSelector(userPermissions);
  const currentLocation = useLocation();

  const handleDrawer = React.useCallback(() => {
    dispatch(setOpen(!open));
    dispatch(setDirection(direction === "rtl" ? "ltr" : "rtl"));
  }, [open, direction]);

  React.useEffect(() => {
    const drawerItems = {
      infoItems: [
        {
          url: "/",
          icon: DialerSipIcon,
          title: "Рабочая область",
          visible: true,
        },
        {
          url: "/convicted",
          icon: AssignmentIndIcon,
          title: "Заявления",
          visible: permissions.convictedPagePermitted,
        },
        {
          url: "/calls",
          icon: HistoryIcon,
          title: "История звонков",
          visible: permissions.callsPagePermitted,
        },
        {
          url: "/devices",
          icon: ComputerIcon,
          title: "Аппараты",
          visible: permissions.devicesPagePermitted,
        },
        {
          url: "/administration",
          icon: LocalPolice,
          title: "Сотрудники",
          visible: permissions.administrationPagePermitted,
        },
        {
          url: "/data",
          icon: StorageIcon,
          title: "Данные",
          visible: permissions.dataPagePermitted,
        },
        {
          url: "/statistics",
          icon: PieChartIcon,
          title: "Статистика",
          visible: permissions.statisticsPagePermitted,
        },
        {
          url: "marked_words",
          icon: VoiceChatIcon,
          title: "Распознавание речи",
          visible: permissions.markedWordsPagePermitted,
        },
      ],
      actionItems: [
        {
          url: `/extra_call_permissions`,
          icon: AddIcCallIcon,
          title: "Дополнительные разрешения на звонок",
          visible: permissions.extraCallPagePermitted,
        },
        {
          url: "/audition",
          icon: TimelineIcon,
          title: "История изменений",
          visible: permissions.auditionPagePermitted,
        },
        {
          url: "/settings",
          icon: SettingsIcon,
          title: "Настройки",
          visible: permissions.settingsPagePermitted,
        },
      ],
    };
    dispatch(setDrawerItems(drawerItems));
  }, [permissions]);

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader
        sx={{ justifyContent: "space-between", paddingLeft: "15px" }}
      >
        {open && <AppLogo variant="h5" />}
        {direction !== "rtl" && (
          <IconButton onClick={handleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </DrawerHeader>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <List>
          {items.infoItems.map((item: DrawerItemType) =>
            item.visible ? (
              <Link
                to={item.url}
                key={item.title}
                style={{ color: "inherit", textDecoration: "inherit" }}
                draggable="false"
              >
                <ListItem
                  key={item.title}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      transition: "300ms",
                    }}
                    selected={currentLocation.pathname == item.url}
                  >
                    {(!open && (
                      <Tooltip
                        title={
                          <StyledParagragp text={item.title} fontSize="15px" />
                        }
                        placement="right"
                        sx={{ userSelect: "none" }}
                      >
                        <span>
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              justifyContent: "center",
                            }}
                          >
                            <Icon component={item.icon} />
                          </ListItemIcon>
                        </span>
                      </Tooltip>
                    )) || (
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          justifyContent: "center",
                        }}
                      >
                        <Icon component={item.icon} />
                      </ListItemIcon>
                    )}
                    <ListItemText
                      sx={{
                        opacity: open ? 1 : 0,
                        transition: "all 0.5s",
                        transform: "translateX(25px)",
                        transitionDelay: "0.1s",
                      }}
                    >
                      <StyledParagragp text={item.title} fontWeight={600} />
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              </Link>
            ) : (
              <span key={item.url}></span>
            )
          )}
          <Divider />
        </List>
        <List>
          <Divider />
          {items.actionItems.map((item: DrawerItemType) =>
            item.visible ? (
              <Link
                to={item.url}
                key={item.title}
                draggable="false"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <ListItem
                  key={item.title}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      transition: "300ms",
                    }}
                    selected={currentLocation.pathname == item.url}
                  >
                    {(!open && (
                      <Tooltip
                        title={
                          <StyledParagragp text={item.title} fontSize="15px" />
                        }
                        placement="right"
                        sx={{ userSelect: "none" }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            justifyContent: "center",
                          }}
                        >
                          <Icon component={item.icon} />
                        </ListItemIcon>
                      </Tooltip>
                    )) || (
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          justifyContent: "center",
                        }}
                      >
                        <Icon component={item.icon} />
                      </ListItemIcon>
                    )}
                    <ListItemText
                      sx={{
                        opacity: open ? 1 : 0,
                        transition: "all 0.5s",
                        transform: "translateX(25px)",
                        transitionDelay: "0.1s",
                      }}
                    >
                      <StyledParagragp text={item.title} fontWeight={600} />
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              </Link>
            ) : (
              <span key={item.url}></span>
            )
          )}
          <AppBarMenu />
        </List>
      </Box>
    </Drawer>
  );
};

export default ApplicationDrawer;
