import React from "react";
import { useSelector } from "react-redux";
import { applicationThemeSelector } from "./redux/slices/theme-slice/theme-slice";
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material";
import { userSelector } from "./redux/slices/user-slice/user-slice";
import { setThemeConfigToLocalStorage } from "./utils/local-storge-utils";
import { loadMessages, locale } from "devextreme/localization";
import { SnackbarKey, SnackbarProvider, closeSnackbar } from "notistack";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import NotificationEnqueuer from "./components/organisms/NotificationEnqueuer";
import CloseApplicationDialog from "./components/organisms/CloseApplicationDialog";
import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import ConvictedCardsPage from "./pages/ConvictedCardsPage";
import CallsListPage from "./pages/CallsListPage";
import DevicesListPage from "./pages/DevicesListPage";
import { AdministrationDataGrid } from "./components/organisms/AdministrationDataGrid";
import AuditionPage from "./pages/AuditionPage";
import DataPage from "./pages/DataPage";
import ExtraCallPermissionPage from "./pages/ExtraCallPermissionPage";
import MarkedWordsPage from "./pages/MarkedWordsPage";
import NotFoundPage from "./pages/NotFoundPage";
import SettingsPage from "./pages/SettingsPage";
import SignInPage from "./pages/SignInPage";
import StatisticsPage from "./pages/StatiscticsPage";

function App() {
  const themeOptions = useSelector(applicationThemeSelector);
  const theme = createTheme(themeOptions as ThemeOptions);
  const snackRef = React.useRef(null);

  const { user } = useSelector(userSelector);

  React.useEffect(() => {
    setThemeConfigToLocalStorage(themeOptions);
  }, [themeOptions]);

  React.useEffect(() => {
    loadMessages({ ru: { Yes: "Да", No: "Нет" } });
    locale("ru");
  }, []);
  const [notistackHorizontalPostion, setNotistackHorizontalPosition] =
    React.useState<"center" | "right">("center");

  const snackbarAction = React.useCallback(
    (snackbarId: SnackbarKey | undefined) => (
      <IconButton
        onClick={() => {
          closeSnackbar(snackbarId);
          setNotistackHorizontalPosition(
            notistackHorizontalPostion === "center" ? "right" : "center"
          );
        }}
      >
        <CloseIcon />
      </IconButton>
    ),
    [notistackHorizontalPostion]
  );

  return (
    <SnackbarProvider
      maxSnack={5}
      autoHideDuration={4000}
      disableWindowBlurListener
      ref={snackRef}
      action={snackbarAction}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: notistackHorizontalPostion,
      }}
    >
      <ThemeProvider theme={theme}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            {user ? (
              <Route path="/" element={<MainLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/convicted" element={<ConvictedCardsPage />} />
                <Route path="/calls" element={<CallsListPage />} />
                <Route path="/devices" element={<DevicesListPage />} />
                <Route
                  path="/administration"
                  element={<AdministrationDataGrid />}
                />
                <Route path="/marked_words" element={<MarkedWordsPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route
                  path="/extra_call_permissions"
                  element={<ExtraCallPermissionPage />}
                />
                <Route path="/data" element={<DataPage />} />
                <Route path="/audition" element={<AuditionPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/*" element={<NotFoundPage />} />
              </Route>
            ) : (
              <Route path="/*" element={<SignInPage />}></Route>
            )}
          </Routes>
        </BrowserRouter>
        <NotificationEnqueuer />
        <CloseApplicationDialog />
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
