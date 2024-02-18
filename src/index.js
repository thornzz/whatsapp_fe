import { createTheme, MantineProvider } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./app/store";

import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/core/styles/Combobox.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";

const theme = createTheme({
  components: {
    Dropzone: Dropzone.extend({
      vars: (theme, props) => {
        return {
          root: {
            "--dropzone-accept-bg": "#202C33",
          },
        };
      },
      fontFamily: "Roboto, sans-serif",
    }),
  },
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MantineProvider defaultColorScheme="dark" theme={theme}>
    <Notifications />
    <ModalsProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ModalsProvider>
  </MantineProvider>
);
