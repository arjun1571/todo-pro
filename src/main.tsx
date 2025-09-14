import React from "react";
import ReactDOM from "react-dom/client";
import "material-icons/iconfont/material-icons.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { store } from "./redux/store";
import { ToastComponent } from "./components/core/ToastComponent/ToastComponent";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastComponent />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
