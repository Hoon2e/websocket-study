import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
// import { setStompUrl } from "@utils/stomp.js";

// const STOMP_URL = "http://localhost:8080/ws";
// setStompUrl(STOMP_URL);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
