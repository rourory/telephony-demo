import "./css/Fonts.scss";
import "./css/App.scss";
import "./css/devextreme/dx.material.blue.dark.css";

import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { CssBaseline } from "@mui/material";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <CssBaseline />
    <App />
  </Provider>
);

reportWebVitals();
