import { Route, Routes } from "react-router";
import WebsocketPage from "@pages/WebsocketPage";
import StompPage from "@pages/StompPage";
import LinkPage from "@pages/LinkPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LinkPage />} />
      <Route path="/websocket" element={<WebsocketPage />} />
      <Route path="/stomp" element={<StompPage />} />
    </Routes>
  );
}

export default App;
