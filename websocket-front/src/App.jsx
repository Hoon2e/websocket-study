import { Route, Routes } from "react-router";
import WebsocketPage from "@pages/WebsocketPage";
import StompPage from "@pages/StompPage";
import LinkPage from "@pages/LinkPage";
import { StompProvider } from "./provides/StompProvider";

function App() {
  return (
    // <StompProvider
    //   brokerURL="http://localhost:8080/ws"
    //   // connectHeaders={{ Authorization: "Bearer token" }}
    //   onConnectCallback={() => console.log("%%%Connected")}
    //   onDisconnectCallback={() => console.log("%%%Disconnected")}
    //   onCloseCallback={() => console.log("%%%Close")}
    //   onErrorCallback={() => console.error("%%%Error")}
    //   reconnectDelay={5000}
    // >
    <Routes>
      <Route path="/" element={<LinkPage />} />
      <Route path="/websocket" element={<WebsocketPage />} />
      <Route
        path="/stomp"
        element={
          <StompProvider
            brokerURL="http://localhost:8080/ws"
            reconnectDelay={5000}
          >
            <StompPage />
          </StompProvider>
        }
      />
    </Routes>
    // </StompProvider>
  );
}

export default App;
