import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
// import { setWebSocketUrl } from "@utils/websocket.js";
import { setStompUrl } from "@utils/stomp.js";
const WEBSOCKET_URL = "ws://localhost:8080/ws";
const STOMP_URL = "http://localhost:8080/ws";
// setWebSocketUrl(WEBSOCKET_URL);
setStompUrl(STOMP_URL);
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
