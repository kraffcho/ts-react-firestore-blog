import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";

const root = document.getElementById("root");

if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
