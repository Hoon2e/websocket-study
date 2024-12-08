import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { addEventListener, emit } from "@utils/websocket";

const WebsocketPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const unsubscribe = addEventListener((receivedMessage) => {
      console.log("Received message:", receivedMessage);
      setMessages([...messages, receivedMessage]);
    });

    return () => unsubscribe();
  }, [messages]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>WebSocket Chat Room</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.chatContainer}>
          <div className={styles.messageList}>
            {/* 메시지가 여기에 표시됩니다 */}
            {messages.map((message, index) => (
              <div className={styles.message} key={index}>
                {message}
              </div>
            ))}
          </div>
          {/* <h3 style={{ textAlign: "center" }}>{username}</h3> */}
          <form className={styles.messageForm}>
            <input
              type="text"
              className={styles.messageInput}
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button
              type="button"
              className={styles.sendButton}
              onClick={() => {
                emit(messageInput);
                setMessageInput("");
              }}
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default WebsocketPage;
