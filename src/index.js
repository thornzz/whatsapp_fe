import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./app/store";

import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/core/styles/Combobox.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MantineProvider defaultColorScheme="dark">
    <Notifications />
    <ModalsProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ModalsProvider>
  </MantineProvider>
);
