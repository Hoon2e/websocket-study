import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let websocketUrl = null; // 외부에서 주입받는 URL
const maxReconnectAttempts = 10;
let reconnectAttempts = 0;
const pendingSubscriptions = new Map(); // 활성 구독 관리

let subscriptionIdCounter = 0; // 고유 ID 생성기

const connectStomp = () => {
  if (!websocketUrl) {
    throw new Error(
      "WebSocket URL이 설정되지 않았습니다. setStompUrl(url)을 먼저 호출하세요."
    );
  }

  if (stompClient && stompClient.connected) {
    console.log("STOMP가 이미 연결되어 있습니다.");
    return;
  }

  const socket = new SockJS(websocketUrl);
  stompClient = Stomp.over(socket);
  stompClient.onWebSocketClose = () => {
    console.log("WebSocket이 닫혔습니다. 재연결을 시도합니다...");
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts += 1;
      setTimeout(() => {
        console.log(`재연결 시도 ${reconnectAttempts}회`);
        connectStomp(); // 재연결 시도
      }, 3000); // 1초 딜레이 후 재연결 시도
    } else {
      console.error(
        "최대 재연결 시도 횟수를 초과했습니다. 더 이상 시도하지 않습니다."
      );
    }
  };

  stompClient.onDisconnect = () => {
    console.log("STOMP 연결이 해제되었습니다.");
  };

  stompClient.connect(
    {}, // 연결 헤더 (로그인 정보 등 필요 시 추가)
    () => {
      console.log("STOMP 연결 성공");
      reconnectAttempts = 0; // 연결 성공 시 시도 횟수 초기화
      processPendingSubscriptions(); // 대기 중인 구독 요청 처리
    },
    (error) => {
      console.error("STOMP 연결 오류:", error);
    }
  );
};

export const setStompUrl = (url) => {
  websocketUrl = url;
  connectStomp(); // URL 설정 후 자동 연결 시도
};

export const subscribe = (destination, callback) => {
  const subscriptionId = ++subscriptionIdCounter;

  if (!stompClient || !stompClient.connected) {
    console.warn(
      "STOMP가 연결되지 않았습니다. 구독 요청을 대기열에 추가합니다."
    );

    // 대기 중인 구독 요청 딕셔너리에 추가
    pendingSubscriptions.set(subscriptionId, { destination, callback });

    // 반환된 해제 함수
    return () => {
      if (pendingSubscriptions.has(subscriptionId)) {
        console.log(`${destination}에 대한 활성화된 구독을 해제합니다.`);
        pendingSubscriptions.delete(subscriptionId); // 대기 중인 요청 딕셔너리에서 제거
        activeSubscriptions.get(subscriptionId).unsubscribe(); // 구독 해제
        activeSubscriptions.delete(subscriptionId); // 맵에서 제거
      } else {
        console.log(`대기 중인 구독 요청 ${destination}을(를) 해제합니다.`);
        const index = pendingSubscriptions.findIndex(
          (sub) => sub.id === subscriptionId
        );
        if (index !== -1) {
          pendingSubscriptions.splice(index, 1); // 대기열에서 제거
        } else {
          console.warn("대기 중인 구독 요청이 없습니다.");
        }
      }
    };
  }

  // STOMP 연결 상태에서 즉시 구독
  const subscription = stompClient.subscribe(destination, (message) =>
    callback(JSON.parse(message.body))
  );
  console.log(`${destination}에 구독 성공`);

  // 활성 구독 관리에 추가
  activeSubscriptions.set(subscriptionId, subscription);

  // 반환된 해제 함수
  return () => {
    console.log(activeSubscriptions.get(subscriptionId));
    activeSubscriptions.get(subscriptionId).unsubscribe(); // 구독 해제
    activeSubscriptions.delete(subscriptionId); // 맵에서 제거
    console.log(`${destination}에 대한 활성화된 구독을 해제합니다.`);
  };
};

export const publish = (destination, body) => {
  if (!stompClient || !stompClient.connected) {
    console.warn("STOMP가 연결되지 않았습니다. 발행 요청이 무시되었습니다.");
    return;
  }

  stompClient.send(destination, {}, JSON.stringify(body));
  console.log(`${destination}에 메시지 발행 완료`);
};

const processPendingSubscriptions = () => {
  console.log("대기 중인 구독 요청 처리 중...");
  while (pendingSubscriptions.size > 0) {
    const { id, destination, callback } = pendingSubscriptions.shift(); // 큐에서 제거
    const subscription = stompClient.subscribe(destination, (message) =>
      callback(JSON.parse(message.body))
    ); // 구독 요청 처리
    console.log(`${destination}에 대한 대기 구독 활성화 완료`);

    // 활성 구독으로 관리
    activeSubscriptions.set(id, subscription);
  }
};
