let socket = null;
const listeners = new Set();
let websocketUrl = null; // 외부에서 주입받는 URL

const connectWebSocket = () => {
  if (!websocketUrl) {
    throw new Error(
      "WebSocket URL is not set. Call setWebSocketUrl(url) first."
    );
  }

  if (socket && socket.readyState !== WebSocket.CLOSED) {
    return; // 이미 연결되어 있거나 연결 중
  }

  socket = new WebSocket(websocketUrl);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    console.log("Message received:", event.data);
    listeners.forEach((callback) => callback(event.data));
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected. Attempting to reconnect...");
    socket = null;
    setTimeout(connectWebSocket, 3000); // 3초 후 재연결 시도
  };
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

export const setWebSocketUrl = (url) => {
  websocketUrl = url;
  connectWebSocket(); // URL 설정 후 자동 연결 시도
};

const ensureConnection = () => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    connectWebSocket();
  }
};

export const addEventListener = (callback) => {
  ensureConnection(); // WebSocket이 연결되어 있지 않으면 연결 시도
  listeners.add(callback);

  // 반환값으로 제거 함수 제공
  return () => {
    listeners.delete(callback);
  };
};

export const emit = (message) => {
  ensureConnection(); // WebSocket이 연결되어 있지 않으면 연결 시도
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.error("WebSocket is not open. Cannot send message.");
  }
};
